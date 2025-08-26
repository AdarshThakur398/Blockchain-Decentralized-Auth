import connectDB from "../../Utils/connectDB";
import User from "../../models/schema";
import {ethers} from "ethers"

connectDB();
async function handler (req,res) {

    if(req.method ==='POST') {
        try {
const {name,email}=req.body;
const existinguser=await User.findOne({email});
if(existinguser) {
          res.status(400).json({message:"email already exists!"});
}
   const wallet=ethers.Wallet.createRandom();
       const blockchainAddress=wallet.address;
       const blockchainPrivateKey=wallet.privateKey;
       const newUser=new User({name,email,blockchainAddress});
       await newUser.save();
       res.status(200).json({message:blockchainPrivateKey});
       console.log(blockchainPrivateKey);
        }
        catch(error) {

            console.log(error);
            res.status(500).json({message:"An error occurred!"});
        }

    }
    else {
        res.status(405).json({message:"Method not allowed!"}); 
    }
}

export default handler;