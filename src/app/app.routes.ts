import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { TicketStep1 } from './pages/ticket-step1/ticket-step1';
import { TicketStep2 } from './pages/ticket-step2/ticket-step2';
import { TicketStep3 } from './pages/ticket-step3/ticket-step3';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'billboard', component: Home},
    {path: 'cinemas', component: Home},
    {path: 'login', component: Login},
    {path: 'ticket/step1', component: TicketStep1},
    {path: 'ticket/step2/:id', component: TicketStep2},
    {path: 'ticket/step3/:id', component: TicketStep3}
];
