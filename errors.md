# Errores conocidos - Nomoredrama

- `ERR_CONNECTION_REFUSED` / `ERR_CONNECTION_RESET` a `/api/v1/content` desde frontend dev: el backend iniciado con `npm run dev` moría cuando el comando quedaba bloqueado por timeout de la CLI. No había listener en `:3001` (`netstat` vacío) y los fetch fallaban. Solución: arrancar el backend en una terminal aparte (ej. `cd backend; npm run dev`) y mantenerla abierta; validar con `curl http://localhost:3001/api/health` o `netstat -ano | findstr 3001`.
- Frontend dev caído: la app en `http://localhost:5173` devolvía error porque no había listener en `:5173` (solo conexiones `TIME_WAIT`). Solución: iniciar `npm run dev -- --host 0.0.0.0 --port 5173` en una terminal dedicada y dejarla abierta; comprobar con `netstat -ano | findstr 5173`.
