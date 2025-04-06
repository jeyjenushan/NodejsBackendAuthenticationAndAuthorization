const mongoose=require("mongoose")

const connection=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb connected successfully..");
        
    } catch (error) {
        console.error("Mongodb connection failed")
        process.exit(1)
    }
}

module.exports=connection