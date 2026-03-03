import User from "../models/User"

exports.generateEmail = async (req, res) => {
    try {
        const userId = req.user.Id;
        const { jobDescription, jobmetaData } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ message: "Job description required."});
        }

        const rawProfile = await User.findById(userId);

    } catch (error) {
        
    }
}