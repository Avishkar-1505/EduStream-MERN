import React, { useEffect, useState } from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {Link, matchPath} from 'react-router-dom'
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { IoCartOutline } from "react-icons/io5";
import { courseEndpoints } from '../../services/apis'
import { apiConnector } from '../../services/apiconnector'
import { FaAngleDown } from "react-icons/fa";
import ProfileDropdown from '../core/auth/ProfileDropdown'
import { AiOutlineMenu } from 'react-icons/ai'



const NavBar = () => {

    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const {totalItems} = useSelector((state) => state.cart);
    const location = useLocation();

    const [subLinks, setSubLinks] = useState([])

    const fetchSublinks = async () => {
        try{
            const result = await apiConnector("GET", courseEndpoints.COURSE_CATEGORIES_API);
            console.log("Printing sublinks",result);
            setSubLinks(result.data.allCategory);
        }
        catch(error){
            console.log("Could not fetch category list")
        }
    }

    useEffect(() => {
        fetchSublinks();
    }, [])


    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname);
    }

    console.log(subLinks)

  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between'>


            <Link to="/">
                <img src={logo} width={160} height={42} loading='lazy'/>
            </Link>

            {/* Nav links */}

            <nav>
                <ul className='flex gap-x-6 text-richblack-25'>
                {
                    NavbarLinks.map( (link, index) => (
                        <li key={index}>
                            {
                                link.title === "Catalog" ? (
                                    <div className='relative flex items-center gap-2 group'>
                                        <p>{link.title}</p>
                                        <FaAngleDown />
                                        <div className='invisible absolute left-[50%] translate-x-[-50%] translate-y-[40%] top-[50%]
                                        flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                                        opacity-0 transition-all duration-200 group-hover:visible
                                        group-hover:opacity-100 lg:w-[300px]'>

                                            <div className='absolute left-[50%] top-0 translate-x-[30%]
                                            translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5'>
                                            </div>

                                            {
                                                subLinks.length ? (
                                                    subLinks.map((subLink, index) => (
                                                        <Link to={`/${subLink.name}`} key={index}>
                                                            <p>{subLink.name}</p>
                                                        </Link>
                                                    ))
                                                
                                                ) 
                                                : (<div>Yoo what up</div>)
                                            }
                                        </div>
                                    </div>

                                ) 
                                : (
                                    <Link to={link?.path}>
                                        {<p className={`${matchRoute(link?.path) ? "text-yellow-25" :
                                        "text-richblack-25"}`}>
                                        {link.title}</p>}
                                    </Link>
                                )
                            }
                        </li>
                    ))
                }
                </ul>
            </nav>

            {/* LOgin/Signup button */}
            
            <div className='flex gap-x-4 items-center'>
            {
                user && user?.accountType !== "Instructor" && (
                    <Link to='/dashboard/cart' className='relative'>
                        <IoCartOutline />
                        {
                            totalItems > 0 && (
                                <span> {totalItems}</span>
                            )
                        }
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to='/login'>
                        <button className='border border-richblack-700 
                        bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                        Login</button>
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to='/signup' className='border border-richblack-700 
                        bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                        <button>Sign Up</button>
                    </Link>
                )
            }
            {
                token !== null && <ProfileDropdown/>
            }
            </div>
            
            <button className="mr-4 md:hidden">
            <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
            </button>

        </div>
    </div>
  )
}

export default NavBar