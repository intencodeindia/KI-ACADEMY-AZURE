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
        try {
            const resp = await axios.get(`${baseUrl}/users`, authorizationObj)
            if (resp?.data?.data) {
                set_users(resp?.data?.data)
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