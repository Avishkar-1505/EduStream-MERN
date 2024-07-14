import React, { useState } from 'react'
import {sidebarLinks} from "../../../data/dashboard-links"
import { logout } from '../../../services/operations/authApi'
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { useNavigate } from 'react-router-dom'
import { VscSignOut } from 'react-icons/vsc'
import ConfirmationModal from '../../common/ConfirmationModal'

const Sidebar = () => {

    const {user, loading: profileLoading} = useSelector((state) => state.profile);
    const {loading: authLoading} = useSelector( (state) => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [confirmationModal, setConfirmationModal] = useState(null);

    if (profileLoading || authLoading) {
        return (
          <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
            <div className="spinner"></div>
          </div>
        )
    }
    

  return (
    <div>
        <div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-900 py-10">
            <div className='flex flex-col'>
                {
                    sidebarLinks.map((link) => {
                        if(link.type && user?.accountType !== link.type) return null;

                        return (
                            <SidebarLink link={link} iconName={link.icon} key={link.id} />
                        )
                    })
                }
            </div>

            <div className='mx-auto mb-6 mt-6 h-[1px] w-10/12 bg-richblack-800'></div>

            
            <div className='flex flex-col'>
                <SidebarLink link={{name:"Setting", path:"/dashboard/settings"}} iconName="VscSettingsGear" />

                <button
                    onClick={ () => setConfirmationModal({
                        text1: "Are You Sure?",
                        text2: "You will be logged out of your Account",
                        btn1Text: "Logout",
                        btn2Text: "Cancel",
                        btn1Handler: () => dispatch(logout(navigate)),
                        btn2Handler: () =>  setConfirmationModal(null),
                        
                    })}
                    className='text-sm font-medium text-richblack-300'
                >

                    <div className='flex items-center px-8 py-2 gap-x-2'>
                        <VscSignOut className='text-lg'/>
                        <span>Logout</span>
                    </div>
                </button>
            </div>


            
        </div>

        

        {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
        
  )
}

export default Sidebar