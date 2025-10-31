import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { TicketStep1 } from './pages/ticket-step1/ticket-step1';
import { Register } from './pages/register/register';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'billboard', component: Home},
    {path: 'cinemas', component: Home},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'ticket/step1', component: TicketStep1}
];
