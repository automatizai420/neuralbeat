# 🔧 Diagnóstico de Problemas de Visualización

## 🐛 Problema Reportado

- ✅ Animación de respiración (orb) funciona
- ❌ Contador de segundos no visible
- ❌ Visualizaciones de canvas no se muestran
- ❌ Animaciones de sonido no visibles

## 🔍 Pasos de Diagnóstico

### 1. Prueba el archivo de debug

Abre en tu navegador móvil:
```
https://tu-sitio.pages.dev/debug-viz.html
```

Este archivo te dirá:
- ✓ Si Canvas está soportado
- ✓ Si las animaciones funcionan
- ✓ Si el contador funciona
- ✓ Información del navegador

### 2. Verifica la consola del navegador

En móvil:
- **iOS Safari**: Conecta el iPhone a Mac → Safari → Develop → iPhone → Console
- **Android Chrome**: chrome://inspect → Devices → Inspect

Busca errores en rojo.

### 3. Problemas Comunes y Soluciones

#### A) Canvas no se ve (pantalla negra)

**Causa**: Canvas no se inicializó correctamente

**Solución aplicada**:
```javascript
// Ahora se llama resizeCanvas() en load
window.addEventListener('load', () => {
  // ... código ...
  setTimeout(() => {
    resizeCanvas();
    drawWaves(0);
  }, 100);
});
```

#### B) Contador no visible

**Causa**: Orb muy pequeño en móvil (52px) con texto de 14px

**Solución aplicada**:
```css
@media(max-width:700px){
  .orb{width:52px;height:52px;}
  .orb-sec{font-size:13px;font-weight:400;} /* Reducido de 14px */
}
```

#### C) Animaciones no se ejecutan

**Causa**: `requestAnimationFrame` no se está llamando

**Verificar**: En la función `loop()` debe haber:
```javascript
function loop() {
  if (!S.playing) return;
  // ... código ...
  drawWaves(now);
  rafId = requestAnimationFrame(loop);
}
```

### 4. Verificación Manual

Abre la consola del navegador y ejecuta:

```javascript
// Verificar que los canvas existen
console.log('Lissajous:', document.getElementById('wcLissajous'));
console.log('Spectrum:', document.getElementById('wcSpectrum'));

// Verificar dimensiones
const canvas = document.getElementById('wcLissajous');
console.log('Width:', canvas.width, 'Height:', canvas.height);

// Forzar resize
resizeCanvas();

// Forzar dibujo
drawWaves(performance.now());

// Verificar estado
console.log('Playing:', S.playing);
console.log('Current viz:', currentViz);
```

### 5. Test de Audio

El audio binaural requiere interacción del usuario:

```javascript
// En consola, después de tocar la pantalla:
console.log('AudioContext:', AC);
console.log('AC state:', AC ? AC.state : 'null');
```

Si dice `"suspended"`, el audio está bloqueado por el navegador.

## 🚀 Cambios Aplicados

### ✅ Inicialización de Canvas
- Agregado `resizeCanvas()` en `window.load`
- Agregado `drawWaves(0)` para dibujo inicial
- Agregado evento `orientationchange` para móviles

### ✅ Mejoras en resizeCanvas()
- Verifica que el contenedor exista
- Solo actualiza si las dimensiones cambiaron
- Usa `performance.now()` en lugar de `0`

### ✅ Estilos Móviles
- Orb más visible
- Contador con mejor tamaño de fuente
- Header y bottom bar con altura adecuada

## 📱 Prueba Local

```bash
# Servidor local
python3 -m http.server 8000

# Abre en móvil
http://TU-IP-LOCAL:8000/debug-viz.html
http://TU-IP-LOCAL:8000/index.html
```

## 🌐 Deploy a Cloudflare

```bash
# Asegúrate de que todos los archivos estén actualizados
wrangler pages deploy . --project-name=coherencia

# Limpia caché
# En Cloudflare Dashboard → Caching → Purge Everything
```

## 🆘 Si Nada Funciona

1. **Prueba en otro navegador** (Chrome, Firefox, Safari)
2. **Prueba en modo incógnito** (elimina caché)
3. **Verifica que no haya bloqueadores de contenido**
4. **Comparte el log de la consola** para más ayuda

## 📊 Información del Sistema

Para reportar problemas, incluye:
- Navegador y versión
- Sistema operativo
- Tamaño de pantalla
- Errores de consola
- Resultado de debug-viz.html
