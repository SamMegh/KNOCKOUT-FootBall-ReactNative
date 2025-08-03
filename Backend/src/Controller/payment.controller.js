

export const getsession = async(req, res)=>{
    try {
        res.status(200).json({message:"server works"})
    } catch (error) {
        res.status(500).json({message:"unable to create session"})
    }
}