process.loadEnvFile();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectDB } from './database/conect.js';
import routes from './tasks/routes/task.routes.js';

const app = express();

// Setear el puerto por donde escuchara el servidor 

app.set('port', process.env.PORT || 4000);
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:5174'}));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use("/tasks", routes);


//Conexion a la base de datos
connectDB();

app.listen(app.get('port'), () => {
    console.log(`Servidor escuchando en el puerto ${app.get('port')}`);
});