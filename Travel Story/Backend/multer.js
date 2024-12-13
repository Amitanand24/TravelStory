const multer=require("multer");
const path=require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // Define where the file will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Define filename
    }
});

const fileFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith("image/")){
        cb(null,true);
    }
    else{
        cb(new error("only image are allowed"),false);
    }
};

const upload=multer({storage,fileFilter});
module.exports=upload;