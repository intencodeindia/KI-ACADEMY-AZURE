"use client"

import "./Header.css"
import logo from "../../../public/images/logo-white.png"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { HiMenuAlt3 } from "react-icons/hi";
import { FaRegHeart } from "react-icons/fa";
import { BsCart } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { RiAccountCircleLine } from "react-icons/ri";
import { Button, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdArrowForward } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux"
import { logout } from '@/app/redux/user';
import { useRouter } from "next/navigation";
import Image from "next/image"
import { profilePicturePath } from "@/app/utils/core";
import {signOut} from "next-auth/react"
import { IoMdNotifications } from "react-icons/io";
import axios from "axios";
import { authorizationObj } from "@/app/utils/core";
import { baseUrl } from "@/app/utils/core";
import Modal from 'react-bootstrap/Modal';


const RightMenuBar = ({ options }: any) => {
  const dispatch = useDispatch();

  const router = useRouter()

  const menuOptions = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Logout", path: "/auth" },

  ]

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event?.currentTarget)

  const handleClose = () => setAnchorEl(null)

  const handleLogout = () => {
    dispatch(logout())
    localStorage.setItem("hart", "")
    signOut()
    router.push("/auth");
  };

  return (
    <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2 right-menu-bar">
      {options?.map((option: any, i: number) => (
        <IconButton 
          key={i} 
          onClick={() => option.onClick ? option.onClick() : router.push(option?.path)} 
          className="text-dark nav-icon"
          size="small"
        >
          {option?.label}
        </IconButton>
      ))}
      
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        className="text-dark nav-icon"
        size="small"
      >
        <HiMenuAlt3 />
      </IconButton>

      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {menuOptions.map((option: any, i: number) => (
          <MenuItem
            key={i}
            onClick={() => {
              if (option.label === "Logout") {
                handleLogout(); // Call the logout function
              } else {
                router.push(option?.path);
              }
              handleClose();
            }}
          >
            {option?.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

const CenterMenuBar = ({ options }: any) => {

  const router = useRouter()

  const [hoveredOption, setHoveredOption] = useState<any>(null);

  const handleClick = (hover: boolean, path: string) => {
    if (!hover) router.push(path)
  }

  const handleMouseOver = (index: number) => {
    setHoveredOption(index);
  };

  const handleMouseOut = () => {
    setHoveredOption(null);
  };

  return (
    <div className="d-flex justify-content-start">
      {options?.map((option: any, i: number) => (
        <div
          key={i}
          className="position-relative"
          onMouseOver={() => handleMouseOver(i)}
          onMouseOut={handleMouseOut}
        >
          <div 
            className="d-flex align-items-center text-light px-3 py-2 cursor-pointer"
            onClick={() => !option?.hover && handleClick(option?.hover, option?.path)}
          >
            {option?.label}
            {option?.hover && <IoIosArrowDown className="ms-2" />}
          </div>

          {option?.hover && hoveredOption === i && (
            <div className="position-absolute bg-light rounded shadow-sm" style={{top: "100%", left: 0, width: "200px"}}>
              {option?.options?.map((subOption: any, j: number) => (
                <div
                  key={j}
                  className="d-flex justify-content-between align-items-center p-3 text-dark hover-bg-light cursor-pointer"
                  onClick={() => router.push(subOption?.path)}
                >
                  {subOption?.label}
                  <IoMdArrowForward />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const NotificationPopup = ({ notifications, onClose, show }: { notifications: any[], onClose: () => void, show: boolean }) => {
    const router = useRouter();

    if (!show) return null;

    return (
        <div className="notification-dropdown">
            <div className="notification-header d-flex justify-content-between align-items-center">
                <div>
                    <h6 className="mb-0">Notifications</h6>
                    <small className="text-muted">
                        {notifications.length === 0 ? 'No new notifications' : `${notifications.length} new notifications`}
                    </small>
                </div>
                <div 
                    className="btn-close btn-sm cursor-pointer" 
                    onClick={onClose}
                    role="button"
                    aria-label="Close notifications"
                />
            </div>
            
            <div className="notification-body">
                {notifications.length === 0 ? (
                    <div className="text-center p-4">
                        <div className="mb-2">
                            <IoMdNotifications size={32} className="text-muted" />
                        </div>
                        <p className="text-muted mb-0">No new notifications</p>
                    </div>
                ) : (
                    notifications.map((notification: any, index: number) => (
                        <div key={index} className="notification-item">
                            <div className="d-flex align-items-start gap-2">
                                <div className={`notification-indicator ${notification.type === 'increase' ? 'increase' : 'decrease'}`} />
                                <div>
                                    <p className="notification-text mb-1">
                                        {notification.title}
                                    </p>
                                    <small className="text-muted">
                                        {new Date(notification.created_at).toLocaleDateString()}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="notification-footer">
                <div 
                    className="btn btn-link text-primary text-decoration-none w-100 cursor-pointer"
                    onClick={() => {
                        router.push('/student/notifications');
                        onClose();
                    }}
                    role="button"
                >
                    View All Alerts
                </div>
            </div>
        </div>
    );
};

const Header = () => {

  const router = useRouter()
  const currentUser = useSelector((state: any) => state)
  const { isLogin } = currentUser
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (isLogin && currentUser?.user?.user_id) {
      getNotifications();
    }
  }, [isLogin, currentUser?.user?.user_id]);

  const getNotifications = async () => {
    try {
      const resp = await axios.get(
        `${baseUrl}/notifications/received_notification/${currentUser?.user?.user_id}`, 
        authorizationObj
      );
      if (resp?.data) {
        setNotifications(resp.data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const admin_right_menu_options = [
    { path: currentUser?.user?.institute_id ? "/institution/admin/announcements" : "/admin/announcements", label: <FaRegBell /> },
    { path: currentUser?.user?.institute_id ? "/institution/admin/courses" : "/admin/courses", label: <RiAccountCircleLine /> },
  ]

  const tutor_right_menu_options = [
    { path: currentUser?.user?.institute_id ? "/institution/tutor/announcements" : "/tutor/announcements", label: <FaRegBell /> },
    { path: currentUser?.user?.institute_id ? "/institution/tutor/courses" : "/tutor/courses", label: <RiAccountCircleLine /> },
  ]

  const student_right_menu_options = [
    { path: currentUser?.user?.institute_id ? "/institution/student/favourites" : "/student/favourites", label: <FaRegHeart /> },
    { path: currentUser?.user?.institute_id ? "/institution/student/cart" : "/student/cart", label: <BsCart /> },
    {
        path: "#",
        label: (
            <div className="notification-container position-relative">
                <div className="d-flex align-items-center">
                    <IoMdNotifications className="notification-icon" />
                    {notifications?.length > 0 && (
                        <span className="notification-badge">
                            {notifications.length}
                        </span>
                    )}
                </div>
            </div>
        ),
        onClick: (e?: React.MouseEvent) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            handleNotificationClick();
        }
    },
    { path: currentUser?.user?.institute_id ? "/profile" : "/profile", label: <RiAccountCircleLine /> },
  ]

  const rightMenuBarOptions = [
    ...(currentUser?.user?.role_id === "1" ? admin_right_menu_options :
      currentUser?.user?.role_id === "2" ? tutor_right_menu_options :
        currentUser?.user?.role_id === "3" ? student_right_menu_options : [])
  ];

  const centerMenuBarOptions = [
    {
      label: "Courses", 
      path: "/current-courses"
    },
    isLogin && {
      label: "My Learning", 
      hover: false,
      path: currentUser?.user?.role_id === "1" ? "/admin/analytics" :
            currentUser?.user?.role_id === "2" ? (currentUser?.user?.institute_id ? "/institution/tutor/courses" : "/tutor/courses") :
            currentUser?.user?.role_id === "3" ? (currentUser?.user?.institute_id ? "/institution/student/courses" : "/student/courses") :
            currentUser?.user?.role_id === "4" ? "/institution/admin/analytics" :
            currentUser?.user?.role_id === "5" ? "/institution/sub-admin/analytics" :
            "/"
    },
    !isLogin && {
      label: "Register as Institute", 
      hover: false, 
      path: "/institution/registration"
    }
  ].filter(Boolean); // filter out any falsy values (e.g., if `isLogin` is false, the "Dashboard" option won't be included)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const popup = document.querySelector('.notification-popup');
      const notificationIcon = document.querySelector('.notification-icon');
      if (popup && !popup.contains(event.target as Node) && 
        notificationIcon && !notificationIcon.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-dark bg-dark sticky-top py-2">
      <div className="container-fluid px-lg-4">
        <div className="d-flex align-items-center gap-3">
          <Image
            src={currentUser?.user?.instituteData?.profile_image || logo}
            alt="logo"
            width={80}
            height={80}
            className="navbar-logo rounded-circle cursor-pointer"
            onClick={() => router.push("/")}
            priority
          />
          <h5 className="text-light mb-0 d-none d-sm-block">KI Academy</h5>
        </div>

        <div className="d-flex align-items-center gap-3">
          <CenterMenuBar options={centerMenuBarOptions} />

          {isLogin ? (
            <RightMenuBar options={rightMenuBarOptions} />
          ) : (
            <button 
              className="btn btn-light px-4 py-2 rounded-pill" 
              onClick={() => router.push("/auth/signin")}
              type="button"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header