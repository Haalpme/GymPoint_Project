import { Router } from 'express';
import StudentController from './app/controllers/StudentController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrdersStudentController from './app/controllers/HelpOrdersStudentController';
import HelpOrdersAdminController from './app/controllers/HelpOrdersAdminController';

const routes = new Router();
routes.post('/sessions', SessionController.store);
routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.index);

routes.post('/students/:id/help_orders', HelpOrdersStudentController.store);
routes.get('/students/:id/help_orders', HelpOrdersStudentController.index);

routes.use(authMiddleware);
routes.post('/user', UserController.store);

routes.get('/help_orders', HelpOrdersAdminController.index);
routes.put('/help_orders/:id/answer', HelpOrdersAdminController.update);

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments/:id', EnrollmentController.update);
routes.get('/enrollments', EnrollmentController.index);
routes.delete('/enrollments/:id', EnrollmentController.delete);

export default routes;
