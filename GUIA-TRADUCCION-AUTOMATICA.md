# 🌍 GUÍA: Traducción Automática de Presets

## 📋 OBJETIVO

Agregar traducciones automáticas a **todos los idiomas** (ES, EN, FR, PT, ZH, HI) cuando creas un nuevo preset.

---

## 🎯 SISTEMA ACTUAL

### Estructura de Traducción en presets.js

Cada preset debe tener estos campos traducidos:

```javascript
{
  id: "mi-preset",
  
  // 1. NOMBRE (obligatorio)
  name: {
    es: "Mi Preset",
    en: "My Preset",
    fr: "Mon Préréglage",
    pt: "Meu Preset",
    zh: "我的预设",
    hi: "मेरा प्रीसेट"
  },
  
  // 2. DESCRIPCIÓN CORTA (obligatorio - se muestra en la tarjeta)
  description: {
    es: "Descripción corta",
    en: "Short description",
    fr: "Description courte",
    pt: "Descrição curta",
    zh: "简短描述",
    hi: "संक्षिप्त विवरण"
  },
  
  // 3. DESCRIPCIÓN LARGA (obligatorio - se muestra en wizard)
  longDescription: {
    es: "Texto largo explicativo...",
    en: "Long explanatory text...",
    fr: "Texte explicatif long...",
    pt: "Texto explicativo longo...",
    zh: "详细说明文字...",
    hi: "विस्तृत व्याख्यात्मक पाठ..."
  },
  
  // 4. CAMPOS TÉCNICOS (opcional - para wizards avanzados)
  audio: {
    perception: {
      degradation: {
        es: "...",
        en: "...",
        fr: "...",
        pt: "...",
        zh: "...",
        hi: "..."
      },
      why: {
        es: "...",
        en: "...",
        fr: "...",
        pt: "...",
        zh: "...",
        hi: "..."
      }
    }
  },
  
  // 5. GUÍAS Y MARCADORES (opcional)
  guide: {
    when: { es: "...", en: "...", fr: "...", pt: "...", zh: "...", hi: "..." },
    sequence: { es: "...", en: "...", fr: "...", pt: "...", zh: "...", hi: "..." },
    contraindications: { es: "...", en: "...", fr: "...", pt: "...", zh: "...", hi: "..." }
  },
  
  markers: {
    adjust: { es: "...", en: "...", fr: "...", pt: "...", zh: "...", hi: "..." },
    unexpected: { es: "...", en: "...", fr: "...", pt: "...", zh: "...", hi: "..." },
    stop: { es: "...", en: "...", fr: "...", pt: "...", zh: "...", hi: "..." }
  }
}
```

---

## 🚀 PROCESO DE TRADUCCIÓN AUTOMÁTICA

### Paso 1: Crear el Preset en Español e Inglés

```javascript
// Primero escribe el preset solo en ES y EN
{
  id: "nuevo-preset",
  name: {
    es: "Nuevo Preset",
    en: "New Preset"
  },
  description: {
    es: "Descripción del preset",
    en: "Preset description"
  },
  longDescription: {
    es: "Explicación detallada en español...",
    en: "Detailed explanation in English..."
  }
}
```

### Paso 2: Usar el Script de Traducción

```bash
# Ejecutar el script de traducción automática
node translate-new-preset.js
```

### Paso 3: El Script Genera las Traducciones

El script:
1. Lee el preset con solo ES y EN
2. Traduce automáticamente a FR, PT, ZH, HI
3. Actualiza el archivo presets.js

---

## 🔧 SCRIPT DE TRADUCCIÓN

### translate-new-preset.js

```javascript
// ════════════════════════════════════════════════════
// translate-new-preset.js
// Traduce automáticamente un preset a todos los idiomas
// ════════════════════════════════════════════════════

import https from 'https';
import fs from 'fs';

const API_KEY = 'AIzaSyBWsrT3JUCcfRubxOQ-N4dAz8FxGhDThF4';
const TARGET_LANGS = ['fr', 'pt', 'zh', 'hi'];

// Función para traducir texto
async function translateText(text, targetLang, sourceLang = 'en') {
  return new Promise((resolve, reject) => {
    const encodedText = encodeURIComponent(text);
    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}&q=${encodedText}&target=${targetLang}&source=${sourceLang}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.data && json.data.translations && json.data.translations[0]) {
            resolve(json.data.translations[0].translatedText);
          } else {
            reject(new Error('Invalid response'));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Función para esperar (rate limiting)
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función principal
async function translatePreset(presetId) {
  console.log(`\n🌍 Traduciendo preset: ${presetId}\n`);
  
  // Leer presets.js
  const { PRESETS } = await import('./presets.js');
  const preset = PRESETS.find(p => p.id === presetId);
  
  if (!preset) {
    console.error(`❌ Preset "${presetId}" no encontrado`);
    return;
  }
  
  // Campos a traducir
  const fieldsToTranslate = [
    'name',
    'description',
    'longDescription'
  ];
  
  const translations = {};
  
  // Traducir cada campo
  for (const field of fieldsToTranslate) {
    if (!preset[field]) continue;
    
    const enText = preset[field].en;
    if (!enText) continue;
    
    console.log(`📝 Traduciendo: ${field}`);
    translations[field] = { es: preset[field].es, en: enText };
    
    for (const lang of TARGET_LANGS) {
      try {
        const translated = await translateText(enText, lang);
        translations[field][lang] = translated;
        console.log(`  ✓ ${lang}: ${translated.substring(0, 50)}...`);
        await wait(150); // Rate limiting
      } catch (e) {
        console.error(`  ❌ Error en ${lang}: ${e.message}`);
        translations[field][lang] = enText; // Fallback
      }
    }
  }
  
  // Generar código para copiar/pegar
  console.log('\n\n════════════════════════════════════════════════════');
  console.log('📋 CÓDIGO TRADUCIDO - Copiar y pegar en presets.js:');
  console.log('════════════════════════════════════════════════════\n');
  
  for (const [field, langs] of Object.entries(translations)) {
    console.log(`${field}: {`);
    console.log(`  es: "${langs.es}",`);
    console.log(`  en: "${langs.en}",`);
    console.log(`  fr: "${langs.fr}",`);
    console.log(`  pt: "${langs.pt}",`);
    console.log(`  zh: "${langs.zh}",`);
    console.log(`  hi: "${langs.hi}"`);
    console.log('},\n');
  }
  
  console.log('════════════════════════════════════════════════════');
  console.log('✅ Traducción completada!\n');
}

// Uso: node translate-new-preset.js <preset-id>
const presetId = process.argv[2];

if (!presetId) {
  console.error('❌ Uso: node translate-new-preset.js <preset-id>');
  console.error('   Ejemplo: node translate-new-preset.js delta');
  process.exit(1);
}

translatePreset(presetId).catch(console.error);
```

---

## 📝 USO DEL SCRIPT

### 1. Crear Preset con ES y EN

```javascript
// En presets.js, agregar:
{
  id: "mi-nuevo-preset",
  name: {
    es: "Mi Nuevo Preset",
    en: "My New Preset"
  },
  description: {
    es: "Descripción corta",
    en: "Short description"
  },
  longDescription: {
    es: "Explicación larga en español...",
    en: "Long explanation in English..."
  },
  // ... resto de la configuración
}
```

### 2. Ejecutar Script

```bash
node translate-new-preset.js mi-nuevo-preset
```

### 3. Copiar Resultado

El script imprime el código traducido:

```javascript
name: {
  es: "Mi Nuevo Preset",
  en: "My New Preset",
  fr: "Mon Nouveau Préréglage",
  pt: "Meu Novo Preset",
  zh: "我的新预设",
  hi: "मेरा नया प्रीसेट"
},
```

### 4. Pegar en presets.js

Reemplazar los campos originales con los traducidos.

---

## 🎯 AGREGAR BENEFIT A i18n.js

Cuando agregas un nuevo preset, también debes agregar su benefit a `i18n.js`:

### 1. Generar Key

```javascript
// Si tu preset tiene id: "mi-preset"
// El key será: presetMiPresetBenefit
```

### 2. Agregar a i18n.js

```javascript
// En cada idioma de i18n.js:
es: {
  // ... otros keys
  presetMiPresetBenefit: "Descripción corta",
},

en: {
  // ... otros keys
  presetMiPresetBenefit: "Short description",
},

fr: {
  // ... otros keys
  presetMiPresetBenefit: "Description courte",
},

pt: {
  // ... otros keys
  presetMiPresetBenefit: "Descrição curta",
},

zh: {
  // ... otros keys
  presetMiPresetBenefit: "简短描述",
},

hi: {
  // ... otros keys
  presetMiPresetBenefit: "संक्षिप्त विवरण",
}
```

### 3. Usar en HTML

```html
<div class="preset-card" data-preset-id="mi-preset">
  <div class="pc-benefit" data-i18n="presetMiPresetBenefit">
    Descripción corta
  </div>
</div>
```

---

## ⚡ SCRIPT RÁPIDO: extract-preset-benefits.js

Para extraer automáticamente los benefits de presets.js a i18n.js:

```bash
node extract-preset-benefits.js
```

Este script:
1. Lee todos los presets
2. Extrae los `description` de cada uno
3. Genera el código para i18n.js
4. Lo imprime en consola para copiar/pegar

---

## 🔄 FLUJO COMPLETO

```
1. Crear preset en presets.js (solo ES y EN)
   ↓
2. Ejecutar: node translate-new-preset.js <id>
   ↓
3. Copiar traducciones generadas a presets.js
   ↓
4. Ejecutar: node extract-preset-benefits.js
   ↓
5. Copiar benefits generados a i18n.js
   ↓
6. Agregar HTML del preset en index.html
   ↓
7. Probar en navegador (cambiar idiomas)
   ↓
8. ✅ Preset completamente traducido!
```

---

## 📚 ARCHIVOS NECESARIOS

### Scripts de Traducción:
- ✅ `translate-new-preset.js` - Traduce un preset específico
- ✅ `extract-preset-benefits.js` - Extrae benefits para i18n.js

### Archivos del Sistema:
- ✅ `presets.js` - Definición de presets
- ✅ `i18n.js` - Traducciones de interfaz
- ✅ `index.html` - HTML de la aplicación
- ✅ `app.js` - Lógica de la aplicación

---

## 🎯 CHECKLIST DE NUEVO PRESET

- [ ] Crear preset en presets.js (ES y EN)
- [ ] Ejecutar `translate-new-preset.js`
- [ ] Copiar traducciones a presets.js
- [ ] Ejecutar `extract-preset-benefits.js`
- [ ] Copiar benefits a i18n.js
- [ ] Agregar HTML en index.html
- [ ] Probar en navegador (6 idiomas)
- [ ] Verificar wizard (6 idiomas)
- [ ] Commit y push

---

## 💡 TIPS

### 1. Calidad de Traducción
- Escribe textos claros en inglés (mejor traducción automática)
- Revisa traducciones técnicas manualmente
- Usa terminología consistente

### 2. Rate Limiting
- El script espera 150ms entre traducciones
- No traducir más de 100 textos seguidos
- Si falla, esperar 1 minuto y reintentar

### 3. Fallback
- Si una traducción falla, usa el texto en inglés
- Puedes corregir manualmente después
- El sistema siempre tiene fallback a inglés

---

## 🚨 ERRORES COMUNES

### Error: "Invalid API key"
**Solución:** Verificar que la API key de Google Translate sea válida

### Error: "Quota exceeded"
**Solución:** Esperar 24 horas o usar otra API key

### Error: "Preset not found"
**Solución:** Verificar que el ID del preset sea correcto

---

## 📞 SOPORTE

Si tienes problemas:
1. Verificar que el preset existe en presets.js
2. Verificar que tiene campos `en` definidos
3. Verificar conexión a internet
4. Revisar logs de error en consola

---

## ✅ CONCLUSIÓN

Con este sistema puedes:
- ✅ Traducir presets automáticamente a 6 idiomas
- ✅ Mantener consistencia en traducciones
- ✅ Ahorrar tiempo (5 min vs 2 horas manual)
- ✅ Escalar fácilmente a más idiomas

**¡Listo para agregar presets multiidioma!** 🌍🚀

