const {instance} = require('../config/razorpay');
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");


//capture payment and initiate razorpay order
exports.capturePayment = async (req, res) => {
        //get courseid and userid
        const {courseId} = req.body;
        const userId = req.user.id;

        //validation
        //valid courseid
        if(!courseId){
            return res.json({
                success: false,
                message: "Please provide valid course Id",
            })
        }
        //valid courseDetails
        let course;
        try{
            course = await Course.findById(courseId);
            if(!course){
                return res.json({
                    success:false,
                    message: "Could not find course"
                })
            }

            //if user already paid for course?
            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({
                    success:false,
                    message: "Student is already enrolled",
                })
            }
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success: false,
                message:error.message,
            })
        }

        //create order
        const amount = course.price;
        const currency = "INR";

        const options = {
            amount: amount*100,
            currency: currency,
            notes: {
                courseId: courseId,
                userId
            }
        };

        try{
            //initiate payment using razorpay
            const paymentResponce = await instance.orders.create(options);
            console.log(paymentResponce);

            //return res
            return res.status(200).json({
                success: true,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                courseThumbnail: course.thumbnail,
                orderId: paymentResponce.id,
                currency: paymentResponce.currency,
                amount: paymentResponce.amount,
            })
        }
        catch(error){
            console.log(error);
            res.json({
                success: false,
                message: "Could not initiate order",
            })
        }

        
    
};

//verify signature

exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);

    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest) {
        console.log("Payment is authorized");

        const {coureId, userId} = req.body.payload.enitity.notes;

        try{
            //find the course and enroll the student init
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id: courseId},
                {$push: {studentsEnrolled: userId}},
                {new: true},
            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    message: "Course Not Found",
                });
            }

            console.log(enrolledCourse);

            //find student and add course in list of enrolled courses
            const enrolledStudent = await User.findOneAndUpdate(
                {_id: userId},
                {$push: {courses:courseId}},
                {new: true},
            );

            console.log(enrolledStudent);

            //send course enrollment email
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congratulations",
                "You are enrolled in new course start your learning now"
            );
            
            console.log(emailResponse);

            return res.status(200).json({
                success: true,
                message: "Signature Verified and course added",
            });

        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }

    }
    else{
        return res.status(400).json({
            success: false,
            message: "Invalid request",
        })
    }

}