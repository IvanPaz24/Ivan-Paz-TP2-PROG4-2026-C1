import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then(m => m.Login)
    }, 
    {
        path: 'registro',
        loadComponent: () => import('./auth/registro/registro').then(m => m.Registro)
    },
    {
        path: 'publicaciones',
        loadComponent: () => import('./pages/publicaciones/publicaciones').then(m => m.Publicaciones)
    },
    {
        path: 'miPerfil',
        loadComponent: () => import('./pages/mi-perfil/mi-perfil').then(m => m.MiPerfil)
    },
    {
        path: 'dashboard/usuarios',
        loadComponent: () => import('./pages/dashboard/usuarios/usuarios').then(m => m.Usuarios)
    },
    {
        path: 'dashboard/estadisticas',
        loadComponent: () => import('./pages/dashboard/estadisticas/estadisticas').then(m => m.Estadisticas)
    }
];
