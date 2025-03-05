"use client";

import "./Main.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { authorizationObj, baseUrl } from "@/app/utils/core";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { MdPeople, MdAdminPanelSettings, MdSchool, MdPersonAdd, MdGroup, MdLibraryBooks } from "react-icons/md"; // Replaced MdGuest with MdGroup

export const iconMapping: Record<string, React.ReactNode> = {
  total_users: <MdPeople title="Total Users" />,
  total_admins: <MdAdminPanelSettings title="Total Admins" />,
  total_students: <MdSchool title="Total Students" />,
  total_instructors: <MdPersonAdd title="Total Instructors" />,
  total_guests: <MdGroup title="Total Guests" />, // Updated icon
  total_courses: <MdLibraryBooks title="Total Courses" />,
};

const Main: React.FC = () => {

  const [statistics, setStatistics] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const getAllStatistics = async () => {
    try {
      const response = await axios.get(`${baseUrl}/dashboard`, authorizationObj);
      if (response.data.status === 200) {
        setStatistics(response.data.data);
      } else {
        // console.error("Failed to fetch data:", response.data.message);
      }
    } catch (error) {
      // console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllStatistics();
  }, []);

  if (loading) {
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
        {Object.entries(statistics).map(([key, value]) => (
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
  );
};

const formatLabel = (key: string): string => {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export default Main;
