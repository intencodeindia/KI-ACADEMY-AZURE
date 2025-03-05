"use client";

import "./Main.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { authorizationObj, baseUrl } from "@/app/utils/core";
import Table from "./components/Table";
import { Typography } from "@mui/material";

const Main = () => {
    const [courses, set_courses] = useState([]);

    const getAllCourses = async () => {
        try {
            const resp = await axios.get(`${baseUrl}/courses`, authorizationObj);
            set_courses(resp?.data?.data);
        } catch (error) {
            // console.error(error);
        }
    };

    useEffect(() => {
        getAllCourses();
    }, []);

    return (
        <>
            <div className="flex flex-col justify-start items-start gap-4 mt-4 flex-1 overflow-x-auto">
                <Typography variant="h5" component="h3">
                    Courses
                </Typography>
                <Table data={courses} getAllCourses={getAllCourses} />
            </div>
        </>
    );
};

export default Main;
