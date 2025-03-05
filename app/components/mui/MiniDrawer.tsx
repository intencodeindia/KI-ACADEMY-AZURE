"use client"

import "./index.css"
import * as React from 'react';
import { styled, useTheme, Theme, CSSObject, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { TbDeviceAnalytics } from "react-icons/tb";
import { BsPersonFill as PersonIcon } from "react-icons/bs";
import LogoutIcon from '@mui/icons-material/Logout';
import { companyName, primaryColor } from "../../utils/data"
import logo from "../../../public/images/logo-black.png"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { profilePicture, profilePicturePath } from '@/app/utils/core';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import ConfirmAlertMUI from './ConfirmAlertMUI';
import { logout, setIsAdminDrawerOpen } from '@/app/redux/user';
import { FaBook, FaVideo, FaHome, FaWallet, FaRegBell, FaClipboardCheck, FaShoppingCart, FaRegBookmark, FaPaperPlane, FaEnvelope } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { FaRegClipboard } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { BsFillMortarboardFill } from "react-icons/bs";
import { MdOutlineChat } from "react-icons/md";
import { AiFillDashboard } from "react-icons/ai";
import { IoMdPerson } from "react-icons/io";
import { GrTransaction } from "react-icons/gr";
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { MdOutlineLiveTv } from "react-icons/md";
import { GrContact } from "react-icons/gr";
import { BiSolidSchool } from "react-icons/bi";
import { MdAdminPanelSettings } from "react-icons/md"
import { CgAssign } from "react-icons/cg";
import { MdOutlineCategory } from "react-icons/md";
import { signOut } from "next-auth/react"
import { FaRegCreditCard } from "react-icons/fa";
import { BiSolidPackage } from "react-icons/bi";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function MiniDrawerMUI({ children }: any) {
    const theme = useTheme();
    const router = useRouter();
    const dispatch = useDispatch();

    const state = useSelector((state: any) => state)
    const currentUser = state?.user
    const isAdminDrawerOpen = state?.isAdminDrawerOpen

    const [sideBarData, setSideBarData] = React.useState<any[]>([])
    const [clear, setClear] = React.useState<boolean>(false)

    // window data
    const [pathName, setPathName] = React.useState<string | null>(null)

    React.useEffect(() => {
        setPathName(window?.location?.pathname)
    }, [])

    React.useEffect(() => {
        getSideBarData()
    }, [currentUser, pathName])

    React.useEffect(() => {
        getSideBarData()
    }, [])

    const getSideBarData = () => {
        if (currentUser?.role_id === "1") {
            setSideBarData([
                {
                    label: "Analytics",
                    route: "/admin/analytics",
                    icon: <AiFillDashboard />
                },
                {
                    label: "Courses",
                    route: "/admin/courses",
                    icon: <FaBook />
                },
                {
                    label: "Tutors",
                    route: "/admin/tutors",
                    icon: <IoMdPerson />
                },
                {
                    label: "Onboarding-Tutors",
                    route: "/admin/onboarding-tutors",
                    icon: <IoMdPeople />
                },
                {
                    label: "Students",
                    route: "/admin/students",
                    icon: <IoMdPeople />
                },
                {
                    label: "Institutions",
                    route: "/admin/institutions",
                    icon: <BsFillMortarboardFill />
                },
                {
                    label: "Announcements",
                    route: "/admin/announcements",
                    icon: <FaPaperPlane />
                },
                {
                    label: "Categories",
                    route: "/admin/course-categories",
                    icon: <MdOutlineCategory />
                },
                {
                    label: "Contact Us",
                    route: "/admin/contact-us",
                    icon: <GrContact />
                },
                {
                    label: "Transaction",
                    route: "/admin/transactions",
                    icon: <GrTransaction />
                },
                {
                    label: "Plans",
                    route: "/admin/plans",
                    icon: <FaRegCreditCard />
                },
                {
                    label: "Subscriptions",
                    route: "/admin/subscriptions",
                    icon: <BiSolidPackage />
                },
                // {
                //     label: "My Institutes",
                //     route: "/admin/my-institutes",
                //     icon: <BiSolidSchool />
                // },
            ]);
        } else if (currentUser?.role_id === "2") {
            if (currentUser?.institute_id) {
                setSideBarData([
                    {
                        label: "Courses",
                        route: "/institution/tutor/courses",
                        icon: <FaBook />
                    },
                    {
                        label: "Notifications",
                        route: "/institution/tutor/notifications",
                        icon: <FaEnvelope />
                    },
                    {
                        label: "Live",
                        route: "/institution/tutor/live",
                        icon: <MdOutlineLiveTv />
                    },
                    {
                        label: "Live Recordings",
                        route: "/institution/tutor/live-recordings",
                        icon: <FaVideo />
                    },
                ])
            } else {
                setSideBarData([
                    {
                        label: "Courses",
                        route: "/tutor/courses",
                        icon: <FaBook />
                    },
                    {
                        label: "Students",
                        route: "/tutor/students",
                        icon: <IoMdPeople />
                    },
                    {
                        label: "Announcements",
                        route: "/tutor/announcements",
                        icon: <FaPaperPlane />
                    },
                    {
                        label: "Live",
                        route: "/tutor/live",
                        icon: <MdOutlineLiveTv />
                    },
                    {
                        label: "Live Recordings",
                        route: "/tutor/live-recordings",
                        icon: <FaVideo />
                    },
                    // {
                    //     label: "My Institutes",
                    //     route: "/tutor/my-institutes",
                    //     icon: <BiSolidSchool />
                    // },
                ])
            }
        } else if (currentUser?.role_id === "3") {
            if (currentUser?.institute_id) {
                setSideBarData([
                    {
                        label: "Courses",
                        route: "/institution/student/courses",
                        icon: <FaBook />
                    },
                    {
                        label: "Notifications",
                        route: "/institution/student/notifications",
                        icon: <FaEnvelope />
                    },
                    {
                        label: "Cart",
                        route: "/institution/student/cart",
                        icon: <FaShoppingCart />
                    },
                    {
                        label: "Favourites",
                        route: "/institution/student/favourites",
                        icon: <FaRegBookmark />
                    },
                    {
                        label: "Payment",
                        route: "/institution/student/payment",
                        icon: <FaRegBookmark />
                    },
                ])
            } else {
                setSideBarData([
                    {
                        label: "Courses",
                        route: "/student/courses",
                        icon: <FaBook />
                    },
                    {
                        label: "Notifications",
                        route: "/student/notifications",
                        icon: <FaEnvelope />
                    },
                    {
                        label: "Cart",
                        route: "/student/cart",
                        icon: <FaShoppingCart />
                    },
                    {
                        label: "Favourites",
                        route: "/student/favourites",
                        icon: <FaRegBookmark />
                    },
                    {
                        label: "Payment",
                        route: "/student/payment",
                        icon: <FaRegBookmark />
                    },
                    // {
                    //     label: "Live",
                    //     route: "/student/live",
                    //     icon: <FaVideo />
                    // },
                    // {
                    //     label: "My Institutes",
                    //     route: "/student/my-institutes",
                    //     icon: <BiSolidSchool />
                    // },
                ])
            }
        } else if (currentUser?.role_id === "4") {
            setSideBarData([
                {
                    label: "Analytics",
                    route: "/institution/admin/analytics",
                    icon: <AiFillDashboard />
                },
                {
                    label: "Courses",
                    route: "/institution/admin/courses",
                    icon: <FaBook />
                },
                {
                    label: "Assign Course",
                    route: "/institution/admin/assign-course",
                    icon: <CgAssign />
                },
                {
                    label: "Sub Admins",
                    route: "/institution/admin/sub-admins",
                    icon: <MdAdminPanelSettings />
                },
                {
                    label: "Tutors",
                    route: "/institution/admin/tutors",
                    icon: <IoMdPerson />
                },
                {
                    label: "Students",
                    route: "/institution/admin/students",
                    icon: <IoMdPeople />
                },
                {
                    label: "Announcements",
                    route: "/institution/admin/announcements",
                    icon: <FaPaperPlane />
                },
                {
                    label: "Transactions",
                    route: "/institution/admin/transactions",
                    icon: <GrTransaction />
                },
            ])
        } else if (currentUser?.role_id === "5") {
            setSideBarData([
                {
                    label: "Analytics",
                    route: "/institution/sub-admin/analytics",
                    icon: <AiFillDashboard />
                },
                {
                    label: "Courses",
                    route: "/institution/sub-admin/courses",
                    icon: <FaBook />
                },
                {
                    label: "Assign Course",
                    route: "/institution/admin/assign-course",
                    icon: <CgAssign />
                },
                {
                    label: "Tutors",
                    route: "/institution/sub-admin/tutors",
                    icon: <IoMdPerson />
                },
                {
                    label: "Students",
                    route: "/institution/sub-admin/students",
                    icon: <IoMdPeople />
                },
                {
                    label: "Announcements",
                    route: "/institution/sub-admin/announcements",
                    icon: <FaPaperPlane />
                },
                {
                    label: "Transactions",
                    route: "/institution/sub-admin/transactions",
                    icon: <GrTransaction />
                },
            ])
        }
    }

    // drawer
    const [open, setOpen] = React.useState<any>(isAdminDrawerOpen);
    const handleDrawerOpen = () => {
        setOpen(true);
        dispatch(setIsAdminDrawerOpen(true))
    };

    const handleDrawerClose = () => {
        setOpen(false);
        dispatch(setIsAdminDrawerOpen(false))
    };

    // menu
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // confirmation alert
    const [alertData, setAlertdata] = React.useState<any>(null)
    const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false)

    // loading
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (clear) {
            localStorage.setItem("hart", "")
        }
    }, [clear])

    // logout
    const _logout = async () => {
        try {
            setIsLoading(true)
            setIsLoading(false)
            setClear(true)
            dispatch(logout())
            setAlertdata(null)
            setIsAlertOpen(false)
            signOut()
            router?.push("/auth/signin")
        } catch (error: any) {
            // console.error(error)
            setIsLoading(false)
        }
    }

    return (
        <>
            <ConfirmAlertMUI
                open={isAlertOpen}
                setOpen={setIsAlertOpen}
                title={alertData?.title}
                description={alertData?.description}
                fun={alertData?.fun}
                isLoading={isLoading}
            />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" className='w-full flex justify-between items-center'>
                            <div className='flex gap-2 items-start cursor-pointer'
                                onClick={() => router.push("/")}
                            >
                                <p className="m-0">{currentUser?.instituteData?.name ? currentUser?.instituteData?.name : companyName}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {/* <IconButton size="small"><MdOutlineChat style={{ color: "#eee" }} /></IconButton> */}
                                {/* <IconButton size="small"><FaRegBell style={{ color: "#eee" }} /></IconButton> */}
                                <>
                                    <Button
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                    >
                                        <div className='flex items-center'>
                                            <Image 
                                                src={currentUser?.profile_picture || profilePicture}
                                                alt="profile picture"
                                                width={40}
                                                height={40}
                                                className='w-[40px] h-[40px] object-cover object-center rounded-full cursor-pointer'
                                                onError={(e: any) => {
                                                    e.target.src = profilePicture;
                                                }}
                                                priority={true}
                                                loading="eager"
                                            />
                                        </div>
                                    </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={openMenu}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={() => {
                                            handleClose()
                                            router?.push("/profile")
                                        }}
                                        ><PersonIcon
                                                style={{ width: 18, height: 18 }}
                                            /> <span className='ml-2 pt-[3px]'>Profile</span></MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                setAlertdata({
                                                    title: "Logout?",
                                                    description: "Are you sure you want to logout?. The action cannot be undone",
                                                    fun: _logout,
                                                })
                                                setIsAlertOpen(true)
                                                handleClose()
                                            }}
                                        ><LogoutIcon
                                                sx={{ width: 18, height: 18 }} /> <span className='ml-2 pt-[3px]'>Logout</span></MenuItem>
                                    </Menu>
                                </>
                            </div>
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <div className='flex gap-2 items-center m-auto cursor-pointer'
                            onClick={() => router.push("/")}
                        >
                            <Image src={logo} width={30} height={30} objectFit='contain' alt='logo'
                                className='rounded-full p-[3px] bg-white w-[30px] h-[30px]'
                            />
                            <p className="m-0">{companyName}</p>
                        </div>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List sx={{ padding: 0, marginTop: '15px' }}>
                        {sideBarData?.map((data: any, i: number) => (
                            <ListItem key={i} disablePadding
                                onClick={() => router?.push(data?.route)}
                                sx={{
                                    display: 'block',
                                    color: pathName === data?.route ? primaryColor : "",


                                }}
                            >
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,

                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                            color: pathName === data?.route ? primaryColor : "",
                                        }}
                                    >
                                        {data?.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={data?.label} sx={{
                                        opacity: open ? 1 : 0
                                    }} className={`${pathName === data?.route ? "font-bold" : ""}`} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#fff' }}>
                    <DrawerHeader />
                    {children}
                </Box>
            </Box>
        </>
    );
}
