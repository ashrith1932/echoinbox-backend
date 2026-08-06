import { ValidationError } from '../shared/errors/AppError.js';

export const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    const details = error.errors?.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }));
    next(new ValidationError('Invalid request data', details));
  }
};
