# CyberSeguro

Detector de Phishing y Amenazas

Este proyecto incluye:
- **Frontend** en Next.js con TailwindCSS y lucide-react
- **Backend** serverless compatible con Vercel
- **knowledge_base.json** con patrones de estafas y fraudes

## Estructura
```
/frontend
/backend/api/analyze.js
/backend/data/knowledge_base.json
package.json
README.md
```

## Deploy
Listo para subir a Vercel. Backend y frontend funcionan juntos.

## Scripts
- `dev`: desarrollo frontend
- `build`: build frontend
- `start`: producción frontend

## Backend
- Endpoint: `/api/analyze` (POST)
- Input: `{ input: string }`
- Output: `{ matches: [...], riesgoPromedio: 0-100 }`

## Frontend
- Página principal con textarea, upload imagen, botón "Analizar Ahora"
- Muestra riesgo, indicadores, explicación y recomendación

## knowledge_base.json
- 100 entradas de estafas, phishing, fraudes y ciberseguridad
- Cada entrada: id, tipo, categoria, patrones, riesgoBase

## Dependencias
- react, react-dom, next, tailwindcss, lucide-react

---

**Recuerda agregar tu knowledge_base.json en /backend/data/**
