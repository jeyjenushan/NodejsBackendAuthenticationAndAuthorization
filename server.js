
require("dotenv").config()
const express=require("express")
const connectDb=require("./db/db");
const router = require("./routes/auth-routes");
const homeRoutes=require("./routes/home-routes")
const adminRoutes=require("./routes/admin-routes")
const uploadImageRoutes=require("./routes/image-routes")
connectDb()

const PORT=process.env.PORT||3000;

const app=express()
app.use(express.json())

app.use("/api/auth",router)
app.use("/api/home",homeRoutes)
app.use("/api/admin",adminRoutes)
app.use("/api/image",uploadImageRoutes)

app.listen(PORT,()=>{
    console.log(`The Server is running on port number : ${PORT}`)
})



