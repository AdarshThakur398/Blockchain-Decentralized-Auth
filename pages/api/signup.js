import connectDB from "../../Utils/connectDB";
import User from "../../models/schema";
import { ethers } from "ethers";

connectDB();

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email } = req.body;

    
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    
    const wallet = ethers.Wallet.createRandom();
    const blockchainAddress = wallet.address;
    const blockchainPrivateKey = wallet.privateKey;


    const newUser = new User({ name, email, blockchainAddress });
    await newUser.save();

  
    return res.status(200).json({
      message: "Signup successful! Copy your private key and import it into MetaMask and go to Login page to continue.",
      privateKey: blockchainPrivateKey,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error occurred" });
  }
}

export default handler;