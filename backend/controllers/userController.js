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
        preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.update(req.user.id, { name, email });
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
* Update user preferences
*/
export const updatePreferences = async (req, res, next) => {
try {
const preferences =  await UserPreference.upsert(req.user.id, req.body);
res.json({
success: true,
message: 'Preferences updated successfully',
data: { preferences }
});
} catch (error) {
next(error);
}
};

/*
* Change password
*/
export const changePassword = async (req, res, next) => {
try {
const { currentPassword, newPassword } = req.body;

if (!currentPassword || !newPassword) {
return res.status(400).json({
success: false,
message: 'Please provide current and new password'
});
}

// Verify current password
const user = await User.findByEmail(req.user.email);

const isValid = await User.verifyPassword(currentPassword, user.password_hash);

if (!isValid) {
return res.status(401).json({
success: false,
message: 'Current password is incorrect'
});

}

// Update to new password
await User.updatePassword(req.user.id, newPassword);

res.json({
success: true,message: 'Password changed successfully'
});
} catch (error) {
next(error);
}
};

/*
 * Delete user account
 in production you would typically want to implement a soft delete or at least require password confirmation before deleting an account to prevent accidental deletions but for simplicity we will just delete the user record here.
 */
export const deleteAccount = async (req, res, next) => {
  try {
    await User.delete(req.user.id);
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};


