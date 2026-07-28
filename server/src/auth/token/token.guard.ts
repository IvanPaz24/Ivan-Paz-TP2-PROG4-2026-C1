import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class TokenGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const http = context.switchToHttp();

    const req: any = http.getRequest();

    const authorization = req.headers.authorization; 

    const token = authorization?.replace('Bearer ', '') || '';

    try {
      const verificado = verify(token, process.env.CLAVE_SECRETA!); 

      const { email, _id, nombreUsuario, perfil } = verificado as { email: string, _id: string, nombreUsuario: string, perfil : string};

      if (!req.body) {
        req.body = { email };
      } else {
        // req.body.emailDelToken = email;
        // req.body.idDelToken = _id;
        // req.body.nombreUsuarioDelToken = nombreUsuario;
        // req.body.perfil = perfil 
      }
      req.idDelToken = _id;
      req.emailDelToken = email;
      req.nombreUsuarioDelToken = nombreUsuario;
      req.perfil = perfil;

      return true;

    } catch (error) {
      console.error(error);
      throw new UnauthorizedException();
    }
  }
}