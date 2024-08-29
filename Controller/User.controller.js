 // Adjust the path based on the actual location
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isAuth } from "../Middleware/isAuth.js";
import sendMail  from "../Service/Nodemailer.js";
import TryCatch from "../Middleware/TryCatch.js";
import { User } from './../Model/User.schema.js';
import { sendForgotMail } from "../Service/Nodemailer.js";

export const Register = TryCatch(async (req, res) => {
  const { name, password, email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
      return res.status(401).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
      name,
      email,
      password: hashedPassword
  };

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

  const activationToken = jwt.sign(
      { user: newUser, otp },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
  );

  console.log("Generated OTP:", otp);
  console.log("Token on registration:", activationToken);

  // Prepare the data for the email
  const data = {
      name,
      otp
  };

  // Send the activation email
  await sendMail(email, "Your OTP Code", data);
  res.status(200).json({ message: "OTP sent to your email", activationToken });
});
 
export const VerifyOtp = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body; // Get OTP and activationToken from request body

  console.log("Received OTP for verification:", otp);
  console.log("Token received for verification:", activationToken);

  let verify;
  try {
      verify = jwt.verify(activationToken, process.env.JWT_SECRET);
  } catch (err) {
      return res.status(400).json({ message: "OTP expired or invalid" });
  }

  console.log("Decoded OTP from token:", verify.otp);

  if (verify.otp !== otp) {
      return res.status(400).json({ message: "Wrong OTP" });
  }

  const { name, email, password } = verify.user;

  await User.create({
      name,
      email,
      password
  });

  res.status(200).json({ message: "User verified and registered successfully" });
});


export const loginUser=TryCatch(async(req,res)=>{
const {email,password}=req.body;
const user=await User.findOne({email})
if(!user){return res.status(200).json({
  message:"No User with this email"
})}
const matchpassword=await bcrypt.compare(password,user.password)
if(!matchpassword){return res.status(401).json({message:"Password incorrect"})}


const token=await jwt.sign({_id: user._id},process.env.JWT_SECRET,{expiresIn:"15d"})
res.json({
  message:`Welcome back ${user.name}`,
  token,
  user
})
 
})

export const myProfile= TryCatch(async(req,res)=>{
  const user=await User.findById(req.user._id)
  res.json({user})
}
  
)

export const forgotpassword = TryCatch(async (req, res) => {
  const { email } = req.body; // Correctly destructure email from req.body
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Add expiration for the token
  const data = { email, token };
  await sendForgotMail( "E-learning Password Reset", data); // Ensure correct function name and arguments

  user.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // Correctly set expiration time
  await user.save();

  res.json({
    message: "Reset Password Link is sent to your email"
  });
});

export const getUserById = TryCatch(async (req, res) => {
  const { id } = req.params; // Get user ID from request parameters

  // Find the user by ID
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
 
  res.json(user);
});

export const resetPassword = TryCatch(async (req, res) => {
  try {
    const token = req.params.token;  // Changed from req.query.token to req.params.token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decodedData.email });

    if (!user) {
      return res.status(401).json({ message: "No user with this email" });
    }

    if (user.resetPasswordExpire === null || user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ message: "Token expired or invalid" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordExpire = null;

    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


export const fetchadmin = async (req, res) => {
  try {
    console.log("Request URL:", req.originalUrl); // Debug URL
    console.log("Request Params:", req.params); // Debug route parameters
    console.log("Request Query:", req.query); // Debug query parameters

    // Find an admin in the database
    const admin = await User.findOne({ role: "admin" }).exec();
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Respond with the admin ID
    res.json({ adminId: admin._id });
  } catch (error) {
    console.error("Error fetching admin ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

  export const fetchuser=async(req,res)=>{
    const { adminId } = req.query;

  try {
    // Example logic: Find a user that the admin should reply to
    // This could be the user with the most recent activity, an unread message, etc.
    const user = await User.findOne({ role: "user" });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ userId: user._id });
  } catch (error) {
    console.error("Error fetching user ID:", error);
    res.status(500).json({ message: "Server error" });
  }
  }
