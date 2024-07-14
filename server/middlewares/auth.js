const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


//auth
exports.auth = async (req, res, next) => {
    try{
        //etract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");;

        if(!token){
            return res.status(401).json({
                success: false,
                message: "No token found",
            });
        }

        //verify token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error) {
            return res.status(401).json({
                success: false,
                message: "Token is Invalid",
            });
        }
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Something went wrong while validating token, please try again later',
        })
    }
}

//isStudent
exports.isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for students only"
            })
        }
        next()
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        })
    }
}

//isInstructor
exports.isInstructor = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructors only"
            })
        }
        next()
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        })
    }
}

//isAdmin
exports.isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin only"
            });
        }
        next();
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified, please try again",
        })
    }
}

