import User from "./../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone: "",
    github: "",
    linkedin: "",
    portfolio: "",
    cvUrl: "",
    cvText: "",
  });

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res
    .status(201)
    .json({
      message: "User registered successfully",
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, github: user.github, linkedin: user.linkedin, portfolio: user.portfolio, cvUrl: user.cvUrl, cvText: user.cvText },
    });
};

export const loginUser = async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });

  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  }); 

  user.refreshToken = refreshToken;
  await user.save();  

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });


  res.status(200).json({
    message: "Login successful",
    accessToken,
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, github: user.github, linkedin: user.linkedin, portfolio: user.portfolio, cvUrl: user.cvUrl, cvText: user.cvText },
  });
};

export const logoutUser = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(400).json({ message: "No refresh token provided" });
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(400).json({ message: "Invalid refresh token" });
  }
  user.refreshToken = null;
  await user.save();
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",  
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful" });
}

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  } 
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    } 
    const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "10m",
    }); 
    res.status(200).json({ accessToken: newAccessToken, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, github: user.github, linkedin: user.linkedin, portfolio: user.portfolio, cvUrl: user.cvUrl, cvText: user.cvText } });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  } 
}