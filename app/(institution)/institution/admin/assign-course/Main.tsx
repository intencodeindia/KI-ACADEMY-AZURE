"use client"

import AntdDrawer from '@/app/components/antd/AntdDrawer'
import CreateUserForm from '@/app/components/mui/CreateUserForm'
import { authorizationObj, baseUrl, courseThumbnailPath, profilePicture, profilePicturePath } from '@/app/utils/core'
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
import AssignCourseForm from '@/app/components/mui/AssignCourseForm'
import Image from 'next/image'
const Main = () => {
    const currentUser = useSelector((state: any) => state?.user)
    const [courses, set_courses] = useState([])
    const [is_loading, set_is_loading] = useState(false)
    const [data, set_data] = useState([])
    const [all_tutors, set_all_tutors] = useState([])
    const [assigned_tutors, set_assigned_tutors] = useState([])
    const [is_viewing, set_is_viewing] = useState(false)
    const [courseId, set_courseId] = useState("")

    useEffect(() => {
        get_courses()
    }, [currentUser])

    const get_courses = async () => {
        if (!currentUser?.institute_id) return
        try {
            set_is_loading(true)
            const resp = await axios.get(`${baseUrl}/courses/by-institute/${currentUser?.institute_id}`, authorizationObj);
            set_is_loading(false)
            set_courses(resp?.data?.data);
        } catch (error) {
            // console.error(error);
            set_is_loading(false)
        }
    }

    const handleViewClick = async (courseId: string) => {
        const instituteId = currentUser?.institute_id
        if (!courseId || !instituteId) return
        set_courseId(courseId)
        try {
            set_is_loading(true)
            const all_tutors_resp: any = await axios.get(`${baseUrl}/institutions/getUsersByInstitutes/${instituteId}`, authorizationObj)
            const _all_tutors = all_tutors_resp?.data?.filter((at: any) => at?.role_id === "2")
            set_all_tutors(_all_tutors)
            const assigned_tutors_resp: any = await axios.get(`${baseUrl}/courses/get-instructors-assigned-to-course/${instituteId}/${courseId}`, authorizationObj)
            set_assigned_tutors(assigned_tutors_resp?.data?.data)
            set_is_loading(false)
            set_is_viewing(true)
        } catch (error) {
            // console.error(error)
            set_is_loading(false)
        }
    }

    useEffect(() => {
        const processed_data: any = courses?.map((c: any, i: number) => {
            return {
                id: i,
                s_no: i + 1,
                course_title: c?.course_title,
                course_thumbnail: `${courseThumbnailPath}/${c?.course_thumbnail}`,
                course_language: c?.course_language,
                course_id: c?.course_id
            }
        })
        set_data(processed_data)
    }, [courses])

    const columns = [
        { field: "s_no", headerName: "S. No", width: 75 },
        {
            field: "course_thumbnail",
            headerName: "Thumbnail",
            width: 80,
            renderCell: (params: any) => (
                <div className='w-full h-full fex justify-center items-center'>
                    <Image src={params?.row?.course_thumbnail} alt="thumbnail"
                        className='w-[60px] h-[40px] object-cover object-center mt-[5px]'
                    />
                </div>
            ),
        },
        { field: "course_title", headerName: "Title", flex: 1 },
        { field: "course_language", headerName: "Language", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params: any) => (
                <div
                    className='w-full flex justify-center items-center cursor-pointer'
                    onClick={() => handleViewClick(params?.row?.course_id)}
                >
                    <MdRemoveRedEye style={{ marginRight: "0.5em", fontSize: "1.2em", marginTop: "-2px" }} />
                    View
                </div>
            ),
        },
    ];

    const assign_course = async (tutorId: string) => {
        const course_id = courseId
        const institute_id = currentUser?.institute_id
        const assigned_to = tutorId
        const assigned_by = currentUser?.user_id
        if (!course_id || !institute_id || !assigned_to || !assigned_by) return

        const formData = new FormData()
        formData.append("course_id", course_id)
        formData.append("institute_id", institute_id)
        formData.append("assigned_to", assigned_to)
        formData.append("assigned_by", assigned_by)

        try {
            set_is_loading(true)
            const resp = await axios.post(`${baseUrl}/courses/assign-course`, formData, authorizationObj)
            handleViewClick(course_id)
            set_is_loading(true)
        } catch (error) {
            // console.error(error)
        }
    }

    const unAssign_course = async (tutorId: string) => {
        const course_id = courseId
        const institute_id = currentUser?.institute_id
        const assigned_to = tutorId
        if (!course_id || !institute_id || !assigned_to) return

        const formData = new FormData()
        formData.append("course_id", course_id)
        formData.append("institute_id", institute_id)
        formData.append("assigned_to", assigned_to)

        try {
            set_is_loading(true)
            const resp = await axios.post(`${baseUrl}/courses/unassign-course`, formData, authorizationObj)
            handleViewClick(course_id)
            set_is_loading(true)
        } catch (error) {
            // console.error(error)
        }
    }

    return (
        <>
            <AntdDrawer
                open={is_viewing}
                setOpen={set_is_viewing}
                title="Assign Course"
                placement="right"
            >
                <AssignCourseForm
                    all_tutors={all_tutors}
                    assigned_tutors={assigned_tutors}
                    assign_course={assign_course}
                    unAssign_course={unAssign_course}
                />
            </AntdDrawer>
            <div className="flex flex-col justify-start items-start gap-4 mt-4 flex-1 overflow-x-auto">
                <div className="w-full flex justify-between items-center">
                    <Typography variant="h5" component="h3">Assign Course</Typography>
                </div>
                <div className='w-full h-full'>
                    <DataGrid
                        rows={data}
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