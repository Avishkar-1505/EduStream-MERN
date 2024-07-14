const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
    try{
        //fetch data
        const {sectionName, courseId} = req.body;

        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message: "Missing Properties",
            })
        }

        const newSection = await Section.create({sectionName});

        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id
                }
            },
            {new: true}
        ).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        })
        .exec();
        //Use populate to populate both section and subsection

        return res.status(200).json({
            success: true,
            message: "Section Created Successfully",
            updatedCourseDetails,
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to create Section",
            error: error.message,
        });
    }
}

exports.updateSection = async (req, res) => {
    try{
        //fetch data
        const {sectionName, sectionId, courseId} = req.body;

        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message: "Missing Properties",
            })
        } 
        
        //Update data
        const section = await Section.findByIdAndUpdate(
            sectionId,
            {sectionName},
            {new: true}
        );

        const updatedCourseDetails = await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        })
        .exec();

        //return res
        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully",
            section,
            updatedCourseDetails,
        })

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to Update Section",
            error: error.message,
        });
    }
}

exports.deleteSection = async (req, res) => {
    try{
        //getId assumming id is in params
        const {sectionId, courseId} = req.body

        //findByIdAndDelete
        await Section.findByIdAndDelete(sectionId)

        //TODO :- do we need to delete sectionid from course
        const data = await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        })
        .exec();

        //return res
        return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully",
            data,
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to Delete Section, please try again",
            error: error.message,
        });
    }
}