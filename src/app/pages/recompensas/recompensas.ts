import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user/user';

interface Recompensa {
  nombre: string;
  puntos: number;
  categoria: string;
  descripcion: string;
  destacada?: boolean;
}

@Component({
  selector: 'app-recompensas',
  templateUrl: './recompensas.html',
  styleUrl: './recompensas.css',
  imports: [CommonModule, RouterLink]
})
export class Recompensas implements OnInit {
  user: any;
  cargando = true;
  errorCarga = false;
  canjeando: string | null = null;
  codigoCanje: string | null = null;
  recompensaCanjeada = '';

  proximaMeta = 100;
  faltanPuntos = 0;
  porcentajeProgreso = 0;

  readonly niveles = [
    { nombre: 'Bronce', puntos: 0 },
    { nombre: 'Plata', puntos: 100 },
    { nombre: 'Oro', puntos: 300 },
    { nombre: 'Diamante', puntos: 700 }
  ];

  readonly recompensas: Recompensa[] = [
    {
      nombre: 'Pochoclo chico',
      puntos: 50,
      categoria: 'Candy bar',
      descripcion: 'El clásico del cine para acompañar tu próxima función.'
    },
    {
      nombre: 'Pochoclo mediano',
      puntos: 80,
      categoria: 'Candy bar',
      descripcion: 'Una porción ideal para disfrutar toda la película.'
    },
    {
      nombre: 'Pochoclo grande',
      puntos: 120,
      categoria: 'Candy bar',
      descripcion: 'Más pochoclo para compartir una gran historia.'
    },
    {
      nombre: 'Gaseosa chica',
      puntos: 40,
      categoria: 'Bebidas',
      descripcion: 'Elegí tu sabor favorito al retirar el beneficio.'
    },
    {
      nombre: 'Gaseosa mediana',
      puntos: 70,
      categoria: 'Bebidas',
      descripcion: 'El complemento justo para tu combo de cine.'
    },
    {
      nombre: 'Gaseosa grande',
      puntos: 100,
      categoria: 'Bebidas',
      descripcion: 'Disfrutá tu bebida favorita en tamaño grande.'
    },
    {
      nombre: 'Gift Card $5.000',
      puntos: 300,
      categoria: 'Gift card',
      descripcion: 'Usala en entradas o productos seleccionados.',
      destacada: true
    },
    {
      nombre: 'Gift Card $10.000',
      puntos: 500,
      categoria: 'Gift card',
      descripcion: 'Un beneficio premium para tu próxima salida.',
      destacada: true
    }
  ];

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  get puntos(): number {
    return this.user?.puntos ?? 0;
  }

  getNivel(): string {
    if (this.puntos >= 700) return 'Diamante';
    if (this.puntos >= 300) return 'Oro';
    if (this.puntos >= 100) return 'Plata';
    return 'Bronce';
  }

  getProximoNivel(): string {
    if (this.puntos < 100) return 'Plata';
    if (this.puntos < 300) return 'Oro';
    if (this.puntos < 700) return 'Diamante';
    return 'Nivel máximo';
  }

  alcanzoNivel(puntosRequeridos: number): boolean {
    return this.puntos >= puntosRequeridos;
  }

  esNivelActual(nombre: string): boolean {
    return this.getNivel() === nombre;
  }

  puedeCanjear(recompensa: Recompensa): boolean {
    return !!this.user && this.puntos >= recompensa.puntos && !this.canjeando;
  }

  canjear(recompensa: Recompensa): void {
    if (!this.puedeCanjear(recompensa)) return;

    this.canjeando = recompensa.nombre;
    this.codigoCanje = null;

    this.userService.claimReward(recompensa.nombre, recompensa.puntos).subscribe({
      next: (claim: any) => {
        this.user.puntos -= recompensa.puntos;
        this.recompensaCanjeada = recompensa.nombre;
        this.codigoCanje = claim.code;
        this.actualizarProgreso();
        this.canjeando = null;
        this.toastr.success('La recompensa ya es tuya.');
      },
      error: () => {
        this.canjeando = null;
        this.toastr.error('No se pudo realizar el canje.');
      }
    });
  }

  cerrarComprobante(): void {
    this.codigoCanje = null;
    this.recompensaCanjeada = '';
  }

  ngOnInit(): void {
    this.userService.getMyProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.actualizarProgreso();
        this.cargando = false;
      },
      error: () => {
        this.errorCarga = true;
        this.cargando = false;
      }
    });
  }

  private actualizarProgreso(): void {
    if (this.puntos < 100) {
      this.proximaMeta = 100;
    } else if (this.puntos < 300) {
      this.proximaMeta = 300;
    } else if (this.puntos < 700) {
      this.proximaMeta = 700;
    } else {
      this.proximaMeta = this.puntos;
    }

    this.faltanPuntos = Math.max(0, this.proximaMeta - this.puntos);
    this.porcentajeProgreso = this.puntos >= 700
      ? 100
      : Math.min(100, (this.puntos / this.proximaMeta) * 100);
  }
}
