import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { loginSchema, RegisterSchema } from "../utils/zodSchemas";

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "2h" }
  );

  return { accessToken, refreshToken };
};

export const RegisterController = async (req, res, next) => {
  try {
    const validatedData = RegisterSchema.parse(req.body);
    const { userName, email, password, role } = validatedData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ userName, email, password: hashedPassword, role });

    await user.save();

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: user._id, userName, role },
    });
  } catch (error) {
    next(error);
  }
};

export const LoginController = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    return res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        userName: user.userName,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const RefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Invalid refresh token" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    return res.status(201).json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const ForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    const resultUri = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const EmailSend = await sendEmail({
      to: email,
      subject: "Password reset request",
      template: "resetpassword",
      context: { resultUri, userName: user.userName },
    });

    return res.status(201).json({ message: "Password reset email sent" });
  } catch (error) {
    next(error);
  }
};

export const ResetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};
