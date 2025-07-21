import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./config/db.js";


dotenv.config();

const app=express();


app.use(cors());
app.use(express.json());

// app.use('/api/auth',authRouter);
// app.use('/api/items',itemRouter);
// app.use('/api/users',userRouter);
// app.use('/api-doc',swaggerUi.serve,swaggerUi.setup(swaggerSpec));



// app.use(errorMiddleware);

// db ko call kane hai.

connectDB();

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server is running is port ${PORT}`));

