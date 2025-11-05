import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { TicketStep1 } from './pages/ticket-step1/ticket-step1';
import { TicketStep2 } from './pages/ticket-step2/ticket-step2';
import { TicketStep3 } from './pages/ticket-step3/ticket-step3';
import { Register } from './pages/register/register';
import { AuthGuard } from './guards/AuthGuard';
import { MovieDetails } from './pages/movie-details/movie-details';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'billboard', component: Home},
    {path: 'cinemas', component: Home /*canActivate: [AuthGuard]*/},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'ticket/step1', component: TicketStep1},
    {path: 'ticket/step2/:id', component: TicketStep2},
    {path: 'ticket/step3/:id', component: TicketStep3},
    {path: 'details/:id', component: MovieDetails},
    {path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Si está logueado, va a 'inicio'
    {path: '**', redirectTo: '/inicio' }, // Manejo de rutas no encontradas
    
];
