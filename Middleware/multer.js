import multer from "multer";           //a middleware for file uploads
import{v4 as uuid} from "uuid"        //a library for giving unique ids
const storage= multer.diskStorage({  //diskstorage- where and how you want to store the file
    destination(req,file,cb){       //it decides where the file is uploaded
        cb(null,"uploads")         //cb- callback, null- no error, uploads- the directory we want to use to save the file
    },
    filename(req,file,cb){              //decided how we want to save the file
const id=uuid()                        //creates unique id

const extName=file.originalname.split(".").pop()//extract the last extension of the file name eg(.jpg)
const fileName=`${id}.${extName}`;   //id- the unique id , extname- the extention eg(.jpg)

cb(null,fileName);                 //save the  file with the unique name

    }
})

export const uploadFiles=multer({storage}).single("file")