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

    const [users, set_users] = useState([])

    const getAllUsers = async () => {
        const instituteId = currentUser?.institute_id
        if (!instituteId) return
        try {
            const resp = await axios.get(`${baseUrl}/institutions/getUsersByInstitutes/${instituteId}`, authorizationObj)
            if (resp?.data) {
                const data = resp?.data?.filter((d: any) => d?.role_id !== "4")
                set_users(data)
            } else {
                set_users([])
            }
        } catch (error) {
            // console.error(error)
            set_users([])
        }
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    return (
        <>
            <div className="flex flex-col justify-start items-start gap-4 mt-4">
                <Table data={users} getAllStudents={getAllUsers} />
            </div>
        </>
    )
}

export default Main