
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper")
const Image=require("../models/Image")
const cloudinary=require("../config/cloudinary")

const fs=require("fs")


const uploadImage=async(req,res)=>{
    try {
        //check if file is miising in req object
        if(!req.file){
            return res.status(400).json({
                success:false,
                message:"File is required.Please upload an image"
            })
        }
           //upload to cloudinary
           const {url,publicId}=await uploadToCloudinary(req.file.path)

           //store the image url and public id along with the uploaded user id in database
            const newlyUploadedImage=new Image({
                url,publicId,uploadedBy:req.userInfo.userId
            })
             await newlyUploadedImage.save()
//delete the file localstore
fs.unlinkSync(req.file.path)

             return res.status(201).json({
                success:true,
                message:"File is uploaded successfully..",
                image:newlyUploadedImage
            })

    } catch (error) {
        console.log(error)
       return res.status(500).json({
            success:false,
            message:"Something went wrong! please try again"
        })
        
    }
}


const fetchImageController=async(req,res)=>{
    try {
        const page=parseInt(req.query.page) || 1
        const limit=parseInt(req.query.limit) || 5
        const skip=(page-1)*limit;
        const sortBy=req.query.sortBy || "createdAt"
        const sortOrder=req.query.sortOrder== "asc"?1:-1
        const totalImages=await Image.countDocuments()
        const totalPages=Math.ceil(totalImages/limit);


        const sortObj={}
        sortObj[sortBy]=sortOrder


        const images=await Image.find().sort(sortObj).skip(skip).limit(limit)
        if(images){
            res.status(200).json({
                success:true,
                currentPage:page,
                totalPages:totalPages,
                totalImages:totalImages,
                data:images
            })
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Something went wrong! Please try again"
        })
        
    }
}


const deleteImageController=async(req,res)=>{
    try {
        const getCurrentIdOfImageToBeDeleted=req.params.id;
        const userId=req.userInfo.userId

        const image=await Image.findById(getCurrentIdOfImageToBeDeleted)
        if(!image){
           return res.status(500).json({
                success:false,
                message:"Image not found"
            }) 
        }

        //check if this image is uploaded by the current user who is trying to delete this
          if(image.uploadedBy.toString()!==userId){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to delete this image because you haven't uploaded it "
            })
          }

          //delete this image from the cloudinary
          await cloudinary.uploader.destroy(image.publicId)
          
 //delet image mongodb
 await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted)
 res.status(200).json({
    success:true,
    message:"Image deleted successfully"
})

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Something went wrong! Please try again"
        })
    }
}









module.exports={
    uploadImage,
    fetchImageController,
    deleteImageController
}