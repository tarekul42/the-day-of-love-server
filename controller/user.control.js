import bcrypt from 'bcrypt';
import User from '../model/user.model.js';
import JWT from 'jsonwebtoken';

const saltRound = 10;


// Authetication Intrigration---->

//  Regitration user --->
export const userRegistration =async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        const user =await User.findOne({email:email});

        if (name && email && password) {
            if(user) return res.status(404).json({success:false,message:'Authentication Erorr: Email already predefine'})
        
            const hashPass = await bcrypt.hash(password,saltRound);
            const createUser = new User({
                name,
                email,
                password:hashPass,
            });

            await createUser.save();

            return res.status(201).json({
                success:true,
                message:"Successfully Regitration "
            });
        } else {
            return res.status(201).json({
                success:false,
                message:"Please Fill the form"
            });
        };

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    };
};

//  socialLogin user --->
export const socialLogin =async(req,res)=>{
    try {
        const {name,email,profile}=req.body;
        const user =await User.findOne({email:email});
        
        if(user) {
            if(user.isSocialLogIn ===true){
                const payload = {
                    userId : user?._id,
                    name:user?.name
                };
    
                const token = JWT.sign(payload,process.env.JWT_SECRET,{expiresIn:'10d'});
    
                return res.status(201).json({
                    success:true,
                    message:`Successfully Login ${newUser?.name}`,
                    token
                });
            }else{
                return res.status(400).json({success:false,message:'Authentication Erorr: Email already predefine'});
            }
        }else{
            const createUser = new User({
                name,
                email,
                password:'',
                profile,
                isSocialLogIn:true,
            });

            const newUser = await createUser.save();

            const payload = {
                userId : newUser?._id,
                name:newUser?.name
            };
            
            const token = JWT.sign(payload,process.env.JWT_SECRET,{expiresIn:'10d'});

            return res.status(201).json({
                success:true,
                message:`Successfully Login ${newUser?.name}`,
                token
            });
        
        }
       
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    };
};

// LogIn with SSO --->

export const SSOlogIn =async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user = await User.findOne({email:email});

        if (user) {
            const comparePass = await bcrypt.compare(password,user.password);
            if (comparePass) {
                const payload = {
                    userId : user?._id,
                    name:user?.name
                };
    
                const token = JWT.sign(payload,process.env.JWT_SECRET,{expiresIn:'10d'});
    
                return res.status(201).json({
                    success:true,
                    message:`Successfully Login ${newUser?.name}`,
                    token
                });
            } else {
                return res.status(400).json({
                    success:false,
                    message:"Authentication Error:Password Incorrect"
                });
            }
        } else {
            return res.status(404).json({
                success:false,
                message:"Authentication Error: Not Found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    };
};

// get user 

export const getUserProfile =async(req,res)=>{
    try {
        const user = await User.findById(req.userId);
        return res.status(200).json({
            success:true,
            user
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    };
};

// User Update--->
export const userPassUp =async(req,res)=>{
    try {
        const userId=req.userId;
        const {oldPass,newPass}=req.body;
        const user = await User.findById(userId);

        const updatePass = async (password)=>{
            const hashPass = await bcrypt.hash(password,saltRound);

                const update = await User.findByIdAndUpdate(userId,{
                    $set:{
                        password:hashPass
                    }
                },{new:true});

                if (update) {
                    return res.status(200).json({
                        success:true,
                        message:"Password Updated"
                    });
                } else {
                    return res.status(400).json({
                        success:false,
                        message:"Update Faild"
                    });
                }
        };

        if (user) {
            if (!user.password && user.isSocialLogIn===true) {
                await updatePass(newPass);
            } else {
                const comparePass = await bcrypt.compare(oldPass,user.password);
                if (comparePass) {
                    await updatePass(newPass);
                } else {
                    return res.status(400).json({
                        success:false,
                        message:"Authentication Error:Password Incorrect"
                    });
                }
            }
        } else {
            return res.status(404).json({
                success:false,
                message:"Authentication Error: Not Found"
            });
        }

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    };
};

// // Delete user--->
// export const deleteUser =async(req,res)=>{
//     try {

//     } catch (error) {
//         return res.status(500).json({
//             success:false,
//             message:error.message
//         });
//     };
// };

