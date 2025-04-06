const multer=require("multer");
const path=require("path")

//set our multer storage
const storage=multer.diskStorage({
   destination:function(req,file,cb){
    cb(null,"uploads/")
   },
   //what the filename inside he folder
   filename:function(req,file,cb){
    cb(null,
        file.fieldname + "-" + Date.now()+path.extname(file.originalname)
    )

   }


})

//file filter functions
const checkFileFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith("image")){
        cb(null,true)
    }else{
        cb(new Error("Not an image!please upload ony the images"))
    }
}


module.exports=multer({
    storage,
    fileFilter:checkFileFilter,
    limits:{
        fileSize:5*1024*1024
    }


})