import React from "react";
import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
export default function MainLayout() {
  return (
    <>
    
      <Navbar />
      <Box sx={{ padding: 3, marginTop: 7 }}>
        <Outlet />
      </Box>
    </>
  );
}
