import * as Yup from "yup";

const leagueValidator = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("League name is required"),

  joinfee: Yup.object().shape({
    amount: Yup.number()
      .typeError("Joining Fee must be a number")
      .min(20, "Joining Fee must be greater than 20")
      .max(300, "Joining Fee must be less than 300")
      .required("Joining Fee is required"),
    type: Yup.string()
      .oneOf(["SCoin", "GCoin"], "Invalid coin type") // adjust if you allow more
      .required("Coin type is required"),
  }),

  start: Yup.date()
    .typeError("Start date is invalid")
    .required("Start date is required"),

  end: Yup.date()
    .typeError("End date is invalid")
    .min(Yup.ref("start"), "End date must be after start date")
    .required("End date is required"),

  totalWeeks: Yup.number()
    .typeError("Total weeks must be a number")
    .min(1, "Total weeks must be at least 1")
    .required("Total weeks is required"),

  maxTimeTeamSelect: Yup.number()
    .typeError("Max team select time must be a number")
    .min(1, "Must be at least 1")
    .required("Max team select time is required"),

  lifelinePerUser: Yup.number()
    .typeError("Lifeline per user must be a number")
    .min(1, "Must be at least 1")
    .required("Lifeline per user is required"),

  type: Yup.string()
    .oneOf(["private", "public"], "Invalid league type")
    .required("League type is required"),
});

export default leagueValidator;
