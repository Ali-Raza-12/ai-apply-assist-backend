import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/generateTokens.js";
import { serializeUser } from "../utils/serializeUser.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { refreshCookieOptions } from "../config/cookies.js";

export const registerUser = async (req, res, next) => {
  try {
  const { name, email, password } = req.body;

  if(!name || !email || !password) {
    return errorResponse(res, 400, "Name, Email and Password are required fields");
  }

  const existingUser = await User.findOne({ email }).lean();

  if (existingUser) {
    return errorResponse(res, 409, "User already exists" );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  const tokens = generateTokens(user._id);
  const accessToken = tokens.accessToken;
  const refreshToken = tokens.refreshToken;

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  const serializedUser = serializeUser(user);

  return successResponse(res, 201, "User registered successfully", {
        accessToken,
        user: serializedUser,
      });
  }
  catch(error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, 400, "Email and Password are required fields")
  }

  const user = await User.findOne({ email });

  if (!user) {
    return errorResponse(res, 404, "User not found" );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return errorResponse(res, 401, "Invalid credentials" );
  }

  const tokens = generateTokens(user._id);
  const accessToken = tokens.accessToken;
  const refreshToken = tokens.refreshToken;

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  const serializedUser = serializeUser(user);

  return successResponse(res, 200, "Login successful", {
    accessToken: accessToken,
    user: serializedUser
  })
} catch(error) {
  next(error)
}
};

export const logoutUser = async (req, res, next) => {
  try {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return errorResponse(res, 401, "No refresh token provided" );
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return errorResponse(res, 401, "Invalid refresh token" );
  }

  user.refreshToken = null;
  await user.save();
  res.clearCookie("refreshToken", refreshCookieOptions);

  return successResponse(res, 200, "Logout successful")
} catch(error) {
  next(error);
}
};

export const refreshAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return errorResponse(res, 400, "No refresh token provided" );
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse(res, 400, "User not found" );
    }
    if (user.refreshToken !== refreshToken) {
      return errorResponse(res, 401, "Refresh token is mismatched" );
    }
    const token = generateTokens(user._id);
    const accessToken = token.accessToken;

    const serializedUser = serializeUser(user);
    
    return successResponse(res, 200, "Access Token refresh successfully", {
        accessToken: accessToken,
        user: serializedUser
      });
  } catch (error) {
    next(error)
  }
};
