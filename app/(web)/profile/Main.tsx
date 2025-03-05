"use client"

import "./Main.css"
import { authorizationObj, baseUrl, profilePicture, profilePicturePath, profilePictureSizeLimit } from '@/app/utils/core'
import AlertMUI from '@/app/components/mui/AlertMUI'
import { login } from '@/app/redux/user'
import { Box, CircularProgress, Tab, Tabs } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HiPencil } from "react-icons/hi2";
import { primaryColor } from '@/app/utils/data'
import PropTypes from 'prop-types';
import Personal from './Personal'
import Security from './Security'
import Docs from './Docs'
import MoreInfo from "./MoreInfo"
import MoreInfoAdmin from "./MoreInfoAdmin"
import Image from 'next/image'

function CustomTabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ProfileSection = ({ user, setUser }: any) => {
    const currentUser = useSelector((state: any) => state?.user)
    const dispatch = useDispatch()

    const profileImageFileRef: any = useRef(null)

    const [selectedBase64, setSelectedBase64] = useState<null | string>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<null | string>(null)
    const [successMessage, setSuccessMessage] = useState<null | string>(null)
    const [activeTab, setActiveTab] = useState(0);

    const updateProfilePicture = async () => {

        setErrorMessage(null)
        setSuccessMessage(null)

        if (!profileImageFileRef || !profileImageFileRef?.current) return
        if (!profileImageFileRef?.current?.files || !profileImageFileRef?.current?.files?.length) return
        if (!profileImageFileRef?.current?.files[0]) return

        const profileImage = profileImageFileRef?.current?.files[0]

        if (!profileImage?.type?.startsWith("image")) {
            setErrorMessage("Profile picture must be an image")
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000);
            return
        }

        if (profileImage?.size > profilePictureSizeLimit) {
            setErrorMessage("Image too large must less than 2 mb")
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000);
            return
        }

        try {

            setIsLoading(true)

            const formData = new FormData()
            formData.append("profile_picture", profileImage)
            formData.append("first_name", currentUser?.first_name)
            formData.append("last_name", currentUser?.last_name)

            const resp = await axios.post(`${baseUrl}/users/update/${currentUser?.user_id}`, formData, authorizationObj)
            const user = await axios.get(`${baseUrl}/users/${currentUser?.user_id}`, authorizationObj)
            setUser({ ...currentUser, profile_picture: user?.data?.data?.profile_picture })
            dispatch(login({ ...currentUser, profile_picture: user?.data?.data?.profile_picture }))
            setIsLoading(false)
            setSuccessMessage("Profile picture updated successfully")
            setTimeout(() => {
                setSuccessMessage(null)
            }, 3000);

        } catch (error: any) {
            // console.error(error)
            setIsLoading(false)
            setErrorMessage(error?.response?.data?.message)
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000);
        }

    }

    return (
        <div className="container py-4">
            {errorMessage && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {errorMessage}
                    <button type="button" className="btn-close" onClick={() => setErrorMessage(null)}></button>
                </div>
            )}
            
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button>
                </div>
            )}

            <div className="text-center mb-4">
                <label htmlFor="profilePictureInput" 
                    className="position-relative d-inline-block cursor-pointer rounded-circle"
                    style={{ width: '110px', height: '110px', background: "linear-gradient(136.17deg, #FFFFFF 2.88%, #898989 128.67%)" }}>
                    {isLoading && (
                        <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
                            <div className="spinner-border text-primary"></div>
                        </div>
                    )}
                    <Image
                        src={selectedBase64 || user?.profile_picture || profilePicture} 
                        alt="profile"
                        width={100}
                        height={100}
                        className={`rounded-circle ${isLoading ? 'opacity-60' : ''}`}
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        onError={(e: any) => e.target.src = profilePicture}
                    />
                    <span className="position-absolute bottom-0 end-0 bg-primary rounded-circle d-flex justify-content-center align-items-center"
                        style={{ width: '24px', height: '24px' }}>
                        <HiPencil className="text-white" style={{ width: '12px', height: '12px' }}/>
                    </span>
                </label>
                <input 
                    type="file" 
                    id="profilePictureInput" 
                    hidden 
                    ref={profileImageFileRef}
                    accept="image/*"
                    onChange={(e: any) => {
                        if (currentUser?._id !== user?._id) return;
                        const base64Url = URL?.createObjectURL(e?.target?.files[0]);
                        setSelectedBase64(base64Url);
                        updateProfilePicture();
                    }}
                />
            </div>

            <ul className="nav nav-tabs nav-fill mb-4">
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 0 ? 'active' : ''}`}
                        onClick={() => setActiveTab(0)}
                    >
                        Personal
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 1 ? 'active' : ''}`}
                        onClick={() => setActiveTab(1)}
                    >
                        Security
                    </button>
                </li>
                {(currentUser?.role_id !== "1" && currentUser?.role_id !== "5") && (
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 2 ? 'active' : ''}`}
                            onClick={() => setActiveTab(2)}
                        >
                            {currentUser?.role_id === "2" ? "Docs" : 
                             currentUser?.role_id === "3" ? "More Info" : 
                             currentUser?.role_id === "4" ? "More Info" : ""}
                        </button>
                    </li>
                )}
            </ul>

            <div className="tab-content">
                <div className={`tab-pane fade ${activeTab === 0 ? 'show active' : ''}`}>
                    <Personal
                        setErrorMessage={setErrorMessage}
                        setSuccessMessage={setSuccessMessage}
                        user={user}
                        setUser={setUser}
                    />
                </div>
                <div className={`tab-pane fade ${activeTab === 1 ? 'show active' : ''}`}>
                    <Security
                        setErrorMessage={setErrorMessage}
                        setSuccessMessage={setSuccessMessage}
                        user={user}
                        setUser={setUser}
                    />
                </div>
                {currentUser?.role_id !== "1" && (
                    <div className={`tab-pane fade ${activeTab === 2 ? 'show active' : ''}`}>
                        {currentUser?.role_id === "2" ? (
                            <Docs
                                setErrorMessage={setErrorMessage}
                                setSuccessMessage={setSuccessMessage}
                                user={user}
                                setUser={setUser}
                                errorMessage={errorMessage}
                            />
                        ) : currentUser?.role_id === "3" ? (
                            <MoreInfo
                                setErrorMessage={setErrorMessage}
                                setSuccessMessage={setSuccessMessage}
                                user={user}
                                setUser={setUser}
                                errorMessage={errorMessage}
                            />
                        ) : currentUser?.role_id === "4" ? (
                            <MoreInfoAdmin
                                setErrorMessage={setErrorMessage}
                                setSuccessMessage={setSuccessMessage}
                                user={user}
                                setUser={setUser}
                                errorMessage={errorMessage}
                            />
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    )
}

const Main = () => {
    const currentUser = useSelector((state: any) => state?.user)
    const [user, set_user] = useState<any>(currentUser)
    useEffect(() => { get_user(currentUser?.user_id) }, [currentUser])

    const get_user = async (userId: string) => {
        if (!userId) return
        try {
            const resp = await axios.get(`${baseUrl}/users/${userId}`,authorizationObj)
            set_user(resp?.data?.data)
        } catch (error) {
            // console.error(error)
        }
    }

    return <ProfileSection user={user} setUser={set_user} />
}

export default Main