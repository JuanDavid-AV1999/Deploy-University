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
- Codeship

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

## Travis CI y Codeship

La integración continua complementaria está configurada en `.travis.yml`, `codeship-services.yml` y `codeship-steps.yml`.

## Entrega 3

El documento `ENTREGA_3.md` consolida la integración final, historial de cambios, sugerencias para solución de problemas, responsabilidades y opiniones solicitadas por la actividad evaluativa.


## Nota

Si no configuras las variables de Firebase, la aplicación funciona en modo local con almacenamiento en el navegador.
