import { ethers } from "ethers"; 
import jwt from "jsonwebtoken";

const secret = process.env.SECRET_KEY;

async function handler(req, res) {
 
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { signedMessage, nonce, address } = req.body;

   
    if (!signedMessage || !nonce || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    
    const verifiedAddress = ethers.verifyMessage(nonce, signedMessage);
    if (verifiedAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ message: "Invalid Signature!" });
    }

 
    const token = jwt.sign({ address }, secret, { expiresIn: "10m" });


    return res.status(200).json({ token });
  } catch (err) {
    console.error("Error in /api/login:", err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
}

export default handler;