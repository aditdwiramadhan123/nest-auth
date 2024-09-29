import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { path: 'users/all', method: RequestMethod.GET },
        { path: 'users/me', method: RequestMethod.GET },
        { path: 'users/update', method: RequestMethod.PATCH },
      );
  }
}
