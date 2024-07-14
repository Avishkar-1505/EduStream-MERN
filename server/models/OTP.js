const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        requires: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60
    }
})

//function to send mail

async function sendVerificationEmail(email, otp) {
    try{
        const mailResponce = await mailSender(email, "Verification Email from StudyNotion",emailTemplate(otp))
        console.log("Email sent successfully", mailResponce);
    }
    catch(error){
        console.error("Error while sending mail", error);
        throw error;
    }
}

otpSchema.pre("save", async function(next) {
    const mailRes = await sendVerificationEmail(this.email, this.otp);
    next()
})

module.exports = mongoose.model("OTP", otpSchema)