import { Router } from 'express';
import {
  addToggleBody,
  addUserToBody,
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  getTodosOfLoggedInUser,
  getTodosOfUser,
  updateTodo,
} from './todoController.mjs';
import { protect } from '../auth/authController.mjs';

// Mounted on '/api/todos'
const todoRouter = Router();

// Protect all routes below
todoRouter.use(protect);

// '/api/todos/'
// todoRouter.route('/').get(getTodos).post(createTodo);
todoRouter
  .route('/')
  .get(getTodosOfLoggedInUser)
  .post(addUserToBody, createTodo);
// todoRouter.route('/').get(protect, getTodos).post(createTodo);

// '/api/todos/:todoId'
todoRouter.route('/:todoId').get(getTodo).patch(updateTodo).delete(deleteTodo);

//

// '/api/todos/toggle/:todoId'
todoRouter.patch('/toggle/:todoId', addToggleBody, updateTodo);

// '/api/todos/user/:userId'
// todoRouter.get('/user/:userId', getTodosOfUser);
todoRouter.get('/user/:userId', getTodos);

export default todoRouter;
