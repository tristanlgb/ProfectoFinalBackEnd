# E-commerce backend con NestJS

Backend completo de e-commerce desarrollado con NestJS. Gestiona usuarios, productos y carritos, incorpora autenticación con Passport/JWT y renderiza vistas Handlebars para distintos flujos de la aplicación.

## Funcionalidades

- Registro, login y autenticación JWT.
- Estrategias Local y JWT con Passport.
- Gestión de usuarios, productos y carritos.
- Cifrado de contraseñas.
- Carga de archivos con Multer.
- Recuperación y notificaciones por correo.
- Vistas Handlebars para catálogo, perfil y administración.
- Middleware de autenticación y logging.
- Manejo de errores personalizados.
- Pruebas unitarias y end-to-end.

## Stack

- Node.js, TypeScript y NestJS
- MongoDB y Mongoose
- Passport, JWT y bcrypt
- Handlebars
- Nodemailer y Multer
- Jest y Supertest
- ESLint y Prettier

## Arquitectura

La solución utiliza módulos de `auth`, `users`, `products` y `carts`. Cada dominio separa controlador, servicio, DTOs y esquema. `src/common/` agrupa middleware y utilidades compartidas; `src/config/` centraliza configuración.

## Configuración

Crear `.env` con `PORT`, `MONGODB_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `PERSISTENCE` y `NODE_ENV`.

## Ejecución

```bash
npm install
npm run start:dev
```

Para producción: `npm run build` y `npm run start:prod` si se incorpora ese script al proyecto.

> Proyecto educativo. No versionar secretos ni credenciales reales.