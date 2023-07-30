const { validationResult } = require("express-validator");
const authService = require('../Services/admin');
const { getLogger } = require("nodemailer/lib/shared");
const validateMongodbId = require('../Helpers/verify_mongoId');
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
        validateMongodbId(user_id);

        try {
            const getUser = await authService.getUser(user_id, res);
            return getUser;
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    },

    blockUser: async (req, res, next) => {
        const user_id = req.params.id;
        const block = validateMongodbId(user_id);
        try {
            const blockUser = await authService.userBlocked(user_id, res);
            return blockUser;
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    },

    unblockUser: async (req, res, next) => {
        const user_id = req.params.id;
        validateMongodbId(user_id);
        try {
            const unblockUser = await authService.userUnblocked(user_id, res);
            return unblockUser;
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: error.message });
        }
    }


}
