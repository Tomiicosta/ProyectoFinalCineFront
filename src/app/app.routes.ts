import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { TicketStep1 } from './pages/ticket-step1/ticket-step1';
import { Register } from './pages/register/register';
import { AuthGuard } from './guards/AuthGuard';

export const routes: Routes = [
    {path: '', component: Home, canActivate: [AuthGuard]},
    {path: 'billboard', component: Home, canActivate: [AuthGuard]},
    {path: 'cinemas', component: Home, canActivate: [AuthGuard]},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'ticket/step1', component: TicketStep1},

    {path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Si está logueado, va a 'inicio'
    {path: '**', redirectTo: '/inicio' } // Manejo de rutas no encontradas
];
