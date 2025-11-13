# CinePass

**CinePass** es una aplicación web desarrollada con Angular 20 diseñada para gestionar la venta de boletos de cine online de manera agil y segura. Para la persistencia de datos y peticiones HTTP se ha utilizado el BackEnd de la misma, desarrollado por nosotros el cuatrimestre anterior y mejorado para este proyecto. 

Link al BackEnd --> https://github.com/ilgazzolo/cinema-management-api.git

---
## Tecnologias utilizadas
- Angular 20
- HTML
- CSS
- TypeScript
---

## Arquitectura
Para el desarrollo de la Aplicación, utilizamos una arquitectura modular y basada en componentes, aprovechando las características del framework Angular. La estructura del proyecto se organiza de la siguiente manera:

```
  src
└── app
     └── components
     └── guards
     └── interceptor
     └── models
     └── pages
     └── services
```
---
## Seguridad 
La seguridad de la Aplicación se basa en la utilización de un AuthGuard y un RoleGuard, para la protección de rutas dentro de la web. Tambien se implementó un AuthInterceptor, el cual intercepta las peticiones HTTP, verificando que el token de inicio de sesión no este caducado o sea invalido.

---

## Funciones Iniciales
 - Registro y autenticación de usuarios (cliente y administrador).
 - Gestión CRUD de cartelera, funciones, salas, usuarios y entrada.
 - Asignación de funciones a salas en fechas y horarios específicos.
 - Compra de entradas por parte de los clientes, con validación de disponibilidad.
 - Visualización de cartelera y funciones por parte de los usuarios.
 - Selección de butacas a la hora de comprar la entrada.
 - Gestión de pagos via API MercadoPago.
 - Amplio catalogo de películas obtenidas desde TMDB API.
 - Control de acceso según roles.

---

## Como correr el proyecto

**NECESARIO** utilizar el siguiente repositorio para utilizar el mismo BackEnd --> https://github.com/ilgazzolo/cinema-management-api.git

 1. Clonar el repositorio:   
    ```bash
    git clone https://github.com/Tomiicosta/ProyectoFinalCineFront.git
    cd ProyectoFinalCineFront 
    ```
 2. Ejecuta la aplicación:
    ```New Terminal
    ng serve

---


## Licencia
Este proyecto es de uso académico. Todos los derechos reservados.

Luciano Gazzolo  
Sebastian Aguilera  
Daniel Herrera 
Tomás Constantini  
Nahuel Ramirez  

---

**Universidad Tecnologica Nacional**

---
