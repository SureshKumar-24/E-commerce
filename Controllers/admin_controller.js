const { validationResult } = require("express-validator");
const authService = require('../Services/admin');
const { getLogger } = require("nodemailer/lib/shared");

module.exports = {
    allUser: async (req, res, next) => {
        try {
            const getallUser = await authService.allUser(res);
            return getallUser;
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    },

    oneUser: async (req, res, next) => {
        const user_id = req.params.id;
        try {
            const getUser = await authService.getUser(user_id, res);
            return getUser;
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }


}
