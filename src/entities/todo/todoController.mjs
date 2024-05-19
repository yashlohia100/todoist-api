import AppError from '../../utils/appError.mjs';
import catchAsync from '../../utils/catchAsync.mjs';
import Todo from './todoModel.mjs';

export const getTodosOfUser = catchAsync(async (req, res, next) => {
  const todos = await Todo.find({ user: req.params.userId });

  res.status(200).json({
    status: 'success',
    results: todos.length,
    todos,
  });
});

export const getTodosOfLoggedInUser = catchAsync(async (req, res, next) => {
  // We get 'user' from protect middleware
  const todos = await Todo.find({ user: req.user.id });

  res.status(200).json({
    status: 'success',
    results: todos.length,
    todos,
  });
});

export const getTodos = catchAsync(async (req, res, next) => {
  let filterObj = {};

  if (req.params.userId) {
    filterObj = { user: req.params.userId };
  }

  const todos = await Todo.find(filterObj);

  res.status(200).json({
    status: 'success',
    results: todos.length,
    todos,
  });
});

export const addUserToBody = (req, res, next) => {
  req.body.user = req.user.id;
  next();
};

export const createTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.create(req.body);

  res.status(201).json({
    status: 'success',
    todo,
  });
});

export const getTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.findById(req.params.todoId);

  if (!todo) {
    return next(new AppError('No todo found with that id.', 404));
  }

  res.status(200).json({
    status: 'success',
    todo,
  });
});

// Middleware
export const addToggleBody = catchAsync(async (req, res, next) => {
  const todo = await Todo.findById(req.params.todoId);

  if (!todo) {
    return next(new AppError('No todo found with that id.', 404));
  }

  // Append isDone property to body
  // So that updateTodo() can update it
  // req.body = { isDone: true }
  req.body.isDone = !todo.isDone;

  next();
});

export const updateTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.findByIdAndUpdate(req.params.todoId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!todo) {
    return next(new AppError('No todo found with that id.', 404));
  }

  res.status(200).json({
    status: 'success',
    todo,
  });
});

export const deleteTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.findByIdAndDelete(req.params.todoId);

  if (!todo) {
    return next(new AppError('No todo found with that id.', 404));
  }

  res.status(200).json({
    status: 'success',
    todo,
  });
});
