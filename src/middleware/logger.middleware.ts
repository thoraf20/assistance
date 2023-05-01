import { NextFunction, Request, Response } from 'express';
// import logger from '../utils/logger'


function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const log = `${req.method}: ${req.url}`
  console.log(log)
  next();
}

export { loggerMiddleware };
