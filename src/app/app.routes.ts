import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { TicketStep1 } from './pages/ticket-step1/ticket-step1';
import { TicketStep2 } from './pages/ticket-step2/ticket-step2';
import { TicketStep3 } from './pages/ticket-step3/ticket-step3';
import { Register } from './pages/register/register';
import { AuthGuard } from './guards/AuthGuard';
import { MovieDetails } from './pages/movie-details/movie-details';
import { AdminMovies } from './pages/admin-movies/admin-movies';
import { AdminFunciones } from './pages/admin-funciones/admin-funciones';
import { AdminSalas } from './pages/admin-salas/admin-salas';
import { RoleGuard } from './guards/roleGuard';
import { TicketStep4 } from './pages/ticket-step4/ticket-step4';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'billboard', component: Home},
    {path: 'cinemas', component: Home },
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'ticket/step1', component: TicketStep1},
    {path: 'ticket/step2', component: TicketStep2},
    {path: 'ticket/step3', component: TicketStep3},
    {path: 'ticket/step4', component: TicketStep4, canActivate: [AuthGuard]},
    {path: 'details/:id', component: MovieDetails},
<<<<<<< Updated upstream
=======
    {path: 'profile', component: Perfil, canActivate: [AuthGuard]},
>>>>>>> Stashed changes
    {path: 'adminMovies',component: AdminMovies, canActivate: [RoleGuard], data: {role : 'ADMIN'}},
    {path: 'adminFunciones',component: AdminFunciones, canActivate: [RoleGuard], data: {role : 'ADMIN'}},
    {path: 'adminSalas',component:AdminSalas, canActivate: [RoleGuard], data: {role : 'ADMIN'}},
    {path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Si está logueado, va a 'inicio'
    {path: '**', redirectTo: '/inicio' }, // Manejo de rutas no encontradas
];