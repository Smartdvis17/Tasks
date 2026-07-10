## Guia para configuracion inicial del proyecto

-- > npm init -y
-- > npm install express
-- > npm install mongoose
-- > npm install morgan
-- > npm install cors
-- > npm install yup
-- > npm install jest
-- > npm install supertest
-- > npm install dotenv

-- > crear carpeta src
-- > crear index.js dentro de la carpeta src

-- > configurar en el package.json debajo del main el type: module    "type": "module", // para que funcione el modulo

-- > configurar los scripts en el package.json 
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node src/index.js",
    "dev": "node --watch src/index.js"
  },

  -- > configurar variables de entorno 

  -- > configuración inicial del index.js 
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
    origin: 'http://localhost:3000'}));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use("/tasks", routes);


//Conexion a la base de datos
connectDB();

app.listen(app.get('port'), () => {
    console.log(`Servidor escuchando en el puerto ${app.get('port')}`);
});

Configuracion  de la base de datos
-- > crear archivo database/conect.js

-- > creamos la carpeta tasks en la carpeta src

-- > creamos las carpetas controller, services, model, routes, validation,middleware 

-- > creamos el archivo model/taskModel.js dentro de la carpeta model

-- > creamos el archivo controller/taskController.js dentro de la carpeta controller

-- > creamos el archivo routes/taskRoutes.js dentro de la carpeta routes

-- > creamos el archivo services/taskService.js dentro de la carpeta services

-- > creamos el archivo helpers/response.js dentro de la carpeta helpers

-- > creamos el archivo validation/taskValidation.js dentro de la carpeta validation

-- > creamos el middleware en la carpeta src y creamos el archivo validationSchema.js

export const validationSchema = (schema) => {
    return async (req, res, next) => {
        try {
            // Validar el cuerpo de la solicitud utilizando el esquema proporcionado
        const resultValidate = await schema.validate(req.body,{
            abortEarly: false, // Validar todos los errores en lugar de detenerse en el primero
            stripUnknown: true, // Eliminar campos desconocidos
        });
        req.body = resultValidate;
        next();
    } catch (error) {
       console.log(error.inner);
       return res.status(400).send(
        {
            ok: false,
            msg: "Error de validacion",
            errors: error.inner.map((err) => ({
                field: err.path,
                message: err.message,
            })),
        });
        }
};
};


-- > asignar el middleware en el archivo routes/taskRoutes.js
import {Router} from 'express';
import { controllerCreateTask, controllerGetTasks, controllerUpdateTask, controllerDeleteTask, controllerGetTaskById, controllerGetTaskByTitle, controllerGetTasksByDescription, controllerGetTasksByCreationDate, controllerGetTasksByUpdateDate, controllerGetTasksByStatus } from '../controller/task.controller.js';
import { validationSchema } from '../../middleware/validationSchema.js';
import { createTaskSchema, updateTaskSchema, } from '../validation/task.schema.valitation.js';



const router = Router();

router.get('/',  controllerGetTasks);
router.post('/', validationSchema(createTaskSchema), controllerCreateTask);
router.put('/:id', validationSchema(updateTaskSchema), controllerUpdateTask);
router.delete('/:id', controllerDeleteTask);
router.get('/:id', controllerGetTaskById);
router.get('/title/:title', controllerGetTaskByTitle);
router.get('/status/:status', controllerGetTasksByStatus);
router.get('/description/:description', controllerGetTasksByDescription);
router.get('/creationDate/:creationDate', controllerGetTasksByCreationDate);
router.get('/updateDate/:updateDate', controllerGetTasksByUpdateDate);


export default router;
