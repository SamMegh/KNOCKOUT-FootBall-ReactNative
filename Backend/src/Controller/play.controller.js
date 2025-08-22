// Importing required models
import LeagueData from "../DBmodel/league.data.model.js";
import League from "../DBmodel/league.model.js";
import { Request } from "../DBmodel/league.reques.model.js";
import User from '../DBmodel/user.db.model.js';
import { getReceiverSocketId, io } from '../lib/socket.config.js';
/**
 * 🌍 Controller: Get Available Public Leagues
 * ----------------------------------------------------------------------------
 * This controller returns a list of public leagues that the currently 
 * authenticated user has NOT yet joined. It includes:
 * - Ongoing leagues (already started but not ended)
 * - Upcoming leagues (starting in the future)
 */

export const getleague = async (req, res) => {
    try {
        // 🕒 Get current timestamp
        const currentDate = new Date();

        // 🔐 Get the current user's ID from the authenticated request
        const userId = req.user._id;

        // 🔍 Query: Find leagues where:
        const upcomingLeagues = await League.find({
            $and: [
                {
                    // ⏳ League is either ongoing or upcoming
                    $or: [
                        { start: { $lte: currentDate }, end: { $gte: currentDate } }, // 🟢 Ongoing
                        { start: { $gt: currentDate } }                               // 🔜 Upcoming
                    ]
                },
                { type: "public" },                  // 🌐 Only public leagues
                { participantsId: { $ne: userId } }  // 🙅‍♂️ User hasn't joined yet
            ]
        });

        // ✅ Return the list of leagues
        res.status(200).json(upcomingLeagues);

    } catch (error) {
        // ❌ Handle unexpected server errors
        res.status(500).json({
            message: "Unable to get leagues: " + error
        });
    }
};


/**
 * 📋 Controller: Get My Active Leagues
 * ----------------------------------------------------------------------------
 * This controller fetches all leagues that:
 * - The current authenticated user has joined
 * - Have not ended yet (i.e., are ongoing or upcoming)
 */

export const getmyleague = async (req, res) => {
    try {
        // 🔐 Get the current user's ID from the authenticated request
        const userId = req.user._id;

        // 🕒 Get the current date for checking league end times
        const currentDate = new Date();

        // 🔍 Find leagues where:
        // - The user is a participant
        // - The league hasn't ended yet
        const upcommingLeagues = await League.find({
            end: { $gte: currentDate },                 // 📆 League still active
            participantsId: { $in: [userId] }           // 🙋‍♂️ User is a participant
        }).sort({ start: 1 });                           // 🔢 Sort by start date (earliest first)

        // ✅ Return list of joined, active leagues
        res.status(200).json(upcommingLeagues);

    } catch (error) {
        // ❌ Handle any unexpected server errors
        res.status(500).json({
            message: "Unable to get leagues: " + error.message
        });
    }
};


/**
 * 🏗️ Controller: Create a New League
 * -------------------------------------------------------------------------
 * This controller handles creation of a new league with necessary validations.
 * It calculates `end` date or `totalWeeks` dynamically if one is missing.
 * Ensures the authenticated user is valid and sets them as the league owner.
 */

export const createleague = async (req, res) => {
    try {
        // 🔐 Get the current authenticated user's ID
        const ownerId = req.user._id;

        // 📥 Destructure required fields from the request body
        let {
            name,
            joinfee,
            end,
            start,
            maxTimeTeamSelect,
            type,
            lifelinePerUser,
            totalWeeks
        } = req.body;

        // ⚠️ Validate essential fields
        if (!start || !name || !joinfee || !ownerId || (!totalWeeks && !end)) {
            return res.status(400).json({ message: "All fields are required to create a league" });
        }

        // 🔍 Ensure that the league creator (user) exists
        const owner_in_DB = await User.findById(ownerId);
        if (!owner_in_DB) {
            return res.status(400).json("Invalid user to create league");
        }

        // 📅 Utility: Get the next Saturday after a given date, with week offset
        function getNextSaturday(date, weekOffset) {
            const result = new Date(date);
            const day = result.getDay();
            const daysUntilSaturday = (6 - day + 7) % 7;
            result.setDate(result.getDate() + daysUntilSaturday + (weekOffset * 7));
            return result;
        }

        // 🔢 Utility: Calculate number of weeks between two dates
        function getTotalWeeks(startDateStr, endDateStr) {
            const start = new Date(startDateStr);
            const end = new Date(endDateStr);
            const msPerWeek = 1000 * 60 * 60 * 24 * 7;
            return Math.ceil((end - start) / msPerWeek);
        }

        // 🔁 Dynamically calculate missing end date or total weeks
        if (!end) {
            end = getNextSaturday(start, totalWeeks - 1); // 📆 Calculate end date from weeks
        }
        if (!totalWeeks) {
            totalWeeks = getTotalWeeks(start, end); // 📊 Calculate total weeks from dates
        }

        // 🛠️ Create a new league object with all provided + calculated data
        const newLeague = new League({
            name,
            joinfee,
            ownerId,
            ownerName: owner_in_DB.name,
            end,
            start,
            maxTimeTeamSelect,
            lifelinePerUser,
            totalWeeks,
            type
        });

        // 💾 Save the new league to the database
        await newLeague.save();

        // ✅ Return success response with created league data
        res.status(200).json(newLeague);

    } catch (error) {
        // ❌ Handle unexpected errors gracefully
        res.status(500).json({
            message: "Unable to create league: " + error
        });
    }
};


/**
 * 🧾 Controller: Get My Created Leagues
 * ------------------------------------------------------------------
 * This controller retrieves all leagues that were created by the
 * currently authenticated user, using their user ID (`ownerId`).
 */

export const getMyCreatedLeagues = async (req, res) => {
    try {
        // 🔐 Get the ID of the currently logged-in user
        const ownerId = req.user._id;

        // 🔍 Find all leagues where the user is the creator/owner
        const created_leagues_by_me = await League.find({ ownerId });

        // ✅ Return the list of created leagues
        res.status(200).json(created_leagues_by_me);

    } catch (error) {
        // ❌ Handle and return any server errors
        res.status(500).json({ message: "Error getting your created leagues: " + error.message });
    }
};


/**
 * 🏆 Controller: Join League
 * ----------------------------------------------------------------------------
 * Allows an authenticated user to join a league if:
 * - The league exists and hasn't ended
 * - The user hasn't already joined
 * - Then it initializes the user's team data and adds them to the league.
 */

export const joinleague = async (req, res) => {
    try {
        // 🔐 Get the current user's ID from the request
        const userId = req.user._id;

        // 📥 Extract leagueId from request body
        const { leagueId } = req.body;

        // 🕒 Current date to validate league expiration
        const currentDate = new Date();

        // 🔍 Fetch user from database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // 🔍 Fetch league from database
        const league = await League.findById(leagueId);
        if (!league || currentDate > league.end) {
            return res.status(400).json({ message: "Invalid or expired league" });
        }

        // 🚫 Check if user already joined this league
        if (league.participantsId.includes(userId)) {
            return res.status(400).json({ message: "Already joined" });
        }

        await _updateCoin(userId, leagueId)

        // 🛠️ Create initial team data for the user (helper function)
        await _createTeam(user._id, user.name, league._id, league.name);

        // ➕ Add user to league's participants
        const newleaguedata = await League.findByIdAndUpdate(
            leagueId,
            {
                $push: {
                    participantsId: user._id,     // 🔗 Link user to league
                    participantsNames: user.name  // 🧾 Store user's name
                }
            },
            { new: true } // Return updated league document
        );

        // ✅ Respond with updated league info
        res.status(200).json(newleaguedata);

    } catch (error) {
        // ❌ Catch and return unexpected server errors
        res.status(500).json({
            message: "Unable to join league",
            error
        });
    }
};


/**
 * 🛠️ Internal Helper: Initialize User Team for League
 * -----------------------------------------------------------------------------
 * This helper function prepares the initial team structure for a user when they
 * join a league. It fetches match days from an external API and creates empty
 * team entries (with unselected status) for each valid match day.
 *
 * 🔒 This is an internal function — not exposed as an API route.
 */

const _createTeam = async (userId, userName, leagueId, leagueName) => {
    try {
        // 📂 Fetch league details to get start and end dates
        const league = await League.findById(leagueId);

        // 📅 Helper function to format a Date object as 'YYYY-MM-DD'
        function dateformat(date) {
            const d = new Date(date);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        }

        // 📆 Prepare date range for match fetch
        const start = new Date(league.start);
        const end = new Date(league.end);
        const allDates = new Set(); // 🔁 To store unique match dates

        // 🔄 Loop through date range in 10-day intervals (API efficiency)
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 10)) {
            const dateFrom = dateformat(d);           // 📅 Start of range
            const dTo = new Date(d);
            dTo.setDate(dTo.getDate() + 9);            // 📅 End of 10-day range
            if (dTo > end) dTo.setTime(end.getTime()); // 🧯 Clamp to league end
            const dateTo = dateformat(dTo);

            // 🌐 Fetch match data from football-data API
            const response = await fetch(
                `https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
                {
                    headers: { 'X-Auth-Token': process.env.FOOTBAL_API },
                }
            );

            const data = await response.json();
            if (!data.matches) continue; // ⛔ Skip if no matches returned

            // 📌 Add each match date to the set (in YYYY-MM-DD format)
            data.matches.forEach(match => {
                const date = match.utcDate.split('T')[0]; // Extract only the date portion
                allDates.add(date);
            });
        }

        // ✅ Convert Set to array of unique match dates
        const uniqueDates = [...allDates];

        // 🛑 Ensure at least one match day exists
        if (uniqueDates.length === 0) throw new Error("No matches data found");

        // 📝 Create league data for the user with empty team slots
        const userLeagueData = new LeagueData({
            userId,
            userName,
            leagueId,
            leagueName,
            checkPoint: new Date(), // ⏱️ Timestamp for tracking
            teams: uniqueDates.map(date => ({
                day: new Date(date),        // 🗓️ Matchday
                teamName: "Not Selected"    // 🧑‍🤝‍🧑 Placeholder for future selection
            }))
        });

        // 💾 Save to database
        await userLeagueData.save();

    } catch (error) {
        // ❌ Catch and log errors (non-breaking since it's internal)
        console.error("Error in _createTeam:", error);
    }
};


/**
 * 📝 Controller: Join/Select a Team for a Matchday
 * -------------------------------------------------------------------------
 * This controller allows a user to select a team for a specific matchday 
 * in an active league. It performs multiple validations including:
 * - Date checks
 * - Lifeline availability
 * - Team duplication
 * - League status
 */

export const jointeam = async (req, res) => {
    try {
        // 🕒 Get current timestamp
        const currentDate = new Date();

        // 🔐 Get user ID from authenticated request
        const userId = req.user._id;

        // 📥 Extract necessary fields from request body
        const { leagueId, day, teamName, startTime } = req.body;

        // ⚠️ Validate required fields
        if (!leagueId || !day || !teamName || !startTime) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // 📅 Convert provided matchday to Date object
        const newDate = new Date(day);

        // 🚫 Prevent joining teams for past or current matchdays
        if (currentDate >= newDate) {
            return res.status(400).json({ message: "Invalid date to join team" });
        }

        // 🔍 Fetch user's league data
        const data = await LeagueData.findOne({ userId, leagueId });

        // ❌ Check: league data must exist
        if (!data) {
            return res.status(404).json({ message: "League data not found" });
        }

        // 🚫 Check: user must have lifelines remaining
        if (data.lifeline === 0) {
            return res.status(400).json({ message: "All lifelines used" });
        }

        // 🚫 Check: user must not have missed previous selections
        if (data.noSelected > 0) {
            return res.status(400).json({ message: "Missed previous selection" });
        }

        // 🚫 Check: league should still be active
        if (data.end <= currentDate) {
            return res.status(400).json({ message: "League already ended" });
        }

        // 🚫 Check: team name should not already be selected
        if (data.teams.some(team => team.teamName === teamName)) {
            return res.status(400).json("Team already selected");
        }

        // ✅ All good — Update the team details for the specified day
        const updatedLeague = await LeagueData.findOneAndUpdate(
            { userId, leagueId, "teams.day": day },
            {
                $set: {
                    "teams.$.teamName": teamName,               // 🧑‍🤝‍🧑 Assign selected team name
                    "teams.$.startTime": new Date(startTime)     // 🕒 Record selection start time
                }
            },
            { new: true } // Return updated document
        );

        // 🎉 Return updated league data
        return res.status(200).json(updatedLeague);

    } catch (error) {
        // ❌ Handle unexpected errors gracefully
        console.error("Join Team Error:", error);
        return res.status(500).json({ message: "Unable to join the team", error: error.message });
    }
};


/**
 * 🧑‍💼 Controller: Get Current User's Team in a League
 * -----------------------------------------------------------------
 * This controller fetches the team created by the currently authenticated user
 * for a specific league. It expects a valid `leagueId` in the request body.
 */

export const myteam = async (req, res) => {
    try {
        // 🔐 Get the current authenticated user's ID
        const userId = req.user._id;

        // 📥 Extract league ID from the request body
        const { leagueId } = req.body;

        // ⚠️ Validate that leagueId is provided
        if (!leagueId) {
            return res.status(400).json({ message: "League ID required" });
        }

        // 🔍 Search for the user's team in the specified league
        const myteamdata = await LeagueData.findOne({ userId, leagueId });

        // ❌ If no team is found, return a 400 response
        if (!myteamdata) {
            return res.status(400).json({ message: "No team found for this league" });
        }

        // ✅ If team is found, send it back in the response
        res.status(200).json(myteamdata);

    } catch (error) {
        // ❌ Handle unexpected errors
        res.status(500).json({ message: "Unable to get the team: " + error });
    }
};


/**
 * 🏟️ Controller: Get Teams by League ID
 * -----------------------------------------------------
 * This controller fetches all teams associated with a specific league.
 * It expects a `leagueid` as a query parameter and returns the list
 * of teams stored in the `LeagueData` collection.
 */

export const teams = async (req, res) => {
    try {
        // 🧾 Extract league ID from query parameters
        const { leagueid } = req.query;

        // ⚠️ Validate: leagueid must be provided
        if (!leagueid) {
            return res.status(400).json({ message: "leagueid query parameter is required." });
        }

        // 🔍 Find all team entries in the LeagueData collection by league ID
        const teams = await LeagueData.find({ leagueId: leagueid });

        // ✅ Return the list of teams
        res.status(200).json(teams);

    } catch (error) {
        // ❌ Handle unexpected server errors
        res.status(500).json({ message: "Unable to get the teams: " + error });
    }
};


/**
 * 🏆 Controller: Search Leagues by Name
 * ----------------------------------------------------
 * This controller allows a user to search for public leagues
 * (either ongoing or upcoming) by name that they haven’t joined yet.
 */

export const leaguebyname = async (req, res) => {
    try {
        // 🔐 Extract the user's ID from the authenticated request
        const user = req.user;

        // 🕒 Get the current date and time
        const currentDate = new Date();

        // 🔎 Extract the league name input from request body
        const { name } = req.body;

        // 📂 Query the League collection with multiple conditions:
        const leagues = await League.find({
            $and: [
                {
                    // ⏳ Only include leagues that are either:
                    // - currently ongoing
                    // - or scheduled for the future
                    $or: [
                        { start: { $lte: currentDate }, end: { $gte: currentDate } }, // 📍 Ongoing leagues
                        { start: { $gt: currentDate } }                               // 📍 Upcoming leagues
                    ]
                },
                {
                    // 🔤 Match leagues whose name starts with the given input (case-insensitive)
                    name: { $regex: `^${name}`, $options: "i" }
                },
                {
                    // 🚫 Exclude leagues the user has already joined
                    participantsId: { $ne: user._id }
                }
            ]
        }).limit(6); // 📉 Limit results to 6 for better performance/UI

        const receiver = getReceiverSocketId(user._id);
        if (receiver) {
            io.to(receiver).emit("leaguenameresult", leagues)
        }
        // ✅ Send the found leagues in the response
        res.status(200).json(leagues);

    } catch (error) {
        // ❌ Return an error if something goes wrong with the search
        res.status(500).json({ message: "Unable to get the league: " + error });
    }
};


/**
 * 🎁 Controller: Daily Coin Claim
 * -------------------------------------------------
 * This controller allows a user to claim daily SCoin once per day.
 * It checks whether the user has already claimed coins today and
 * updates the balance if eligible.
 */

export const dailyCoin = async (req, res) => {
    try {
        // 🔐 Get the authenticated user
        const user = req.user;

        // 🕒 Get today's date
        const today = new Date();

        // 📆 Check last daily claim
        const lastUpdate = user.coinClams;
        const getUTCDate = (date) =>
            new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

        const todayUTC = getUTCDate(new Date());
        const lastUpdateUTC = lastUpdate ? getUTCDate(new Date(lastUpdate)) : null;

        const hasUpdatedToday = lastUpdateUTC && todayUTC.getTime() === lastUpdateUTC.getTime();


        // 🚫 Already claimed today
        if (hasUpdatedToday) {
            return res.status(400).json({ message: "You can only claim coins once per day." });
        }

        // 💾 Update SCoin balance & last claim date + log transaction
        const dbuser = await User.findByIdAndUpdate(
            user._id,
            {
                $inc: { SCoin: 5 },         // ➕ Add 5 SCoin
                $set: { coinClams: today }, // 📅 Save claim date
                $push: {
                    coinTransactions: {
                        amount: 5,
                        type: "reward",          // 🎁 reward type
                        coinType: "SCoin",       // 🪙 SCoin only
                        description: "Daily reward",
                        date: today
                    }
                }
            },
            { new: true } // 🆕 Return updated user
        ).select('-password');

        // ✅ Send success response
        res.status(200).json({
            message: "Daily reward claimed successfully 🎉",
            user: dbuser
        });

    } catch (error) {
        // ❌ Server error
        res.status(500).json({ message: "Unable to update daily coins: " + error });
    }
};



// /**
//  * Controller: Buy Coin 💰
//  * This function allows users to purchase in-app coins with optional payment verification.
//  */

// export const buyCoin = async (req, res) => {
//     try {
//         // 🔐 Extract the authenticated user from the request
//         const user = req.user;

//         // 📥 Destructure coin purchase details from request body
//         const { coinAmount, paymentStatus, paymentId, amount } = req.body;

//         // ⚠️ Validate request: coin amount must be positive and amount must exist
//         if (!coinAmount || coinAmount <= 0 || !amount) {
//             return res.status(400).json({ message: "Invalid coin purchase data." });
//         }

//         // 💳 If payment gateway is integrated, check if payment was successful
//         if (paymentStatus && paymentStatus !== "success") {
//             return res.status(400).json({ message: "Payment failed or cancelled." });
//         }

//         // 🔄 Check for duplicate payment ID in user's transaction history
//         const isMatchPaymentId = paymentId &&
//             user.coinTransactions.some(tx => tx.paymentId?.toString() === paymentId.toString());

//         // 🚫 Prevent duplicate or reused payment IDs
//         if (isMatchPaymentId) {
//             return res.status(400).json({ message: "Payment failed or payment ID already exists." });
//         }

//         // 💾 Update user's coin balances and store the new transaction
//         const updatedUser = await User.findByIdAndUpdate(
//             user._id,
//             {
//                 // ➕ Add purchased coins to GCoin and SCoin
//                 $inc: { GCoin: coinAmount },
//                 $inc: { SCoin: coinAmount },

//                 // 📚 Log the transaction in coinTransactions array
//                 $push: {
//                     coinTransactions: {
//                         payAmount: amount,                    // 💵 Actual money paid
//                         GCoin: coinAmount,                   // 🪙 Coins added to GCoin
//                         freeSCoin: coinAmount,               // 🎁 Free bonus coins (if any)
//                         type: "buy",                         // 📌 Transaction type
//                         coinType: "GCoin",                   // 🪙 Coin type for this purchase
//                         description: `Bought ${coinAmount} coins`, // 📝 Summary
//                         paymentId: paymentId || "mock-payment",   // 💳 Payment ID (or mock)
//                         date: new Date()                     // 📅 Timestamp
//                     }
//                 }
//             },
//             { new: true } // 📤 Return updated user document
//         ).select('-password'); // 🔒 Exclude sensitive fields like password

//         // ✅ Return success response with updated user data
//         res.status(200).json({
//             message: `✅ Successfully added ${coinAmount} coins.`,
//             user: updatedUser
//         });

//     } catch (error) {
//         // ❌ Catch and return any unexpected server errors
//         res.status(500).json({ message: "Unable to buy coins", error: error.message });
//     }
// };


/**
 * 📜 Controller: Transaction History
 * ------------------------------------
 * This endpoint retrieves and formats a user's coin transaction history.
 * It ensures the user is authenticated and filters out sensitive information.
 */

export const tranxtxtion = async (req, res) => {
    try {
        // 🔐 Extract the currently authenticated user from the request
        const user = req.user;

        // 🧠 Fetch full user details from the database, excluding the password
        const dbuser = await User.findById(user._id).select("-password");

        // ❌ Handle case when user is not found (possibly logged out or deleted)
        if (!dbuser) {
            return res.status(400).json({
                message: "Unable to get user. Please re-login to solve this problem."
            });
        }

        // 📂 Extract all coin transaction records from the user document
        const rowtx = dbuser.coinTransactions;

        // 🧾 Format each transaction for cleaner frontend display
        const tranxtxtion = rowtx.map(tx => ({
            payAmount: tx.payAmount,                   // 💵 Actual amount paid
            amount: tx.amount,                         // 🪙 Coins credited/spent
            freeSCoin: tx.freeSCoin,                   // 🎁 Bonus/free SCoin
            type: tx.type,                             // 🔄 Transaction type
            coinType: tx.coinType,                     // 🪙 SCoin or GCoin
            description: tx.description,               // 📝 Transaction description

            // 🔑 Identifiers
            paymentId: tx.paymentId || "mock-payment", // Stripe PaymentIntent ID (or fallback)
            chargeId: tx.chargeId || null,             // Stripe Charge ID (if available)
            transactionId: tx.transactionId,           // Your internal ID

            // 🏦 UPI-specific fields
            utr: tx.utr || null,                       // UTR (only for UPI)
            vpa: tx.vpa || null,                       // UPI VPA if available

            // 💳 Card-specific fields
            cardLast4: tx.cardLast4 || null,           // Last 4 digits of card if card payment

            date: tx.date,                             // 📅 Transaction date
            _id: tx._id                                // MongoDB ObjectId for reference
        }));

        // ✅ Return the formatted transaction list
        res.status(200).json(tranxtxtion);

    } catch (error) {
        console.error("❌ Error fetching transactions:", error);
        res.status(500).json({ message: "Unable to get the Transaction" });
    }
};


/**
 * 📜 Controller: Join League Request
 * ------------------------------------
 * Lets a user send a request to join a league.
 * Prevents duplicate requests and saves league fee info.
 */
export const joinrequest = async (req, res) => {
    try {
        // 🔐 Get current user and leagueId
        const user = req.user;
        const { leagueId } = req.body;

        // 🔍 Check if request already exists
        const previous = await Request.findOne({ userId: user._id, leagueId });
        if (previous) return res.status(400).json({
            message: "You have already sent a request for this league"
        });

        // ⚽ Find league details
        const league = await League.findById(leagueId);

        // 📝 Create new request
        const newRequest = new Request({
            userId: user._id,
            userName: user.name,
            leagueId: league._id,
            joinfee: {
                amount: league.joinfee.amount,
                type: league.joinfee.type,
            }
        });

        // 💾 Save and return
        await newRequest.save();
        res.status(200).json(newRequest);

    } catch (error) {
        // ❌ Server error
        res.status(500).json({ message: "Unable to send request" });
    }
};


/**
 * 📜 Controller: Update Coin on League Join
 * ------------------------------------------
 * Deducts the required coin (GCoin / SCoin) from the user 
 * when they attempt to join a league.
 */
// 🛠️ Function to update coins
const _updateCoin = async (userId, leagueId) => {
    try {
        // ⚽ Fetch user & league
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const league = await League.findById(leagueId);
        if (!league) throw new Error("League not found");

        // 💰 Check if user has enough coins of required type
        const haveCoin = league.joinfee.amount <= user[league.joinfee.type];
        if (!haveCoin) {
            throw new Error("You do not have enough coins to join this league");
        }

        // 🔄 Deduct coins based on type
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                $inc: {
                    GCoin: league.joinfee.type === "GCoin" ? -(league.joinfee.amount) : 0,
                    SCoin: league.joinfee.type === "SCoin" ? -(league.joinfee.amount) : 0,
                },
            },
            { new: true }
        );

        // 🔔 Emit socket event if user is online
        const socketUserId = getReceiverSocketId(user._id);
        if (socketUserId) {
            io.to(socketUserId).emit("coinsUpdated", updatedUser);
        }

    } catch (error) {
        throw error; // ❌ let caller handle error
    }
};


/**
 * 📜 Controller: Accept Join Request
 * -----------------------------------
 * Accepts a user's league join request, deducts coins,
 * adds them to participants, and creates their team.
 * Allows the league owner (admin) to accept a user's join request.
 */
export const acceptRequest = async (req, res) => {
    try {
        // 🔐 Get requestId
        const { requestId } = req.body;
        if (!requestId) {
            return res.status(400).json({ message: "Request ID is required" });
        }

        // 🔎 Find request
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const loginuser = req.user;

        // 🔎 Get user & league
        const user = await User.findById(request.userId);
        const league = await League.findById(request.leagueId);

        // 🔒 Only owner can accept
        if (loginuser._id.toString() !== league.ownerId.toString()) {
            return res.status(400).json({ message: "Only admin can accept request" });
        }

        // 🔄 Update request status to 'accept'
        const requestAccept = await Request.findByIdAndUpdate(
            requestId,
            { status: "accept" },
            { new: true }
        );

        // 💰 Deduct coins
        await _updateCoin(user._id, league._id);

        // 👥 Add user to league participants
        await League.findByIdAndUpdate(
            league._id,
            {
                $addToSet: {
                    participantsId: user._id,
                    participantsNames: user.name,
                },
            },
            { new: true }
        );

        // ⚽ Create team for user in league
        await _createTeam(user._id, user.name, league._id, league.name);

        // ✅ Success response
        return res.status(200).json(requestAccept);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Unable to accept the request" });
    }
};

/**
 * 📜 Controller: Reject Join Request
 * -----------------------------------
 * Allows the league owner (admin) to reject a user's join request.
 */
export const rejectRequest = async (req, res) => {
    try {
        // 🔐 Get leagueId, userId from body & logged-in user
        const { requestId } = req.body;
        const loginuser = req.user;
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }
        // ⚠️ Validate input
        if (!requestId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 👤 Find and league
        const league = await League.findById(request.leagueId);

        // 🚫 Only league owner can reject requests
        if (String(loginuser._id) !== String(league.ownerId)) {
            return res.status(400).json({ message: "Only admin can reject request" });
        }

        // 🔄 Update request status to 'reject'
        const requestRejected = await Request.findByIdAndUpdate(requestId,
            { status: "reject" },
            { new: true }
        );

        // 🚫 If request not found


        // ✅ Success
        res.status(200).json(requestRejected);

    } catch (error) {
        // ❌ Error handling
        res.status(400).json({ message: "Unable to reject the request" });
    }
};


/**
 * 📜 Controller: Get League Join Requests
 * ----------------------------------------
 * Fetches all join requests for a specific league.
 * Only the league owner (admin) can access this.
 */
export const requests = async (req, res) => {
    try {
        // 🔐 Get logged-in user & leagueId
        const user = req.user;
        const { leagueId } = req.body;

        // ⚠️ Validate input
        if (!leagueId) {
            return res.status(400).json({ message: "leagueId is required" });
        }

        // ⚽ Find league
        const league = await League.findById(leagueId);
        if (!league) {
            return res.status(404).json({ message: "League not found" });
        }

        // 🚫 Only league owner can view requests
        if (String(league.ownerId) !== String(user._id)) {
            return res.status(403).json({ message: "Only admin can get the requests" });
        }

        // 📥 Fetch all requests for this league
        const requests = await Request.find({ leagueId });

        // ✅ Success
        res.status(200).json(requests);

    } catch (error) {
        // ❌ Error handling
        res.status(500).json({ message: "Unable to fetch requests" });
    }
};
