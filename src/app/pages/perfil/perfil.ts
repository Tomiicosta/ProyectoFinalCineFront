import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { User } from '../../models/user';
import { UserService } from '../../services/user/user';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/AuthService/auth-service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '../../services/ErrorHandler/error-handler';

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
      private errorHandlerService: ErrorHandler
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
        this.syncEditUser();
        this.showPasswordForm = false;
        this.resetPasswordFields();
      } else {
        this.showPasswordForm = false;
        this.resetPasswordFields();
      }
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
}
