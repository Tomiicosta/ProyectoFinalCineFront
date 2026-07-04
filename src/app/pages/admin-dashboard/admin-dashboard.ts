import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminDashboard } from '../../models/adminDashboard';
import { AdminDashboardService } from '../../services/admin-dashboard/admin-dashboard-service';
import { ErrorHandler } from '../../services/ErrorHandler/error-handler';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboardPage implements OnInit {
  dashboard: AdminDashboard | null = null;
  loading = false;
  from = '';
  to = '';

  constructor(
    private dashboardService: AdminDashboardService,
    private errorHandlerService: ErrorHandler
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.from = this.toDateInput(new Date(today.getFullYear(), today.getMonth(), 1));
    this.to = this.toDateInput(today);
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;

    this.dashboardService.getDashboard(this.from, this.to).subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorHandlerService.handleHttpError(error);
      }
    });
  }

  setCurrentMonth(): void {
    const today = new Date();
    this.from = this.toDateInput(new Date(today.getFullYear(), today.getMonth(), 1));
    this.to = this.toDateInput(today);
    this.loadDashboard();
  }

  formatCurrency(value: number | null | undefined): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(value ?? 0);
  }

  private toDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
