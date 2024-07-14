const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt")

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {

    try{
        //get email from request
        const email = req.body.email;

        //check user for emial, email validation
        const user = await User.findOne({email: email});
        if(!user) {
            return res.json({
                success: false,
                message: "Email not registered",
            })
        }

        //generate token
        const token = crypto.randomUUID();

        //update user by addaing token andexpiration time
        const updatedDetails = await User.findOneAndUpdate({email: email},
                                                            {
                                                                token : token,
                                                                resetPasswordExpires: Date.now() + 5*60*1000,
                                                            },
                                                            {new: true});

        //create url    
        const url = `http://localhost:3000/update-password/${token}`

        //send mail containing url
        await mailSender(email, "Password Reset Link",
            `Password Reset Link: ${url}`);
        
        //return response
        return res.json({
            success: true,
            message: "Email sent successfully, please check email and change Password"
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong while sending reset password mail"
        })
    }

   
}

//resetPassword
exports.resetPassword = async (req, res) => {
    try{
        //data fetch
        const {password, confirmPassword, token} = req.body

        //validation
        if(password !== confirmPassword){
            return res.json({
                success: false,
                message: "password Does not match"
            })
        }

        //get user details
        const userDetails = await User.findOne( {token: token});

        //if no entry for token - invalid token or token time out
        if(!userDetails) {
            return res.json({
                success: false,
                message: "Token Inavlid"
            });
        }
        
        if(userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "Token expired please regenrate token"
            })
        }

        //hash new password
        const hashedpassword = await bcrypt.hash(password, 10);

        //update password
        await User.findOneAndUpdate(
            {token: token},
            {password: hashedpassword},
            {new: true},
        );

        //return response
        return res.status(200).json({
            success: true,
            message: "Password Reset Succcessful",
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting password"
        })
    }
}