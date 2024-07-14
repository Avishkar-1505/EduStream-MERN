import React, { useState } from 'react'
import {HomePageExplore} from "../../../data/homepage-explore"
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabsname = [
    "Free",
    "New to coding",
    "Most popular",
    "Skill paths",
    "Career paths",
];

const ExploreMore = () => {

    const [currentTab, setCurrentTab] = useState(tabsname[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value)
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }
    
    

  return (
    <div>
        <div className='text-4xl font-semibold'>
            Unlock the
            <HighlightText text={" Power of Code"} />
        </div>

        <p className='text-center text-richblack-300 text-md '>Learn to build anything you can imagine</p>

        <div className='flex flex-row border-richblack-100 rounded-full bg-richblack-800 mb-5 mt-5 
        px-1 py-1'>
            {
                tabsname.map( (element, index) => {
                    return(
                        <div
                        className={`text-[16px] flex flex-row items-center gap-2
                        ${currentTab === element ?
                        "bg-richblack-900 text-richblack-5 font-medium" 
                        : "text-richblack-200 "} rounded-full transition-all duration-200
                        cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`}
                        key={index}
                        onClick={() => setMyCards(element)}
                        >
                            {element}
                        </div>
                    )
                })
            }
        </div>
        

        <div className='lg:h-[150px]'>

            <div className='absolute flex flex-row gap-10 justify-between w-full'>
            {
                courses.map((element, index) => {
                    return(
                        <CourseCard
                        key={index}
                        cardData = {element}
                        currentCard = {currentCard}
                        setCurrentCard = {setCurrentCard}
                        />
                    )
                })
            }
            </div>

        </div>

    </div>
  )
}

export default ExploreMore