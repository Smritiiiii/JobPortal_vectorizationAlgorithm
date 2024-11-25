import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import userRoute from "./routes/userRoutes.js";
import companyRoute from "./routes/companyRoutes.js"
import jobRoute from "./routes/jobRoutes.js"
import applicationRoute from "./routes/applicationRoutes.js"
// import testRoute from "./routes/testRoute.js"

import dotenv from 'dotenv';
dotenv.config();


const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use (cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials:true
}
app.use (cors(corsOptions));

mongoose.connect("mongodb://127.0.0.1:27017/project3")
.then(() => {
    console.log("DB connected")
})
.catch((error)=> {
    console.error("error connecting to datatbase:",error)
})

const PORT = 3000;

app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job",jobRoute);
app.use("/api/applications", applicationRoute)
// app.use("/api",testRoute)
app.listen(PORT, ()=> {
    console.log(`Server runing is at ${PORT}`);
})