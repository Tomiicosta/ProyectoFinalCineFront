import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recompensas',
  templateUrl: './recompensas.html',
  styleUrl: './recompensas.css',
  imports: [CommonModule]
})
export class Recompensas implements OnInit {

  user: any;
  proximaMeta = 300;
  faltanPuntos = 0;
  porcentajeProgreso = 0;

  constructor(private userService: UserService) {}



  getNivel(): string {

  const puntos = this.user?.puntos || 0;

  if (puntos >= 700) return '💎 Diamante';
  if (puntos >= 300) return '🥇 Oro';
  if (puntos >= 100) return '🥈 Plata';

  return '🥉 Bronce';
}

getProximoNivel(): string {

  const puntos = this.user?.puntos || 0;

  if (puntos < 100) return '🥈 Plata';
  if (puntos < 300) return '🥇 Oro';
  if (puntos < 700) return '💎 Diamante';

  return '🏆 Nivel Máximo';
}

getMetaNivel(): number {

  const puntos = this.user?.puntos || 0;

  if (puntos < 100) return 100;
  if (puntos < 300) return 300;
  if (puntos < 700) return 700;

  return puntos;
}

recompensas = [
  {
    nombre: 'Pochoclo Chico',
    puntos: 50,
    icono: '🍿'
  },
  {
    nombre: 'Pochoclo Mediano',
    puntos: 80,
    icono: '🍿'
  },
  {
    nombre: 'Pochoclo Grande',
    puntos: 120,
    icono: '🍿'
  },
  {
    nombre: 'Gaseosa Chica',
    puntos: 40,
    icono: '🥤'
  },
  {
    nombre: 'Gaseosa Mediana',
    puntos: 70,
    icono: '🥤'
  },
  {
    nombre: 'Gaseosa Grande',
    puntos: 100,
    icono: '🥤'
  },
  {
    nombre: 'Gift Card $5.000',
    puntos: 300,
    icono: '🎁'
  },
  {
    nombre: 'Gift Card $10.000',
    puntos: 500,
    icono: '🎁'
  }
];

canjear(recompensa: any) {

  this.userService.claimReward(
    recompensa.nombre,
    recompensa.puntos
  ).subscribe({

    next: (claim: any) => {

      alert(
        'Canje realizado.\n\n' +
        'Código: ' +
        claim.code
      );

      this.user.puntos -= recompensa.puntos;
    },

    error: (err) => {
      console.error(err);
      alert('No se pudo realizar el canje.');
    }

  });

}


  ngOnInit(): void {

  this.userService.getMyProfile().subscribe({
    next: (data) => {

      this.user = data;

      this.proximaMeta = this.getMetaNivel();

      this.faltanPuntos =
        Math.max(0, this.proximaMeta - this.user.puntos);

      this.porcentajeProgreso =
        Math.min(
          100,
          (this.user.puntos / this.proximaMeta) * 100
        );

      console.log(this.user);
    },
    error: (err) => {
      console.error(err);
    }
  });

}


}