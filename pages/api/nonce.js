import crypto from 'crypto';
import connectDB from '../../Utils/connectDB';
import User from '../../models/schema';

connectDB();

async function handler(req, res) {
    if (req.method === 'POST') {
        const { address } = req.body;
        const stringAddress = address.toString();
        
        try {
            const addressExist = await User.findOne({ blockchainAddress: stringAddress });
            
            if (!addressExist) {
                return res.status(400).json({ message: "Please Register First." }); // Added return
            }
            
            const nonce = crypto.randomBytes(32).toString('hex');
            return res.status(200).json({ message: nonce }); // Added return
            
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "An error occurred!!" }); // Added return
        }
    } else {
        return res.status(405).json({ message: "Method not allowed!" }); // Added return
    }
}

export default handler;