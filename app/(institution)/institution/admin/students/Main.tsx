"use client"

import AntdDrawer from '@/app/components/antd/AntdDrawer'
import CreateUserForm from '@/app/components/mui/CreateUserForm'
import { authorizationObj, baseUrl, profilePicture, profilePicturePath } from '@/app/utils/core'
import { capitalizeString } from '@/app/utils/functions'
import { Button, Typography } from '@mui/material'
import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { IoMdAddCircle } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { IoMdTrash } from "react-icons/io";
import { MdRemoveRedEye } from "react-icons/md";
import { DataGrid } from '@mui/x-data-grid'
import ConfirmAlertMUI from '@/app/components/mui/ConfirmAlertMUI'
import EditUserForm from '@/app/components/mui/EditUserForm'
import Image from 'next/image'
const Main = () => {
    const currentUser = useSelector((state: any) => state?.user)

    const [students, set_students] = useState([])
    const [show_user_modal, set_show_user_modal] = useState<boolean>(false)
    const [processed_data, set_processed_data] = useState<any>([])
    const [alert_data, set_alert_data] = useState<any>(null)
    const [is_alert_open, set_is_alert_open] = useState(false)
    const [is_loading, set_is_loading] = useState(false)    
    const [error_message, set_error_message] = useState("")
    const [success_message, set_success_message] = useState("")
    const [single_user, set_single_user] = useState<any>(null)
    const [is_editing, set_is_editing] = useState(false)

    useEffect(() => {
        get_students()
    }, [currentUser])

    const get_students = async () => {
        const instituteId = currentUser?.institute_id
        if (!instituteId) return
        try {
            const resp = await axios.get(`${baseUrl}/institutions/getUsersByInstitutes/${instituteId}`, authorizationObj)
            const data = resp?.data
            const filtered_data = data?.filter((d: any) => d?.role_id === "3")
            set_students(filtered_data)
        } catch (error) {
            // console.error(error)
        }
    }

    useEffect(() => {
        if (!students?.length) return
        const data = students?.map((d: any, i: number) => {
            return {
                id: i,
                s_no: i + 1,
                user_id: d?.user_id,
                full_name: d?.first_name + " " + d?.last_name,
                profile_picture: `${d?.profile_picture}`,
                user_status: capitalizeString(d?.user_status),
                created_at: moment(d?.created_at).format("DD/MM/YYYY"),
            }
        })
        set_processed_data(data)
    }, [students])

    const columns = [
        { field: "s_no", headerName: "S. No", width: 75 },
        {
            field: "profile_picture",
            headerName: "Picture",
            width: 80,
            renderCell: (params: any) => (
                <div className="w-full h-full flex justify-center items-center pr-2">
                    <Image
                        src={params?.row?.profile_picture}
                        alt="profile photo" width={30} height={30}
                        onError={(e: any) => e.target.src = profilePicture}
                        className="w-[30px] h-[30px] rounded-full object-cover object-center"
                    />
                </div>
            ),
        },
        { field: "full_name", headerName: "Full Name", flex: 1 },
        { field: "created_at", headerName: "Created At", flex: 1 },
        { field: "user_status", headerName: "Status", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params: any) => (
                <div className='w-full flex justify-center items-center px-2 h-fit'>
                    {/* <div className='flex justify-start items-center gap-[4px] cursor-pointer h-fit'
                        onClick={() => delete_sub_admin_confirmation(params?.row?.user_id)}
                    >
                        <IoMdTrash style={{ marginTop: "-4px" }} />
                        <p>Delete</p>
                    </div> */}
                    <div className='flex justify-start items-center gap-[4px] cursor-pointer h-fit'
                        onClick={() => view_student(params?.row?.user_id)}
                    >
                        <MdRemoveRedEye style={{ marginTop: "-4px" }} />
                        <p>View</p>
                    </div>
                </div>
            ),
        },
    ];

    const delete_student_confirmation = (userId: string) => {
        if (!userId) return
        set_alert_data({
            title: "Delete Student?",
            description: "Are you sure you want to delete this student?. The action cannot be undone",
            fun: () => delete_user(userId)
        })
        set_is_alert_open(true)
    }

    const delete_user = async (userId: string) => {
        if (!userId) return
        try {
            set_is_loading(true)
            const resp = await axios.delete(`${baseUrl}/users/${userId}`, authorizationObj)
            set_is_loading(false)
        } catch (error) {
            // console.error(error)
            set_is_loading(false)
            set_error_message("Something went wrong, please try later")
            setTimeout(() => set_error_message(""), 3000)
        }
    }

    const view_student = async (userId: string) => {
        if (!userId) return
        try {
            const resp = await axios.get(`${baseUrl}/users/${userId}`, authorizationObj)
            if (resp?.data?.status > 299 || resp?.data?.status < 200) {
                set_error_message(resp?.data?.message)
                setTimeout(() => set_error_message(""), 2500)
                return
            }
            if (resp?.data?.data) {
                set_single_user(resp?.data?.data)
                set_is_editing(true)
            }
        } catch (error) {
            // console.error(error)
            setTimeout(() => set_error_message(""), 2500)
        }
    }

    return (
        <>
            <ConfirmAlertMUI
                isLoading={is_loading}
                open={is_alert_open}
                setOpen={set_is_alert_open}
                title={alert_data?.title}
                description={alert_data?.description}
                fun={alert_data?.fun}
            />

            <AntdDrawer
                open={is_editing}
                setOpen={set_is_editing}
                title="Edit Student"
                placement="right"
            >
                <EditUserForm set_is_editing={set_is_editing} get_users={get_students} data={single_user} />
            </AntdDrawer>

            <AntdDrawer
                open={show_user_modal}
                setOpen={set_show_user_modal}
                title="Add Student"
                placement="right"
            >
                <CreateUserForm set_show_user_modal={set_show_user_modal} get_users={get_students} role_id="3" />
            </AntdDrawer>
            <div className="flex flex-col justify-start items-start gap-4 mt-4 flex-1 overflow-x-auto">
                <div className="w-full flex justify-between items-center">
                    <Typography variant="h5" component="h3">Students</Typography>
                    <Button variant="contained" color="secondary" onClick={() => set_show_user_modal(true)} >
                        <IoMdAddCircle style={{ marginRight: "0.5em" }} /> Add Student
                    </Button>
                </div>
                <div className='w-full h-full'>
                    <DataGrid
                        rows={processed_data}
                        columns={columns}
                        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                        pageSizeOptions={[10, 20, 30, 40, 50]}
                        hideFooterSelectedRowCount
                        disableColumnSelector
                        style={{ width: "100%", height: "100%" }}
                        loading={is_loading}
                    />
                </div>
            </div>
        </>
    );
}

export default Main