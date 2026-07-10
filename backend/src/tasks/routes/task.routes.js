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