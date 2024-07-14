const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//createRating
exports.createRating = async (req, res) => {
    try{

        //get userId
        const userId = req.user.id;

        //fetch data from req body
        const {rating, review, courseId} = re.body;

        //check if user is enrolled
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: {$elemMatch: {$eq: userId}}
        });

        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: "Student is not enrolled in Course",
            })
        }

        //check if user already reviewed
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });

        if(alreadyReviewed){
            return res.stauts(403).json({
                success: false,
                message: "Course is Already reviewed by user"
            })
        }

        //create rating and review
        const ratingReview = await RatingAndReview.create({
            rating, review,
            course: courseId,
            user: userId,
        });

        //update course
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                }
            },
            {new: true}
        );

        console.log(updatedCourseDetails);

        //retrun response
        return res.status(200).json({
            success: true,
            message: "Rating and Review Created Successfully",
            ratingReview,
        })
        
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//getAverageRating
exports.getAverageRating = async (req, res) => {
    try{
        //get courseId
        const courseId = req.body.courseId;

        //calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating: { $avg: "$rating"},
                },
            },
        ])

        if(result.length > 0) {
            return res,status(200).json({
                success: true,
                averageRating: result[0].averageRating
            })
        }

        //return response
        return res.status(200).json({
            success: true,
            message: "Average Rating is 0, no rating given till time",
            averageRating: 0,
        })

        
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//getAllRating
exports.getAllRating = async (req, res) => {
    try{
        const allReviews = await RatingAndReview.find({}).sort({rating: "desc"})
        .populate({
            path:"user",
            select:"firstName lastName email image"
        })
        .populate({
            path: "course",
            select: "courseName",
        })
        .exec();

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

