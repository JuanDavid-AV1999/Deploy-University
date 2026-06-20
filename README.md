# TaskControl

Aplicación web de gestión de tareas hecha con Vue 3, TypeScript, Pinia, Vue Router, Firebase y Docker.

## Características

- Registro e inicio de sesión
- CRUD de tareas
- Filtros por estado y prioridad
- Búsqueda
- Dashboard con métricas
- Persistencia local y soporte opcional con Firebase
- Docker
- Jenkins
- Travis CI
- GitHub Actions

## Ejecutar en local

```bash
npm install
npm run dev
```

## Variables de entorno opcionales

Copia `.env.example` a `.env` y completa tus credenciales de Firebase.

## Docker

```bash
docker build -t taskcontrol .
docker run -p 8080:80 taskcontrol
```

## Jenkins

El archivo `Jenkinsfile` contiene una pipeline de instalación, validación, build, construcción de imagen Docker y prueba básica del contenedor.

## Travis CI y GitHub Actions

La integración continua complementaria está configurada en `.travis.yml` y `.github/workflows/deploy.yml`.

El workflow de GitHub Actions instala dependencias, valida TypeScript, ejecuta pruebas, compila la aplicación, construye la imagen Docker, valida la configuración de Nginx y despliega en GitHub Pages cuando se actualiza `main` o `master`.
