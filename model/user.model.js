import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Name Is required']
    },
    email:{
        type:String,
        required:[true,'mail is require'],
        validate:{
            validator:(v)=>{
                return /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(v)
            },
            message:(prp)=>`${prp.value} is not a valid mail`
        },
        unique:[true,'Mail must have been unique']
    },
    password :{
        type:String,
        required:[true,'password is required']
    },
    phone :{
        type:Number,
        default:1010101010101
    },
    role:{
        type:String,
        default:'Resume designer'
    },
    isSocialLogIn:{
        type:Boolean,
        deafult:false
    },
    profile:{
        type:String,
        deafult:null
    },
},{timestamps:true});


 const User = mongoose.model('users',userSchema);


 export default User;
