"use client"

import { authorizationObj, baseUrl } from '@/app/utils/core'
import { Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Table from "./components/Table"

const Main = () => {

    const currentUser = useSelector((state: any) => state?.user)
    const [courses, set_courses] = useState<any[]>([])
    const [is_loading, set_is_loading] = useState(false)

    useEffect(() => {
        get_courses()
    }, [currentUser, currentUser?.user_id])

    const get_courses = async () => {
        try {
            set_is_loading(true)
            const resp = await axios.get(`${baseUrl}/enrollments/student/${currentUser?.user_id}`, authorizationObj)
            set_is_loading(false)
            if (resp?.data?.data) {
                set_courses(resp?.data?.data)
            } else {
                set_courses([])
            }
        } catch (error) {
            // console.error(error)
            set_courses([])
            set_is_loading(false)
        }
    }

    return (
        <>
            <div className="flex flex-col justify-start items-start gap-4 mt-4 flex-1">
                <Typography variant="h5" component="h3" sx={{ marginBottom: "8px" }}>My Courses</Typography>
                <Table data={courses} getAllCourses={get_courses} is_loading={is_loading} set_is_loading={set_is_loading} />
            </div>
        </>
    )
}

export default Main