
```
Monitoreo-Ambiental-Microservicios
├─ .gitignore
├─ docker-compose-dev.yml
├─ microservicio-cuentas
│  ├─ .dockerignore
│  ├─ app
│  │  ├─ config
│  │  │  └─ config.js
│  │  ├─ controllers
│  │  │  └─ CuentaController.js
│  │  └─ models
│  │     ├─ cuenta.js
│  │     └─ index.js
│  ├─ app.js
│  ├─ bin
│  │  └─ www
│  ├─ Dockerfile.dev
│  ├─ middlewares
│  │  └─ authMiddleware.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ images
│  │  ├─ javascripts
│  │  └─ stylesheets
│  │     └─ style.css
│  ├─ routes
│  │  ├─ api.js
│  │  └─ index.js
│  └─ views
│     ├─ error.jade
│     ├─ index.jade
│     └─ layout.jade
├─ microservicio-sensores
│  ├─ .dockerignore
│  ├─ app
│  │  ├─ config
│  │  │  └─ config.js
│  │  ├─ controllers
│  │  ├─ controls
│  │  │  ├─ RegistroControl.js
│  │  │  └─ SensorControl.js
│  │  └─ models
│  │     ├─ index.js
│  │     ├─ registro_climatico.js
│  │     └─ sensor.js
│  ├─ app.js
│  ├─ bin
│  │  └─ www
│  ├─ Dockerfile.dev
│  ├─ middlewares
│  │  └─ authMiddleware.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ images
│  │  ├─ javascripts
│  │  └─ stylesheets
│  │     └─ style.css
│  ├─ routes
│  │  ├─ api.js
│  │  └─ index.js
│  └─ views
│     ├─ error.jade
│     ├─ index.jade
│     └─ layout.jade
└─ microservicio-usuarios
   ├─ .dockerignore
   ├─ app
   │  ├─ Conection.js
   │  ├─ config
   │  │  └─ config.js
   │  ├─ controllers
   │  │  ├─ RolController.js
   │  │  └─ UsuarioController.js
   │  └─ models
   │     ├─ index.js
   │     ├─ rol.js
   │     └─ usuario.js
   ├─ app.js
   ├─ bin
   │  └─ www
   ├─ Dockerfile.dev
   ├─ middlewares
   │  └─ authMiddleware.js
   ├─ package-lock.json
   ├─ package.json
   ├─ public
   │  ├─ images
   │  ├─ javascripts
   │  └─ stylesheets
   │     └─ style.css
   ├─ routes
   │  ├─ api.js
   │  └─ index.js
   └─ views
      ├─ error.jade
      ├─ index.jade
      └─ layout.jade

```