import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationMiddleware {
  use(req, res, next) {
    const headers = req.headers['x-access-token'] as string;

    if (!headers || !headers.startsWith('Bearer')) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message:
            'Authorization header is missing or malformed. Ensure you are sending a Bearer token.',
          error: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = headers && headers.split(' ')[1];

    jwt.verify(
      token,
      process.env.SECRET_KEY,
      (error: jwt.VerifyErrors, user: string | jwt.JwtPayload) => {
        if (error) {
          throw new HttpException(
            {
              statusCode: HttpStatus.UNAUTHORIZED,
              message: 'Invalid token',
              error: 'Unauthorized',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }

        res.locals.user = user;
        next();
      },
    );
  }
}
