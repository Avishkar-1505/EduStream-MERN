import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { resetPassword } from '../services/operations/authApi';
import { BiArrowBack } from "react-icons/bi"


const UpdatePassword = () => {

    const dispatch = useDispatch();
    const location = useLocation();

    const [formData, setFormData] = useState({
        password:"", confirmPassword:"",
    })
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
    const {loading} = useSelector( (state) => state.auth);

    const {password, confirmPassword} = formData;

    const handleOnChange = (e) => {
        setFormData( (prevData) => (
            {
                ...prevData,
                [e.target.name] : e.target.value,
            }
        ))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password, confirmPassword, token))
    }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
    {
        loading ? (<div className='spinner'></div>)
        : (
            <div className="max-w-[500px] p-4 lg:p-8">
                <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                Choose new Password</h1>
                <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                Almost done. Enter your new password and your all set.</p>
                <form onSubmit={handleOnSubmit}>
                    <lable>
                        <p>New Password</p>
                        <input
                        required
                        type={showPassword ? "text" : "password"}
                        name='password'
                        value={password}
                        onChange={handleOnChange}
                        placeholder='password'
                        className="form-style w-full !pr-10"
                        />

                        <span
                        className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                        onClick={() => setShowPassword((prev) => !prev)}>
                            {
                                showPassword ? <AiOutlineEyeInvisible fontSize={24}/> : <AiOutlineEye fontSize={24}/>
                            }
                        </span>
                    </lable>

                    <lable className="relative mt-3 block">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                        Confirm Password <sup className="text-pink-200">*</sup>
                        </p>
                        <input
                        required
                        type={showConfirmedPassword ? "text" : "password"}
                        name='confirmPassword'
                        value={confirmPassword}
                        onChange={handleOnChange}
                        placeholder='Confirm Password'
                        className="form-style w-full !pr-10"
                        />

                        <span
                        className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                        onClick={() => setShowConfirmedPassword((prev) => !prev)}>
                            {
                                showConfirmedPassword ? <AiOutlineEyeInvisible fontSize={24}/> : <AiOutlineEye fontSize={24}/>
                            }
                        </span>

                        
                    </lable>
                    
                    <button
                        type='submit'
                        className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
                    >
                        Reset Password
                    </button>
                </form>
                
                <div className="mt-6 flex items-center justify-between">
                    <Link to="/login">
                        <p className="flex items-center gap-x-2 text-richblack-5">
                        Back to Login <BiArrowBack /> Back To Login
                        </p>
                    </Link>
                </div>

            </div>
        )
    }
    </div>
  )
}

export default UpdatePassword