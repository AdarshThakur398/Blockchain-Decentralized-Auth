import {ethers} from 'ethers'
import jwt from 'jsonwebtoken'

const secret =process.env.SECRET_KEY;
async function handler(req,res) {
   const  {signedMessage,nonce,address}= req.body;
   const verifiedAddress= ethers.utils.verifyMessage(nonce,signedMessage);
   if(verifiedAddress!=address) {
     return res.status(401).json({message:"Invalid Signature!"});
     
   }
}