const User=require("../models/User")
const bcrypt=require('bcryptjs')
const jwt=require("jsonwebtoken")


//register Controller
const registerUser=async(req,res)=>{
    try {
        //extract user information from our request body
        const {username,email,password,role}=req.body

        //check if the user is already exists in our database

        const checkExistingUser=await User.findOne({$or:[{username},{email}]})
        console.log(checkExistingUser)
         if(checkExistingUser){
            return res.status(400).json({
                success:false,
                message:"User is already exists either with same username.Please try with a different username or email"
            })
         }


         //hash user password
         const salt=await bcrypt.genSalt(10);
         const hashPassword=await bcrypt.hash(password,salt)

         //newly created user
         const newlyCreatedUser=new User({
            username,email,
            password:hashPassword,
            role:role || "user"
                 })
                 await newlyCreatedUser.save();

                 if(newlyCreatedUser){
                    res.status(201).json({
                        success:true,
                        message:"User registered successfully"
                    })
                 }
                 else{
                    res.status(400).json({
                        success:false,
                        message:"Unable to register"
                    })
                 }

      


    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            message:"Some error occured! Please try again"
        })
    }
}



//login Controller
const loginUser=async(req,res)=>{
    try {
        const {username,password}=req.body;
        const user=await User.findOne({username})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User doesn't exists!"

            })
        }
        //if the password is correct or not
        const isPasswordMatch=await bcrypt.compare(password,user.password)
          
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid credintials!"

            })

        }

        //create a json web token
        //npm i jsonwebtoken

        const accessToken=jwt.sign({
            userId:user._id,
            username:user.username,
            role:user.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn:'15m'
        })


        res.status(200).json({
            success:true,
            message:"Logged in successfull",
            accessToken

        })
        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            message:"Some error occured! Please try again"
        })
    }
}


const changePassword=async(req,res)=>{
    try {
           const userId=req.userInfo.userId

           //extract old and new password
           const {oldPassword,newPassword}=req.body
           //find the current logged in user
           const user=await User.findById(userId)
           if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
           }

           //check if old password is corresct
           const isPasswordMatch=await bcrypt.compare(oldPassword,user.password)
           if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"old password is not correct! please try again"
            })
           }
           //hash the new password
    const salt=await bcrypt.genSalt(10)
    const newhashPassword=await bcrypt.hash(newPassword,salt);

    //update user password
    user.password=newhashPassword

    await user.save()

    return res.status(200).json({
        success:true,
        message:"Password changed success"
    })


        
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            message:"Some error occured! Please try again"
        })
        
    }
}




module.exports={
    registerUser,loginUser,changePassword
}