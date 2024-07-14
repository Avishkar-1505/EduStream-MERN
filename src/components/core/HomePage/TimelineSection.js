import React from 'react'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"


const timeline = [
    {
        Logo: Logo1,
        heading: "Leadership",
        Decription: "Fully commited to the success company"
    },
    {
        Logo: Logo2,
        heading: "Responsibility",
        Decription: "Students will always be our top priority"
    },
    {
        Logo: Logo3,
        heading: "Flexibility",
        Decription: "The ability to switch is an important skills"
    },
    {
        Logo: Logo4,
        heading: "Solve the problem",
        Decription: "Code your way to a solution"
    }
]

const TimelineSection = () => {
  return (
    <div>
        <div className='flex flex-row gap-14 items-center'>
            <div className='w-[45%] flex flex-col gap-5'>
                {
                    timeline.map( (element, index) => {
                        return (
                            <div className='flex felx-row gap-6' key={index}>
                                <div className='w-[50px] h-[50px] bg-white flex items-center'>
                                    <img src={element.Logo} alt='logoImage'/>
                                </div>

                                <div>
                                    <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                    <p className='text-base'>{element.Decription}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            

            <div className='relative shadow-blue-200 shadow-[10px_-5px_50px_-5px]'>
                <img src={timelineImage} alt='TimeLineImage'
                    className='drop-shadow-[18px_18px_rgb(255,255,255)] object-cover h-fit'
                />

                <div className='absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-7
                left-[50%] translate-x-[-50%] translate-y-[-50%]
                '>
                    <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-100 px-7'>
                        <p className='text-3xl font-bold'>10</p>
                        <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
                    </div>

                    <div className='flex gap-5 items-center px-7'>
                        <p className='text-3xl font-bold'>250</p>
                        <p className='text-caribbeangreen-300 text-sm'>Types Of Courses</p>
                    </div>
                </div>
            </div>

        </div>

        
    </div>
  )
}

export default TimelineSection