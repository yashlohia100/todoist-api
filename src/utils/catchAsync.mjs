const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;

/*
const catchAsync = (fn) => {
  return (req, res, next) => {
    // const fnPromise = fn(req, res, next);
    // fnPromise.catch((err) => next(err));
    // fn(req, res, next).catch((err) => next(err));
    fn(req, res, next).catch(next);
  };
};
*/
