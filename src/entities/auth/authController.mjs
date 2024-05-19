import config from '../../../config.mjs';
import AppError from '../../utils/appError.mjs';
import catchAsync from '../../utils/catchAsync.mjs';
import User from '../user/userModel.mjs';
import { jwtSignAsync, jwtVerifyAsync } from './jwtMethods.mjs';

const getJwtToken = async (userId) => {
  const token = await jwtSignAsync({ id: userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });

  return token;
};

const sendJwtCookie = (res, token) => {
  const cookieOptions = {
    maxAge: config.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.sameSite = 'none';
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);
};

const createSendToken = async (user, res, statusCode) => {
  const token = await getJwtToken(user.id);

  sendJwtCookie(res, token);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  createSendToken(user, res, 201);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide both email and password.', 400));
  }

  // const user = await User.findOne({ email });
  // Select all fields plus password, because
  // password is not selected in schema definition
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('No user found with that email.', 404));
  }

  const isCorrect = await user.checkPassword(password);
  if (!isCorrect) {
    return next(new AppError('Incorrect password.', 401));
  }

  createSendToken(user, res, 200);
});

const extractToken = (req) => {
  let token = null;
  const tokenString = req.headers.authorization;
  if (tokenString?.startsWith('Bearer')) {
    token = tokenString.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  return token;
};

export const protect = catchAsync(async (req, res, next) => {
  console.log('Cookies:', req.cookies);

  const token = extractToken(req);
  // const token = req.cookies?.jwt;
  if (!token) {
    return next(
      new AppError('You are not logged in. Please login to get access.', 401)
    );
  }

  const decoded = await jwtVerifyAsync(token, config.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError('The user belonging to this token does not exist.', 401)
    );
  }

  req.user = user;
  next();
});

export const logout = (req, res, next) => {
  // Send a past cookie with same name
  const cookieOptions = {
    maxAge: -10 * 1000,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.sameSite = 'none';
    cookieOptions.secure = true;
  }

  res.cookie('jwt', 'loggedout', cookieOptions);

  res.status(200).json({
    status: 'success',
  });
};
