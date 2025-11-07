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
import { TicketStep4 } from './pages/ticket-step4/ticket-step4';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'billboard', component: Home},
    {path: 'cinemas', component: Home /*canActivate: [AuthGuard]*/},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'ticket/step1', component: TicketStep1},
    {path: 'ticket/step2', component: TicketStep2},
    {path: 'ticket/step3', component: TicketStep3},
    {path: 'ticket/step4', component: TicketStep4},
    {path: 'details/:id', component: MovieDetails},
    {path: 'adminMovies',component: AdminMovies},
    {path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Si está logueado, va a 'inicio'
    {path: '**', redirectTo: '/inicio' }, // Manejo de rutas no encontradas
    
];
