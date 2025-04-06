const express=require("express")
const authMiddleware = require("../middleware/auth-middleware")
const isAdminUser = require("../middleware/admin-middleware")
const { uploadImage, fetchImageController, deleteImageController } = require("../controllers/image-controller")
const multerMiddleWare=require("../middleware/upload-middleware")
const router=express.Router()


//upload the image

router.post("/upload",authMiddleware,isAdminUser,multerMiddleWare.single("image"),uploadImage)

//to get all the images

router.get("/get",authMiddleware,fetchImageController)

//delete image rout
router.delete("/:id",authMiddleware,isAdminUser,deleteImageController)

module.exports=router