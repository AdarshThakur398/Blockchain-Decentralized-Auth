import { verifyMessage } from "ethers";
import jwt from "jsonwebtoken";

const secret = process.env.SECRET_KEY;

async function handler(req, res) {
  try {
    const { signedMessage, nonce, address } = req.body;

    // Verify signature
    const verifiedAddress = verifyMessage(nonce, signedMessage);

    if (verifiedAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ message: "Invalid Signature!" });
    }

    // Generate JWT
    const token = jwt.sign({ address }, secret, { expiresIn: "10m" });

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
}

export default handler;
