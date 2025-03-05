"use client"

import React from 'react'
import { useSelector } from 'react-redux'
import { useState, useEffect } from "react"
import axios from 'axios'
import { authorizationObj, baseUrl } from '@/app/utils/core'
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    CircularProgress,
} from "@mui/material";
import { MdPeople, MdAdminPanelSettings, MdSchool, MdPersonAdd, MdGroup, MdLibraryBooks } from "react-icons/md";
import { iconMapping } from "../../../../(admin)/admin/analytics/Main"

const Main = () => {
    const currentUser = useSelector((state: any) => state.user)

    const [is_loading, set_is_loading] = useState(false)
    const [total_counts, set_total_counts] = useState<any>(null)

    useEffect(() => {
        if (currentUser?.institute_id) get_analytics(currentUser?.institute_id)
    }, [currentUser])

    const get_analytics = async (instituteId: string) => {
        if (!instituteId) return
        try {
            set_is_loading(true)
            const resp = await axios.get(`${baseUrl}/analytics/total-counts-by-institution/${instituteId}`, authorizationObj)
            set_is_loading(false)
            set_total_counts(resp?.data)

        } catch (error) {
            // console.error(error)
            set_is_loading(false)
        }
    }

    if (is_loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="flex flex-col justify-start items-start gap-4 mt-4">
            <Typography variant="h5" component="h3">
                Analytics
            </Typography>
            <Grid container spacing={2}>
                {
                    !total_counts ?
                        null :
                        Object.entries(total_counts).map(([key, value]: any) => (
                            <Grid item xs={12} sm={6} md={4} key={key}>
                                <Card
                                    sx={{
                                        boxShadow: 2,
                                        borderRadius: "2px",
                                        backgroundColor: "#fefefe",
                                        transition: "0.5s",
                                        "&:hover": { boxShadow: 4 },
                                    }}
                                >
                                    <CardContent sx={{ padding: "24px" }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="h6" sx={{ color: "#666" }}>
                                                {formatLabel(key)}
                                            </Typography>
                                            <Box sx={{ fontSize: 24, color: "#666" }}>
                                                {iconMapping[key] || <MdPeople />}
                                            </Box>
                                        </Box>
                                        <Typography variant="h4" sx={{ fontWeight: "semi-bold", color: "#2691d7", marginTop: "12px" }}>
                                            {value !== null ? value.toLocaleString() : 0}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
            </Grid>
        </div>
    )
}


export default Main

const formatLabel = (key: string): string => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};
