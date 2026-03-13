import User from "../models/user.js";
import jwt from "jsonwebtoken";
import UserPreference from "../models/UserPreference.js";

/**
 * Generate JWT token for a user
 * @param {User} user - The user object
 * @returns {string} - The generated JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
};

/*
Register new user
*/

export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    //validation

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, password and name",
      });
    }

    //check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    //create user
    const user = await User.create({ email, password, name });

    //create default preferences for the new user
    await UserPreference.upsert(user.id, {
      dietary_restrictions: [],
      allergies: [],
      preferred_cuisines: [],
      default_servings: 4,
      measurement_unit: "metric",
    });

    //generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }
    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(
      password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user);
    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

/*
 * Get current user
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    next(error);
  }
};

/**
 * Request password reset (placeholder would send email in production)
 * 
 * in future this is where we would generate a password reset token and send an email to the user with a link to reset their password. For now, we just return a success message without revealing whether the email exists in our system for security reasons.
 */
export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email" });
    }
    const user = await User.findByEmail(email);
    // Don't reveal if user exists or not for security
    res.json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent",
    });
  } catch (error) {
    next(error);
  }
};


