import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { User } from '../../models/user';
import { UserService } from '../../services/user/user';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '../../services/ErrorHandler/error-handler';
import { Compra } from '../../models/compra';
import { TicketService } from '../../services/ticket/ticket-service';
import { Ticket } from '../../models/ticket';
import { CinemaService } from '../../services/cinema/cinema-service';
import { Sala } from '../../models/sala';
import { SeatService } from '../../services/seat-service';
import { Butaca } from '../../models/butaca';
import { FunctionService } from '../../services/function/function-service';
import { Funcion } from '../../models/funcion';

interface EditUser {
  name: string;
  surname: string;
  username: string;
  email: string;
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',  
  styleUrls: ['./perfil.css'],
  standalone: true,
  imports: [FormsModule, RouterLink]
})
export class  Perfil implements OnInit {

  showTickets = false;
  tickets: Ticket[] = [];
  selectedIndex: number | null = null;
  selectedTicket: Ticket | null = null;
  selectedSala: Sala | null = null;
  seatCodes: string[] = []; 
  selectedFuncion: Funcion | null = null;;

  user!: User | null;
  editUser: EditUser = {
    name: '',
    surname: '',
    username: '',
    email: '',
    currentPassword: '',
    password: '',
    confirmPassword: ''
  };
  editMode: boolean = false;
  showPasswordForm = false;

    // visibilidad de los inputs de contraseña
    showCurrentPassword = false;
    showNewPassword = false;
    showConfirmPassword = false;

    constructor(
      private userService: UserService,
      public authService: AuthService,
      private toastr: ToastrService,
      private errorHandlerService: ErrorHandler,
      private cinemaService: CinemaService,
      private seatService: SeatService,
      private functionService: FunctionService
    ) {}
  
    ngOnInit(): void {
      this.loadProfile();
    }
  
    loadProfile(): void {
      this.userService.getMyProfile().subscribe({
        next: (data: User) => {
          this.user = data;
          this.syncEditUser();
        },
        error: (err) => console.error(err)
      });
    }
  
    // Copia de datos básicos al objeto de edición
    private syncEditUser(): void {
      if (!this.user) return;
  
      this.editUser.name = this.user.name;
      this.editUser.surname = this.user.surname;
      this.editUser.username = this.user.username;
      this.editUser.email = this.user.email;
    }
  
    toggleEdit(): void {
  this.editMode = !this.editMode;

  if (this.editMode) {
    // cierro tickets
    this.showTickets = false;
    this.selectedIndex = null;
    this.selectedTicket = null;
    this.selectedSala = null;
    this.selectedFuncion = null;
    this.seatCodes = [];

    this.syncEditUser();
    this.showPasswordForm = false;
    this.resetPasswordFields();
  } else {
    this.showPasswordForm = false;
    this.resetPasswordFields();
  }
}


cerrarTickets(): void {
  this.showTickets = false;
  this.selectedIndex = null;
  this.selectedTicket = null;
  this.selectedSala = null;
  this.selectedFuncion = null;
  this.seatCodes = [];
}



  
    togglePasswordForm(): void {
      this.showPasswordForm = !this.showPasswordForm;
  
      if (!this.showPasswordForm) {
        this.resetPasswordFields();
      }
    }
  
    resetPasswordFields(): void {
      this.editUser.currentPassword = '';
      this.editUser.password = '';
      this.editUser.confirmPassword = '';
      this.showCurrentPassword = false;
      this.showNewPassword = false;
      this.showConfirmPassword = false;
    }
  
    // Toggles de los ojitos
    toggleCurrentPasswordVisibility(): void {
      this.showCurrentPassword = !this.showCurrentPassword;
    }
  
    toggleNewPasswordVisibility(): void {
      this.showNewPassword = !this.showNewPassword;
    }
  
    toggleConfirmPasswordVisibility(): void {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  
    onSubmit(form: NgForm): void {
      if (!this.user) return;
      if (this.isFormInvalid(form)) return;
      if (this.showPasswordForm && this.isPasswordSectionInvalid()) return;
      const payload = this.buildUpdatePayload();
  
      this.userService.updateMyProfile(payload).subscribe({
        next: (updated: User) => {
          this.user = updated;
          this.editMode = false;
          this.showPasswordForm = false;
          this.resetPasswordFields();
          this.syncEditUser();
          this.toastr.success("Perfil actualizado correctamente.");
        },
        error: (error: HttpErrorResponse) => {
          this.errorHandlerService.handleHttpError(error);  
        }
      });
    }

    /* ===== Helpers privados ===== */

private isFormInvalid(form: NgForm): boolean {
  if (form.invalid) {
    this.toastr.error("Completa todos los campos obligatorios.");
    return true;
  }
  return false;
}

private isPasswordSectionInvalid(): boolean {
  const current = this.editUser.currentPassword || '';
  const pass = this.editUser.password || '';
  const confirm = this.editUser.confirmPassword || '';

  if (!current || !pass || !confirm) {
    this.toastr.error("Completa todos los campos de contraseña.");
    return true;
  }

  if (pass !== confirm) {
    this.toastr.error("Las contraseñas nuevas no coinciden.");
    return true;
  }

  return false;
}

private buildUpdatePayload(): any {
  const payload: any = {
    name: this.editUser.name,
    surname: this.editUser.surname,
    username: this.editUser.username,
    email: this.editUser.email
  };

  if (this.showPasswordForm && this.editUser.password) {
    payload.currentPassword = this.editUser.currentPassword;
    payload.password = this.editUser.password;
  }

  return payload;
}

toggleTickets(): void {
  this.showTickets = !this.showTickets;

  if (this.showTickets) {
    // Al abrir tickets, cierro edición
    this.editMode = false;
    this.showPasswordForm = false;
    this.resetPasswordFields();
  }

  if (this.showTickets && this.tickets.length === 0) {
    this.userService.getMyTickets().subscribe({
      next: (data) => {
        this.tickets = data;
      },
      error: (err) => console.error('Error cargando tickets:', err)
    });
  }
}



 onSelectChange(): void {
  if (this.selectedIndex === null) {
    this.selectedTicket = null;
    this.selectedSala = null;
    this.seatCodes = [];
    return;
  }

  this.selectedTicket = this.tickets[this.selectedIndex];

  if (!this.selectedTicket) {
    this.selectedSala = null;
    this.seatCodes = [];
    return;
  }

  // Pedir sala
  this.cinemaService.getSala(this.selectedTicket.cinemaId).subscribe({
    next: (data: Sala) => {
      this.selectedSala = data;
    },
    error: (err) => console.error(err)
  });

  this.functionService.getFuncionById(this.selectedTicket.funcionId).subscribe({
    next: (data: Funcion) => {
      this.selectedFuncion = data;
      console.log('FUNCION CARGADA:', data);
    },
    error: (err) => console.error('Error cargando función:', err)
  });

  // 🔥 Pedir cada butaca por id y armar "R{row}C{column}"
  this.seatCodes = []; // reseteamos

  // Asumo que selectedTicket.seats es number[] con los IDs de las butacas
  this.selectedTicket.seats.forEach((seatId: number) => {
    this.seatService.getSeat(seatId).subscribe({
      next: (seat: Butaca) => {
        const code = `R${seat.seatRowNumber}C${seat.seatColumnNumber}`;
        this.seatCodes.push(code);
      },
      error: (err) => console.error('Error cargando butaca', seatId, err)
    });
  });

  console.log('SELECTED TICKET:', this.selectedTicket);
}


formatearFecha(fecha: string): string {
  const [year, month, day] = fecha.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);

  const opciones: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };

  const fechaFormateada = dateObj.toLocaleDateString('es-ES', opciones);
  return fechaFormateada.replace(',', '');
}

formatearHora(hora: string): string {
  // asumiendo "HH:mm:ss"
  return hora.slice(0, 5);
}

}
