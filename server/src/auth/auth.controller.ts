import { Body, Controller, Get, Logger, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { LoginDto } from './login.dto';
import { TokenGuard } from './token/token.guard';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { FileInterceptor } from '@nestjs/platform-express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'fotosPerfil',
    public_id: (req, file) => `IMG_${Date.now()}`,
  } as any,
});
 

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    logger = new Logger('FotoPerfil');

    @Post('registro')
    @UseInterceptors(FileInterceptor('imagen', { storage }))
    registro(@Body() dto : CreateUsuarioDto ,
    @UploadedFile() file: Express.Multer.File){

        console.log(dto);
        
        this.logger.log('Nueva foto de perfil');

        const fotoPerfil = file?.path ?? null;

        return this.authService.registrar({...dto, fotoPerfil});
    }

    @Post('login')
    login(@Body() dto : LoginDto){
        return this.authService.login(dto);
    }

    @Get('/seguro')
    @UseGuards(TokenGuard)
    rutaSegura(@Req() req: any)  {
         const email = req.emailDelToken;
        return { mensaje: 'Acceso otorgado a ' + email };
    }

    @Post('renovar')
    @UseGuards(TokenGuard)
    renovar(@Req() req: any) {
        return this.authService.renovar(req.idDelToken, req.emailDelToken, req.nombreUsuarioDelToken);
    }

    @Get('autorizar')
    @UseGuards(TokenGuard)
    autorizar(@Req() req: any) {
        return { valido: true, usuarioId: req.idDelToken };
    }
}
