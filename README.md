# Coherencia · Neuro·Cardíaca v7

Aplicación web de coherencia neurocardíaca que combina frecuencias binaurales con técnicas de respiración científicamente validadas.

## 🌟 Características

- **Frecuencias Binaurales**: Delta, Theta, Schumann, Alpha, Beta, Gamma (incluye protocolo MIT 40 Hz)
- **Técnicas de Respiración**: Coherencia cardíaca, Nadi Shodhana, 4-7-8, Box Breathing, Wim Hof Method, Dispenza/Maha Bandha
- **Visualizaciones**: Lissajous, Osciloscopio, Espectro, Espectrograma, Vectorscopio
- **Multiidioma**: Español, Inglés, Francés, Portugués
- **Base Científica**: Documentación completa con referencias a estudios

## 🚀 Despliegue en Cloudflare Pages

### Opción 1: Dashboard Web
1. Ve a [Cloudflare Pages](https://pages.cloudflare.com/)
2. Crea un nuevo proyecto
3. Sube el archivo `index.html`
4. Deploy!

### Opción 2: Wrangler CLI
```bash
# Instalar Wrangler (si no lo tienes)
npm install -g wrangler

# Login a Cloudflare
wrangler login

# Deploy
wrangler pages deploy . --project-name=coherencia
```

## 🧪 Desarrollo Local

```bash
# Servidor simple con Python
python3 -m http.server 8000

# O con Node.js
npx http-server -p 8000
```

Luego abre: http://localhost:8000

## 📱 Uso

1. Selecciona un preset de la columna izquierda
2. Ajusta parámetros en la pestaña "Controles" si lo deseas
3. Presiona ▶ para comenzar
4. Usa auriculares para mejor experiencia binaural

## ⚠️ Precauciones

- No usar mientras conduces o operas maquinaria
- Consulta con un profesional de salud si tienes epilepsia o problemas cardiovasculares
- El método Wim Hof debe practicarse acostado, nunca en agua

## 📚 Referencias Científicas

Ver sección "∂ Ciencia" en la aplicación para referencias completas a estudios publicados.

## 📄 Licencia

MIT License - Uso educativo y de bienestar
