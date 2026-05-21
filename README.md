# Football API - Sistema de Gestión de Jugadores

Este proyecto es una aplicación full-stack diseñada para la gestión, visualización y análisis de datos de jugadores de fútbol. La arquitectura está completamente contenedorizada utilizando Docker, lo que garantiza un entorno de desarrollo consistente y de fácil despliegue.

## 🚀 Arquitectura del Sistema

El proyecto está compuesto por tres servicios principales:

* **Frontend:** Aplicación desarrollada en **Angular** que incluye componentes interactivos, paginación dinámica, gráficos de rendimiento (gráficos de radar) y exportación de datos a formatos legibles como CSV.
* **Backend:** API REST robusta construida con **NestJS**, encargada de la lógica de negocio, la conexión al ORM y la exposición de los endpoints.
* **Base de Datos:** Motor **MySQL (v8.0)** para el almacenamiento persistente de los registros de los jugadores.

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu sistema:

* [Docker](https://docs.docker.com/get-docker/) y [Docker Compose](https://docs.docker.com/compose/install/)
* [Node.js](https://nodejs.org/) (Para desarrollo local o instalación de dependencias fuera del contenedor)
* Un cliente API como [Postman](https://www.postman.com/) o [Insomnia](https://insomnia.rest/)

---

## 📦 Instalación y Despliegue con Docker

Para levantar todo el entorno (Base de datos, Backend y Frontend) de manera automatizada, sigue estos pasos:

1. Clonar el repositorio e ingresar a la carpeta raíz del proyecto:
   ```bash
   cd football-api
   
# Challenge_XAcademyDEV_2026