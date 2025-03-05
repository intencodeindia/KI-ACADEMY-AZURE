"use client"

import "./Main.css"
import axios from "axios"
import React, { useEffect, useState } from 'react'
import { authorizationObj, baseUrl } from "@/app/utils/core"
import { Button, Typography } from "@mui/material"
import Table from "./components/Table"
import { IoMdAddCircle } from "react-icons/io";

const Main = () => {

    const [students, set_students] = useState([])

    const getAllStudents = async () => {
        try {
            const resp = await axios.get(`${baseUrl}/students`, authorizationObj)
            set_students(resp?.data?.data)
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
                <Typography variant="h5">Students</Typography>
                <Table data={students} getAllStudents={getAllStudents} />
            </div>
        </>
    )
}

export default Main