"use client"

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { authorizationObj } from '@/app/utils/core'
import { CircularProgress } from '@mui/material'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { CompanyAvatar } from '@/app/(auth)/auth/signin/Main'

const Main = ({ token }: any) => {

    const router = useRouter()

    const [is_success, set_is_success] = useState(true)
    const [is_loading, set_is_loading] = useState(false)
    const [message, set_message] = useState("")

    const verify_email = async () => {
        try {
            set_is_loading(true)
            const resp = await axios.get(`https://api.kiacademy.in/verify-email/${token}`, authorizationObj)
            set_is_loading(false)
            if (resp?.data?.status > 199 || resp?.data?.status < 300) {
                set_is_success(true)
                set_message("Email verified successfully, proceed to login")
            } else {
                set_is_success(false)
                set_message(resp?.data?.message)
            }
        } catch (error) {
            // console.error(error)
            set_is_success(false)
            set_is_loading(false)
            set_message("Oops something went wrong")
        }
    }

    useEffect(() => { verify_email() }, [token])

    return (
        <div className='w-screen h-screen flex flex-col justify-center items-center p-4 gap-4'>
            {
                is_loading ? <CircularProgress size={32} color="primary" /> :
                    <>
                        <CompanyAvatar />
                        <p className={`w-full text-xl text-center ${is_success ? "text-green-600" : "text-red-600 font-bold"}`}>{message}</p>
                        {
                            is_success ?
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    style={{ fontSize: "1em", width: "250px", marginTop: "0.5em" }}
                                    onClick={() => router.push("/auth/signin")}
                                >
                                    Proceed to login
                                </Button>
                                : null
                        }
                    </>
            }
        </div>
    )
}

export default Main