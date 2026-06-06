const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();


// middleware
app.use(cors());
app.use(express.json());


// routes
const userRoutes = require("./Routers/UserRoutes");
const patientRoutes = require("./Routers/PatientRoutes");

const scheduleRoutes     = require("./Routers/ScheduleReport");
const reportRoutes       = require("./Routers/ReportRoutes");
const appointmentRoutes  = require("./Routers/AppointmentRoutes");

const labRoutes = require("./Routers/LabRoutes");

const adminRoutes      = require("./Routers/AdminRoutes");
const doctorRoutes     = require("./Routers/DoctorAdminRoutes");
//const PatientRoutes    = require("./Routers/AdminPatientRoutes");
const AppointmentRoutes = require("./Routers/AppointmentAdminRoutes");

const pharmacyRoutes = require("./Routers/PharmacyRoutes");
app.use("/api/pharmacy", pharmacyRoutes);
 
app.use("/api/admin",       adminRoutes);
app.use("/api/doctor",      doctorRoutes);
//app.use("/api/patient",     PatientRoutes);
app.use("/api/appointment", AppointmentRoutes);
 
app.use("/api/lab", labRoutes);
 
 
 
app.use("/api/schedule",    scheduleRoutes);
app.use("/api/report",      reportRoutes);
app.use("/api/appointment", appointmentRoutes);
// use routes
app.use("/api/user", userRoutes);
app.use("/api/patient", patientRoutes);


// mongodb connection

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("MongoDB Connected");
})
.catch((err)=>{
    console.log(err);
});



// server

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
});