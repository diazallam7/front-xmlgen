# front-mxlgeneratefactura (Demo)

Pequeño frontend demo en React + TypeScript para enviar un payload JSON al microservicio `xmlgen-service` y descargar el XML resultante.

Requisitos
- Node 18+ (o versión compatible)

Instalación

```bash
npm install
```

Variables de entorno (opcional)
- `.env` (ya incluido de ejemplo)
  - `VITE_XMLGEN_URL` (por defecto `http://localhost:4000/generate-invoice`)
  - `VITE_API_BASE` (si prefieres enviar vía backend p.ej. `http://localhost:8000`)

Ejecutar en dev

```bash
npm run dev
```

Uso
- Abre la app en el puerto que indique Vite (por defecto `http://localhost:5173`).
- Pegá o cargá el sample JSON (botón `Cargar sample`) y presioná `Enviar`.
- Marca la casilla "Enviar vía backend" para que la petición vaya a `/api/invoices` (requiere que tengas un backend Laravel corriendo en `VITE_API_BASE`).
- Si el microservicio responde con `{ success: true, xml: "<...>" }` la app descargará el XML automáticamente.

Notas
- Este es un demo mínimo. Para producción: añadir validación, manejo de errores más robusto, autenticación entre servicios y UI/UX.
