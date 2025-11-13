import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandler {
  constructor(private toastr: ToastrService){}

  //Metodo para manejar errores en la pagina
  handleHttpError(error: any, defaultMessage: string = 'Ocurrió un error inesperado.') {
    // errores HTTP
    if (error instanceof HttpErrorResponse) {
        
        let errorMessage: string = defaultMessage;

        // Lógica de error 400 
        if (error.status === 400 && error.error) {
            
            if (typeof error.error === 'string') {
                errorMessage = error.error; 
            } else if (error.error.message) {
                errorMessage = error.error.message;
            } else {
                errorMessage = 'Ocurrió un error de validación en el servidor.';
            }
        
        // Manejo de otros errores (Ej: 401, 403, 500)
        } else if (error.status === 0) {
             errorMessage = 'Error de conexión. Verifique su red o la disponibilidad del servidor.';
        } else {
             // Si el servidor devuelve un mensaje en el objeto de error principal (Ej: 500)
             errorMessage = error.message || defaultMessage;
        }

        this.toastr.error(errorMessage, 'Error:');
        
    } else {
        // Para errores que no son HTTP (Ej: errores de programacion)
        this.toastr.error(defaultMessage, 'Error:');
        console.error('Error no HTTP:', error);
    }
  }
}
