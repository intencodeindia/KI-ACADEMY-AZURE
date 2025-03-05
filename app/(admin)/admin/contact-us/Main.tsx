"use client"

import { authorizationObj, baseUrl } from '@/app/utils/core'
import { Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Table from './components/Table'

const Main = () => {

    const [contacts, set_contacts] = useState<any[]>([])

    useEffect(() => {
        get_contacts_data()
    }, [])

    const get_contacts_data = async () => {
        try {
            const resp = await axios.get(`${baseUrl}/contact_us`, authorizationObj)
            if (resp?.data?.data) {
                set_contacts(resp?.data?.data)
            } else {
                set_contacts([])
            }
        } catch (error) {
            // console.error(error)
            set_contacts([])
        }
    }

    return (
        <div className="flex flex-col justify-start items-start gap-4 mt-4 flex-1 overflow-x-auto">
            <Typography variant="h5" component="h3">
                Contacts
            </Typography>
            <Table data={contacts}/>
        </div>
    )
}

export default Main
