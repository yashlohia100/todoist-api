import AppError from '../../utils/appError.mjs';
import catchAsync from '../../utils/catchAsync.mjs';
import User from './userModel.mjs';

export const getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    users,
  });
});

export const createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    user,
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(new AppError('No user found with that id.', 404));
  }

  res.status(200).json({
    status: 'success',
    user,
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No user found with that id.', 404));
  }

  res.status(200).json({
    status: 'success',
    user,
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.userId);

  if (!user) {
    return next(new AppError('No user found with that id.', 404));
  }

  res.status(200).json({
    status: 'success',
    user,
  });
});

export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: 'success',
    user,
  });
});
