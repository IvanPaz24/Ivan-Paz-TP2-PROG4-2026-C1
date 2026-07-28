import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: any = context.switchToHttp().getRequest();

    if (req.perfil !== 'administrador') {
      throw new ForbiddenException('Acceso solo para administrador');
    }
    
    return true;
  }
}
