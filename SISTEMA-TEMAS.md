# 🎨 Sistema de Temas · Coherencia v8

## Descripción

Sistema de 4 temas visuales intercambiables que transforman la experiencia de la aplicación según el estado de ánimo y preferencia del usuario.

---

## 🎯 Temas Disponibles

### 1. ⚡ **CYBER TECH** (Default)
**Sensación:** Dashboard técnico, interfaz de laboratorio, precisión científica

**Paleta:**
```css
--bg:      #060a10  /* Azul oscuro frío */
--primary: #50b4c8  /* Cyan neón */
--text:    #7aa8b8  /* Azul-gris */
```

**Ideal para:**
- Usuarios que prefieren interfaces tech/gaming
- Sesiones de concentración y productividad
- Presets Beta y Gamma (alta frecuencia)

---

### 2. 🌲 **FOREST TWILIGHT**
**Sensación:** Meditación en bosque, conexión con tierra, naturaleza

**Paleta:**
```css
--bg:      #0f1410  /* Negro verdoso (musgo nocturno) */
--primary: #8ca88e  /* Verde salvia suave */
--text:    #a8b8a8  /* Verde-gris claro */
```

**Ideal para:**
- Meditación profunda y mindfulness
- Sesiones de relajación natural
- Presets Theta, Schumann, Alpha

---

### 3. 🕯️ **WARM NIGHT** ⭐ Recomendado
**Sensación:** Meditación nocturna, calidez, introspección pacífica

**Paleta:**
```css
--bg:      #12100f  /* Negro cálido (casi marrón) */
--primary: #c8b8a0  /* Beige luminoso */
--text:    #b8a898  /* Beige claro */
```

**Ideal para:**
- Sesiones nocturnas antes de dormir
- Práctica de coherencia cardíaca
- Presets Delta, 4-7-8, Box Breathing
- **Menos fatiga visual en sesiones largas**

---

### 4. 🌊 **DEEP OCEAN**
**Sensación:** Calma marina, profundidad, serenidad

**Paleta:**
```css
--bg:      #0e1214  /* Azul-gris muy oscuro */
--primary: #8ca8b8  /* Azul grisáceo suave */
--text:    #a8b8c0  /* Azul-gris claro */
```

**Ideal para:**
- Respiración consciente y pranayama
- Sesiones de calma y equilibrio
- Presets Ujjayi, Nadi Shodhana
- Usuarios que prefieren azul pero más natural

---

## 🔧 Implementación Técnica

### Estructura CSS

Cada tema se define como un atributo `data-theme` en el elemento `<html>`:

```css
/* Theme 1: Cyber (default) */
:root, [data-theme="cyber"] {
  --primary: #50b4c8;
  /* ... */
}

/* Theme 2: Forest */
[data-theme="forest"] {
  --primary: #8ca88e;
  /* ... */
}

/* Theme 3: Warm */
[data-theme="warm"] {
  --primary: #c8b8a0;
  /* ... */
}

/* Theme 4: Ocean */
[data-theme="ocean"] {
  --primary: #8ca8b8;
  /* ... */
}
```

### Variables CSS Unificadas

Todos los componentes usan variables CSS genéricas que se adaptan al tema:

```css
--primary    /* Color principal (antes --cyan) */
--primary-d  /* Color principal oscuro */
--bg         /* Fondo principal */
--surface    /* Superficies */
--border     /* Bordes sutiles */
--text       /* Texto principal */
--muted      /* Texto secundario */
```

---

## 🎮 Uso

### Cambiar tema manualmente

```javascript
// Desde consola o código
window.setTheme('warm');
```

### Selector en UI

Los usuarios pueden cambiar el tema desde el header usando los botones:
- ⚡ Cyber Tech
- 🌲 Forest Twilight
- 🕯️ Warm Night
- 🌊 Deep Ocean

### Persistencia

El tema seleccionado se guarda automáticamente en `localStorage`:

```javascript
localStorage.setItem('coherencia_theme', 'warm');
```

Y se carga automáticamente al iniciar la app.

---

## 🎨 Guía de Diseño

### Principios

1. **Coherencia:** Todos los temas mantienen la misma jerarquía visual
2. **Legibilidad:** Contraste suficiente en todos los temas
3. **Propósito:** Cada tema refuerza un estado mental específico
4. **Accesibilidad:** Todos los temas cumplen WCAG AA

### Colores de Bandas Cerebrales

Los colores de las bandas se mantienen consistentes entre temas para identidad:

```css
Delta:    #9b7de8  (púrpura)
Theta:    #4488cc  (azul)
Schumann: #4ecb8a  (verde)
Alpha:    #50b4c8  (cyan)
Beta:     #d4a84b  (dorado)
Gamma:    #e05555  (rojo)
```

Pero se ajustan ligeramente en saturación según el tema base.

---

## 📊 Recomendaciones de Uso

### Por Momento del Día

| Hora | Tema Recomendado | Razón |
|------|------------------|-------|
| **Mañana** | Cyber o Ocean | Energía, claridad mental |
| **Tarde** | Forest o Ocean | Balance, concentración |
| **Noche** | Warm Night | Relajación, menos luz azul |

### Por Tipo de Sesión

| Sesión | Tema Recomendado |
|--------|------------------|
| **Meditación profunda** | Forest Twilight |
| **Coherencia cardíaca** | Warm Night |
| **Concentración/estudio** | Cyber Tech |
| **Pranayama/respiración** | Deep Ocean |
| **Antes de dormir** | Warm Night |

---

## 🚀 Futuras Mejoras

### Posibles adiciones:

1. **Tema claro (Light Mode)**
   - Para uso diurno en ambientes muy iluminados

2. **Tema personalizado**
   - Permitir al usuario crear su propia paleta

3. **Auto-switch por hora**
   - Cambiar automáticamente según hora del día

4. **Tema por preset**
   - Cada preset podría sugerir un tema óptimo

5. **Animaciones de transición**
   - Fade suave entre temas

---

## 📝 Notas Técnicas

### Compatibilidad

- ✅ Todos los navegadores modernos (CSS Custom Properties)
- ✅ Mobile responsive
- ✅ Sin dependencias externas

### Performance

- ⚡ Cambio instantáneo (solo actualiza CSS variables)
- 💾 Mínimo impacto en localStorage (< 20 bytes)
- 🎨 Sin re-render de componentes

### Mantenimiento

Para agregar un nuevo tema:

1. Definir paleta en CSS (`:root` section)
2. Agregar botón en header con emoji
3. Agregar al array `validThemes` en `app.js`
4. Documentar en este archivo

---

## 🎯 Conclusión

El sistema de temas transforma Coherencia v8 de una herramienta técnica a una **experiencia personalizable** que se adapta al estado emocional y contexto del usuario.

**Recomendación general:** Empieza con **Warm Night** 🕯️ para la mayoría de sesiones de coherencia cardíaca y meditación.

---

*Última actualización: Mayo 2026*
