import mongoose from 'mongoose';
const uri = "mongodb://root:password@localhost:27017/myapp?authSource=admin&directConnection=true";
const connectDB=async () => {
    try {
        await mongoose.connect(uri);
        console.log("mongodb connected");

    }
    catch(err) {
        console.log(err);
       
    }

}

export default connectDB;