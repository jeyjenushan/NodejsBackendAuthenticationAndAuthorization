const jwt=require("jsonwebtoken")

const authMiddleware=(req,res,next)=>{
    const authHeaders=req.headers["authorization"]

    const token=authHeaders && authHeaders.split(" ")[1]
    if(!token){
        return res.status(404).json({
            success:false,
            message:"Access denied.No token provided.Please login to continue"
        })
    }


    //decode this token
    try {
        const decodedTokenInfo=jwt.verify(token,process.env.JWT_SECRET_KEY)
        //decoded info our user information
        
        req.userInfo=decodedTokenInfo      
        next()

        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Access denied.No token provided.Please login to continue"
        })
        
    }

}

module.exports=authMiddleware