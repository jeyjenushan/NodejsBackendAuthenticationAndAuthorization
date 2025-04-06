const express=require("express")
const authMiddleWare=require("../middleware/auth-middleware")
const { registerUser, loginUser, changePassword } = require("../controllers/auth-controller")
const router=express.Router()



router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/change-password",authMiddleWare,changePassword)


module.exports=router