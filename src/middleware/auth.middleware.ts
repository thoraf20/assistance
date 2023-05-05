import { NextFunction, RequestHandler, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as httpStatus from 'http-status-codes';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { User } from '../services/user/user.model';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';

function authMiddleware(omitSecondFactor = false): RequestHandler {
  
  return async (request: RequestWithUser, response: Response, next: NextFunction) => {
  const authorization = request.header('Authorization')
    const accessToken = authorization?.split(' ')[1] as string
  if (accessToken) {
    const secret = `${process.env.JWT_SECRET}`;
    try {
      const decoded = jwt.decode(accessToken) as DataStoredInToken

      const { id, isSecondFA } = decoded;
      const user = await User.findOne({
        where: { id }
      });
      if (user) {
        if (!omitSecondFactor && user.is2FAEnable && !isSecondFA) {
          next(new WrongAuthenticationTokenException())
        } else {
          request.user = user;
          next();
        }
      } else {
        return response.status(httpStatus.StatusCodes.UNAUTHORIZED).json({
          message: 'invalid token'
        })
      }
    } catch (error) {
      return response.status(httpStatus.StatusCodes.UNAUTHORIZED).json({
        message: 'invalid token'
      })    }
  } else {
    return response.status(httpStatus.StatusCodes.UNAUTHORIZED).json({
      message: 'token missing'
    });
  }
}
}

export default authMiddleware;
