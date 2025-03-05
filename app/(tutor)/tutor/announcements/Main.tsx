"use client"

import "./Main.css"
import axios from "axios"
import React, { useEffect, useState } from 'react'
import { authorizationObj, baseUrl } from "@/app/utils/core"
import { Typography } from "@mui/material"
import Table from "./components/Table"
import { useSelector } from "react-redux"

const Main = () => {

    const currentUser = useSelector((state: any) => state?.user)

    const [students, set_students] = useState([])

    const getAllStudents = async () => {
        try {
            const resp = await axios.get(`${baseUrl}/analytics/students-enrolled-in-instructor-courses/${currentUser?.user_id}`, authorizationObj)
            set_students(resp?.data)
        } catch (error) {
            // console.error(error)
        }
    }

    useEffect(() => {
        getAllStudents()
    }, [])

    return (
        <>
            <div className="flex flex-col justify-start items-start gap-4 mt-4">
                <Table data={students} getAllStudents={getAllStudents} />
            </div>
        </>
    )
}

export default Main