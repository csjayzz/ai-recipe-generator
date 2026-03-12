import User from "../models/user";
import UserPreference from "../models/UserPreference";

//using user mofel to handle account data and userpref for haandling user preferences

/*
Get user profile
*/
export const getProfile = async (req, res, next) => {
try {
const user = await User.findById(req.user.id);
const preferences = await UserPreference.findByUserId(req.user.id);
res.json({
success: true,
data: {
user,
preferences
}
});
} catch (error) {
next(error);
}
};
