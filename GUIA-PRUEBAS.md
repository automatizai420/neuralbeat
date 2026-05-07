# Guía Rápida de Pruebas - Coherencia v8

## 🚀 Inicio Rápido

### 1. Iniciar Servidor
```bash
cd neuralbeat
npx http-server
```

### 2. Abrir Navegador
```
http://127.0.0.1:8080/index.html
```

### 3. Verificar Consola (F12)
✅ Debe mostrar: `🎵 Coherencia v8 modular loaded`  
❌ NO debe haber errores rojos

---

## ✅ Checklist de Funcionalidades

### Header
- [ ] Botones de idioma (ES/EN/FR/PT) cambian textos
- [ ] Botón "∂ Ciencia" abre overlay de bibliografía
- [ ] Status dot cambia a verde cuando está playing

### Panel Izquierdo - Presets
- [ ] Click en cualquier preset lo marca como activo (borde cyan)
- [ ] Valores se actualizan en el panel de controles
- [ ] Tabs "Programas" / "Controles" cambian de panel

### Panel Izquierdo - Controles
- [ ] Sliders se mueven y actualizan valores
- [ ] Toggles (Binaural, Pitido, Ruido) cambian estado
- [ ] Si está playing, cambios se aplican en tiempo real

### Panel Central - Orb
- [ ] Botón ▶ inicia animación
- [ ] Orb crece/decrece con respiración
- [ ] Colores cambian según fase (cyan, gold, purple)
- [ ] Contador de ciclos aumenta

### Panel Central - Visualizaciones
- [ ] Botón Lissajous muestra patrón de Lissajous + Spectrum
- [ ] Botón Oscilo muestra osciloscopio
- [ ] Botón Spectrum muestra espectro completo
- [ ] Botón Spectro muestra espectrograma
- [ ] Botón Vector muestra vectorscopio
- [ ] Botón Cymatics muestra patrones cimáticos ⭐

### Bottom Bar
- [ ] Estadísticas se actualizan (L, R, Beat, Carrier)
- [ ] Contador de ciclos aumenta
- [ ] BPM se muestra correctamente

### Overlay Bibliografía
- [ ] Se abre con botón "∂ Ciencia"
- [ ] Tabs funcionan: Binaural, Pranayama, Vago, LCR
- [ ] Contenido cambia al cambiar tab
- [ ] Se cierra con X o click fuera

### Mobile (< 700px)
- [ ] Botón "☰ Presets" abre bottom sheet
- [ ] Bottom sheet muestra presets
- [ ] Tabs en bottom sheet funcionan
- [ ] Se cierra arrastrando hacia abajo

---

## 🎯 Pruebas por Preset

### Alpha 10 Hz (Coherencia Cardíaca)
```
1. Click en preset "Alpha 10 Hz"
2. Click en ▶
3. Verificar:
   - Orb respira a 6 rpm (10 segundos por ciclo)
   - Beat: 10 Hz
   - Carrier: 250 Hz
   - Patrón de respiración: 5s inhala, 5s exhala
```

### Gamma 40 Hz (MIT Protocol)
```
1. Click en preset "Gamma 40 Hz"
2. Click en ▶
3. Verificar:
   - Respiración rápida (Bhastrika)
   - Beat: 40 Hz
   - Carrier: 500 Hz
   - Patrón: 1s inhala, 1s exhala
```

### 528 Hz (Healing)
```
1. Click en preset "528 Hz"
2. Click en ▶
3. Verificar:
   - Tone: 528 Hz (no carrier)
   - Beat: 8 Hz
   - Respiración lenta: 5 rpm
   - Cymatics muestra patrón hermoso
```

### Wim Hof
```
1. Click en preset "Wim Hof"
2. Click en ▶
3. Verificar:
   - 30 respiraciones rápidas
   - Retención con pulmones vacíos
   - Recuperación con pulmones llenos (15s)
   - 4 rondas totales
   - Dots muestran progreso
```

---

## 🎨 Pruebas de Visualización Cymatics

### Frecuencias Bajas (< 200 Hz)
```
Preset: Delta (2.5 Hz beat, 200 Hz carrier)
Patrón esperado: Pocas ondas, movimiento lento
```

### Frecuencias Medias (200-500 Hz)
```
Preset: Alpha 10 Hz (10 Hz beat, 250 Hz carrier)
Patrón esperado: Ondas moderadas, equilibrado
```

### Frecuencias Altas (> 500 Hz)
```
Preset: 528 Hz (8 Hz beat, 528 Hz tone)
Patrón esperado: Muchas ondas, patrón complejo y hermoso
```

### Beat Modulation
```
1. Selecciona cualquier preset
2. Ajusta slider de Beat (0-40 Hz)
3. Observa cómo el patrón cimático pulsa más rápido/lento
```

---

## 🐛 Errores Comunes y Soluciones

### Error: "Failed to load module"
**Causa**: No estás usando servidor HTTP  
**Solución**: `npx http-server` (nunca abrir con file://)

### Error: "Cannot find module './app.js'"
**Causa**: Ruta incorrecta o archivo no existe  
**Solución**: Verifica que estás en el directorio correcto con `ls *.js`

### Error: "AudioContext was not allowed to start"
**Causa**: Navegador requiere interacción del usuario  
**Solución**: Normal, se resuelve al hacer click en ▶

### No se escucha audio
**Causa**: Volumen bajo o binaural desactivado  
**Solución**: 
1. Verifica slider de volumen (> 0%)
2. Verifica toggle "Binaural" está ON
3. Usa auriculares para mejor efecto

### Visualizaciones no se mueven
**Causa**: Audio no está playing  
**Solución**: Click en ▶ para iniciar

### Orb no respira
**Causa**: Preset no tiene patrón de respiración  
**Solución**: Normal en algunos presets, prueba Alpha 10 Hz

---

## 📊 Métricas de Éxito

### Performance
- [ ] Carga inicial < 2 segundos
- [ ] Animaciones fluidas (60 fps)
- [ ] Sin lag al cambiar presets
- [ ] Visualizaciones sin stuttering

### Funcionalidad
- [ ] 0 errores en consola
- [ ] Todos los botones responden
- [ ] Audio se escucha correctamente
- [ ] Traducciones funcionan en 4 idiomas

### UX
- [ ] Interfaz intuitiva
- [ ] Feedback visual inmediato
- [ ] Responsive en mobile
- [ ] Accesible con teclado (Tab navigation)

---

## 🎯 Casos de Uso Reales

### Sesión de Meditación (20 min)
```
1. Preset: Theta 6 Hz
2. Volumen: 40-60%
3. Binaural: ON
4. Pitido: OFF (menos distracción)
5. Visualización: Cymatics (hipnótico)
```

### Sesión de Trabajo Enfocado (45 min)
```
1. Preset: Beta 18 Hz
2. Volumen: 30-50%
3. Binaural: ON
4. Pitido: ON (mantiene ritmo)
5. Visualización: Spectrum (menos distracción)
```

### Sesión de Coherencia Cardíaca (5 min)
```
1. Preset: Alpha 10 Hz
2. Volumen: 50%
3. Binaural: ON
4. Pitido: ON (guía respiración)
5. Visualización: Lissajous (ver coherencia)
```

### Sesión Wim Hof (15 min)
```
1. Preset: Wim Hof
2. Volumen: 60%
3. Binaural: ON
4. Pitido: ON (marca fases)
5. Visualización: Oscilo (ver intensidad)
```

---

## 💡 Tips de Uso

### Audio
- Usa **auriculares** para efecto binaural completo
- Empieza con **volumen bajo** (30-40%)
- El **pitido guía** ayuda a mantener el ritmo respiratorio
- El **ruido rosa** puede ayudar a concentrarse

### Respiración
- **No fuerces** la respiración, sigue el orb naturalmente
- Si te mareas (especialmente Wim Hof), **detén y respira normal**
- La **coherencia cardíaca** (6 rpm) es la más segura para empezar
- **Retenciones** solo si estás cómodo, no son obligatorias

### Visualizaciones
- **Cymatics** es la más hipnótica, ideal para meditación
- **Lissajous** muestra la coherencia entre L y R
- **Spectrum** es útil para ver las frecuencias activas
- **Oscilo** muestra la forma de onda en tiempo real

### Presets
- Empieza con **Alpha 10 Hz** (más equilibrado)
- **Delta** para dormir (úsalo en cama)
- **Gamma 40 Hz** para estudio intenso
- **528 Hz** para relajación profunda
- **Wim Hof** solo si tienes experiencia con respiración

---

## 📞 Reporte de Bugs

Si encuentras un bug:

1. **Captura de pantalla** de la consola (F12)
2. **Pasos para reproducir**:
   - Preset usado
   - Acciones realizadas
   - Resultado esperado vs obtenido
3. **Información del sistema**:
   - Navegador y versión
   - Sistema operativo
   - Dispositivo (desktop/mobile)

---

**Última actualización**: Mayo 2026  
**Versión**: v8 Modular  
**Estado**: ✅ Todas las funcionalidades verificadas
