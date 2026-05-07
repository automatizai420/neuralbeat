// ════════════════════════════════════════════════════════════════════════════
// COHERENCIA — PRESETS v3.0
// ════════════════════════════════════════════════════════════════════════════
//
// CAMBIOS PRINCIPALES v2 → v3
// ─────────────────────────────────────────────────────────────────────────
// 1. PROTOCOLO WIM HOF CORREGIDO
//    Flujo real: 30 resp. rápidas → exhale y RETIENE VACÍO (holdEmpty, libre)
//    → inhala profundo y RETIENE LLENO 15s (recovery breath) → 4 rondas.
//    holdEmpty ahora es configurable (target inicial sugerido, el usuario
//    presiona ▶ cuando necesita respirar). holdFull recovery = 15s fijo.
//
// 2. BINAURAL AÑADIDO A TODOS LOS PRESETS
//    Todo preset tiene audio.binaural. Los presets "solo respiración" reciben
//    un beat coherente con su estado target. El binaural puede desactivarse
//    en UI pero la frecuencia está documentada y justificada en cada preset.
//
// 3. RANGOS DE PERCEPCIÓN AUDITIVA DOCUMENTADOS
//    audio.perception → explica por qué ese carrier + beat específico
//    funciona mejor para ese rango de frecuencia. Incluye umbrales de
//    degradación para que el usuario entienda los límites reales del sistema.
//
// 4. TIPOS MÚLTIPLES POR PRESET
//    type ahora es un array. Un preset puede ser binaural + breathing + tone.
//    intent es también un array para soporte multi-objetivo en onboarding.
//
// 5. CATEGORIZACIÓN DUAL
//    category → categoría técnica (binaural | healing | pranayama)
//    sessions → objetivos de sesión (para onboarding y filtrado)
//    priority dentro de sessions → orden de recomendación (1 = primero)
//
// 6. GUÍA DE USO ENRIQUECIDA
//    guide → {when, duration, sequence, contraindications}
//    markers → positivos + señales de corrección (no solo "qué buscar"
//    sino "qué hacer si no ocurre o si hay algo inesperado")
//
// ─────────────────────────────────────────────────────────────────────────
// ESTRUCTURA DE CADA PRESET
// ─────────────────────────────────────────────────────────────────────────
//
//   id              → clave única, coincide con data-band en HTML
//   category        → categoría técnica primaria
//   type            → array de mecanismos: ["binaural","breathing","tone"]
//   sessions        → [{id, priority}] objetivos de sesión
//   scientificLevel → validated | emerging | traditional
//   color           → color del band indicator (CSS data-band)
//
//   name            → {es, en, fr, pt}
//   description     → {es, en, fr, pt} línea corta (pc-benefit)
//   longDescription → {es, en, fr, pt} párrafo expandido para wizard intro
//
//   audio           → configuración del motor de audio
//     binaural      → true/false (si false, solo tone monoaural)
//     beat          → Hz del beat binaural (diferencia entre oído L y R)
//     carrier       → Hz de la frecuencia portadora base
//     tone          → Hz del tono puro (presets healing sin beat)
//     perception    → {
//       optimal     → rango carrier óptimo para este beat
//       degradation → qué ocurre fuera del rango
//       why         → justificación fisiológica/acústica
//     }
//
//   breathing       → configuración del motor de respiración
//     pattern       → motor a usar (ver convención abajo)
//     bpm           → ciclos por minuto
//     ratio         → inhale:exhale (1.0 = igual, 0.7 = exhale 1.4x)
//     holdFull      → segundos de retención pulmón lleno
//     holdEmpty     → segundos de retención pulmón vacío
//     // Solo Wim Hof:
//     wimhof        → {
//       breathCount     → nº de respiraciones por ronda (default 30)
//       holdEmptyTarget → segundos sugeridos de holdEmpty (usuario puede más)
//       holdEmptyMax    → límite de seguridad en UI
//       recoveryHold    → segundos de holdFull en recovery breath (15s fijo)
//       rounds          → nº de rondas (default 4)
//     }
//
//   tuning          → rangos ajustables con semántica de dirección
//     audio.beat    → {min, max, step, lower:{es,en}, higher:{es,en}}
//     audio.carrier → {min, max, step, lower:{es,en}, higher:{es,en}}
//     audio.tone    → {min, max, step, lower:{es,en}, higher:{es,en}}
//     breathing.bpm → {min, max, step, lower:{es,en}, higher:{es,en}}
//     breathing.holdFull  → ...
//     breathing.holdEmpty → ...
//
//   markers         → señales de respuesta del sistema
//     positive      → {es, en} array de señales de que funciona
//     adjust        → {es, en} qué hacer si NO ocurre nada
//     unexpected    → {es, en} señales normales que pueden alarmar
//     stop          → {es, en} señales absolutas de parar
//
//   guide           → contexto de uso
//     when          → {es, en} mejores momentos del día / contexto
//     duration      → {min, recommended, max} en minutos
//     sequence      → {es, en} con qué preset combinar antes/después
//     contraindications → {es, en}
//
//   tags            → array libre para filtrado / search
//
// ─────────────────────────────────────────────────────────────────────────
// CONVENCIÓN: breathing.pattern
// ─────────────────────────────────────────────────────────────────────────
//   coherencia  → motor base i:e, controlado por bpm + ratio
//   nadi        → Nadi Shodhana 1:1 con alternancia nasal
//   478         → fixedDurations: inhale 4s → holdFull 7s → exhale 8s
//   box         → fixedDurations: inhale 4s → holdFull 4s → exhale 4s → holdEmpty 4s
//   dispenza    → exhale + holdEmpty largo con Mula Bandha
//   bhastrika   → rápido, i:e corto, sin retenciones
//   wimhof      → motor especial (ver wimhof{} arriba)
//   ujjayi      → coherencia con fricción glótica
//
// ─────────────────────────────────────────────────────────────────────────
// CONVENCIÓN: sessions[]
// ─────────────────────────────────────────────────────────────────────────
//   foco        → trabajo analítico, productividad, atención sostenida
//   creatividad → flow creativo, pensamiento lateral, arte, escritura
//   calma       → reducción de ansiedad, regulación emocional, reset
//   meditacion  → estados contemplativos, insight, profundidad
//   energia     → activación, mañana, antes de ejercicio o reto
//   conexion    → antes de conversaciones, empatía, apertura emocional
//   sueno       → inducción al sueño, relajación nocturna
//   liberacion  → trabajo emocional, soltar, procesamiento
//
// ════════════════════════════════════════════════════════════════════════════

export const PRESETS = [

  // ══════════════════════════════════════════════════════════════════════
  // BINAURAL — BANDAS CEREBRALES
  // ══════════════════════════════════════════════════════════════════════

  {
    id: "delta",
    category: "binaural",
    type: ["binaural", "breathing"],
    sessions: [
      { id: "sueno",    priority: 1 },
      { id: "meditacion", priority: 3 }
    ],
    scientificLevel: "emerging",
    color: "#9b7de8",

    name: { 
      es: "Delta 2.5 Hz", 
      en: "Delta 2.5 Hz", 
      fr: "Delta 2.5 Hz", 
      pt: "Delta 2.5 Hz",
      zh: "Delta 2.5 Hz",
      hi: "Delta 2.5 Hz"
    },
    description: {
      es: "Sueño Profundo",
      en: "Deep Sleep",
      fr: "Sommeil Profond",
      pt: "Sono Profundo",
      zh: "深度睡眠",
      hi: "गहरी नींद"
    },
    longDescription: {
      es: "Las ondas delta (1–4 Hz) dominan el sueño de ondas lentas, la fase de mayor recuperación física y limpieza cerebral (sistema glinfático). Este preset sincroniza el beat binaural con la banda delta baja (2.5 Hz) y usa una respiración extremadamente lenta para activar el sistema parasimpático y reducir el umbral de consciencia. La retención vacía corta genera presión negativa intratorácica que puede potenciar el flujo del líquido cefalorraquídeo.",
      en: "Delta waves (1–4 Hz) dominate slow-wave sleep, the phase of greatest physical recovery and brain cleansing (glymphatic system). This preset synchronizes the binaural beat with low delta (2.5 Hz) and uses extremely slow breathing to activate the parasympathetic system and lower the consciousness threshold. The short empty retention creates negative intrathoracic pressure that may enhance cerebrospinal fluid flow.",
      zh: "Delta波（1-4 Hz）主导慢波睡眠，这是身体恢复和大脑清洁（淋巴系统）的最重要阶段。此预设将双耳节拍与低delta频段（2.5 Hz）同步，并使用极慢的呼吸来激活副交感神经系统并降低意识阈值。短暂的空息会产生负胸内压，可能增强脑脊液流动。",
      hi: "डेल्टा तरंगें (1-4 Hz) धीमी-तरंग नींद पर हावी होती हैं, जो सबसे अधिक शारीरिक पुनर्प्राप्ति और मस्तिष्क सफाई (ग्लिम्फेटिक सिस्टम) का चरण है। यह प्रीसेट बाइनॉरल बीट को निम्न डेल्टा (2.5 Hz) के साथ सिंक्रनाइज़ करता है और पैरासिम्पेथेटिक सिस्टम को सक्रिय करने और चेतना की सीमा को कम करने के लिए अत्यंत धीमी श्वास का उपयोग करता है। छोटा खाली कुंभक नकारात्मक इंट्राथोरेसिक दबाव उत्पन्न करता है जो मस्तिष्कमेरु द्रव प्रवाह को बढ़ा सकता है।"
    },

    audio: {
      binaural: true,
      beat: 2.5,
      carrier: 200,
      perception: {
        optimal: { min: 180, max: 260 },
        degradation: {
          es: "Por debajo de 150 Hz el oído pierde resolución de fase y el beat se percibe como distorsión, no como pulso. Por encima de 300 Hz con beat tan bajo (2.5 Hz) la diferencia se hace casi imperceptible. El carrier 200 Hz es el punto donde el córtex auditivo procesa mejor beats lentos.",
          en: "Below 150 Hz the ear loses phase resolution and the beat is perceived as distortion, not as a pulse. Above 300 Hz with such a low beat (2.5 Hz) the difference becomes nearly imperceptible. The 200 Hz carrier is where the auditory cortex best processes slow beats.",
          fr: "En dessous de 150 Hz, l'oreille perd la résolution de phase et le battement est perçu comme une distorsion, pas comme une pulsation. Au-dessus de 300 Hz avec un battement aussi bas (2,5 Hz), la différence devient presque imperceptible. La porteuse de 200 Hz est le point où le cortex auditif traite le mieux les battements lents.",
          pt: "Abaixo de 150 Hz, o ouvido perde resolução de fase e o batimento é percebido como distorção, não como pulso. Acima de 300 Hz com batimento tão baixo (2,5 Hz), a diferença torna-se quase imperceptível. A portadora de 200 Hz é o ponto onde o córtex auditivo processa melhor batimentos lentos.",
          zh: "低于150 Hz时，耳朵失去相位分辨率，节拍被感知为失真而非脉冲。高于300 Hz且节拍如此之低（2.5 Hz）时，差异变得几乎无法察觉。200 Hz载波是听觉皮层最好地处理慢节拍的点。",
          hi: "150 Hz से नीचे कान चरण संकल्प खो देता है और बीट विकृति के रूप में माना जाता है, नाड़ी के रूप में नहीं। 300 Hz से ऊपर इतनी कम बीट (2.5 Hz) के साथ अंतर लगभग अगोचर हो जाता है। 200 Hz वाहक वह बिंदु है जहां श्रवण प्रांतस्था धीमी बीट को सबसे अच्छी तरह से संसाधित करता है।"
        },
        why: {
          es: "El procesamiento binaural ocurre en el núcleo olivar superior. Para beats <4 Hz, la resolución temporal del sistema auditivo requiere un carrier en el rango de voz humana (150–300 Hz). Carriers más altos se procesan en áreas de mayor frecuencia donde la detección de fase es menos precisa para diferencias tan pequeñas.",
          en: "Binaural processing occurs in the superior olivary nucleus. For beats <4 Hz, the temporal resolution of the auditory system requires a carrier in the human voice range (150–300 Hz). Higher carriers are processed in areas where phase detection is less precise for such small differences.",
          fr: "Le traitement binaural se produit dans le noyau olivaire supérieur. Pour les battements <4 Hz, la résolution temporelle du système auditif nécessite une porteuse dans la gamme de la voix humaine (150-300 Hz). Les porteuses plus élevées sont traitées dans des zones de fréquence plus élevée où la détection de phase est moins précise pour de si petites différences.",
          pt: "O processamento binaural ocorre no núcleo olivar superior. Para batimentos <4 Hz, a resolução temporal do sistema auditivo requer uma portadora na faixa da voz humana (150-300 Hz). Portadoras mais altas são processadas em áreas de frequência mais alta onde a detecção de fase é menos precisa para diferenças tão pequenas.",
          zh: "双耳处理发生在上橄榄核。对于<4 Hz的节拍，听觉系统的时间分辨率需要人声范围（150-300 Hz）的载波。更高的载波在更高频率区域处理，其中相位检测对如此小的差异不太精确。",
          hi: "बाइनॉरल प्रसंस्करण सुपीरियर ऑलिवरी न्यूक्लियस में होता है। <4 Hz की बीट के लिए, श्रवण प्रणाली के अस्थायी संकल्प को मानव आवाज़ रेंज (150-300 Hz) में वाहक की आवश्यकता होती है। उच्च वाहक उच्च आवृत्ति क्षेत्रों में संसाधित होते हैं जहां चरण पहचान इतने छोटे अंतर के लिए कम सटीक है।"
        }
      }
    },

    breathing: {
      pattern: "coherencia",
      bpm: 3,
      ratio: 1.0,
      holdFull: 2,
      holdEmpty: 4
    },

    tuning: {
      audio: {
        beat: {
          min: 1, max: 4, step: 0.5,
          lower: {
            es: "1–2 Hz: sueño de ondas lentas tardío — para personas que ya tienen sueño pero quieren profundizar. Puede causar somnolencia muy rápida. No usar si necesitas estar despierto después.",
            en: "1–2 Hz: late slow-wave sleep — for people already sleepy wanting to deepen. Can cause drowsiness very quickly. Don't use if you need to be awake afterward.",
            fr: "1-2 Hz: sommeil à ondes lentes tardif — pour les personnes déjà somnolentes voulant approfondir. Peut causer une somnolence très rapide. Ne pas utiliser si vous devez être éveillé après.",
            pt: "1-2 Hz: sono de ondas lentas tardio — para pessoas já sonolentas querendo aprofundar. Pode causar sonolência muito rapidamente. Não use se precisar estar acordado depois.",
            zh: "1-2 Hz：晚期慢波睡眠 — 适合已经困倦但想加深的人。可能很快引起嗜睡。如果之后需要保持清醒，请勿使用。",
            hi: "1-2 Hz: देर से धीमी-तरंग नींद — पहले से नींद में लोगों के लिए जो गहरा करना चाहते हैं। बहुत जल्दी तंद्रा का कारण बन सकता है। यदि आपको बाद में जागना है तो उपयोग न करें।"
          },
          higher: {
            es: "3–4 Hz: zona de transición vigilia→sueño. Mejor para inducir el sueño sin forzar. Si a 2.5 Hz tardas en dormirte, sube a 3.5 Hz primero 10 min y luego baja.",
            en: "3–4 Hz: wake-to-sleep transition zone. Better for inducing sleep without forcing. If at 2.5 Hz sleep is slow, raise to 3.5 Hz for 10 min then lower.",
            fr: "3-4 Hz: zone de transition éveil→sommeil. Meilleur pour induire le sommeil sans forcer. Si à 2,5 Hz le sommeil est lent, montez à 3,5 Hz pendant 10 min puis baissez.",
            pt: "3-4 Hz: zona de transição vigília→sono. Melhor para induzir o sono sem forçar. Se a 2,5 Hz o sono é lento, suba para 3,5 Hz por 10 min e depois baixe.",
            zh: "3-4 Hz：清醒→睡眠过渡区。更适合不强迫地诱导睡眠。如果在2.5 Hz时入睡缓慢，先升至3.5 Hz 10分钟然后降低。",
            hi: "3-4 Hz: जागरण→नींद संक्रमण क्षेत्र। बिना जबरदस्ती नींद लाने के लिए बेहतर। यदि 2.5 Hz पर नींद धीमी है, तो 10 मिनट के लिए 3.5 Hz तक बढ़ाएं फिर कम करें।"
          }
        },
        carrier: {
          min: 150, max: 260, step: 10,
          lower: {
            es: "150–175 Hz: sonido más oscuro, casi sub-grave percibido. Favorece disociación sensorial profunda. Solo si no hay mareo con frecuencias graves.",
            en: "150–175 Hz: darker sound, almost perceived sub-bass. Favors deep sensory dissociation. Only if no dizziness with low frequencies.",
            fr: "150-175 Hz: son plus sombre, presque sub-basse perçue. Favorise la dissociation sensorielle profonde. Seulement s'il n'y a pas de vertige avec les basses fréquences.",
            pt: "150-175 Hz: som mais escuro, quase sub-grave percebido. Favorece dissociação sensorial profunda. Apenas se não houver tontura com frequências baixas.",
            zh: "150-175 Hz：更暗的声音，几乎感知到次低音。有利于深度感官分离。仅在低频没有头晕时使用。",
            hi: "150-175 Hz: गहरा ध्वनि, लगभग उप-बास माना जाता है। गहरी संवेदी पृथक्करण का पक्ष लेता है। केवल तभी जब कम आवृत्तियों के साथ चक्कर न आए।"
          },
          higher: {
            es: "225–260 Hz: ligeramente más perceptible y brillante. Útil si el oído no 'engancha' el beat a 200 Hz. Sube 10 Hz y espera 1 min antes de ajustar otra vez.",
            en: "225–260 Hz: slightly more perceptible and bright. Useful if the ear doesn't 'lock' the beat at 200 Hz. Raise 10 Hz and wait 1 min before adjusting again.",
            fr: "225-260 Hz: légèrement plus perceptible et brillant. Utile si l'oreille ne 'verrouille' pas le battement à 200 Hz. Augmentez de 10 Hz et attendez 1 min avant d'ajuster à nouveau.",
            pt: "225-260 Hz: ligeiramente mais perceptível e brilhante. Útil se o ouvido não 'trava' o batimento a 200 Hz. Aumente 10 Hz e espere 1 min antes de ajustar novamente.",
            zh: "225-260 Hz：稍微更明显和明亮。如果耳朵在200 Hz时不能'锁定'节拍，则很有用。提高10 Hz并等待1分钟再次调整。",
            hi: "225-260 Hz: थोड़ा अधिक बोधगम्य और उज्ज्वल। यदि कान 200 Hz पर बीट को 'लॉक' नहीं करता है तो उपयोगी। 10 Hz बढ़ाएं और फिर से समायोजित करने से पहले 1 मिनट प्रतीक्षा करें।"
          }
        }
      },
      breathing: {
        bpm: {
          min: 2, max: 4, step: 0.5,
          lower: {
            es: "2–2.5 rpm: casi apnea natural, ciclo de ~25s. Solo para practicantes con experiencia en pranayama. El sistema puede sentir urgencia de respirar — es normal, no es peligroso.",
            en: "2–2.5 rpm: near-natural apnea, ~25s cycle. Only for pranayama-experienced practitioners. The system may feel urgency to breathe — this is normal, not dangerous.",
            fr: "2-2,5 rpm: apnée quasi-naturelle, cycle de ~25s. Uniquement pour les praticiens expérimentés en pranayama. Le système peut ressentir une urgence de respirer — c'est normal, pas dangereux.",
            pt: "2-2,5 rpm: apneia quase natural, ciclo de ~25s. Apenas para praticantes experientes em pranayama. O sistema pode sentir urgência de respirar — isso é normal, não é perigoso.",
            zh: "2-2.5 rpm：接近自然呼吸暂停，约25秒周期。仅适用于有调息经验的练习者。系统可能感到呼吸紧迫 — 这是正常的，不危险。",
            hi: "2-2.5 rpm: लगभग प्राकृतिक श्वासरोध, ~25से चक्र। केवल प्राणायाम-अनुभवी अभ्यासियों के लिए। सिस्टम सांस लेने की तात्कालिकता महसूस कर सकता है — यह सामान्य है, खतरनाक नहीं।"
          },
          higher: {
            es: "3.5–4 rpm: ciclo de 15s, rango óptimo para inducir somnolencia sin esfuerzo consciente. Si te cuesta mantener 3 rpm, sube a 3.5 — el efecto es casi igual.",
            en: "3.5–4 rpm: 15s cycle, optimal range for inducing drowsiness without conscious effort. If 3 rpm is difficult, raise to 3.5 — the effect is nearly the same.",
            fr: "3,5-4 rpm: cycle de 15s, plage optimale pour induire la somnolence sans effort conscient. Si 3 rpm est difficile, montez à 3,5 — l'effet est presque le même.",
            pt: "3,5-4 rpm: ciclo de 15s, faixa ideal para induzir sonolência sem esforço consciente. Se 3 rpm é difícil, suba para 3,5 — o efeito é quase o mesmo.",
            zh: "3.5-4 rpm：15秒周期，无需有意识努力即可诱导嗜睡的最佳范围。如果3 rpm困难，升至3.5 — 效果几乎相同。",
            hi: "3.5-4 rpm: 15से चक्र, सचेत प्रयास के बिना तंद्रा प्रेरित करने के लिए इष्टतम सीमा। यदि 3 rpm कठिन है, तो 3.5 तक बढ़ाएं — प्रभाव लगभग समान है।"
          }
        },
        holdEmpty: {
          min: 0, max: 8, step: 1,
          lower: {
            es: "0s: sin retención, ciclo fluido. Ideal para quedarse dormido — no interrumpe el inicio del sueño con pausas activas.",
            en: "0s: no retention, smooth cycle. Ideal for falling asleep — doesn't interrupt sleep onset with active pauses.",
            fr: "0s: pas de rétention, cycle fluide. Idéal pour s'endormir — n'interrompt pas le début du sommeil avec des pauses actives.",
            pt: "0s: sem retenção, ciclo suave. Ideal para adormecer — não interrompe o início do sono com pausas ativas.",
            zh: "0秒：无保持，流畅周期。适合入睡 — 不会用主动暂停打断睡眠开始。",
            hi: "0से: कोई कुंभक नहीं, सुचारू चक्र। सो जाने के लिए आदर्श — सक्रिय विराम के साथ नींद की शुरुआत को बाधित नहीं करता।"
          },
          higher: {
            es: "5–8s: activa el sistema glinfático de limpieza cerebral y potencia el efecto delta. Solo si no hay mareo. Si aparece hormigueo en las manos, reduce 2s.",
            en: "5–8s: activates glymphatic brain-cleansing and potentiates delta effect. Only if no dizziness. If tingling appears in hands, reduce by 2s.",
            fr: "5-8s: active le système glymphatique de nettoyage cérébral et potentialise l'effet delta. Seulement s'il n'y a pas de vertige. Si des picotements apparaissent dans les mains, réduisez de 2s.",
            pt: "5-8s: ativa o sistema glinfático de limpeza cerebral e potencializa o efeito delta. Apenas se não houver tontura. Se aparecer formigamento nas mãos, reduza 2s.",
            zh: "5-8秒：激活淋巴脑清洁系统并增强delta效果。仅在没有头晕时。如果手部出现刺痛，减少2秒。",
            hi: "5-8से: ग्लिम्फेटिक मस्तिष्क-सफाई को सक्रिय करता है और डेल्टा प्रभाव को बढ़ाता है। केवल तभी जब चक्कर न आए। यदि हाथों में झुनझुनी दिखाई दे, तो 2से कम करें।"
          }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Los párpados se sienten pesados sin esfuerzo después de 3–4 min",
          "La respiración se vuelve automática — pierdes la cuenta del ciclo",
          "Sensación de hundimiento suave (como que la gravedad aumenta)",
          "Los pensamientos se convierten en imágenes difusas (hipnagogia)"
        ],
        en: [
          "Eyelids feel heavy without effort after 3–4 min",
          "Breathing becomes automatic — you lose count of the cycle",
          "Gentle sinking sensation (as if gravity increases)",
          "Thoughts shift to diffuse images (hypnagogia)"
        ],
        fr: [
          "Les paupières se sentent lourdes sans effort après 3-4 min",
          "La respiration devient automatique — vous perdez le compte du cycle",
          "Sensation d'enfoncement doux (comme si la gravité augmentait)",
          "Les pensées se transforment en images diffuses (hypnagogie)"
        ],
        pt: [
          "As pálpebras ficam pesadas sem esforço após 3-4 min",
          "A respiração torna-se automática — você perde a conta do ciclo",
          "Sensação de afundamento suave (como se a gravidade aumentasse)",
          "Os pensamentos transformam-se em imagens difusas (hipnagogia)"
        ],
        zh: [
          "3-4分钟后眼皮不费力地感到沉重",
          "呼吸变得自动 — 你失去了周期的计数",
          "轻柔的下沉感觉（好像重力增加）",
          "思想转变为模糊的图像（入睡幻觉）"
        ],
        hi: [
          "3-4 मिनट के बाद पलकें बिना प्रयास के भारी महसूस होती हैं",
          "श्वास स्वचालित हो जाती है — आप चक्र की गिनती खो देते हैं",
          "कोमल डूबने की अनुभूति (जैसे गुरुत्वाकर्षण बढ़ता है)",
          "विचार धुंधली छवियों में बदल जाते हैं (हिप्नागोगिया)"
        ]
      },
      adjust: {
        es: "Si después de 5 min tu mente sigue activa: (1) baja el beat 0.5 Hz. (2) Añade 1–2s al holdEmpty. (3) Si el binaural te resulta estimulante en vez de relajante, baja el volumen al mínimo perceptible.",
        en: "If after 5 min your mind remains active: (1) lower beat by 0.5 Hz. (2) Add 1–2s to holdEmpty. (3) If the binaural feels stimulating rather than relaxing, lower volume to minimum perceptible.",
        fr: "Si après 5 min votre esprit reste actif: (1) baissez le battement de 0,5 Hz. (2) Ajoutez 1-2s au holdEmpty. (3) Si le binaural semble stimulant plutôt que relaxant, baissez le volume au minimum perceptible.",
        pt: "Se após 5 min sua mente permanece ativa: (1) baixe o batimento em 0,5 Hz. (2) Adicione 1-2s ao holdEmpty. (3) Se o binaural parece estimulante em vez de relaxante, baixe o volume ao mínimo perceptível.",
        zh: "如果5分钟后你的思维仍然活跃：(1) 降低节拍0.5 Hz。(2) 在holdEmpty中添加1-2秒。(3) 如果双耳节拍感觉刺激而不是放松，将音量降至最低可感知。",
        hi: "यदि 5 मिनट के बाद आपका मन सक्रिय रहता है: (1) बीट को 0.5 Hz कम करें। (2) holdEmpty में 1-2से जोड़ें। (3) यदि बाइनॉरल आराम के बजाय उत्तेजक लगता है, तो वॉल्यूम को न्यूनतम बोधगम्य तक कम करें।"
      },
      unexpected: {
        es: "Hormigueo leve en manos o pies: normal con retenciones. Imágenes vívidas al cerrar los ojos: señal positiva de entrada a hipnagogia, no las sigas activamente.",
        en: "Mild tingling in hands or feet: normal with retentions. Vivid images when eyes close: positive sign of entering hypnagogia, don't actively follow them.",
        fr: "Picotements légers dans les mains ou les pieds: normal avec les rétentions. Images vives en fermant les yeux: signe positif d'entrée en hypnagogie, ne les suivez pas activement.",
        pt: "Formigamento leve nas mãos ou pés: normal com retenções. Imagens vívidas ao fechar os olhos: sinal positivo de entrada na hipnagogia, não as siga ativamente.",
        zh: "手或脚轻微刺痛：保持时正常。闭眼时生动的图像：进入入睡幻觉的积极信号，不要主动跟随它们。",
        hi: "हाथों या पैरों में हल्की झुनझुनी: कुंभक के साथ सामान्य। आंखें बंद करने पर जीवंत छवियां: हिप्नागोगिया में प्रवेश का सकारात्मक संकेत, उन्हें सक्रिय रूप से न फॉलो करें।"
      },
      stop: {
        es: "Mareo intenso, sensación de vértigo o palpitaciones irregulares: para la sesión inmediatamente. Este preset no es para personas con apnea del sueño no tratada.",
        en: "Intense dizziness, vertigo sensation, or irregular palpitations: stop the session immediately. This preset is not for people with untreated sleep apnea.",
        fr: "Vertiges intenses, sensation de vertige ou palpitations irrégulières: arrêtez la session immédiatement. Ce préréglage n'est pas pour les personnes souffrant d'apnée du sommeil non traitée.",
        pt: "Tontura intensa, sensação de vertigem ou palpitações irregulares: pare a sessão imediatamente. Este preset não é para pessoas com apneia do sono não tratada.",
        zh: "强烈头晕、眩晕感或不规则心悸：立即停止会话。此预设不适用于未治疗的睡眠呼吸暂停患者。",
        hi: "तीव्र चक्कर, चक्कर की अनुभूति, या अनियमित धड़कन: तुरंत सत्र बंद करें। यह प्रीसेट अनुपचारित स्लीप एपनिया वाले लोगों के लिए नहीं है।"
      }
    },

    guide: {
      when: {
        es: "30–60 min antes de dormir, acostado o reclinado. Oscuridad o luz muy tenue. No usar si necesitas conducir o estar alerta en las próximas 2 horas.",
        en: "30–60 min before sleep, lying or reclined. Darkness or very dim light. Don't use if you need to drive or be alert in the next 2 hours.",
        fr: "30-60 min avant le sommeil, allongé ou incliné. Obscurité ou lumière très faible. Ne pas utiliser si vous devez conduire ou être alerte dans les 2 prochaines heures.",
        pt: "30-60 min antes de dormir, deitado ou reclinado. Escuridão ou luz muito fraca. Não use se precisar dirigir ou estar alerta nas próximas 2 horas.",
        zh: "睡前30-60分钟，躺着或斜倚。黑暗或非常微弱的光线。如果您需要在接下来的2小时内开车或保持警觉，请勿使用。",
        hi: "सोने से 30-60 मिनट पहले, लेटे हुए या झुके हुए। अंधेरा या बहुत मंद प्रकाश। यदि आपको अगले 2 घंटों में गाड़ी चलानी है या सतर्क रहना है तो उपयोग न करें।"
      },
      duration: { min: 10, recommended: 20, max: 45 },
      sequence: {
        es: "Si vienes de un día de alta activación: usa Box Breathing 5 min antes como reset del SNA. Delta es el destino, Box es el puente.",
        en: "Coming from a high-activation day: use Box Breathing for 5 min first as ANS reset. Delta is the destination, Box is the bridge.",
        fr: "Venant d'une journée de haute activation: utilisez Box Breathing pendant 5 min d'abord comme réinitialisation du SNA. Delta est la destination, Box est le pont.",
        pt: "Vindo de um dia de alta ativação: use Box Breathing por 5 min primeiro como reset do SNA. Delta é o destino, Box é a ponte.",
        zh: "来自高激活日：首先使用Box Breathing 5分钟作为自主神经系统重置。Delta是目的地，Box是桥梁。",
        hi: "उच्च-सक्रियण दिन से आ रहे हैं: पहले ANS रीसेट के रूप में 5 मिनट के लिए Box Breathing का उपयोग करें। Delta गंतव्य है, Box पुल है।"
      },
      contraindications: {
        es: "Epilepsia, apnea del sueño no tratada, embarazo, antecedentes de psicosis. No combinar con alcohol o sedantes.",
        en: "Epilepsy, untreated sleep apnea, pregnancy, history of psychosis. Don't combine with alcohol or sedatives.",
        fr: "Épilepsie, apnée du sommeil non traitée, grossesse, antécédents de psychose. Ne pas combiner avec de l'alcool ou des sédatifs.",
        pt: "Epilepsia, apneia do sono não tratada, gravidez, histórico de psicose. Não combine com álcool ou sedativos.",
        zh: "癫痫、未治疗的睡眠呼吸暂停、怀孕、精神病史。不要与酒精或镇静剂结合使用。",
        hi: "मिर्गी, अनुपचारित स्लीप एपनिया, गर्भावस्था, मनोविकृति का इतिहास। शराब या शामक के साथ संयोजन न करें।"
      }
    },

    tags: ["sueno", "sueño", "sleep", "delta", "glimatic", "glymphatic", "LCR", "parasympathetic", "nighttime"]
  },


  {
    id: "theta",
    category: "binaural",
    type: ["binaural", "breathing"],
    sessions: [
      { id: "meditacion",  priority: 1 },
      { id: "creatividad", priority: 2 },
      { id: "sueno",       priority: 4 }
    ],
    scientificLevel: "emerging",
    color: "#4488cc",

    name: { 
      es: "Theta 6 Hz", 
      en: "Theta 6 Hz", 
      fr: "Theta 6 Hz", 
      pt: "Theta 6 Hz",
      zh: "Theta 6 Hz",
      hi: "Theta 6 Hz"
    },
    description: {
      es: "Meditación Profunda",
      en: "Deep Meditation",
      fr: "Méditation Profonde",
      pt: "Meditação Profunda",
      zh: "深度冥想",
      hi: "गहरा ध्यान"
    },
    longDescription: {
      es: "Theta (4–8 Hz) es el estado del sueño REM, la memoria episódica y la meditación profunda. En theta el filtro crítico de la mente se afloja: los insights, los recuerdos y las imágenes emergen sin esfuerzo. El ciclo de 15s (4 rpm) coincide con las oscilaciones lentas del LCR. La retención llena de 4s activa los barorreceptores aórticos generando una quietud profunda que el cerebro asocia con seguridad.",
      en: "Theta (4–8 Hz) is the state of REM sleep, episodic memory, and deep meditation. In theta the mind's critical filter loosens: insights, memories, and images emerge effortlessly. The 15s cycle (4 rpm) coincides with slow CSF oscillations. The 4s full retention activates aortic baroreceptors generating a deep stillness the brain associates with safety.",
      fr: "Theta (4-8 Hz) est l'état du sommeil paradoxal, de la mémoire épisodique et de la méditation profonde. En theta, le filtre critique de l'esprit se relâche: les insights, les souvenirs et les images émergent sans effort. Le cycle de 15s (4 rpm) coïncide avec les oscillations lentes du LCR. La rétention pleine de 4s active les barorécepteurs aortiques générant un calme profond que le cerveau associe à la sécurité.",
      pt: "Theta (4-8 Hz) é o estado do sono REM, memória episódica e meditação profunda. Em theta, o filtro crítico da mente se afrouxa: insights, memórias e imagens emergem sem esforço. O ciclo de 15s (4 rpm) coincide com oscilações lentas do LCR. A retenção cheia de 4s ativa os barorreceptores aórticos gerando uma quietude profunda que o cérebro associa à segurança.",
      zh: "Theta（4-8 Hz）是快速眼动睡眠、情景记忆和深度冥想的状态。在theta中，思维的批判性过滤器松弛：洞察力、记忆和图像毫不费力地出现。15秒周期（4 rpm）与脑脊液的缓慢振荡一致。4秒的满息激活主动脉压力感受器，产生大脑与安全相关的深度静止。",
      hi: "Theta (4-8 Hz) REM नींद, एपिसोडिक मेमोरी और गहरे ध्यान की स्थिति है। Theta में मन का महत्वपूर्ण फ़िल्टर ढीला हो जाता है: अंतर्दृष्टि, यादें और छवियां सहजता से उभरती हैं। 15से चक्र (4 rpm) धीमी CSF दोलनों के साथ मेल खाता है। 4से का पूर्ण कुंभक महाधमनी बैरोरिसेप्टर्स को सक्रिय करता है जो एक गहरी शांति उत्पन्न करता है जिसे मस्तिष्क सुरक्षा से जोड़ता है।"
    },

    audio: {
      binaural: true,
      beat: 6,
      carrier: 200,
      perception: {
        optimal: { min: 180, max: 280 },
        degradation: {
          es: "Para beats en rango theta (4–8 Hz) el sistema auditivo necesita un carrier estable. Carriers superiores a 350 Hz con beat 6 Hz pueden hacer que la diferencia de fase suene como vibrato rápido en lugar de pulso lento. El rango 200–280 Hz mantiene la coherencia del beat.",
          en: "For theta-range beats (4–8 Hz) the auditory system needs a stable carrier. Carriers above 350 Hz with a 6 Hz beat can make the phase difference sound like fast vibrato rather than a slow pulse. The 200–280 Hz range maintains beat coherence.",
          fr: "Pour les battements de la bande thêta (4–8 Hz), le système auditif a besoin d&#39;une porteuse stable. Avec des porteuses supérieures à 350 Hz et un battement de 6 Hz, la différence de phase peut être perçue comme un vibrato rapide plutôt que comme une pulsation lente. La bande 200–280 Hz assure la cohérence du battement.",
          pt: "Para batimentos na faixa teta (4–8 Hz), o sistema auditivo precisa de uma portadora estável. Portadoras acima de 350 Hz com um batimento de 6 Hz podem fazer com que a diferença de fase soe como um vibrato rápido em vez de um pulso lento. A faixa de 200–280 Hz mantém a coerência do batimento.",
          zh: "对于θ波段（4–8 Hz）的节拍，听觉系统需要一个稳定的载波。高于350 Hz的载波，如果节拍频率为6 Hz，则相位差听起来会像快速颤音，而不是缓慢的脉冲。200–280 Hz的范围可以保持节拍的一致性。",
          hi: "थीटा श्रेणी (4–8 हर्ट्ज़) की ध्वनियों के लिए श्रवण तंत्र को एक स्थिर वाहक की आवश्यकता होती है। 6 हर्ट्ज़ की ध्वनि के साथ 350 हर्ट्ज़ से ऊपर के वाहक ध्वनियाँ चरण अंतर को धीमी नाड़ी के बजाय तीव्र कंपन जैसा बना सकती हैं। 200–280 हर्ट्ज़ की श्रेणी में ध्वनि की सुसंगति बनी रहती है।"
        },
        why: {
          es: "El núcleo olivar superior codifica la diferencia de frecuencia entre ambos oídos. Para beats lentos (<8 Hz) la latencia neural necesaria es mayor, por lo que el procesamiento es más eficiente con carriers en frecuencias medias-bajas donde el tiempo de respuesta del núcleo es óptimo.",
          en: "The superior olivary nucleus encodes the frequency difference between both ears. For slow beats (<8 Hz) the required neural latency is higher, so processing is more efficient with mid-low frequency carriers where the nucleus response time is optimal.",
          fr: "Le noyau olivaire supérieur code la différence de fréquence entre les deux oreilles. Pour les battements lents (&lt; 8 Hz), la latence neuronale requise est plus élevée ; le traitement est donc plus efficace avec des porteuses de fréquences moyennes à basses, pour lesquelles le temps de réponse du noyau est optimal.",
          pt: "O núcleo olivar superior codifica a diferença de frequência entre as duas orelhas. Para batimentos lentos (&lt;8 Hz), a latência neural necessária é maior, portanto o processamento é mais eficiente com portadoras de frequência média-baixa, onde o tempo de resposta do núcleo é ideal.",
          zh: "上橄榄核负责编码双耳之间的频率差。对于慢速节拍（&lt;8 Hz），所需的神经延迟较长，因此，对于中低频载波（此时上橄榄核的反应时间最佳），处理效率更高。",
          hi: "सुपीरियर ओलिवरी न्यूक्लियस दोनों कानों के बीच आवृत्ति अंतर को एन्कोड करता है। धीमी धड़कनों (&lt;8 हर्ट्ज़) के लिए आवश्यक तंत्रिका विलंबता अधिक होती है, इसलिए मध्य-निम्न आवृत्ति वाहकों के साथ प्रसंस्करण अधिक कुशल होता है जहां न्यूक्लियस की प्रतिक्रिया का समय इष्टतम होता है।"
        }
      }
    },

    breathing: {
      pattern: "coherencia",
      bpm: 4,
      ratio: 1.0,
      holdFull: 4,
      holdEmpty: 3
    },

    tuning: {
      audio: {
        beat: {
          min: 4, max: 8, step: 0.5,
          lower: {
          es: "4–5 Hz: theta profundo, borde del sueño. Imágenes muy vívidas, posible pérdida temporal de consciencia. Solo si el objetivo es meditación sin dormir activo.",
          en: "4–5 Hz: deep theta, edge of sleep. Very vivid imagery, possible temporary loss of consciousness. Only if objective is meditation without active sleep.",
          fr: "4–5 Hz : thêta profond, en bordure du sommeil. Images très vives, possible perte de conscience temporaire. Uniquement si l’objectif est la méditation sans sommeil actif.",
          pt: "4–5 Hz: onda teta profunda, limiar do sono. Imagens muito vívidas, possível perda temporária de consciência. Somente se o objetivo for a meditação sem sono ativo.",
          zh: "4-5赫兹：深度θ波，接近睡眠边缘。画面非常生动，可能出现短暂的意识丧失。仅适用于不涉及主动睡眠的冥想。",
          hi: "4–5 हर्ट्ज़: गहरी थीटा आवृत्ति, नींद की अवस्था के किनारे पर। बहुत ही सजीव कल्पनाएँ, संभवतः क्षणिक बेहोशी। केवल तभी जब उद्देश्य सक्रिय नींद के बिना ध्यान करना हो।"
        },
          higher: {
          es: "7–8 Hz: límite theta/alfa. Más fácil de sostener sin dormirse. Bueno para meditadores nuevos o sesiones cortas de 10–15 min.",
          en: "7–8 Hz: theta/alpha border. Easier to sustain without sleeping. Good for new meditators or short 10–15 min sessions.",
          fr: "7–8 Hz : limite thêta/alpha. Plus facile à maintenir sans s’endormir. Idéal pour les débutants en méditation ou pour de courtes séances de 10 à 15 minutes.",
          pt: "7–8 Hz: limite entre as ondas teta e alfa. Mais fácil de manter sem dormir. Bom para iniciantes na meditação ou para sessões curtas de 10 a 15 minutos.",
          zh: "7–8 Hz：θ波/α波交界处。无需睡眠即可轻松维持。适合冥想新手或10–15分钟的短时冥想。",
          hi: "7–8 हर्ट्ज़: थीटा/अल्फा सीमा। बिना सोए इसे बनाए रखना आसान है। नए ध्यानियों या 10-15 मिनट के छोटे सत्रों के लिए अच्छा है।"
        }
        },
        carrier: {
          min: 150, max: 280, step: 10,
          lower: {
          es: "150–180 Hz: oscuro, profundo. Favorece disociación corporal y visiones internas. No uses menos de 150 Hz — el beat se vuelve imperceptible.",
          en: "150–180 Hz: dark, deep. Favors body dissociation and inner visions. Don't go below 150 Hz — the beat becomes imperceptible.",
          fr: "150–180 Hz : sombre, profond. Favorise la dissociation corporelle et les visions intérieures. Ne descendez pas en dessous de 150 Hz, car le rythme devient imperceptible.",
          pt: "150–180 Hz: escuro, profundo. Favorece a dissociação corporal e visões interiores. Não use frequências abaixo de 150 Hz — a batida torna-se imperceptível.",
          zh: "150–180 赫兹：低沉、深沉。有利于身体分离和内在幻象。不要低于 150 赫兹——否则节拍会变得难以察觉。",
          hi: "150–180 हर्ट्ज़: गहरा और रहस्यमय। यह शरीर से अलगाव और आंतरिक दृष्टियों को बढ़ावा देता है। 150 हर्ट्ज़ से नीचे न जाएं — इससे लय अगोचर हो जाती है।"
        },
          higher: {
          es: "240–280 Hz: más claro, ayuda a mantener consciencia sin dormirse. Útil para meditadores que practican awareness sin objeto.",
          en: "240–280 Hz: clearer, helps maintain consciousness without sleeping. Useful for meditators practicing objectless awareness.",
          fr: "240–280 Hz : son plus clair, favorise le maintien de la conscience sans s’endormir. Utile pour les méditants pratiquant la méditation de pleine conscience sans objet.",
          pt: "240–280 Hz: mais nítido, ajuda a manter a consciência sem dormir. Útil para meditadores que praticam a atenção plena sem objeto.",
          zh: "240–280 赫兹：更清晰，有助于保持清醒状态而不入睡。对练习无对象觉知的冥想者很有帮助。",
          hi: "240–280 हर्ट्ज़: अधिक स्पष्ट, नींद के बिना चेतना बनाए रखने में सहायक। वस्तुहीन जागरूकता का अभ्यास करने वाले ध्यानियों के लिए उपयोगी।"
        }
        }
      },
      breathing: {
        bpm: {
          min: 3, max: 5, step: 0.5,
          lower: {
          es: "3–3.5 rpm: potencia theta profundo. Ciclo de 17–20s. Riesgo real de dormirse — solo si eso es aceptable.",
          en: "3–3.5 rpm: deepens theta. 17–20s cycle. Real risk of sleeping — only if that's acceptable.",
          fr: "3–3,5 tr/min : approfondit l’état thêta. Cycle de 17 à 20 s. Risque réel d’endormissement – à condition que cela soit acceptable.",
          pt: "3–3,5 rpm: aprofunda a frequência theta. Ciclo de 17–20 segundos. Risco real de induzir ao sono — apenas se isso for aceitável.",
          zh: "3–3.5 转/分：加深θ波。周期17–20秒。确实有睡着的风险——只有在你能接受的情况下才行。",
          hi: "3–3.5 आरपीएम: थीटा तीव्रता को बढ़ाता है। चक्र 17–20 सेकंड का होता है। नींद आने का वास्तविक खतरा है — लेकिन केवल तभी जब यह स्वीकार्य हो।"
        },
          higher: {
          es: "4.5–5 rpm: mantiene el awareness activo mientras el beat lleva a theta. El ciclo más corto (12s) da más puntos de anclaje consciente.",
          en: "4.5–5 rpm: maintains active awareness while the beat carries theta. The shorter cycle (12s) gives more conscious anchor points.",
          fr: "4,5–5 tr/min : maintient une conscience active tandis que le rythme porte l’onde thêta. Le cycle plus court (12 s) offre davantage de points d’ancrage conscients.",
          pt: "4,5–5 rpm: mantém a consciência ativa enquanto a batida carrega o ritmo theta. O ciclo mais curto (12s) proporciona mais pontos de ancoragem conscientes.",
          zh: "4.5–5 转/分：在节拍保持θ波的同时，保持积极的意识状态。较短的周期（12秒）提供更多意识锚点。",
          hi: "4.5–5 आरपीएम: यह लय के साथ-साथ सक्रिय जागरूकता बनाए रखता है, जबकि थीटा ऊर्जा प्रवाहित होती रहती है। छोटा चक्र (12 सेकंड) अधिक सचेत आधार बिंदु प्रदान करता है।"
        }
        },
        holdFull: {
          min: 0, max: 8, step: 1,
          lower: {
          es: "0s: flujo suave. Ideal para meditadores nuevos o si la retención genera ansiedad.",
          en: "0s: smooth flow. Ideal for new meditators or if retention generates anxiety.",
          fr: "0s : flux fluide. Idéal pour les débutants en méditation ou si la rétention génère de l’anxiété.",
          pt: "0s: fluxo suave. Ideal para iniciantes na meditação ou para quem tem dificuldade em manter a meditação por longos períodos, gerando ansiedade.",
          zh: "0秒：流畅的冥想体验。非常适合冥想新手，或者如果冥想过程中保持专注会感到焦虑。",
          hi: "0 सेकंड: सहज प्रवाह। नए ध्यानियों के लिए या यदि ध्यान केंद्रित करने से चिंता उत्पन्न होती है तो यह आदर्श है।"
        },
          higher: {
          es: "5–8s: activación barorreceptora intensa → quietud muy profunda. Practica avanzada. Asegúrate de que la inhalación después del hold sea natural, no forzada.",
          en: "5–8s: intense baroreflex activation → very deep stillness. Advanced practice. Ensure the inhale after the hold is natural, not forced.",
          fr: "5 à 8 s : activation intense du baroréflexe → immobilité très profonde. Pratique avancée. Veillez à ce que l’inspiration après la rétention soit naturelle, et non forcée.",
          pt: "5–8 segundos: ativação intensa do barorreflexo → quietude muito profunda. Prática avançada. Certifique-se de que a inspiração após a retenção seja natural, não forçada.",
          zh: "5-8秒：强烈的压力反射激活→非常深层的静止状态。进阶练习。确保屏息后的吸气自然，不要强迫。",
          hi: "5-8 सेकंड: तीव्र बैरोरिफ्लेक्स सक्रियण → अत्यंत गहरी शांति। उन्नत अभ्यास। सुनिश्चित करें कि ठहराव के बाद साँस लेना स्वाभाविक हो, ज़बरदस्ती नहीं।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Imágenes espontáneas detrás de los ojos cerrados (sin dirigirlas)",
          "Pérdida de conciencia del cuerpo físico — no sabes dónde terminan tus pies",
          "Sensación de flotar o de expansión del espacio interior",
          "La mente 'salta' a recuerdos o insights sin haberlos buscado"
        ],
        en: [
          "Spontaneous imagery behind closed eyes (without directing them)",
          "Loss of awareness of the physical body — you don't know where your feet end",
          "Floating or interior space expansion sensation",
          "Mind 'jumps' to memories or insights without having sought them"
        ]
      },
      adjust: {
          es: "Si te quedas dormido: sube beat a 7–8 Hz + sube 0.5 rpm. Si no llegas a theta después de 8 min: baja beat 1 Hz + extiende holdFull 1s. La oscilación theta personal varía ±1 Hz entre personas — ajusta de a 0.5 Hz con 2 min de espera entre cambios.",
          en: "If you fall asleep: raise beat to 7–8 Hz + raise 0.5 rpm. If theta is unreachable after 8 min: lower beat by 1 Hz + extend holdFull by 1s. Personal theta oscillation varies ±1 Hz between people — adjust in 0.5 Hz steps with 2 min wait between changes.",
          fr: "Si vous vous endormez : augmentez la fréquence à 7–8 Hz et la vitesse de 0,5 tr/min. Si l’oscillation thêta est inatteignable après 8 minutes : diminuez la fréquence de 1 Hz et prolongez le maintien de 1 seconde. L’oscillation thêta varie de ±1 Hz d’une personne à l’autre ; ajustez par paliers de 0,5 Hz en attendant 2 minutes entre chaque modification.",
          pt: "Se você adormecer: aumente a frequência para 7–8 Hz e a rotação em 0,5 rpm. Se a oscilação theta estiver inalcançável após 8 minutos: diminua a frequência em 1 Hz e prolongue o tempo de duração da estimulação (holdFull) em 1 segundo. A oscilação theta individual varia ±1 Hz entre as pessoas — ajuste em incrementos de 0,5 Hz com um intervalo de 2 minutos entre as alterações.",
          zh: "如果睡着了：将节拍频率提高到 7–8 Hz，转速提高 0.5 rpm。如果 8 分钟后仍无法达到 theta 波：将节拍频率降低 1 Hz，并将保持时间延长 1 秒。每个人的 theta 波振荡频率存在 ±1 Hz 的差异——以 0.5 Hz 为步长进行调整，每次调整后等待 2 分钟。",
          hi: "यदि आपको नींद आ जाए: बीट को 7-8 हर्ट्ज़ तक बढ़ाएँ + 0.5 आरपीएम बढ़ाएँ। यदि 8 मिनट के बाद भी थीटा ऑसिलेशन न हो: बीट को 1 हर्ट्ज़ कम करें + होल्डफुल को 1 सेकंड तक बढ़ाएँ। व्यक्तिगत थीटा ऑसिलेशन हर व्यक्ति में ±1 हर्ट्ज़ तक भिन्न हो सकता है — 0.5 हर्ट्ज़ के चरणों में समायोजित करें और प्रत्येक परिवर्तन के बीच 2 मिनट का अंतराल रखें।"
        },
      unexpected: {
          es: "Saltos musculares (mioclonías) al entrar a theta: completamente normal, es la transición vigilia→sueño. Sensación de caída: también normal, señal de que el umbral theta está cerca.",
          en: "Muscle jerks (myoclonus) when entering theta: completely normal, it's the wake-to-sleep transition. Falling sensation: also normal, signal that the theta threshold is close.",
          fr: "Des secousses musculaires (myoclonies) lors de l&#39;entrée en ondes thêta : tout à fait normales, elles correspondent à la transition veille-sommeil. Sensation de chute : également normale, elle indique que le seuil thêta est proche.",
          pt: "Espasmos musculares (mioclonia) ao entrar no ritmo theta: completamente normais, trata-se da transição da vigília para o sono. Sensação de queda: também normal, indica que o limiar theta está próximo.",
          zh: "进入θ波时出现肌肉抽搐（肌阵挛）：完全正常，这是从清醒到睡眠的过渡阶段。坠落感：也是正常的，表明θ波阈值即将达到。",
          hi: "थीटा अवस्था में प्रवेश करते समय मांसपेशियों में होने वाली ऐंठन (मायोक्लोनस): यह पूरी तरह से सामान्य है, यह नींद से जागने की प्रक्रिया है। गिरने का अहसास: यह भी सामान्य है, यह संकेत देता है कि थीटा अवस्था की सीमा नजदीक है।"
        },
      stop: {
          es: "Si sientes angustia o contenido perturbador persistente: abre los ojos, respira normalmente. Theta puede activar material emocional no resuelto — no es un error del sistema, es información.",
          en: "If you feel distress or persistent disturbing content: open your eyes, breathe normally. Theta can activate unresolved emotional material — it's not a system error, it's information.",
          fr: "Si vous ressentez de la détresse ou des pensées perturbantes persistantes : ouvrez les yeux et respirez normalement. Les ondes thêta peuvent activer des éléments émotionnels non résolus ; il ne s’agit pas d’un dysfonctionnement du système, mais d’une information.",
          pt: "Se você sentir angústia ou conteúdo perturbador persistente: abra os olhos e respire normalmente. A atividade Theta pode ativar material emocional não resolvido — não é um erro do sistema, é informação.",
          zh: "如果你感到痛苦或持续受到令人不安的内容困扰：睁开眼睛，正常呼吸。Theta波可以激活未解决的情绪素材——这不是系统错误，而是信息。",
          hi: "यदि आपको बेचैनी या लगातार परेशान करने वाली सामग्री महसूस हो रही है: अपनी आँखें खोलें, सामान्य रूप से सांस लें। थीटा ऊर्जा अनसुलझे भावनात्मक तत्वों को सक्रिय कर सकती है - यह कोई सिस्टम त्रुटि नहीं है, बल्कि जानकारी है।"
        }
    },

    guide: {
      when: {
          es: "Tarde (no en la noche si no quieres dormirte) o al despertar temprano. Posición sentada para mantener awareness. Ojos cerrados o fijos en un punto.",
          en: "Afternoon (not at night if you don't want to sleep) or upon early waking. Seated position to maintain awareness. Eyes closed or fixed on a point.",
          fr: "L&#39;après-midi (pas la nuit si vous ne souhaitez pas dormir) ou au réveil. Position assise pour rester vigilant. Yeux fermés ou fixés sur un point.",
          pt: "À tarde (não à noite, se não quiser dormir) ou logo ao acordar. Sente-se para manter o estado de alerta. Olhos fechados ou fixos em um ponto.",
          zh: "下午（如果不想睡觉，就不要在晚上）或清晨醒来后。保持坐姿以保持清醒。闭上眼睛或注视一点。",
          hi: "दोपहर के समय (रात में नहीं, अगर आप सोना नहीं चाहते) या सुबह जल्दी उठने पर। सचेत रहने के लिए बैठें। आंखें बंद रखें या किसी एक बिंदु पर टिकी हुई हों।"
        },
      duration: { min: 10, recommended: 25, max: 60 },
      sequence: {
          es: "Alpha 10 Hz (5–8 min) como entrada, luego Theta. Salir de theta con Alpha 8 Hz 3–5 min antes de volver a actividad normal.",
          en: "Alpha 10 Hz (5–8 min) as entry, then Theta. Exit theta with Alpha 8 Hz for 3–5 min before returning to normal activity.",
          fr: "Entrée en ondes alpha à 10 Hz (5 à 8 min), puis ondes thêta. Sortie en ondes alpha à 8 Hz pendant 3 à 5 min avant de revenir à l&#39;activité normale.",
          pt: "Alfa 10 Hz (5–8 min) como entrada, seguido de Theta. Saída de Theta com Alfa 8 Hz por 3–5 min antes de retornar à atividade normal.",
          zh: "以 Alpha 10 Hz（5-8 分钟）作为进入，然后是 Theta。以 Alpha 8 Hz 持续 3-5 分钟结束 Theta，然后恢复正常活动。",
          hi: "प्रवेश के लिए अल्फा 10 हर्ट्ज़ (5-8 मिनट), फिर थीटा। सामान्य गतिविधि पर लौटने से पहले 3-5 मिनट के लिए अल्फा 8 हर्ट्ज़ के साथ थीटा से बाहर निकलें।"
        },
      contraindications: {
          es: "Epilepsia. Proceder con cuidado en personas con historial de disociación severa o trastorno de despersonalización.",
          en: "Epilepsy. Proceed with caution in people with history of severe dissociation or depersonalization disorder.",
          fr: "Épilepsie. Procéder avec prudence chez les personnes ayant des antécédents de troubles dissociatifs ou de dépersonnalisation sévères.",
          pt: "Epilepsia. Proceda com cautela em pessoas com histórico de transtorno dissociativo grave ou despersonalização.",
          zh: "癫痫。对于有严重分离性障碍或人格解体障碍病史的患者，应谨慎用药。",
          hi: "मिर्गी। गंभीर वियोग या व्यक्तित्वहीनता विकार के इतिहास वाले लोगों में सावधानी बरतें।"
        }
    },

    tags: ["meditacion", "meditation", "theta", "REM", "visualizacion", "visualization", "LCR", "insight"]
  },


  {
    id: "schumann",
    category: "binaural",
    type: ["binaural", "breathing"],
    sessions: [
      { id: "calma",       priority: 2 },
      { id: "meditacion",  priority: 3 },
      { id: "creatividad", priority: 3 }
    ],
    scientificLevel: "traditional",
    color: "#4ecb8a",

    name: { es: "Schumann 7.83 Hz", en: "Schumann 7.83 Hz", fr: "Schumann 7.83 Hz", pt: "Schumann 7.83 Hz" },
    description: {
      es: "Resonancia Terrestre",
      en: "Earth Resonance",
      fr: "Résonance Terrestre",
      pt: "Ressonância Terrestre"
    },
    longDescription: {
          es: "7.83 Hz es la frecuencia fundamental de la cavidad electromagnética Tierra-ionosfera, medida por primera vez por Winfried Schumann en 1952. Coincide con el límite theta/alfa. Su uso como referencia de 'arraigo' es de naturaleza tradicional — la fisiología humana evolucionó en presencia de este campo. La respiración 4 rpm con retenciones simétricas cortas crea un ciclo que ancla el sistema nervioso sin inducir somnolencia.",
          en: "7.83 Hz is the fundamental frequency of the Earth-ionosphere electromagnetic cavity, first measured by Winfried Schumann in 1952. It coincides with the theta/alpha border. Its use as a 'grounding' reference is traditional in nature — human physiology evolved in the presence of this field. Breathing at 4 rpm with short symmetric retentions creates a cycle that anchors the nervous system without inducing drowsiness.",
          fr: "7,83 Hz est la fréquence fondamentale de la cavité électromagnétique Terre-ionosphère, mesurée pour la première fois par Winfried Schumann en 1952. Elle coïncide avec la limite entre les ondes thêta et alpha. Son utilisation comme référence d’ancrage est traditionnelle : la physiologie humaine a évolué en présence de ce champ. Une respiration à 4 cycles par minute, avec de courtes rétentions symétriques, crée un cycle qui ancre le système nerveux sans induire de somnolence.",
          pt: "7,83 Hz é a frequência fundamental da cavidade eletromagnética Terra-ionosfera, medida pela primeira vez por Winfried Schumann em 1952. Ela coincide com a fronteira entre as frequências teta e alfa. Seu uso como referência de &quot;aterramento&quot; é tradicional — a fisiologia humana evoluiu na presença desse campo. Respirar a 4 rpm com breves retenções simétricas cria um ciclo que ancora o sistema nervoso sem induzir sonolência.",
          zh: "7.83赫兹是地球-电离层电磁腔的基频，由温弗里德·舒曼于1952年首次测量。它与θ波/α波的交界线重合。将其用作“接地”参考频率是传统做法——人类生理机能正是在这种场域中进化而来的。以每分钟4次的频率进行呼吸，并配合短暂对称的屏息，可以形成一个稳定神经系统的周期，而不会引起困倦。",
          hi: "7.83 हर्ट्ज़ पृथ्वी-आयनोमंडल विद्युतचुंबकीय गुहा की मूल आवृत्ति है, जिसे पहली बार 1952 में विन्फ्रीड शुमान द्वारा मापा गया था। यह थीटा/अल्फा सीमा के साथ मेल खाती है। इसका उपयोग &#39;ग्राउंडिंग&#39; संदर्भ के रूप में पारंपरिक है - मानव शरीर क्रिया विज्ञान इसी क्षेत्र की उपस्थिति में विकसित हुआ ह���। 4 आरपीएम की दर से सांस लेना और थोड़े-थोड़े समय के लिए सममित रूप से सांस रोकना एक ऐसा चक्र बनाता है जो उनींदापन पैदा किए बिना तंत्रिका तंत्र को स्थिर रखता है।"
        },

    audio: {
      binaural: true,
      beat: 7.83,
      carrier: 200,
      perception: {
        optimal: { min: 180, max: 300 },
        degradation: {
          es: "7.83 Hz está en el límite de resolución temporal del sistema auditivo. El carrier 200 Hz es el mínimo recomendado para que el beat sea percibido como pulso y no como variación de amplitud. Por encima de 350 Hz con este beat, el efecto binaural se puede confundir con tremolo.",
          en: "7.83 Hz is at the temporal resolution limit of the auditory system. The 200 Hz carrier is the recommended minimum for the beat to be perceived as a pulse and not as amplitude variation. Above 350 Hz with this beat, the binaural effect can be confused with tremolo.",
          fr: "La fréquence de 7,83 Hz correspond à la limite de résolution temporelle du système auditif. Une porteuse de 200 Hz est le minimum recommandé pour que le battement soit perçu comme une pulsation et non comme une variation d&#39;amplitude. Au-delà de 350 Hz, avec ce battement, l&#39;effet binaural peut être confondu avec un trémolo.",
          pt: "7,83 Hz está no limite de resolução temporal do sistema auditivo. A portadora de 200 Hz é o mínimo recomendado para que a batida seja percebida como um pulso e não como uma variação de amplitude. Acima de 350 Hz, com essa batida, o efeito binaural pode ser confundido com tremolo.",
          zh: "7.83 Hz 接近听觉系统的时间分辨率极限。建议将 200 Hz 的载波频率设为最低值，以确保节拍被感知为脉冲而非振幅变化。当节拍频率高于 350 Hz 时，双耳效应可能与颤音混淆。",
          hi: "7.83 हर्ट्ज़ श्रवण तंत्र की समय-संबंधी सीमा है। 200 हर्ट्ज़ की आवृत्ति को न्यूनतम अनुशंसित आवृत्ति माना जाता है ताकि ध्वनि को स्पंदन के रूप में समझा जा सके, न कि आयाम में बदलाव के रूप में। इस आवृत्ति के साथ 350 हर्ट्ज़ से ऊपर, द्विश्रव्य प्रभाव को कंपन के साथ भ्रमित किया जा सकता है।"
        },
        why: {
          es: "La diferencia de 7.83 Hz entre los dos tonos es lo suficientemente pequeña para ser procesada como beat binaural y lo suficientemente grande para ser perceptible en el rango de 200–300 Hz. El cerebro detecta esta diferencia de fase gracias al núcleo olivar superior con mayor precisión en el rango de voz humana.",
          en: "The 7.83 Hz difference between the two tones is small enough to be processed as a binaural beat and large enough to be perceptible in the 200–300 Hz range. The brain detects this phase difference through the superior olivary nucleus with greater precision in the human voice range.",
          fr: "La différence de 7,83 Hz entre les deux sons est suffisamment faible pour être perçue comme un battement binaural et suffisamment importante pour être audible dans la gamme 200–300 Hz. Le cerveau détecte cette différence de phase avec une plus grande précision dans la gamme de fréquences de la voix humaine grâce au noyau olivaire supérieur.",
          pt: "A diferença de 7,83 Hz entre os dois tons é pequena o suficiente para ser processada como uma batida binaural e grande o suficiente para ser perceptível na faixa de 200–300 Hz. O cérebro detecta essa diferença de fase através do núcleo olivar superior com maior precisão na faixa da voz humana.",
          zh: "这两个音调之间的7.83赫兹的相位差既小到足以被处理成双耳节拍，又大到足以在200-300赫兹范围内被人耳感知。在人声范围内，大脑通过上橄榄核更精确地检测出这种相位差。",
          hi: "दो स्वरों के बीच 7.83 हर्ट्ज़ का अंतर इतना कम है कि इसे द्विश्रव्य ताल के रूप में संसाधित किया जा सकता है और इतना अधिक है कि इसे 200-300 हर्ट्ज़ की सीमा में महसूस किया जा सकता है। मस्तिष्क मानव आवाज की सीमा में इस चरण अंतर को सुपीरियर ओलिवरी न्यूक्लियस के माध्यम से अधिक सटीकता से पहचानता है।"
        }
      }
    },

    breathing: {
      pattern: "coherencia",
      bpm: 4,
      ratio: 1.0,
      holdFull: 3,
      holdEmpty: 3
    },

    tuning: {
      audio: {
        beat: {
          min: 7.0, max: 9.0, step: 0.1,
          lower: {
          es: "7.0–7.5 Hz: más theta, más introspectivo. Arraigo hacia adentro. Para meditación quieta.",
          en: "7.0–7.5 Hz: more theta, more introspective. Inward grounding. For quiet meditation.",
          fr: "7,0–7,5 Hz : fréquence thêta plus marquée, introspection accrue. Ancrage intérieur. Pour la méditation silencieuse.",
          pt: "7,0–7,5 Hz: mais teta, mais introspectivo. Ancoragem interna. Para meditação tranquila.",
          zh: "7.0–7.5 Hz：更偏向θ波，更内省。向内扎根。适合安静冥想。",
          hi: "7.0–7.5 हर्ट्ज़: अधिक थीटा, अधिक आत्मनिरीक्षण। आंतरिक स्थिरता। शांत ध्यान के लिए।"
        },
          higher: {
          es: "8.0–9.0 Hz: límite alpha. Más alerta, arraigo externo. Para trabajo creativo o antes de actividad física suave.",
          en: "8.0–9.0 Hz: alpha border. More alert, external grounding. For creative work or before gentle physical activity.",
          fr: "8,0–9,0 Hz : limite alpha. Éveil accru, ancrage externe. Pour les activités créatives ou avant une activité physique douce.",
          pt: "8,0–9,0 Hz: limite alfa. Mais alerta, ancoragem externa. Para trabalho criativo ou antes de atividades físicas leves.",
          zh: "8.0–9.0 Hz：α波临界点。更清醒，更接地气。适合创意工作或轻柔的体育活动前。",
          hi: "8.0–9.0 हर्ट्ज़: अल्फा बॉर्डर। अधिक सतर्कता, बाहरी ग्राउंडिंग। रचनात्मक कार्यों के लिए या हल्की शारीरिक गतिविधि से पहले उपयुक्त।"
        }
        },
        carrier: {
          min: 180, max: 300, step: 10,
          lower: {
          es: "180–190 Hz: mínimo recomendado. Sonido muy oscuro, arraigo profundo.",
          en: "180–190 Hz: recommended minimum. Very dark sound, deep grounding.",
          fr: "180–190 Hz : minimum recommandé. Son très sombre, ancrage profond.",
          pt: "180–190 Hz: mínimo recomendado. Som muito escuro, com profunda presença.",
          zh: "180–190 Hz：建议最低频率。声音非常浑厚，具有深沉的接地感。",
          hi: "180–190 हर्ट्ज़: न्यूनतम अनुशंसित आवृत्ति। बहुत ही गहरी ध्वनि, बेहतरीन ग्राउंडिंग।"
        },
          higher: {
          es: "260–300 Hz: más brillante. Útil si el beat a 200 Hz te resulta difícil de percibir.",
          en: "260–300 Hz: brighter. Useful if the beat at 200 Hz is hard to perceive.",
          fr: "260–300 Hz : plus brillant. Utile si le battement à 200 Hz est difficile à percevoir.",
          pt: "260–300 Hz: mais brilhante. Útil se a batida em 200 Hz for difícil de perceber.",
          zh: "260–300 Hz：更明亮。如果难以察觉 200 Hz 的节拍，则此频率很有用。",
          hi: "260–300 हर्ट्ज़: अधिक चमकदार। यह तब उपयोगी होता है जब 200 हर्ट्ज़ पर बीट को समझना मुश्किल हो।"
        }
        }
      },
      breathing: {
        bpm: {
          min: 3, max: 5, step: 0.5,
          lower: {
          es: "3–3.5 rpm: arraigo profundo en quietud. Baja solo si el ambiente es tranquilo y tienes tiempo.",
          en: "3–3.5 rpm: deep grounding in stillness. Lower only in a quiet environment with time to spare.",
          fr: "3–3,5 tr/min : un ancrage profond dans le silence. À un régime inférieur uniquement dans un environnement calme et avec du temps devant soi.",
          pt: "3–3,5 rpm: profunda conexão com a quietude. Apenas em um ambiente silencioso e com tempo de sobra.",
          zh: "3–3.5 转/分：深层静谧的根基。仅在安静且时间充裕的环境下才可使用更低转速。",
          hi: "3–3.5 आरपीएम: शांति में गहरी स्थिरता प्राप्त करना। केवल शांत वातावरण में और पर्याप्त समय होने पर ही गति कम करें।"
        },
          higher: {
          es: "4.5–5 rpm: mantiene atención activa. Útil para Schumann como fondo de trabajo.",
          en: "4.5–5 rpm: maintains active attention. Useful for Schumann as a work background.",
          fr: "4,5–5 tr/min : maintient l’attention. Utile pour Schumann comme fond sonore de travail.",
          pt: "4,5–5 rpm: mantém a atenção ativa. Útil para Schumann como música de fundo para o trabalho.",
          zh: "4.5–5 转/分：有助于保持注意力集中。适合作为舒曼作品的工作背景音乐。",
          hi: "4.5–5 आरपीएम: सक्रिय ध्यान बनाए रखता है। शुमान के संगीत में पृष्ठभूमि के रूप में उपयोगी।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Sensación de 'pies en la tierra' incluso estando sentado",
          "Diálogo interno que disminuye sin esfuerzo",
          "Respiración que se hace más lenta de manera espontánea",
          "Calor suave o pulsación en el bajo vientre o pecho"
        ],
        en: [
          "'Feet on the ground' sensation even while seated",
          "Internal dialogue diminishing effortlessly",
          "Breathing spontaneously slowing down",
          "Gentle warmth or pulsation in lower abdomen or chest"
        ]
      },
      adjust: {
          es: "Esta es la frecuencia más personal del sistema. Si 7.83 Hz no genera arraigo, mueve de 0.1 Hz en 0.1 Hz con 1 min de escucha en cada punto. Tu Schumann personal puede estar entre 7.4 y 8.4 Hz. Cuando encuentres el punto, la quietud es casi inmediata — como afinar una cuerda.",
          en: "This is the most personal frequency in the system. If 7.83 Hz doesn't produce grounding, move in 0.1 Hz steps with 1 min of listening at each point. Your personal Schumann may be between 7.4 and 8.4 Hz. When you find it, stillness is almost immediate — like tuning a string.",
          fr: "Il s&#39;agit de la fréquence la plus personnelle du système. Si 7,83 Hz ne vous procure pas d&#39;ancrage, augmentez-la par paliers de 0,1 Hz en écoutant pendant une minute à chaque palier. Votre fréquence de Schumann personnelle se situe probablement entre 7,4 et 8,4 Hz. Lorsque vous la trouvez, le calme est quasi instantané, comme lorsqu&#39;on accorde une corde.",
          pt: "Esta é a frequência mais pessoal do sistema. Se 7,83 Hz não produzir ancoragem, mova-se em incrementos de 0,1 Hz, com 1 minuto de escuta em cada ponto. Sua frequência Schumann pessoal pode estar entre 7,4 e 8,4 Hz. Quando você a encontrar, a quietude será quase imediata — como afinar uma corda.",
          zh: "这是系统中最为个人化的频率。如果 7.83 Hz 无法带来安定感，请以 0.1 Hz 为步长逐步增加频率，并在每个频率点聆听 1 分钟。你的舒曼共振频率可能在 7.4 到 8.4 Hz 之间。一旦找到它，平静感几乎会立刻到来——就像调弦一样。",
          hi: "यह प्रणाली में सबसे व्यक्तिगत आवृत्ति है। यदि 7.83 हर्ट्ज़ पर आपको शांति नहीं मिलती, तो प्रत्येक बिंदु पर 1 मिनट तक सुनते हुए 0.1 हर्ट्ज़ के चरणों में आगे बढ़ें। आपकी व्यक्तिगत शुमान आवृत्ति 7.4 और 8.4 हर्ट्ज़ के बीच हो सकती है। जब आप इसे पा लेते हैं, तो शांति लगभग तुरंत ही प्राप्त हो जाती है - जैस��� किसी तार को ट्यून करना।"
        },
      unexpected: {
          es: "Leve sensación de vértigo los primeros 2 min: normal durante el ajuste del sistema nervioso al beat lento.",
          en: "Slight vertigo sensation in the first 2 min: normal during nervous system adjustment to the slow beat.",
          fr: "Légère sensation de vertige pendant les 2 premières minutes : normale pendant l’adaptation du système nerveux au rythme lent.",
          pt: "Leve sensação de vertigem nos primeiros 2 minutos: normal durante o ajuste do sistema nervoso ao ritmo cardíaco lento.",
          zh: "前 2 分钟有轻微眩晕感：这是神经系统适应慢心跳的正常现象。",
          hi: "पहले 2 मिनट में हल्का चक्कर आना: धीमी लय के साथ तंत्रिका तंत्र के समायोजन के दौरान यह सामान्य है।"
        },
      stop: {
          es: "Vértigo persistente después de 3 min o sensación de disociación no deseada: parar y respirar normalmente.",
          en: "Persistent vertigo after 3 min or unwanted dissociation sensation: stop and breathe normally.",
          fr: "Vertiges persistants après 3 min ou sensation de dissociation indésirable : arrêtez-vous et respirez normalement.",
          pt: "Vertigem persistente após 3 minutos ou sensação indesejada de dissociação: pare e respire normalmente.",
          zh: "持续眩晕3分钟后或出现非自愿的分离感：停止并正常呼吸。",
          hi: "3 मिनट के बाद भी लगातार चक्कर आना या अवांछित अलगाव की अनुभूति होने पर: रुकें और सामान्य रूप से सांस लें।"
        }
    },

    guide: {
      when: {
          es: "Cualquier momento. Especialmente útil después de pantallas, reuniones intensas o viajes. También como reset entre sesiones de trabajo.",
          en: "Any time. Especially useful after screens, intense meetings or travel. Also as a reset between work sessions.",
          fr: "À tout moment. Particulièrement utile après une séance devant un écran, des réunions intenses ou un voyage. Idéal aussi pour se ressourcer entre deux sessions de travail.",
          pt: "A qualquer hora. Especialmente útil após longos períodos em frente à tela, reuniões intensas ou viagens. Também serve como uma pausa entre sessões de trabalho.",
          zh: "任何时间都适用。尤其适合在长时间使用电子屏幕、参加紧张的会议或旅行之后。也适合在工作间隙放松身心。",
          hi: "कभी भी। स्क्रीन पर लंबे समय तक रहने, गहन बैठकों या यात्रा के बाद विशेष रूप से उपयोगी। काम के सत्रों के बीच आराम करने के लिए भी बढ़िया।"
        },
      duration: { min: 7, recommended: 15, max: 30 },
      sequence: {
          es: "Puede ser el preset de entrada antes de cualquier binaural más profundo (Theta, Delta) o el de salida después de Gamma.",
          en: "Can be the entry preset before any deeper binaural (Theta, Delta) or the exit after Gamma.",
          fr: "Peut être le préréglage d&#39;entrée avant tout binaural plus profond (Theta, Delta) ou le préréglage de sortie après Gamma.",
          pt: "Pode ser a predefinição de entrada antes de qualquer binaural mais profundo (Theta, Delta) ou a predefinição de saída após Gamma.",
          zh: "可以是任何更深层次的双耳节拍（Theta、Delta）之前的入口预设，也可以是Gamma之后的出口预设。",
          hi: "यह किसी भी गहरे बाइनॉरल (थीटा, डेल्टा) से पहले का एंट्री प्रीसेट हो सकता है या गामा के बाद का एग्जिट प्रीसेट हो सकता है।"
        },
      contraindications: {
          es: "Epilepsia.",
          en: "Epilepsy.",
          fr: "Épilepsie.",
          pt: "Epilepsia.",
          zh: "癫痫。",
          hi: "मिर्गी।"
        }
    },

    tags: ["arraigo", "grounding", "schumann", "theta-alpha", "reset", "naturaleza", "nature"]
  },


  {
    id: "alpha10",
    category: "binaural",
    type: ["binaural", "breathing"],
    sessions: [
      { id: "calma",       priority: 1 },
      { id: "conexion",    priority: 2 },
      { id: "meditacion",  priority: 2 },
      { id: "creatividad", priority: 3 }
    ],
    scientificLevel: "validated",
    color: "#50b4c8",

    name: { es: "Alpha 10 Hz — Coherencia", en: "Alpha 10 Hz — Coherence", fr: "Alpha 10 Hz — Cohérence", pt: "Alpha 10 Hz — Coerência" },
    description: {
      es: "Coherencia Cardíaca",
      en: "Heart Coherence",
      fr: "Cohérence Cardiaque",
      pt: "Coerência Cardíaca"
    },
    longDescription: {
          es: "El preset más validado científicamente del sistema. La respiración a 6 rpm (0.1 Hz) activa la Arritmia Sinusal Respiratoria (RSA), sincronizando el ciclo cardíaco con el respiratorio. Esta sincronía maximiza la Variabilidad de la Frecuencia Cardíaca (HRV), indicador principal de resiliencia del sistema nervioso autónomo. El beat binaural de 10 Hz (alpha medio) refuerza el estado de calma alerta validado por HeartMath Institute. Sin retenciones — el ciclo fluido 5s-5s es el estándar clínico.",
          en: "The most scientifically validated preset in the system. Breathing at 6 rpm (0.1 Hz) activates Respiratory Sinus Arrhythmia (RSA), synchronizing the cardiac and respiratory cycles. This synchrony maximizes Heart Rate Variability (HRV), the primary indicator of autonomic nervous system resilience. The 10 Hz binaural beat (mid-alpha) reinforces the calm-alert state validated by the HeartMath Institute. No retentions — the smooth 5s-5s cycle is the clinical standard.",
          fr: "Le préréglage le plus validé scientifiquement du système. Une respiration à 6 cycles par minute (0,1 Hz) active l&#39;arythmie sinusale respiratoire (ASR), synchronisant les cycles cardiaque et respiratoire. Cette synchronisation maximise la variabilité de la fréquence cardiaque (VFC), principal indicateur de la résilience du système nerveux autonome. Le battement binaural à 10 Hz (alpha moyen) renforce l&#39;état de calme-vigilance validé par l&#39;Institut HeartMath. Aucune rétention : le cycle régulier de 5 secondes à 5 secondes est la norme clinique.",
          pt: "A configuração predefinida mais validada cientificamente no sistema. A respiração a 6 rpm (0,1 Hz) ativa a Arritmia Sinusal Respiratória (ASR), sincronizando os ciclos cardíaco e respiratório. Essa sincronia maximiza a Variabilidade da Frequência Cardíaca (VFC), o principal indicador da resiliência do sistema nervoso autônomo. A batida binaural de 10 Hz (alfa médio) reforça o estado de calma e alerta validado pelo Instituto HeartMath. Sem retenções — o ciclo suave de 5s-5s é o padrão clínico.",
          zh: "系统中经过科学验证的预设模式。以每分钟 6 转（0.1 赫兹）的频率呼吸可激活呼吸性窦性心律失常 (RSA)，使心率和呼吸周期同步。这种同步性可最大限度地提高心率变异性 (HRV)，这是自主神经系统恢复能力的主要指标。10 赫兹双耳节拍（中频 α 波）可强化经心率研究所验证的平静警觉状态。无任何保留——平滑的 5 秒-5 秒循环是临床标准。",
          hi: "सिस्टम में सबसे वैज्ञानिक रूप से प्रमाणित प्रीसेट। 6 आरपीएम (0.1 हर्ट्ज़) पर सांस लेने से रेस्पिरेटरी साइनस एरिथमिया (आरएसए) सक्रिय हो जाता है, जिससे हृदय और श्वसन चक्र सिंक्रनाइज़ हो जाते हैं। यह सिंक्रनाइज़ेशन हृदय गति परिवर्तनशीलता (एचआरवी) को अधिकतम करता है, जो स्वायत्त तंत्रिका तं��्र की मजबूती का प्राथमिक संकेतक है। 10 हर्ट्ज़ बाइनॉरल बीट (मिड-अल्फा) हार्टमैथ इंस्टीट्यूट द्वारा प्रमाणित शांत-सतर्क अवस्था को सुदृढ़ करता है। कोई रिटेंशन नहीं - सुचारू 5 सेकंड-5 सेकंड का चक्र नैदानिक मानक है।"
        },

    audio: {
      binaural: true,
      beat: 10,
      carrier: 250,
      perception: {
        optimal: { min: 200, max: 380 },
        degradation: {
          es: "10 Hz es el beat más 'fácil' de percibir para el sistema auditivo porque cae en el centro de la respuesta de amplitud del córtex auditivo. Carriers entre 200–380 Hz ofrecen percepción óptima. Por debajo de 180 Hz el beat puede sentirse apagado. Por encima de 450 Hz con 10 Hz de diferencia, algunos oídos lo perciben como dos tonos separados.",
          en: "10 Hz is the 'easiest' beat for the auditory system to perceive because it falls at the center of the auditory cortex amplitude response. Carriers between 200–380 Hz offer optimal perception. Below 180 Hz the beat can feel muffled. Above 450 Hz with 10 Hz difference, some ears perceive it as two separate tones.",
          fr: "Le rythme à 10 Hz est le plus facile à percevoir pour le système auditif, car il se situe au centre de la réponse en amplitude du cortex auditif. Les fréquences porteuses comprises entre 200 et 380 Hz offrent une perception optimale. En dessous de 180 Hz, le rythme peut sembler étouffé. Au-dessus de 450 Hz, avec une différence de 10 Hz, certaines oreilles perçoivent le rythme comme deux sons distincts.",
          pt: "10 Hz é a frequência mais fácil de ser percebida pelo sistema auditivo, pois se encontra no centro da resposta de amplitude do córtex auditivo. Frequências portadoras entre 200 e 380 Hz oferecem percepção ideal. Abaixo de 180 Hz, a frequência pode parecer abafada. Acima de 450 Hz, com uma diferença de 10 Hz, algumas pessoas a percebem como dois tons distintos.",
          zh: "10 Hz 是听觉系统最容易感知的节拍频率，因为它位于听觉皮层振幅响应的中心。200-380 Hz 之间的载波频率能提供最佳的感知效果。低于 180 Hz 时，节拍会感觉比较闷。高于 450 Hz 且频率差为 10 Hz 时，有些人的耳朵会将其感知为两个独立的音调。",
          hi: "10 हर्ट्ज़ की आवृत्ति श्रवण तंत्र के लिए सबसे आसानी से समझ में आने वाली ध्वनि है क्योंकि यह श्रवण प्रांतस्था की आयाम प्रतिक्रिया के केंद्र में स्थित होती है। 200-380 हर्ट्ज़ के बीच की आवृत्तियाँ सर्वोत्तम अनुभूति प्रदान करती हैं। 180 हर्ट्ज़ से नीचे की आवृत्तियाँ अस्पष्ट सुनाई दे सकती हैं। 450 हर्ट्ज़ से ऊपर, 10 हर्ट्ज़ के अंतर के साथ, कुछ कान इसे दो अलग-अलग स्वरों के रूप में समझते हैं।"
        },
        why: {
          es: "La banda alpha (8–12 Hz) coincide con la mayor sensibilidad del sistema de resonancia neural del córtex auditivo. Esto hace que los beats en este rango sean los más fácilmente percibidos y los que generan mayor respuesta en el EEG en estudios de laboratorio.",
          en: "The alpha band (8–12 Hz) coincides with the highest sensitivity of the auditory cortex neural resonance system. This makes beats in this range the most easily perceived and the ones generating the greatest EEG response in laboratory studies.",
          fr: "La bande alpha (8–12 Hz) correspond à la sensibilité maximale du système de résonance neuronale du cortex auditif. C’est pourquoi les battements dans cette gamme sont les plus facilement perçus et ceux qui génèrent la plus grande réponse EEG lors d’études en laboratoire.",
          pt: "A banda alfa (8–12 Hz) coincide com a maior sensibilidade do sistema de ressonância neural do córtex auditivo. Isso faz com que os batimentos nessa faixa sejam os mais facilmente percebidos e os que geram a maior resposta no EEG em estudos de laboratório.",
          zh: "α波段（8-12 Hz）与听觉皮层神经共振系统的最高敏感度相吻合。这使得该波段的节拍最容易被感知，并且在实验室研究中能产生最强的脑电图反应。",
          hi: "अल्फा बैंड (8-12 हर्ट्ज़) श्रवण प्रांतस्था तंत्रिका अनुनाद प्रणाली की उच्चतम संवेदनशीलता के साथ मेल खाता है। इसी कारण इस श्रेणी में आने वाली ध्वनियाँ सबसे आसानी से पहचानी जा सकती हैं और प्रयोगशाला अध्ययनों में सबसे अधिक ईईजी प्रतिक्रिया उत्पन्न करती हैं।"
        }
      }
    },

    breathing: {
      pattern: "coherencia",
      bpm: 6,
      ratio: 1.0,
      holdFull: 0,
      holdEmpty: 0
    },

    tuning: {
      audio: {
        beat: {
          min: 8, max: 12, step: 0.5,
          lower: {
          es: "8–9 Hz: alpha profundo, más relajado, borde theta. Mayor relajación pero menos coherencia cardíaca precisa.",
          en: "8–9 Hz: deep alpha, more relaxed, theta border. Greater relaxation but less precise heart coherence.",
          fr: "8–9 Hz : ondes alpha profondes, plus détendues, limite thêta. Relaxation accrue mais cohérence cardiaque moins précise.",
          pt: "8–9 Hz: alfa profundo, mais relaxado, limite teta. Maior relaxamento, mas menor precisão na coerência cardíaca.",
          zh: "8–9 Hz：深度α波，更放松，接近θ波的交界处。放松程度更高，但心率同步性较差。",
          hi: "8–9 हर्ट्ज़: गहरा अल्फा, अधिक आरामदेह, थीटा सीमा। अधिक आराम लेकिन हृदय की संगति में कम सटीकता।"
        },
          higher: {
          es: "11–12 Hz: alpha alto. Atención suave sostenida. Bueno para lecturas meditativas o trabajo introspectivo.",
          en: "11–12 Hz: high alpha. Sustained gentle attention. Good for meditative reading or introspective work.",
          fr: "11–12 Hz : fréquences alpha élevées. Attention douce et soutenue. Idéal pour la lecture méditative ou le travail introspectif.",
          pt: "11–12 Hz: frequência alfa alta. Atenção suave e sustentada. Boa para leitura meditativa ou trabalho introspectivo.",
          zh: "11-12赫兹：高频α波。持续轻柔的注意力。适合冥想式阅读或内省式工作。",
          hi: "11–12 हर्ट्ज़: उच्च अल्फा आवृत्ति। निरंतर और सौम्य ध्यान। ध्यानमग्न पठन या आत्मनिरीक्षण के लिए उपयुक्त।"
        }
        },
        carrier: {
          min: 200, max: 380, step: 10,
          lower: {
          es: "200–230 Hz: más oscuro, más relajante. Si quieres coherencia con calma profunda.",
          en: "200–230 Hz: darker, more relaxing. If you want coherence with deep calm.",
          fr: "200–230 Hz : plus sombre, plus relaxant. Idéal pour une ambiance cohérente et un calme profond.",
          pt: "200–230 Hz: mais escuro, mais relaxante. Ideal para quem busca coerência com profunda calma.",
          zh: "200–230赫兹：更柔和、更放松。如果您想要与深沉平静相协调。",
          hi: "200–230 हर्ट्ज़: अधिक गंभीर और सुकून देने वाला। अगर आप गहरी शांति के साथ सामंजस्य चाहते हैं।"
        },
          higher: {
          es: "300–380 Hz: más brillante, beat más perceptible. Si tu oído no 'engancha' el beat a 250 Hz, sube el carrier.",
          en: "300–380 Hz: brighter, more perceptible beat. If your ear doesn't 'lock' the beat at 250 Hz, raise the carrier.",
          fr: "300–380 Hz : battement plus clair et plus perceptible. Si votre oreille ne perçoit pas le battement à 250 Hz, augmentez le niveau du signal porteur.",
          pt: "300–380 Hz: batimento mais brilhante e perceptível. Se seu ouvido não conseguir identificar o batimento em 250 Hz, aumente a frequência da portadora.",
          zh: "300–380 Hz：更明亮、更容易察觉的节拍。如果你的耳朵在 250 Hz 时无法“锁定”节拍，请提高载波频率。",
          hi: "300–380 हर्ट्ज़: अधिक स्पष्ट और आसानी से सुनाई देने वाली लय। यदि आपका कान 250 हर्ट्ज़ पर लय को ठीक से नहीं पहचान पाता है, तो आवृत्ति बढ़ाएँ।"
        }
        }
      },
      breathing: {
        bpm: {
          min: 4.5, max: 7, step: 0.5,
          lower: {
          es: "5–5.5 rpm: más lento, potencia parasimpático. Coherencia cardíaca menos precisa pero más relajante.",
          en: "5–5.5 rpm: slower, deepens parasympathetic. Less precise heart coherence but more relaxing.",
          fr: "5–5,5 tr/min : rythme plus lent, stimulation parasympathique plus profonde. Cohérence cardiaque moins précise, mais relaxation accrue.",
          pt: "5–5,5 rpm: mais lento, intensifica a atividade parassimpática. Menos coerência cardíaca precisa, porém mais relaxante.",
          zh: "5-5.5 转/分：心率减慢，副交感神经活动增强。心率协调性降低，但更令人放松。",
          hi: "5–5.5 आरपीएम: धीमी गति, पैरासिम्पेथेटिक तंत्रिका तंत्र को गहरा करती है। हृदय की गति में सटीकता कम होती है लेकिन अधिक आराम मिलता है।"
        },
          higher: {
          es: "6.5–7 rpm: zona de coherencia cardíaca alta. Más beta-relajado. Para momentos donde necesitas calma sin somnolencia.",
          en: "6.5–7 rpm: high heart coherence zone. More relaxed-beta. For moments needing calm without drowsiness.",
          fr: "6,5–7 tr/min : zone de forte cohérence cardiaque. Fréquence bêta plus détendue. Pour les moments de calme sans somnolence.",
          pt: "6,5–7 rpm: zona de alta coerência cardíaca. Beta mais relaxado. Para momentos que exigem calma sem sonolência.",
          zh: "6.5–7 转/分：心率同步性高的区域。更放松的β波。适合需要平静但又不想犯困的时刻。",
          hi: "6.5–7 आरपीएम: उच्च हृदय सामंजस्य क्षेत्र। अधिक आरामदेह बीटा अवस्था। उन क्षणों के लिए जब आपको उनींदापन के बिना शांति की आवश्यकता हो।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Calor perceptible en el centro del pecho (no el corazón, el campo cardíaco)",
          "Respiración que se vuelve automática — dejas de 'guiarla'",
          "Sensación de que el corazón late de forma regular y espaciosa",
          "Calma sin somnolencia: alerta tranquila y estable"
        ],
        en: [
          "Perceptible warmth in the center of the chest (not the heart, the cardiac field)",
          "Breathing becomes automatic — you stop 'guiding' it",
          "Heart rate felt as regular and spacious",
          "Calm without drowsiness: tranquil and stable alertness"
        ]
      },
      adjust: {
          es: "Si no sientes el calor en el pecho después de 3 min: baja el bpm a 5.5. Si la respiración se siente forzada: activa la exhale más larga (ratio 0.8). Si el beat binaural te resulta difícil de sentir: sube el carrier 30 Hz.",
          en: "If you don't feel chest warmth after 3 min: lower bpm to 5.5. If breathing feels forced: activate longer exhale (ratio 0.8). If the binaural beat is hard to feel: raise carrier by 30 Hz.",
          fr: "Si vous ne ressentez pas de chaleur dans la poitrine après 3 minutes : réduisez le rythme cardiaque à 5,5. Si votre respiration est difficile : allongez l’expiration (ratio 0,8). Si le battement binaural est difficile à percevoir : augmentez la fréquence porteuse de 30 Hz.",
          pt: "Se você não sentir aquecimento no peito após 3 minutos: diminua a frequência cardíaca para 5,5 bpm. Se a respiração parecer forçada: ative uma expiração mais longa (proporção de 0,8). Se a batida binaural for difícil de sentir: aumente a frequência portadora em 30 Hz.",
          zh: "如果3分钟后仍未感觉到胸口发热：将心率降至5.5。如果呼吸感觉吃力：延长呼气时间（呼气/呼气比0.8）。如果难以感受到双耳节拍：将载波频率提高30赫兹。",
          hi: "यदि 3 मिनट के बाद भी सीने में गर्माहट महसूस न हो, तो धड़कन की दर को 5.5 तक कम करें। यदि सांस लेने में कठिनाई हो, तो सांस छोड़ने की अवधि बढ़ाएं (अनुपात 0.8)। यदि दोनों कानों की धड़कन को महसूस करना मुश्किल हो, तो वाहक ध्वनि को 30 हर्ट्ज़ बढ़ाएं।"
        },
      unexpected: {
          es: "Impulso de suspirar: señal excelente. El suspiro es el mecanismo natural de reset del SNA. No lo suprimas.",
          en: "Urge to sigh: excellent signal. Sighing is the ANS's natural reset mechanism. Don't suppress it.",
          fr: "Envie de soupirer : excellent signe. Le soupir est le mécanisme de réinitialisation naturel du système nerveux autonome. Ne le réprimez pas.",
          pt: "Vontade de suspirar: excelente sinal. Suspirar é o mecanismo natural de reinicialização do SNA (Sistema Nervoso Autônomo). Não reprima esse suspiro.",
          zh: "想叹气：这是个好信号。叹气是自主神经系统的自然重置机制，不要抑制它。",
          hi: "आह भरने की इच्छा: एक बेहतरीन संकेत। आह भरना तंत्रिका तंत्र का प्राकृतिक रीसेट तंत्र है। इसे दबाएँ नहीं।"
        },
      stop: {
          es: "No tiene contraindicaciones agudas. Si aparece ansiedad al sintonizar el latido cardíaco: cambia a respiración con ojos abiertos.",
          en: "No acute contraindications. If anxiety appears when tuning into the heartbeat: switch to breathing with eyes open.",
          fr: "Aucune contre-indication aiguë. En cas d&#39;anxiété lors de l&#39;écoute du rythme cardiaque : passer à la respiration les yeux ouverts.",
          pt: "Não há contraindicações agudas. Se surgir ansiedade ao sintonizar-se com os batimentos cardíacos: passe a respirar com os olhos abertos.",
          zh: "无急性禁忌症。如果在聆听心跳时出现焦虑：改为睁眼呼吸。",
          hi: "कोई गंभीर दुष्प्रभाव नहीं हैं। यदि हृदय गति पर ध्यान केंद्रित करते समय घबराहट महसूस हो, तो आंखें खोलकर सांस लेने का अभ्यास करें।"
        }
    },

    guide: {
      when: {
          es: "Cualquier momento. Es el preset de entrada ideal para la mayoría de usuarios y objetivos. Mañana para empezar el día, tarde como reset, noche para bajar de activación.",
          en: "Any time. It's the ideal entry preset for most users and objectives. Morning to start the day, afternoon as reset, evening to lower activation.",
          fr: "À tout moment. C&#39;est le préréglage idéal pour la plupart des utilisateurs et des objectifs. Le matin pour bien démarrer la journée, l&#39;après-midi pour une réinitialisation, le soir pour une activation réduite.",
          pt: "A qualquer hora. É a configuração inicial ideal para a maioria dos usuários e objetivos. De manhã para começar o dia, à tarde para redefinir e à noite para diminuir a ativação.",
          zh: "任何时间都适用。对于大多数用户和各种目标而言，这都是理想的初始预设模式。早上开启新的一天，下午重置状态，晚上降低活跃度。",
          hi: "किसी भी समय। यह अधिकांश उपयोगकर्ताओं और उद्देश्यों के लिए आदर्श एंट्री प्रीसेट है। दिन की शुरुआत के लिए सुबह, दोपहर में रीसेट के लिए, और शाम को एक्टिवेशन लेवल कम करने के लिए।"
        },
      duration: { min: 5, recommended: 15, max: 30 },
      sequence: {
          es: "Puede ir antes de cualquier otro preset. Si vienes de Beta o Gamma, úsalo 5 min como transición. Es el puente universal del sistema.",
          en: "Can precede any other preset. Coming from Beta or Gamma, use it 5 min as a transition. It's the system's universal bridge.",
          fr: "Peut précéder n&#39;importe quel autre préréglage. En provenance de Beta ou Gamma, utilisez-le comme transition de 5 minutes. C&#39;est le pont universel du système.",
          pt: "Pode ser usado antes de qualquer outra predefinição. Vindo do Beta ou Gamma, use-o por 5 minutos como uma transição. É a ponte universal do sistema.",
          zh: "可置于任何其他预设之前。从 Beta 或 Gamma 模式切换过来时，请使用 5 分钟作为过渡。它是系统的通用过渡模式。",
          hi: "इसे किसी भी अन्य प्रीसेट से पहले इस्तेमाल किया जा सकता है। बीटा या गामा से आने पर, इसे 5 मिनट के ट्रांज़िशन के रूप में उपयोग करें। यह सिस्टम का यूनिवर्सल ब्रिज है।"
        },
      contraindications: {
          es: "Ninguna conocida.",
          en: "None known.",
          fr: "Aucun connu.",
          pt: "Nenhuma conhecida.",
          zh: "目前尚无已知信息。",
          hi: "कोई ज्ञात नहीं।"
        }
    },

    tags: ["HRV", "HeartMath", "coherencia", "coherence", "RSA", "vagal", "validated", "beginners", "alpha"]
  },


  {
    id: "alpha8",
    category: "binaural",
    type: ["binaural", "breathing"],
    sessions: [
      { id: "creatividad", priority: 1 },
      { id: "calma",       priority: 3 },
      { id: "foco",        priority: 4 }
    ],
    scientificLevel: "emerging",
    color: "#50b4c8",

    name: { es: "Alpha 8 Hz — Flujo", en: "Alpha 8 Hz — Flow", fr: "Alpha 8 Hz — Flux", pt: "Alpha 8 Hz — Fluxo" },
    description: {
      es: "Creatividad & Flow",
      en: "Creativity & Flow",
      fr: "Créativité & Flux",
      pt: "Criatividade & Fluxo"
    },
    longDescription: {
          es: "Alpha bajo (8 Hz) es el estado mental del flow creativo: las conexiones entre ideas no relacionadas ocurren con naturalidad, la autocrítica se suspende y el tiempo subjetivo se comprime. El carrier más alto (300 Hz) da un carácter más 'vivo' al binaural sin perder el rango alpha. La retención vacía corta (2s) genera una micropausa de CO₂ que suaviza la mente sin adormecer el proceso creativo.",
          en: "Low alpha (8 Hz) is the mental state of creative flow: connections between unrelated ideas occur naturally, self-criticism is suspended and subjective time compresses. The higher carrier (300 Hz) gives a more 'alive' character to the binaural without leaving the alpha range. The short empty retention (2s) generates a CO₂ micro-pause that softens the mind without dulling the creative process.",
          fr: "Les basses fréquences alpha (8 Hz) correspondent à l&#39;état mental de flux créatif : des liens entre des idées apparemment sans rapport se tissent naturellement, l&#39;autocritique est suspendue et la perception subjective du temps se comprime. La fréquence porteuse plus élevée (300 Hz) confère un caractère plus dynamique au stimulus binaural sans pour autant sortir de la gamme alpha. La brève pause (2 s) génère une micro-pause CO₂ qui apaise l&#39;esprit sans freiner le processus créatif.",
          pt: "A frequência alfa baixa (8 Hz) representa o estado mental do fluxo criativo: conexões entre ideias aparentemente desconexas ocorrem naturalmente, a autocrítica é suspensa e o tempo subjetivo se comprime. A frequência portadora mais alta (300 Hz) confere um caráter mais &quot;vivo&quot; ao som binaural sem sair da faixa alfa. A breve retenção vazia (2 s) gera uma micropausa de CO₂ que acalma a mente sem prejudicar o processo criativo.",
          zh: "低频α波（8赫兹）是创意迸发时的精神状态：看似无关的想法之间自然而然地产生联系，自我批评被抑制，主观时间感也随之压缩。高频载波（300赫兹）赋予双耳节拍更“鲜活”的特质，同时又不脱离α波范围。短暂的空声保持（2秒）产生二氧化碳微停顿，使大脑放松，但又不至于抑制创作过程。",
          hi: "कम अल्फा (8 हर्ट्ज़) रचनात्मक प्रवाह की मानसिक अवस्था है: असंबंधित विचारों के बीच सहज संबंध स्थापित होते हैं, आत्म-आलोचना निलंबित हो जाती है और व्यक्तिपरक समय संकुचित हो जाता है। उच्च वाहक (300 हर्ट्ज़) अल्फा रेंज से बाहर निकले बिना बाइनॉरल को अधिक &#39;जीवंत&#39; बनाता है। संक्षिप्त खाली ठहरा�� (2 सेकंड) एक सूक्ष्म CO₂ विराम उत्पन्न करता है जो रचनात्मक प्रक्रिया को मंद किए बिना मन को शांत करता है।"
        },

    audio: {
      binaural: true,
      beat: 8,
      carrier: 300,
      perception: {
        optimal: { min: 220, max: 420 },
        degradation: {
          es: "Con beat de 8 Hz, el carrier 300 Hz ofrece el mejor balance entre percepción clara y carácter sonoro cálido. Por debajo de 200 Hz el beat puede sentirse 'pesado'. Por encima de 450 Hz el beat puede confundirse con un leve temblor en el tono.",
          en: "With an 8 Hz beat, the 300 Hz carrier offers the best balance between clear perception and warm sonic character. Below 200 Hz the beat can feel 'heavy'. Above 450 Hz the beat can be confused with a slight tone wobble.",
          fr: "Avec un battement de 8 Hz, la porteuse à 300 Hz offre le meilleur compromis entre clarté et chaleur sonore. En dessous de 200 Hz, le battement peut paraître lourd. Au-dessus de 450 Hz, il peut être confondu avec une légère oscillation de la tonalité.",
          pt: "Com uma frequência de 8 Hz, a portadora de 300 Hz oferece o melhor equilíbrio entre percepção clara e um timbre quente. Abaixo de 200 Hz, a frequência pode parecer &quot;pesada&quot;. Acima de 450 Hz, a frequência pode ser confundida com uma leve oscilação tonal.",
          zh: "8赫兹的节拍频率配合300赫兹的载波频率，在清晰的听感和温暖的音色之间实现了最佳平衡。低于200赫兹时，节拍会感觉“沉重”。高于450赫兹时，节拍可能会与轻微的音调波动混淆。",
          hi: "8 हर्ट्ज़ की बीट के साथ, 300 हर्ट्ज़ कैरियर स्पष्ट ध्वनि बोध और मधुर ध्वनि चरित्र के बीच सर्वोत्तम संतुलन प्रदान करता है। 200 हर्ट्ज़ से नीचे बीट थोड़ी भारी लग सकती है। 450 हर्ट्ज़ से ऊपर बीट को ध्वनि में हल्की सी अस्थिरता के साथ भ्रमित किया जा सकता है।"
        },
        why: {
          es: "El alpha bajo (8 Hz) se asocia con mayor actividad en el hemisferio derecho, ligado a la creatividad. El carrier 300 Hz (rango medio de la voz humana femenina) genera una resonancia que algunos estudios asocian con mayor activación del área de Broca — zona del lenguaje creativo.",
          en: "Low alpha (8 Hz) is associated with greater right hemisphere activity, linked to creativity. The 300 Hz carrier (mid-range of the female human voice) generates a resonance some studies associate with greater activation of Broca's area — the creative language zone.",
          fr: "Les basses fréquences alpha (8 Hz) sont associées à une activité accrue de l&#39;hémisphère droit, liée à la créativité. La fréquence porteuse de 300 Hz (dans la gamme moyenne de la voix féminine) génère une résonance que certaines études associent à une activation plus importante de l&#39;aire de Broca, la zone du langage créatif.",
          pt: "A frequência alfa baixa (8 Hz) está associada a uma maior atividade no hemisfério direito, ligada à criatividade. A portadora de 300 Hz (faixa média da voz feminina) gera uma ressonância que alguns estudos associam a uma maior ativação da área de Broca — a zona da linguagem criativa.",
          zh: "低频α波（8赫兹）与右脑半球活动增强相关，而右脑半球活动与创造力密切相关。300赫兹的载波频率（女性人声的中频范围）会产生一种共振，一些研究表明这种共振与布罗卡区（负责语言创造力的区域）的激活增强有关。",
          hi: "कम अल्फा (8 हर्ट्ज़) दाहिने गोलार्ध की अधिक गतिविधि से जुड़ा है, जो रचनात्मकता से संबंधित है। 300 हर्ट्ज़ की वाहक आवृत्ति (महिला की आवाज की मध्य-श्रेणी) एक अनुनाद उत्पन्न करती है जिसे कुछ अध्ययनों में ब्रोका क्षेत्र - रचनात्मक भाषा क्षेत्र - की अधिक सक्रियता से जोड़ा गया है।"
        }
      }
    },

    breathing: {
      pattern: "coherencia",
      bpm: 6,
      ratio: 1.0,
      holdFull: 0,
      holdEmpty: 2
    },

    tuning: {
      audio: {
        beat: {
          min: 7, max: 10, step: 0.5,
          lower: {
          es: "7–7.5 Hz: alpha profundo, casi theta. Ideal para escritura de ficción o arte libre donde el control consciente estorba.",
          en: "7–7.5 Hz: deep alpha, near theta. Ideal for fiction writing or free art where conscious control interferes.",
          fr: "7–7,5 Hz : ondes alpha profondes, proches des ondes thêta. Idéal pour l’écriture de fiction ou la création artistique libre où le contrôle conscient intervient.",
          pt: "7–7,5 Hz: alfa profundo, próximo de teta. Ideal para escrita de ficção ou arte livre onde o controle consciente interfere.",
          zh: "7–7.5 赫兹：深度α波，接近θ波。非常适合小说创作或自由艺术创作，因为这类创作中意识控制会受到干扰。",
          hi: "7–7.5 हर्ट्ज़: डीप अल्फा, नियर थीटा। कथा लेखन या मुक्त कला के लिए आदर्श, जहाँ सचेत नियंत्रण बाधा उत्पन्न करता है।"
        },
          higher: {
          es: "9–10 Hz: más activo, pensamiento lateral rápido. Para trabajo creativo con deadline o brainstorming estructurado.",
          en: "9–10 Hz: more active, fast lateral thinking. For creative work with deadlines or structured brainstorming.",
          fr: "9–10 Hz : pensée latérale plus active et rapide. Idéal pour les travaux créatifs avec des échéances ou les séances de brainstorming structurées.",
          pt: "9–10 Hz: pensamento lateral mais ativo e rápido. Ideal para trabalhos criativos com prazos ou sessões de brainstorming estruturadas.",
          zh: "9-10赫兹：思维更活跃、更敏捷，适合进行横向思考。适用于有截止日期的创意工作或结构化的头脑风暴。",
          hi: "9-10 हर्ट्ज़: अधिक सक्रिय, तीव्र और रचनात्मक सोच। समय सीमा वाले रचनात्मक कार्यों या सुनियोजित विचार-मंथन के लिए उपयुक्त।"
        }
        },
        carrier: {
          min: 220, max: 420, step: 10,
          lower: {
          es: "220–260 Hz: más introspectivo. Para creatividad contemplativa, poesía, diseño de espacio interior.",
          en: "220–260 Hz: more introspective. For contemplative creativity, poetry, interior space design.",
          fr: "220–260 Hz : plus introspectif. Pour la créativité contemplative, la poésie, la décoration intérieure.",
          pt: "220–260 Hz: mais introspectivo. Ideal para criatividade contemplativa, poesia e design de interiores.",
          zh: "220–260 赫兹：更偏向内省。适合沉思冥想式的创作、诗歌创作和室内空间设计。",
          hi: "220–260 हर्ट्ज़: अधिक आत्मनिरीक्षण के लिए उपयुक्त। चिंतनशील रचनात्मकता, कविता और आंतरिक सज्जा के लिए।"
        },
          higher: {
          es: "360–420 Hz: más energético y presente. Para música, performance, escritura rápida. Máximo 420 Hz para mantener el beat perceptible como pulso.",
          en: "360–420 Hz: more energetic and present. For music, performance, fast writing. Maximum 420 Hz to keep the beat perceptible as a pulse.",
          fr: "360–420 Hz : plus énergique et présent. Pour la musique, le jeu d’acteur, l’écriture rapide. Maximum 420 Hz pour que le rythme reste perceptible comme une pulsation.",
          pt: "360–420 Hz: mais energético e presente. Para música, performance e escrita rápida. Máximo de 420 Hz para manter a pulsação perceptível.",
          zh: "360–420 Hz：更具活力和冲击力。适用于音乐、表演和快速写作。最高频率为 420 Hz，以保持节拍清晰可辨，如同脉搏一般。",
          hi: "360–420 हर्ट्ज़: अधिक ऊर्जावान और जीवंत। संगीत, प्रदर्शन और तीव्र लेखन के लिए उपयुक्त। ताल को स्पंदन के रूप में महसूस करने योग्य बनाए रखने के लिए अधिकतम 420 हर्ट्ज़।"
        }
        }
      },
      breathing: {
        holdEmpty: {
          min: 0, max: 5, step: 1,
          lower: {
          es: "0s: flujo continuo. Mejor para no interrumpir el stream de ideas. Elige 0s si estás en un momento de producción activa.",
          en: "0s: continuous flow. Best for not interrupting the idea stream. Choose 0s if in a moment of active production.",
          fr: "0s : flux continu. Idéal pour ne pas interrompre le flot d’idées. Choisissez 0s en pleine production.",
          pt: "0s: fluxo contínuo. Ideal para não interromper o fluxo de ideias. Escolha 0s se estiver em um momento de produção ativa.",
          zh: "0 秒：连续流动。最适合不中断思路的情况。如果正处于高效创作阶段，请选择 0 秒。",
          hi: "0s: निरंतर प्रवाह। विचारों के प्रवाह को बाधित न करने के लिए सर्वोत्तम। सक्रिय उत्पादन के क्षण में 0s चुनें।"
        },
          higher: {
          es: "3–5s: pausa que resetea el ciclo mental. Útil para transitar entre bloques creativos o si la mente se satura.",
          en: "3–5s: pause that resets the mental cycle. Useful for transitioning between creative blocks or if the mind saturates.",
          fr: "3 à 5 secondes : pause permettant de réinitialiser le cycle mental. Utile pour surmonter les blocages créatifs ou en cas de saturation mentale.",
          pt: "3–5 segundos: pausa que reinicia o ciclo mental. Útil para transições entre bloqueios criativos ou quando a mente está saturada.",
          zh: "3-5秒：暂停，重置思维循环。有助于在创作瓶颈期之间转换思路，或者当思维饱和时使用。",
          hi: "3-5 सेकंड का विराम: यह मानसिक चक्र को रीसेट करता है। रचनात्मक अवरोधों से उबरने या मन के अत्यधिक विचारों से भर जाने पर यह उपयोगी होता है।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Aparición espontánea de ideas o imágenes sin buscarlas",
          "El tiempo 'se comprime' — 20 min se sienten como 5",
          "Facilidad para conectar conceptos no relacionados",
          "Ausencia de autocrítica: lo que sale, sale — sin filtro"
        ],
        en: [
          "Spontaneous appearance of ideas or images without seeking them",
          "Time 'compresses' — 20 min feels like 5",
          "Ease connecting unrelated concepts",
          "Absence of self-criticism: what comes out, comes out — no filter"
        ]
      },
      adjust: {
          es: "Si la mente divaga sin producir nada útil: sube el beat a 9 Hz. Si estás demasiado tenso para fluir: baja a 7.5 Hz y activa exhale más larga (ratio 0.8). El flow es un estado de alta receptividad, no de esfuerzo — si te esfuerzas, algo está mal calibrado.",
          en: "If the mind wanders without producing anything useful: raise beat to 9 Hz. If too tense to flow: lower to 7.5 Hz and activate longer exhale (ratio 0.8). Flow is a state of high receptivity, not effort — if you're making effort, something is miscalibrated.",
          fr: "Si l&#39;esprit vagabonde sans rien produire d&#39;utile : augmentez la fréquence cardiaque à 9 Hz. Si la tension est trop forte pour permettre à votre esprit de se laisser aller : diminuez-la à 7,5 Hz et activez une expiration plus longue (ratio 0,8). L&#39;état de flow est un état de grande réceptivité, non d&#39;effort ; si vous faites un effort, c&#39;est qu&#39;il y a un problème de réglage.",
          pt: "Se a mente divagar sem produzir nada útil: aumente a frequência cardíaca para 9 Hz. Se estiver muito tenso para fluir: diminua para 7,5 Hz e ative uma expiração mais longa (proporção de 0,8). O estado de fluxo é um estado de alta receptividade, não de esforço — se você está fazendo esforço, algo está desregulado.",
          zh: "如果思绪游离，无法产生任何有用的信息：将节拍提高到 9 赫兹。如果感觉过于紧张而无法流畅进行：将节拍降低到 7.5 赫兹，并延长呼气时间（呼气/呼吸比 0.8）。流畅是一种高度接纳的状态，而非刻意努力——如果你需要刻意努力，那就说明某些环节出了问题。",
          hi: "यदि मन बिना किसी उपयोगी विचार के भटकता रहे: लय को 9 हर्ट्ज़ तक बढ़ाएँ। यदि तनाव के कारण प्रवाह न हो पा रहा हो: लय को 7.5 हर्ट्ज़ तक कम करें और साँस छोड़ने की अवधि बढ़ाएँ (अनुपात 0.8)। प्रवाह उच्च ग्रहणशीलता की अवस्था है, प्रयास की नहीं – यदि आप प्रयास कर रहे हैं, तो कुछ गड़बड़ है।"
        },
      unexpected: {
          es: "Distracción inicial los primeros 3–5 min: normal. El estado alpha 8 Hz necesita un período de 'soltar el control' antes de estabilizarse.",
          en: "Initial distraction in the first 3–5 min: normal. The alpha 8 Hz state needs a 'releasing control' period before stabilizing.",
          fr: "Distraction initiale durant les 3 à 5 premières minutes : normale. L’état alpha à 8 Hz nécessite une période de « relâchement du contrôle » avant de se stabiliser.",
          pt: "Distração inicial nos primeiros 3 a 5 minutos: normal. O estado alfa de 8 Hz precisa de um período de &quot;liberação do controle&quot; antes de se estabilizar.",
          zh: "最初3-5分钟的注意力分散是正常的。8赫兹的α波状态需要一个“释放控制”期才能稳定下来。",
          hi: "शुरुआती 3-5 मिनट में ध्यान भटकना सामान्य है। अल्फा 8 हर्ट्ज़ अवस्था को स्थिर होने से पहले &#39;नियंत्रण छोड़ने&#39; की अवधि की आवश्यकता होती है।"
        },
      stop: {
          es: "Sin contraindicaciones agudas. Si el binaural te genera ansiedad: baja el volumen o cambia al carrier más oscuro.",
          en: "No acute contraindications. If the binaural generates anxiety: lower volume or switch to the darker carrier.",
          fr: "Aucune contre-indication aiguë. Si le son binaural génère de l&#39;anxiété : baissez le volume ou passez à une porteuse plus sombre.",
          pt: "Não há contraindicações agudas. Se o áudio binaural gerar ansiedade: diminua o volume ou mude para a portadora mais escura.",
          zh: "无急性禁忌症。如果双耳节拍引起焦虑：降低音量或切换到颜色较深的载波。",
          hi: "कोई तत्काल विपरीत संकेत नहीं हैं। यदि बाइनॉरल हेडफ़ोन से घबराहट होती है, तो वॉल्यूम कम करें या गहरे रंग के कैरियर का उपयोग करें।"
        }
    },

    guide: {
      when: {
          es: "Mañana (después de cafeína si la usas, no antes). Ambiente que puedas controlar — no en transporte. Con papel o editor de texto listo.",
          en: "Morning (after caffeine if you use it, not before). Controllable environment — not on transport. With paper or text editor ready.",
          fr: "Le matin (après la caféine si vous en consommez, pas avant). Dans un environnement contrôlé, hors des transports. Avec du papier ou un éditeur de texte à portée de main.",
          pt: "De manhã (após o consumo de cafeína, se você a utiliza, e não antes). Em um ambiente controlado — não durante o transporte. Com papel ou editor de texto à mão.",
          zh: "早上（如果你喝咖啡的话，最好在咖啡因摄入之后，而不是之前）。在可控的环境下——不要在交通工具上。准备好纸笔或文本编辑器。",
          hi: "सुबह (यदि आप कैफीन का सेवन करते हैं, तो उसके बाद, पहले नहीं)। नियंत्रित वातावरण में - परिवहन में नहीं। कागज़ या टेक्स्ट एडिटर तैयार रखें।"
        },
      duration: { min: 10, recommended: 30, max: 90 },
      sequence: {
          es: "Alpha 10 Hz (5 min) como calentamiento, luego bajar a Alpha 8 Hz. Para salir del flow sin desorientación: Alpha 10 Hz 3 min antes de parar.",
          en: "Alpha 10 Hz (5 min) as warmup, then lower to Alpha 8 Hz. To exit flow without disorientation: Alpha 10 Hz 3 min before stopping.",
          fr: "Alpha 10 Hz (5 min) en guise d&#39;échauffement, puis réduire à Alpha 8 Hz. Pour sortir du flux sans désorientation : Alpha 10 Hz 3 min avant l&#39;arrêt.",
          pt: "Alfa 10 Hz (5 min) como aquecimento, depois reduzir para Alfa 8 Hz. Para sair do fluxo sem desorientação: Alfa 10 Hz 3 min antes de parar.",
          zh: "先以 10 Hz 的 Alpha 频率（5 分钟）进行热身，然后降低至 8 Hz。为了避免在心流结束后出现迷失方向的情况：在停止心流前 3 分钟以 10 Hz 的 Alpha 频率进行练习。",
          hi: "वार्मअप के रूप में अल्फा 10 हर्ट्ज़ (5 मिनट), फिर अल्फा 8 हर्ट्ज़ तक कम करें। बिना विचलित हुए प्रवाह से बाहर निकलने के लिए: रुकने से 3 मिनट पहले अल्फा 10 हर्ट्ज़।"
        },
      contraindications: {
          es: "Ninguna conocida.",
          en: "None known.",
          fr: "Aucun connu.",
          pt: "Nenhuma conhecida.",
          zh: "目前尚无已知信息。",
          hi: "कोई ज्ञात नहीं।"
        }
    },

    tags: ["flow", "creatividad", "creativity", "alpha", "escritura", "writing", "arte", "art"]
  },


  {
    id: "beta",
    category: "binaural",
    type: ["binaural", "breathing"],
    sessions: [
      { id: "foco",        priority: 2 },
      { id: "energia",     priority: 3 }
    ],
    scientificLevel: "emerging",
    color: "#d4a84b",

    name: { es: "Beta 16 Hz — Foco", en: "Beta 16 Hz — Focus", fr: "Beta 16 Hz — Concentration", pt: "Beta 16 Hz — Foco" },
    description: {
      es: "Foco & Productividad",
      en: "Focus & Productivity",
      fr: "Focus & Productivité",
      pt: "Foco & Produtividade"
    },
    longDescription: {
          es: "Beta (14–30 Hz) es el estado mental de la cognición activa, la atención sostenida y el pensamiento analítico. El Box Breathing (4-4-4-4) es el protocolo de regulación del SNA más usado en entornos de alto rendimiento porque sus retenciones simétricas equilibran exactamente la activación simpática (holdFull) con la parasimpática (holdEmpty). El resultado: foco activo sin ansiedad ni tensión. Carrier 400 Hz acompaña el estado beta activo.",
          en: "Beta (14–30 Hz) is the mental state of active cognition, sustained attention and analytical thinking. Box Breathing (4-4-4-4) is the most-used ANS regulation protocol in high-performance environments because its symmetric retentions exactly balance sympathetic activation (holdFull) with parasympathetic (holdEmpty). Result: active focus without anxiety or tension. 400 Hz carrier accompanies the active beta state.",
          fr: "L&#39;état bêta (14–30 Hz) correspond à une cognition active, une attention soutenue et une pensée analytique. La respiration carrée (4-4-4-4) est le protocole de régulation du système nerveux autonome le plus utilisé dans les environnements à haute performance, car ses contractions symétriques équilibrent précisément l&#39;activation sympathique (respiration pleine) et parasympathique (respiration vide). Résultat : une concentration active sans anxiété ni tension. Une fréquence porteuse de 400 Hz accompagne l&#39;état bêta actif.",
          pt: "A frequência beta (14–30 Hz) representa o estado mental de cognição ativa, atenção sustentada e pensamento analítico. A Respiração Quadrada (4-4-4-4) é o protocolo de regulação do SNA mais utilizado em ambientes de alto desempenho, pois suas retenções simétricas equilibram com precisão a ativação simpática (retenção completa) com a parassimpática (retenção vazia). Resultado: foco ativo sem ansiedade ou tensão. Uma frequência portadora de 400 Hz acompanha o estado beta ativo.",
          zh: "β波（14-30 Hz）代表积极认知、持续注意力和分析性思维的心理状态。箱式呼吸法（4-4-4-4）是高强度工作环境中应用最广泛的自主神经系统调节方案，因为其对称的屏息能够精确平衡交感神经激活（保持饱腹）和副交感神经激活（保持空腹）。结果：专注力强，无焦虑或紧张。400 Hz载波伴随活跃的β波状态。",
          hi: "बीटा (14–30 हर्ट्ज़) सक्रिय संज्ञानात्मक क्षमता, निरंतर ध्यान और विश्लेषणात्मक चिंतन की मानसिक अवस्था है। बॉक्स ब्रीदिंग (4-4-4-4) उच्च प्रदर्शन वाले वातावरण में सबसे अधिक उपयोग किया जाने वाला एएनएस विनियमन प्रोटोकॉल है क्योंकि इसकी सममित प्रतिधारण क्रियाएं सहानुभूति तंत्रिका तंत्र (हो��्ड फुल) और परासहानुभूति तंत्रिका तंत्र (होल्ड एम्प्टी) के बीच सटीक संतुलन बनाती हैं। परिणाम: चिंता या तनाव के बिना सक्रिय एकाग्रता। 400 हर्ट्ज़ की वाहक ध्वनि सक्रिय बीटा अवस्था के साथ होती है।"
        },

    audio: {
      binaural: true,
      beat: 16,
      carrier: 400,
      perception: {
        optimal: { min: 300, max: 500 },
        degradation: {
          es: "Para beats en rango beta (14–30 Hz) se necesita un carrier más alto. Con carrier 400 Hz y beat 16 Hz, la diferencia es el 4% del carrier — rango óptimo de detección. Con carrier inferior a 250 Hz y beat 16 Hz, el cerebro puede empezar a percibir los dos tonos por separado en lugar del beat combinado.",
          en: "For beta-range beats (14–30 Hz) a higher carrier is needed. With 400 Hz carrier and 16 Hz beat, the difference is 4% of the carrier — optimal detection range. With carrier below 250 Hz and 16 Hz beat, the brain may start perceiving the two tones separately instead of the combined beat.",
          fr: "Pour les battements de la gamme bêta (14–30 Hz), une fréquence porteuse plus élevée est nécessaire. Avec une fréquence porteuse de 400 Hz et un battement de 16 Hz, la différence est de 4 % de la fréquence porteuse, ce qui correspond à la plage de détection optimale. Avec une fréquence porteuse inférieure à 250 Hz et un battement de 16 Hz, le cerveau risque de percevoir les deux sons séparément au lieu du battement combiné.",
          pt: "Para batimentos na faixa beta (14–30 Hz), é necessária uma portadora mais alta. Com uma portadora de 400 Hz e um batimento de 16 Hz, a diferença é de 4% da portadora — faixa de detecção ideal. Com uma portadora abaixo de 250 Hz e um batimento de 16 Hz, o cérebro pode começar a perceber os dois tons separadamente, em vez do batimento combinado.",
          zh: "对于β波段（14–30 Hz）的节拍，需要更高的载波频率。当载波频率为400 Hz，节拍频率为16 Hz时，两者的频率差为载波频率的4%——这是最佳检测范围。如果载波频率低于250 Hz，节拍频率为16 Hz，大脑可能会将这两个音调分别感知，而不是将它们组合在一起。",
          hi: "बीटा-रेंज बीट्स (14–30 हर्ट्ज़) के लिए उच्च कैरियर की आवश्यकता होती है। 400 हर्ट्ज़ कैरियर और 16 हर्ट्ज़ बीट के साथ, अंतर कैरियर का 4% होता है - जो इष्टतम पहचान सीमा है। 250 हर्ट्ज़ से कम कैरियर और 16 हर्ट्ज़ बीट के साथ, मस्तिष्क संयुक्त बीट के बजाय दोनों टोन को अलग-अलग समझना शुरू कर सकता है।"
        },
        why: {
          es: "La regla general: el beat no debe superar el 10% del carrier para ser procesado como binaural coherente. A 16 Hz de beat, el carrier mínimo recomendado es 160 Hz, pero para percepción óptima el carrier debe estar en al menos 300 Hz (donde la resolución de fase del sistema auditivo es alta en ese rango de frecuencia).",
          en: "The general rule: the beat should not exceed 10% of the carrier to be processed as coherent binaural. At 16 Hz beat, the recommended minimum carrier is 160 Hz, but for optimal perception the carrier should be at least 300 Hz (where phase resolution of the auditory system is high in that frequency range).",
          fr: "Règle générale : le battement ne doit pas dépasser 10 % de la fréquence porteuse pour être traité comme un signal binaural cohérent. À un battement de 16 Hz, la fréquence porteuse minimale recommandée est de 160 Hz, mais pour une perception optimale, elle doit être d’au moins 300 Hz (la résolution de phase du système auditif étant élevée dans cette gamme de fréquences).",
          pt: "A regra geral é a seguinte: a frequência de batimento não deve exceder 10% da frequência portadora para ser processada como binaural coerente. Com uma frequência de batimento de 16 Hz, a frequência portadora mínima recomendada é de 160 Hz, mas para uma percepção ideal, a portadora deve ser de pelo menos 300 Hz (onde a resolução de fase do sistema auditivo é alta nessa faixa de frequência).",
          zh: "一般规则：为了使双耳信号连贯，拍频不应超过载波频率的10%。对于16赫兹的拍频，建议的最小载波频率为160赫兹，但为了获得最佳感知效果，载波频率应至少为300赫兹（在该频率范围内，听觉系统的相位分辨率较高）。",
          hi: "सामान्य नियम: सुसंगत द्विश्रव्य ध्वनि के रूप में संसाधित होने के लिए बीट वाहक आवृत्ति के 10% से अधिक नहीं होनी चाहिए। 16 हर्ट्ज़ की बीट पर, अनुशंसित न्यूनतम वाहक आवृत्ति 160 हर्ट्ज़ है, लेकिन इष्टतम अनुभूति के लिए वाहक आवृत्ति कम से कम 300 हर्ट्ज़ होनी चाहिए (जहां उस आवृत्ति सीमा में श्रवण तंत्र का चरण संकल्प उच्च होता है)।"
        }
      }
    },

    breathing: {
      pattern: "box",
      bpm: 4,
      ratio: 1.0,
      holdFull: 4,
      holdEmpty: 4
    },

    tuning: {
      audio: {
        beat: {
          min: 12, max: 20, step: 1,
          lower: {
          es: "12–14 Hz: beta bajo. Foco relajado, sostenible por horas. Sin riesgo de tensión. Para trabajo intelectual de largo aliento.",
          en: "12–14 Hz: low beta. Relaxed focus, sustainable for hours. No risk of tension. For long-haul intellectual work.",
          fr: "12–14 Hz : faible fréquence bêta. Concentration détendue et durable pendant des heures. Aucun risque de tension. Idéal pour les tâches intellectuelles de longue durée.",
          pt: "12–14 Hz: beta baixo. Foco relaxado, sustentável por horas. Sem risco de tensão. Para trabalho intelectual de longa duração.",
          zh: "12–14 Hz：低β波。放松专注，可持续数小时。无紧张风险。适合长时间脑力工作。",
          hi: "12–14 हर्ट्ज़: कम बीटा। आरामदायक एकाग्रता, घंटों तक बनी रहती है। तनाव का कोई खतरा नहीं। लंबे समय तक चलने वाले बौद्धिक कार्यों के लिए उपयुक्त।"
        },
          higher: {
          es: "17–20 Hz: beta alto. Alta alerta. Útil para sprints de 30–45 min máximo. Puede generar tensión de cabeza si se usa más de 1 hora seguida.",
          en: "17–20 Hz: high beta. High alert. Useful for 30–45 min sprints maximum. Can generate head tension if used more than 1 hour straight.",
          fr: "17–20 Hz : fréquence bêta élevée. Alerte maximale. Utile pour des efforts intenses de 30 à 45 minutes maximum. Peut engendrer des maux de tête en cas d’utilisation prolongée (plus d’une heure).",
          pt: "17–20 Hz: beta alto. Alerta máximo. Útil para sprints de 30 a 45 minutos no máximo. Pode causar tensão na cabeça se usado por mais de 1 hora seguida.",
          zh: "17–20 Hz：高β波。高度警觉。最多适用于30–45分钟的冲刺训练。如果连续使用超过1小时，可能会导致头部紧张。",
          hi: "17–20 हर्ट्ज़: उच्च बीटा। उच्च सतर्कता। अधिकतम 30–45 मिनट के त्वरित उपयोग के लिए उपयोगी। लगातार 1 घंटे से अधिक उपयोग करने पर सिरदर्द उत्पन्न कर सकता है।"
        }
        },
        carrier: {
          min: 300, max: 500, step: 10,
          lower: {
          es: "300–350 Hz: beat más sutil. Para trabajo que requiere concentración pero no máxima activación.",
          en: "300–350 Hz: subtler beat. For work requiring concentration but not maximum activation.",
          fr: "300–350 Hz : rythme plus subtil. Pour les tâches nécessitant de la concentration mais pas une activation maximale.",
          pt: "300–350 Hz: batida mais sutil. Para trabalhos que exigem concentração, mas não ativação máxima.",
          zh: "300–350 赫兹：较柔和的节拍。适合需要集中注意力但不需要高度集中精力的工作。",
          hi: "300-350 हर्ट्ज़: सूक्ष्म लय। ऐसे कार्यों के लिए जिनमें एकाग्रता की आवश्यकता होती है लेकिन अधिकतम सक्रियता की नहीं।"
        },
          higher: {
          es: "450–500 Hz: beat más estimulante. Para tareas urgentes o que requieren velocidad de procesamiento alta. No excedas 500 Hz — el beat empieza a degradarse.",
          en: "450–500 Hz: more stimulating beat. For urgent tasks or those requiring high processing speed. Don't exceed 500 Hz — the beat starts degrading.",
          fr: "450–500 Hz : rythme plus stimulant. Pour les tâches urgentes ou celles nécessitant une vitesse de traitement élevée. Ne pas dépasser 500 Hz, car le rythme se dégrade.",
          pt: "450–500 Hz: batida mais estimulante. Para tarefas urgentes ou que exigem alta velocidade de processamento. Não ultrapasse 500 Hz — a batida começa a se degradar.",
          zh: "450–500 赫兹：更具刺激性的节拍。适用于紧急任务或需要高速处理的任务。请勿超过 500 赫兹——节拍效果会开始下降。",
          hi: "450–500 हर्ट्ज़: अधिक उत्तेजक लय। तत्काल कार्यों या उच्च प्रसंस्करण गति की आवश्यकता वाले कार्यों के लिए उपयुक्त। 500 हर्ट्ज़ से अधिक न करें: इससे लय की गुणवत्ता कम होने लगती है।"
        }
        }
      },
      breathing: {
        holdFull: {
          min: 3, max: 6, step: 1,
          lower: {
          es: "3s: box suave. Para entrada o si el Box 4-4-4-4 se siente intenso.",
          en: "3s: gentle box. For entry or if Box 4-4-4-4 feels intense.",
          fr: "3s : boîte douce. Pour commencer ou si la boîte 4-4-4-4 est trop intense.",
          pt: "3s: caixa suave. Para entrada ou se a Caixa 4-4-4-4 parecer intensa.",
          zh: "3s：轻柔模式。用于入门或感觉 4-4-4-4 模式强度过大时。",
          hi: "3s: सौम्य बॉक्सिंग। शुरुआती चरण के लिए या यदि बॉक्स 4-4-4-4 तीव्र महसूस हो।"
        },
          higher: {
          es: "5–6s: mayor activación simpática moderada en el hold lleno. Más energizante. Mantén la simetría: si subes holdFull, sube holdEmpty igual.",
          en: "5–6s: greater moderate sympathetic activation on full hold. More energizing. Keep symmetry: if raising holdFull, raise holdEmpty equally.",
          fr: "5 à 6 s : activation sympathique modérée plus importante en maintien complet. Plus énergisant. Maintenir la symétrie : si vous augmentez la force de maintien maximale, augmentez également la force de maintien minimale.",
          pt: "5–6s: maior ativação simpática moderada na sustentação completa. Mais energizante. Mantenha a simetria: se aumentar a sustentação completa, aumente a sustentação vazia na mesma proporção.",
          zh: "5-6秒：完全屏息时交感神经激活程度更高，更能提神。保持对称：如果提高完全屏息时间，则空屏时间也应相应提高。",
          hi: "5–6 सेकंड: पूर्ण धारण पर मध्यम स्तर की सहानुभूति तंत्रिका तंत्र की सक्रियता अधिक होती है। अधिक ऊर्जादायक। समरूपता बनाए रखें: यदि धारण पूर्ण को बढ़ा रहे हैं, तो धारण खाली को भी समान रूप से बढ़ाएं।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Capacidad de sostener la atención en una tarea sin distracción",
          "Pensamiento analítico fluido — las piezas se organizan solas",
          "Sin ansiedad ni tensión muscular: claridad activa",
          "La mente 'sabe lo que tiene que hacer' sin esfuerzo de dirección"
        ],
        en: [
          "Ability to sustain attention on one task without distraction",
          "Fluid analytical thinking — pieces organize themselves",
          "No anxiety or muscle tension: active clarity",
          "Mind 'knows what to do' without direction effort"
        ]
      },
      adjust: {
          es: "Si sientes ansiedad o tensión en cuello/hombros: baja el beat a 14 Hz o usa Alpha 10 Hz 5 min de entrada. El Box Breathing sin binaural ya es efectivo — si el binaural genera activación excesiva, desactívalo y mantén solo el Box.",
          en: "If you feel anxiety or neck/shoulder tension: lower beat to 14 Hz or use Alpha 10 Hz for 5 min entry. Box Breathing without binaural is already effective — if the binaural generates excessive activation, deactivate it and keep only Box.",
          fr: "En cas d&#39;anxiété ou de tensions dans la nuque et les épaules : réduisez la fréquence à 14 Hz ou utilisez les ondes alpha à 10 Hz pendant 5 minutes. La respiration carrée sans stimulation binaurale est déjà efficace ; si cette dernière génère une activation excessive, désactivez-la et conservez uniquement la respiration carrée.",
          pt: "Se você sentir ansiedade ou tensão no pescoço/ombros: diminua a frequência para 14 Hz ou use o Alpha 10 Hz por 5 minutos na fase introdutória. A respiração quadrada sem o uso de binaural já é eficaz — se o binaural gerar ativação excessiva, desative-o e mantenha apenas a respiração quadrada.",
          zh: "如果您感到焦虑或颈肩紧张：请将节拍频率降低至 14 Hz，或使用 10 Hz 的 Alpha 节拍进行 5 分钟的练习。即使不使用双耳节拍，盒式呼吸法也已有效——如果双耳节拍导致过度激活，请将其关闭，仅保留盒式呼吸法。",
          hi: "यदि आपको घबराहट या गर्दन/कंधे में तनाव महसूस हो, तो लय को 14 हर्ट्ज़ तक कम करें या 5 मिनट के लिए अल्फा 10 हर्ट्ज़ का प्रयोग करें। बाइनॉरल के बिना भी बॉक्स ब्रीदिंग प्रभावी है - यदि बाइनॉरल से अत्यधिक उत्तेजना उत्पन्न होती है, तो इसे बंद कर दें और केवल बॉक्स ब्रीदिंग का प्रयोग करें।"
        },
      unexpected: {
          es: "Calor en las manos o pies durante el holdFull: activación simpática moderada, completamente normal en Box.",
          en: "Warmth in hands or feet during holdFull: moderate sympathetic activation, completely normal in Box.",
          fr: "Chaleur dans les mains ou les pieds pendant le maintien : activation sympathique modérée, parfaitement normale dans la boîte.",
          pt: "Sensação de calor nas mãos ou nos pés durante o contato: ativação simpática moderada, completamente normal em Box.",
          zh: "握持过程中手脚发热：中度交感神经激活，在 Box 中完全正常。",
          hi: "पकड़ने के दौरान हाथों या पैरों में गर्माहट: मध्यम सहानुभूति तंत्रिका तंत्र सक्रियण, बॉक्स में पूरी तरह से सामान्य।"
        },
      stop: {
          es: "Palpitaciones irregulares o dolor de pecho: parar inmediatamente. No usar si hay hipertensión no controlada.",
          en: "Irregular palpitations or chest pain: stop immediately. Don't use with uncontrolled hypertension.",
          fr: "Palpitations irrégulières ou douleurs thoraciques : interrompre immédiatement le traitement. Ne pas utiliser en cas d’hypertension non contrôlée.",
          pt: "Palpitações irregulares ou dor no peito: suspenda imediatamente o uso. Não utilize em caso de hipertensão não controlada.",
          zh: "出现心悸或胸痛：立即停药。高血压未控制者禁用。",
          hi: "अनियमित धड़कन या सीने में दर्द होने पर तुरंत इसका सेवन बंद कर दें। अनियंत्रित उच्च रक्तचाप में इसका प्रयोग न करें।"
        }
    },

    guide: {
      when: {
          es: "Mañana o principio de tarde. No usar después de las 18h si tienes sensibilidad al sueño. Ideal antes de bloque de trabajo profundo de 90–120 min.",
          en: "Morning or early afternoon. Don't use after 6pm if sleep-sensitive. Ideal before a 90–120 min deep work block.",
          fr: "Le matin ou en début d&#39;après-midi. À éviter après 18h en cas de somnolence. Idéal avant une période de travail intense de 90 à 120 minutes.",
          pt: "De manhã ou no início da tarde. Não use após as 18h se tiver sensibilidade ao sono. Ideal antes de um período de trabalho intenso de 90 a 120 minutos.",
          zh: "上午或午后早些时候使用。如果睡眠敏感，请勿在下午 6 点后使用。非常适合在进行 90-120 分钟的深度工作之前使用。",
          hi: "सुबह या दोपहर के शुरुआती समय में इस्तेमाल करें। अगर आपको नींद से परेशानी होती है तो शाम 6 बजे के बाद इसका इस्तेमाल न करें। 90-120 मिनट के गहन कार्य सत्र से पहले इसका इस्तेमाल करना सबसे अच्छा है।"
        },
      duration: { min: 5, recommended: 10, max: 20 },
      sequence: {
          es: "Usar como entrada. Después del bloque de trabajo, usar Alpha 10 Hz para bajar de estado beta. No terminar en Beta sin transición.",
          en: "Use as entry. After the work block, use Alpha 10 Hz to come down from beta state. Don't end in Beta without transition.",
          fr: "À utiliser comme point d&#39;entrée. Après le bloc de travail, utilisez Alpha 10 Hz pour revenir de l&#39;état bêta. Ne terminez pas en bêta sans transition.",
          pt: "Use como entrada. Após o bloco de trabalho, use Alpha 10 Hz para sair do estado beta. Não termine em Beta sem transição.",
          zh: "用作入口。工作块结束后，使用 Alpha 10 Hz 从 Beta 状态过渡到 Beta 状态。不要在没有过渡的情况下直接进入 Beta 状态。",
          hi: "इसे प्रवेश बिंदु के रूप में उपयोग करें। कार्य ब्लॉक के बाद, बीटा अवस्था से नीचे आने के लिए अल्फा 10 हर्ट्ज़ का उपयोग करें। संक्रमण के बिना बीटा अवस्था में समाप्त न करें।"
        },
      contraindications: {
          es: "Hipertensión no controlada, ansiedad clínica activa. Precaución en epilepsia.",
          en: "Uncontrolled hypertension, active clinical anxiety. Caution in epilepsy.",
          fr: "Hypertension non contrôlée, anxiété clinique active. Prudence en cas d&#39;épilepsie.",
          pt: "Hipertensão não controlada, ansiedade clínica ativa. Cuidado em casos de epilepsia.",
          zh: "高血压控制不佳，临床焦虑症状明显。癫痫患者慎用。",
          hi: "अनियंत्रित उच्च रक्तचाप, सक्रिय नैदानिक चिंता। मिर्गी के रोगियों में सावधानी बरतें।"
        }
    },

    tags: ["foco", "focus", "productividad", "productivity", "beta", "box-breathing", "trabajo", "work", "alto-rendimiento", "high-performance"]
  },


  {
    id: "gamma40",
    category: "binaural",
    type: ["binaural", "breathing"],
    sessions: [
      { id: "foco",    priority: 1 },
      { id: "energia", priority: 2 }
    ],
    scientificLevel: "validated",
    color: "#ff6b6b",

    name: { es: "Gamma 40 Hz — MIT", en: "Gamma 40 Hz — MIT Protocol", fr: "Gamma 40 Hz — Protocole MIT", pt: "Gamma 40 Hz — Protocolo MIT" },
    description: {
      es: "Protocolo MIT 40 Hz",
      en: "MIT 40 Hz Protocol",
      fr: "Protocole MIT 40 Hz",
      pt: "Protocolo MIT 40 Hz"
    },
    longDescription: {
          es: "El laboratorio Tsai (MIT) demostró que la estimulación gamma de 40 Hz —mediante luz o sonido— puede reducir la carga de beta-amiloide en modelos de Alzheimer y potenciar la actividad microglial de limpieza. La Bhastrika (respiración de fuelle) produce hiperventilación controlada que genera alcalosis respiratoria, activa el eje simpático-adrenal y potencia naturalmente la actividad gamma. Binaural + Bhastrika juntos crean un doble mecanismo de activación gamma.",
          en: "The Tsai lab (MIT) showed that 40 Hz gamma stimulation — via light or sound — can reduce beta-amyloid load in Alzheimer models and enhance microglial cleaning activity. Bhastrika (bellows breathing) produces controlled hyperventilation generating respiratory alkalosis, activates the sympathetic-adrenal axis, and naturally potentiates gamma activity. Binaural + Bhastrika together create a double gamma activation mechanism.",
          fr: "Le laboratoire Tsai (MIT) a démontré que la stimulation gamma à 40 Hz — par la lumière ou le son — peut réduire la charge en bêta-amyloïde dans des modèles de la maladie d&#39;Alzheimer et améliorer l&#39;activité de nettoyage des cellules microgliales. La respiration Bhastrika (respiration par soufflet) induit une hyperventilation contrôlée, générant une alcalose respiratoire, active l&#39;axe sympatho-surrénalien et potentialise naturellement l&#39;activité gamma. L&#39;association de la stimulation binaurale et de la respiration Bhastrika crée un double mécanisme d&#39;activation gamma.",
          pt: "O laboratório de Tsai (MIT) demonstrou que a estimulação gama de 40 Hz — por meio de luz ou som — pode reduzir a carga de beta-amiloide em modelos de Alzheimer e aumentar a atividade de limpeza da microglia. A bhastrika (respiração de fole) produz hiperventilação controlada, gerando alcalose respiratória, ativa o eixo simpático-adrenal e potencializa naturalmente a atividade gama. A combinação de estimulação binaural e bhastrika cria um mecanismo de dupla ativação gama.",
          zh: "蔡氏实验室（麻省理工学院）的研究表明，40赫兹的伽马波刺激——无论是通过光刺激还是声刺激——可以降低阿尔茨海默病模型中的β-淀粉样蛋白负荷，并增强小胶质细胞的清除活性。风箱式呼吸法（Bhastrika）可产生可控的过度通气，从而导致呼吸性碱中毒，激活交感-肾上腺轴，并自然地增强伽马波活动。双耳节拍呼吸法与风箱式呼吸法相结合，可形成双重伽马波激活机制。",
          hi: "त्साई लैब (एमआईटी) ने दिखाया कि 40 हर्ट्ज़ गामा उत्तेजना - प्रकाश या ध्वनि के माध्यम से - अल्जाइमर मॉडल में बीटा-एमिलॉयड की मात्रा को कम कर सकती है और माइक्रोग्लियल सफाई गतिविधि को बढ़ा सकती है। भस्त्रिका (सांस लेने की तकनीक) नियंत्रित अतिश्वसन उत्पन्न करती है जिससे श्वसन क्षारीयता पैदा होती है, सहानुभूति-अधिवृक्क अक्ष सक्रिय होता है और गामा गतिविधि स्वाभाविक रूप से बढ़ जाती है। द्विश्रम और भस्त्रिका मिलकर दोहरी गामा सक्रियण क्रियाविधि बनाते हैं।"
        },

    audio: {
      binaural: true,
      beat: 40,
      carrier: 500,
      perception: {
        optimal: { min: 400, max: 700 },
        degradation: {
          es: "Para beats gamma (30–50 Hz) se necesita un carrier alto. Con beat 40 Hz y carrier 500 Hz la diferencia es el 8% del carrier — dentro del rango de percepción binaural coherente. Si el carrier baja de 350 Hz con beat 40 Hz, el sistema auditivo empieza a percibir los dos tonos como dos frecuencias separadas, no como un beat. Por encima de 800 Hz el oído tiene mayor dificultad en detectar diferencias de fase.",
          en: "For gamma beats (30–50 Hz) a high carrier is needed. With 40 Hz beat and 500 Hz carrier the difference is 8% of the carrier — within coherent binaural perception range. If the carrier drops below 350 Hz with 40 Hz beat, the auditory system starts perceiving the two tones as two separate frequencies, not as a beat. Above 800 Hz the ear has greater difficulty detecting phase differences.",
          fr: "Pour les battements gamma (30–50 Hz), une porteuse de fréquence élevée est nécessaire. Avec un battement à 40 Hz et une porteuse à 500 Hz, la différence est de 8 % de la porteuse, ce qui reste dans la plage de perception binaurale cohérente. Si la porteuse descend en dessous de 350 Hz avec un battement à 40 Hz, le système auditif perçoit les deux sons comme deux fréquences distinctes, et non comme un battement. Au-delà de 800 Hz, l&#39;oreille a plus de difficulté à détecter les différences de phase.",
          pt: "Para batimentos gama (30–50 Hz), é necessária uma portadora alta. Com um batimento de 40 Hz e uma portadora de 500 Hz, a diferença é de 8% da portadora — dentro da faixa de percepção binaural coerente. Se a portadora cair abaixo de 350 Hz com um batimento de 40 Hz, o sistema auditivo começa a perceber os dois tons como duas frequências separadas, e não como um batimento. Acima de 800 Hz, o ouvido tem maior dificuldade em detectar diferenças de fase.",
          zh: "对于伽马拍频（30–50 Hz），需要较高的载波频率。当拍频为 40 Hz，载波频率为 500 Hz 时，两者频率差为载波频率的 8%——这在双耳相干感知范围内。如果 40 Hz 拍频对应的载波频率低于 350 Hz，听觉系统就会将这两个音调感知为两个独立的频率，而不是一个拍频。高于 800 Hz 时，耳朵更难察觉相位差。",
          hi: "गामा बीट्स (30–50 हर्ट्ज़) के लिए एक उच्च कैरियर की आवश्यकता होती है। 40 हर्ट्ज़ बीट और 500 हर्ट्ज़ कैरियर के साथ, अंतर कैरियर का 8% होता है - जो सुसंगत द्विश्रव्य बोध सीमा के भीतर है। यदि 40 हर्ट्ज़ बीट के साथ कैरियर 350 हर्ट्ज़ से नीचे गिर जाता है, तो श्रवण तंत्र दोनों स्वरों को बीट के बजाय दो अलग-अल��� आवृत्तियों के रूप में ग्रहण करने लगता है। 800 हर्ट्ज़ से ऊपर, कान को कला भेदों का पता लगाने में अधिक कठिनाई होती है।"
        },
        why: {
          es: "La regla del 10%: el beat no debe superar el 10% del carrier. 40 Hz / 500 Hz = 8%. Es el preset que más se acerca al límite — por eso el carrier no puede bajarse mucho. La percepción de gamma binaural también requiere que ambos oídos reciban el estímulo de forma independiente (auriculares, no altavoces).",
          en: "The 10% rule: the beat should not exceed 10% of the carrier. 40 Hz / 500 Hz = 8%. It's the preset closest to the limit — that's why the carrier can't be lowered much. Gamma binaural perception also requires both ears to receive the stimulus independently (headphones, not speakers).",
          fr: "La règle des 10 % : le battement ne doit pas dépasser 10 % de la porteuse. 40 Hz / 500 Hz = 8 %. C&#39;est le réglage préréglé le plus proche de la limite ; c&#39;est pourquoi la porteuse ne peut pas être beaucoup réduite. La perception binaurale gamma nécessite également que les deux oreilles reçoivent le stimulus indépendamment (avec un casque, et non des haut-parleurs).",
          pt: "A regra dos 10%: a batida não deve exceder 10% da frequência portadora. 40 Hz / 500 Hz = 8%. Este é o valor predefinido mais próximo do limite — por isso a frequência portadora não pode ser muito reduzida. A percepção binaural gama também exige que ambas as orelhas recebam o estímulo independentemente (fones de ouvido, não alto-falantes).",
          zh: "10%规则：节拍频率不应超过载波频率的10%。40赫兹/500赫兹=8%。这是最接近极限的预设值——这就是为什么载波频率不能大幅降低的原因。伽马双耳感知也要求双耳独立接收刺激（使用耳机，而不是扬声器）。",
          hi: "10% का नियम: बीट कैरियर के 10% से अधिक नहीं होनी चाहिए। 40 हर्ट्ज़ / 500 हर्ट्ज़ = 8%। यह सीमा के सबसे करीब का प्रीसेट है - इसीलिए कैरियर को बहुत कम नहीं किया जा सकता। गामा बाइनॉरल परसेप्शन के लिए दोनों कानों को स्वतंत्र रूप से उद्दीपन प्राप्त करना भी आवश्यक है (हेडफ़ोन, स्पीकर नहीं)।"
        }
      }
    },

    breathing: {
      pattern: "bhastrika",
      bpm: 10,
      ratio: 1.0,
      holdFull: 0,
      holdEmpty: 0
    },

    tuning: {
      audio: {
        beat: {
          min: 36, max: 44, step: 1,
          lower: {
          es: "36–39 Hz: ligeramente más suave. Bueno para sesiones de iniciación al gamma o si 40 Hz genera exceso de alerta.",
          en: "36–39 Hz: slightly softer. Good for gamma initiation sessions or if 40 Hz generates excess alertness.",
          fr: "36–39 Hz : légèrement plus doux. Convient aux séances d’initiation gamma ou si 40 Hz génère une vigilance excessive.",
          pt: "36–39 Hz: ligeiramente mais suave. Bom para sessões de iniciação gama ou se 40 Hz gerar estado de alerta excessivo.",
          zh: "36–39 Hz：稍柔和一些。适合用于伽马波启动训练，或者当 40 Hz 导致过度警觉时使用。",
          hi: "36–39 हर्ट्ज़: थोड़ी धीमी ध्वनि। गामा किरणों के आरंभिक सत्रों के लिए या यदि 40 हर्ट्ज़ अत्यधिक सतर्कता उत्पन्न करता है तो यह उपयुक्त है।"
        },
          higher: {
          es: "41–44 Hz: más estimulante. Para períodos cortos de máxima activación cognitiva. Tu gamma personal puede estar ±2 Hz del estándar MIT.",
          en: "41–44 Hz: more stimulating. For short periods of maximum cognitive activation. Your personal gamma may be ±2 Hz from the MIT standard.",
          fr: "41–44 Hz : plus stimulant. Pour de courtes périodes d’activation cognitive maximale. Votre fréquence gamma personnelle peut varier de ±2 Hz par rapport à la norme du MIT.",
          pt: "41–44 Hz: mais estimulante. Para curtos períodos de ativação cognitiva máxima. Seu gama pessoal pode variar em ±2 Hz em relação ao padrão do MIT.",
          zh: "41–44 Hz：更具刺激性。适合短时间内达到最佳认知激活状态。您的个人伽马频率可能与麻省理工学院标准值相差 ±2 Hz。",
          hi: "41–44 हर्ट्ज़: अधिक उत्तेजक। अधिकतम संज्ञानात्मक सक्रियता की अल्पकालिक अवधियों के लिए। आपका व्यक्तिगत गामा एमआईटी मानक से ±2 हर्ट्ज़ भिन्न हो सकता है।"
        }
        },
        carrier: {
          min: 400, max: 700, step: 10,
          lower: {
          es: "400–450 Hz: mínimo recomendado. Beat percibible pero más sutil.",
          en: "400–450 Hz: recommended minimum. Perceptible beat but more subtle.",
          fr: "400–450 Hz : minimum recommandé. Battement perceptible, mais plus subtil.",
          pt: "400–450 Hz: mínimo recomendado. Batida perceptível, porém mais sutil.",
          zh: "400–450赫兹：推荐最低频率。可感知节拍，但较为微妙。",
          hi: "400-450 हर्ट्ज़: अनुशंसित न्यूनतम आवृत्ति। बोधगम्य लय, लेकिन अधिक सूक्ष्म।"
        },
          higher: {
          es: "550–700 Hz: beat muy perceptible, más estimulante. No exceder 700 Hz — el oído pierde resolución de fase en frecuencias muy altas.",
          en: "550–700 Hz: very perceptible beat, more stimulating. Don't exceed 700 Hz — the ear loses phase resolution at very high frequencies.",
          fr: "550–700 Hz : battements très perceptibles, plus stimulants. Ne pas dépasser 700 Hz — l’oreille perd en résolution de phase aux très hautes fréquences.",
          pt: "550–700 Hz: batimento muito perceptível, mais estimulante. Não ultrapasse 700 Hz — o ouvido perde a resolução de fase em frequências muito altas.",
          zh: "550–700 Hz：节拍非常明显，更具刺激性。不要超过 700 Hz——人耳在高频率下会失去相位分辨能力。",
          hi: "550–700 हर्ट्ज़: बहुत स्पष्ट लय, अधिक उत्तेजक। 700 हर्ट्ज़ से अधिक न करें — बहुत उच्च आवृत्तियों पर कान ध्वनि विभेदन क्षमता खो देते हैं।"
        }
        }
      },
      breathing: {
        bpm: {
          min: 8, max: 14, step: 1,
          lower: {
          es: "8–9 rpm: Bhastrika suave. Para principiantes o si hay sensibilidad al mareo. Efectiva igualmente.",
          en: "8–9 rpm: gentle Bhastrika. For beginners or if dizziness-sensitive. Equally effective.",
          fr: "8–9 tr/min : Bhastrika doux. Pour les débutants ou les personnes sensibles aux vertiges. Tout aussi efficace.",
          pt: "8–9 rpm: Bhastrika suave. Para iniciantes ou pessoas com tendência a tonturas. Igualmente eficaz.",
          zh: "8-9 转/分钟：轻柔的风箱式呼吸法。适合初学者或容易头晕者。效果同样显著。",
          hi: "8-9 आरपीएम: हल्की भस्त्रिका। शुरुआती लोगों या चक्कर आने की समस्या से ग्रस्त लोगों के लिए। समान रूप से प्रभावी।"
        },
          higher: {
          es: "12–14 rpm: Bhastrika intensa. Solo practicantes con experiencia. La regularidad del ritmo es más importante que la velocidad — un Bhastrika irregular a 14 rpm es menos efectivo que uno regular a 10 rpm.",
          en: "12–14 rpm: intense Bhastrika. Experienced practitioners only. Rhythm regularity is more important than speed — irregular Bhastrika at 14 rpm is less effective than regular at 10 rpm.",
          fr: "12–14 tours/minute : Bhastrika intense. Réservé aux pratiquants expérimentés. La régularité du rythme est plus importante que la vitesse ; un Bhastrika irrégulier à 14 tours/minute est moins efficace qu’un Bhastrika régulier à 10 tours/minute.",
          pt: "12–14 rpm: Bhastrika intenso. Apenas para praticantes experientes. A regularidade do ritmo é mais importante que a velocidade — um Bhastrika irregular a 14 rpm é menos eficaz do que um regular a 10 rpm.",
          zh: "12-14 转/分：强力风箱式呼吸法。仅限有经验的练习者。节奏规律性比速度更重要——14 转/分的不规律风箱式呼吸法不如 10 转/分的规律有效。",
          hi: "12-14 आरपीएम: तीव्र भस्त्रिका। केवल अनुभवी अभ्यासकर्ताओं के लिए। लय की नियमितता गति से अधिक महत्वपूर्ण है — 14 आरपीएम पर अनियमित भस्त्रिका 10 आरपीएम पर नियमित भस्त्रिका की तुलना में कम प्रभावी होती है।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Alerta mental limpia sin nerviosismo ni tensión",
          "Procesamiento de información percibido como más rápido y claro",
          "Hormigueo suave en cuero cabelludo o extremidades (normal con Bhastrika)",
          "Sensación de 'clic' cognitivo — las piezas encajan solas"
        ],
        en: [
          "Clean mental alertness without nervousness or tension",
          "Information processing perceived as faster and clearer",
          "Mild tingling in scalp or extremities (normal with Bhastrika)",
          "'Cognitive click' sensation — pieces fitting together"
        ]
      },
      adjust: {
          es: "Este preset tiene la ventana personal más estrecha. Si el beat no 'engancha' en 40 Hz, mueve ±1 Hz con 2 min de espera. La Bhastrika activa gamma independientemente — el binaural refuerza. Si la Bhastrika genera demasiado mareo: reduce a 8 rpm y mantén solo el binaural.",
          en: "This preset has the narrowest personal window. If the beat doesn't 'lock' at 40 Hz, move ±1 Hz with 2 min wait. Bhastrika activates gamma independently — the binaural reinforces. If Bhastrika generates too much dizziness: reduce to 8 rpm and keep only the binaural.",
          fr: "Ce préréglage offre la plage de réglage la plus étroite. Si le rythme ne se stabilise pas à 40 Hz, déplacez-le de ±1 Hz en attendant 2 minutes. Bhastrika active les ondes gamma indépendamment ; le son binaural les renforce. Si Bhastrika provoque trop de vertiges : réduisez la vitesse à 8 tours/minute et conservez uniquement le son binaural.",
          pt: "Esta predefinição tem a janela pessoal mais estreita. Se a batida não se estabilizar em 40 Hz, ajuste em ±1 Hz e aguarde 2 minutos. O Bhastrika ativa a faixa gama independentemente — o binaural reforça essa função. Se o Bhastrika causar muita tontura, reduza a frequência para 8 rpm e mantenha apenas o binaural.",
          zh: "此预设的个人调节范围最窄。如果节拍没有“锁定”在 40 Hz，请等待 2 分钟后，将频率调整 ±1 Hz。风箱式呼吸法独立激活伽马波——双耳节拍增强了这种效果。如果风箱式呼吸法导致眩晕感过强：请将转速降低至 8 rpm，并仅保留双耳节拍模式。",
          hi: "इस प्रीसेट में सबसे संकीर्ण व्यक्तिगत विंडो है। यदि बीट 40 हर्ट्ज़ पर &#39;लॉक&#39; नहीं होती है, तो 2 मिनट के इंतजार के साथ ±1 हर्ट्ज़ आगे-पीछे करें। भस्त्रिका गामा को स्वतंत्र रूप से सक्रिय करती है — बाइनॉरल इसे सुदृढ़ करता है। यदि भस्त्रिका से बहुत अधिक चक्कर आते हैं: तो इसे 8 आरपीएम तक कम करें और केवल बाइनॉरल रखें।"
        },
      unexpected: {
          es: "Hormigueo en labios o entumecimiento de manos: hipocapnia leve por Bhastrika. Normal y temporal. Si aparece: reduce el ritmo respiratorio 1–2 rpm hasta que pase.",
          en: "Lip tingling or hand numbness: mild hypocapnia from Bhastrika. Normal and temporary. If it appears: reduce breathing rate by 1–2 rpm until it passes.",
          fr: "Picotements aux lèvres ou engourdissement des mains : légère hypocapnie due à Bhastrika. Normal et temporaire. Si ces symptômes apparaissent : réduire la fréquence respiratoire de 1 à 2 respirations par minute jusqu’à disparition des symptômes.",
          pt: "Formigamento nos lábios ou dormência nas mãos: hipocapnia leve causada por Bhastrika. Normal e temporária. Caso ocorra: reduza a frequência respiratória em 1 a 2 respirações por minuto até que passe.",
          zh: "嘴唇刺痛或手部麻木：这是由于风箱式呼吸法引起的轻度低碳酸血症。属于正常现象，且为暂时性。如果出现这种情况：将呼吸频率降低1-2次/分钟，直至症状消失。",
          hi: "होंठों में झुनझुनी या हाथों का सुन्न होना: भस्त्रिका के कारण हल्का हाइपोकैपनिया। सामान्य और अस्थायी। यदि ऐसा हो: सांस लेने की दर को 1-2 आरपीएम कम कर दें जब तक कि यह ठीक न हो जाए।"
        },
      stop: {
          es: "Mareo intenso, visión borrosa o sensación de desmayo: para inmediatamente y respira normalmente. Nunca hacer Bhastrika de pie o en agua.",
          en: "Intense dizziness, blurred vision, or fainting sensation: stop immediately and breathe normally. Never do Bhastrika standing or in water.",
          fr: "En cas de vertiges intenses, de vision trouble ou de sensation de faiblesse, arrêtez immédiatement et respirez normalement. Ne pratiquez jamais le Bhastrika debout ou dans l&#39;eau.",
          pt: "Tontura intensa, visão turva ou sensação de desmaio: pare imediatamente e respire normalmente. Nunca pratique Bhastrika em pé ou na água.",
          zh: "出现强烈头晕、视力模糊或昏厥感：立即停止练习并正常呼吸。切勿站立或在水中练习风箱式呼吸法。",
          hi: "तेज चक्कर आना, धुंधली दृष्टि या बेहोशी महसूस होने पर तुरंत रुक जाएं और सामान्य रूप से सांस लें। भस्त्रिका कभी भी खड़े होकर या पानी में न करें।"
        }
    },

    guide: {
      when: {
          es: "Mañana, preferiblemente en ayunas o 2h después de comer. No usar después de las 17h — puede interferir con el sueño. Sentado o acostado.",
          en: "Morning, preferably fasting or 2h after eating. Don't use after 5pm — can interfere with sleep. Seated or lying down.",
          fr: "Le matin, de préférence à jeun ou 2 heures après un repas. Ne pas utiliser après 17 h – risque de perturbation du sommeil. À prendre en position assise ou allongée.",
          pt: "De manhã, de preferência em jejum ou 2 horas após a refeição. Não use após as 17h — pode interferir no sono. Sentado ou deitado.",
          zh: "早上服用，最好空腹或饭后两小时。下午5点后请勿服用，以免影响睡眠。可坐着或躺着服用。",
          hi: "सुबह के समय, खाली पेट या भोजन करने के दो घंटे बाद इसका प्रयोग करें। शाम 5 बजे के बाद इसका प्रयोग न करें - इससे नींद में खलल पड़ सकता है। बैठकर या लेटकर इसका प्रयोग करें।"
        },
      duration: { min: 5, recommended: 15, max: 20 },
      sequence: {
          es: "Usar como apertura de sesión de trabajo cognitivo intenso. Salir con Alpha 10 Hz 3 min. No más de 20 min seguidos.",
          en: "Use as opening for intense cognitive work session. Exit with Alpha 10 Hz for 3 min. No more than 20 min continuous.",
          fr: "À utiliser en introduction d&#39;une séance de travail cognitif intense. Terminer par une stimulation alpha à 10 Hz pendant 3 minutes. Ne pas dépasser 20 minutes consécutives.",
          pt: "Utilize como abertura para uma sessão de trabalho cognitivo intenso. Finalize com Alpha 10 Hz por 3 minutos. Não ultrapasse 20 minutos contínuos.",
          zh: "用作高强度认知工作环节的开场白。结束后以 10 Hz 的 Alpha 波播放 3 分钟。连续使用时间不得超过 20 分钟。",
          hi: "गहन संज्ञानात्मक कार्य सत्र की शुरुआत के रूप में इसका प्रयोग करें। 3 मिनट के लिए 10 हर्ट्ज़ अल्फा ध्वनि के साथ सत्र समाप्त करें। निरंतर 20 मिनट से अधिक न करें।"
        },
      contraindications: {
          es: "Epilepsia, embarazo, hipertensión no controlada, problemas cardiovasculares, historial de desmayos. NUNCA de pie, en agua o conduciendo.",
          en: "Epilepsy, pregnancy, uncontrolled hypertension, cardiovascular problems, history of fainting. NEVER standing, in water or driving.",
          fr: "Épilepsie, grossesse, hypertension non contrôlée, problèmes cardiovasculaires, antécédents de syncope. Ne jamais rester debout, dans l&#39;eau ou conduire.",
          pt: "Epilepsia, gravidez, hipertensão não controlada, problemas cardiovasculares, histórico de desmaios. NUNCA fique em pé, na água ou dirigindo.",
          zh: "癫痫、怀孕、未控制的高血压、心血管疾病、晕厥史。切勿站立、在水中或驾驶。",
          hi: "मिर्गी, गर्भावस्था, अनियंत्रित उच्च रक्तचाप, हृदय संबंधी समस्याएं, बेहोशी का इतिहास। खड़े होने, पानी में रहने या गाड़ी चलाने की स्थिति में कभी भी इसका इस्तेमाल न करें।"
        }
    },

    tags: ["gamma", "MIT", "cognitivo", "cognitive", "neuroplasticidad", "neuroplasticity", "alzheimer", "bhastrika", "mañana", "morning"]
  },


  {
    id: "gamma25",
    category: "binaural",
    type: ["binaural", "breathing"],
    sessions: [
      { id: "foco",    priority: 3 },
      { id: "energia", priority: 4 }
    ],
    scientificLevel: "emerging",
    color: "#e05555",

    name: { es: "Gamma 25 Hz — Cognitivo", en: "Gamma 25 Hz — Cognitive", fr: "Gamma 25 Hz — Cognitif", pt: "Gamma 25 Hz — Cognitivo" },
    description: {
      es: "Procesamiento Cognitivo",
      en: "Cognitive Processing",
      fr: "Traitement Cognitif",
      pt: "Processamento Cognitivo"
    },
    longDescription: {
          es: "Gamma bajo (25 Hz) es la versión sostenible de la estimulación gamma. A diferencia de 40 Hz, puede mantenerse durante horas sin generar fatiga. El Box Breathing equilibra la activación gamma con la estabilidad del SNA — evita que la estimulación cognitiva derive en tensión o ansiedad. Es el preset ideal para trabajo profundo de largo aliento donde Gamma 40 Hz sería excesivo.",
          en: "Low gamma (25 Hz) is the sustainable version of gamma stimulation. Unlike 40 Hz, it can be maintained for hours without generating fatigue. Box Breathing balances gamma activation with ANS stability — prevents cognitive stimulation from turning into tension or anxiety. It's the ideal preset for long-haul deep work where Gamma 40 Hz would be excessive.",
          fr: "La stimulation gamma basse (25 Hz) est une version durable de la stimulation gamma. Contrairement à la stimulation à 40 Hz, elle peut être maintenue pendant des heures sans provoquer de fatigue. La respiration carrée équilibre l&#39;activation gamma et la stabilité du système nerveux autonome, empêchant ainsi la stimulation cognitive de se transformer en tension ou en anxiété. C&#39;est le réglage idéal pour les tâches cognitives profondes et prolongées, pour lesquelles une stimulation gamma à 40 Hz serait excessive.",
          pt: "A estimulação gama baixa (25 Hz) é a versão sustentável da estimulação gama. Ao contrário da estimulação de 40 Hz, ela pode ser mantida por horas sem gerar fadiga. A respiração quadrada equilibra a ativação gama com a estabilidade do SNA (Sistema Nervoso Autônomo) — impedindo que a estimulação cognitiva se transforme em tensão ou ansiedade. É a configuração ideal para trabalho profundo de longa duração, onde a estimulação gama de 40 Hz seria excessiva.",
          zh: "低伽马波（25赫兹）是伽马波刺激的可持续版本。与40赫兹不同，它可以持续数小时而不会产生疲劳。箱式呼吸法平衡了伽马波激活和自主神经系统稳定性，防止认知刺激转化为紧张或焦虑。对于长时间深度工作而言，它是理想的预设模式，因为40赫兹的伽马波会造成过大的影响。",
          hi: "कम गामा (25 हर्ट्ज़) गामा उत्तेजना का टिकाऊ रूप है। 40 हर्ट्ज़ के विपरीत, इसे थकान पैदा किए बिना घंटों तक बनाए रखा जा सकता है। बॉक्स ब्रीदिंग गामा सक्रियण और एएनएस स्थिरता के बीच संतुलन बनाती है - संज्ञानात्मक उत्तेजना को तनाव या चिंता में बदलने से रोकती है। यह लंबे समय तक चलने वाले गहन कार���य के लिए आदर्श प्रीसेट है, जहाँ 40 हर्ट्ज़ गामा अत्यधिक हो सकता है।"
        },

    audio: {
      binaural: true,
      beat: 25,
      carrier: 450,
      perception: {
        optimal: { min: 350, max: 600 },
        degradation: {
          es: "Beat 25 Hz / Carrier 450 Hz = 5.5% — rango óptimo de percepción binaural. Con carrier inferior a 300 Hz el beat de 25 Hz puede percibirse como vibrato rápido. La percepción de 25 Hz binaural requiere auriculares — con altavoces la diferencia de fase no llega a cada oído de forma independiente.",
          en: "Beat 25 Hz / Carrier 450 Hz = 5.5% — optimal binaural perception range. With carrier below 300 Hz the 25 Hz beat can be perceived as fast vibrato. Perception of 25 Hz binaural requires headphones — with speakers the phase difference doesn't reach each ear independently.",
          fr: "Battement à 25 Hz / Porteuse à 450 Hz = 5,5 % — plage optimale de perception binaurale. Avec une porteuse inférieure à 300 Hz, le battement à 25 Hz peut être perçu comme un vibrato rapide. La perception binaurale du battement à 25 Hz nécessite un casque audio ; avec des haut-parleurs, la différence de phase n&#39;atteint pas chaque oreille indépendamment.",
          pt: "Batida de 25 Hz / Portadora de 450 Hz = 5,5% — faixa ideal de percepção binaural. Com a portadora abaixo de 300 Hz, a batida de 25 Hz pode ser percebida como um vibrato rápido. A percepção binaural de 25 Hz requer fones de ouvido — com alto-falantes, a diferença de fase não chega a cada ouvido independentemente.",
          zh: "25 Hz 节拍 / 450 Hz 载波 = 5.5% — 最佳双耳感知范围。当载波频率低于 300 Hz 时，25 Hz 的节拍会被感知为快速颤音。感知 25 Hz 的双耳声音需要使用耳机——使用扬声器时，相位差无法分别到达左右耳。",
          hi: "बीट 25 हर्ट्ज़ / कैरियर 450 हर्ट्ज़ = 5.5% — इष्टतम द्विश्रव्य बोध सीमा। 300 हर्ट्ज़ से नीचे कैरियर के साथ, 25 हर्ट्ज़ की बीट को तीव्र कंपन के रूप में अनुभव किया जा सकता है। 25 हर्ट्ज़ द्विश्रव्य बोध के लिए हेडफ़ोन आवश्यक हैं — स्पीकर के साथ, ध्वनि अंतर प्रत्येक कान तक स्वतंत्र रूप से नहीं पहुँचता ह��।"
        },
        why: {
          es: "25 Hz está en el rango donde el sistema auditivo tiene buena resolución temporal pero el beat aún no es tan rápido como para confundirse con tono puro. El carrier 450 Hz ofrece una relación señal/beat óptima para esta frecuencia.",
          en: "25 Hz is in the range where the auditory system has good temporal resolution but the beat isn't yet so fast as to be confused with a pure tone. The 450 Hz carrier offers an optimal signal/beat ratio for this frequency.",
          fr: "La fréquence de 25 Hz se situe dans la plage où le système auditif possède une bonne résolution temporelle, mais où le battement n&#39;est pas encore suffisamment rapide pour être confondu avec un son pur. La porteuse à 450 Hz offre un rapport signal/battement optimal pour cette fréquence.",
          pt: "A frequência de 25 Hz está na faixa em que o sistema auditivo possui boa resolução temporal, mas a pulsação ainda não é tão rápida a ponto de ser confundida com um tom puro. A portadora de 450 Hz oferece uma relação sinal/pulso ideal para essa frequência.",
          zh: "25 Hz 的频率范围，在这个范围内，听觉系统具有良好的时间分辨率，但拍频又不会快到与纯音混淆。450 Hz 的载波频率在该频率下具有最佳的信号/拍频比。",
          hi: "25 हर्ट्ज़ वह रेंज है जहाँ श्रवण तंत्र की समय संबंधी स्पष्टता अच्छी होती है, लेकिन ध्वनि इतनी तेज़ नहीं होती कि उसे शुद्ध स्वर समझ लिया जाए। 450 हर्ट्ज़ कैरियर इस आवृत्ति के लिए इष्टतम सिग्नल/बीट अनुपात प्रदान करता है।"
        }
      }
    },

    breathing: {
      pattern: "box",
      bpm: 4,
      ratio: 1.0,
      holdFull: 4,
      holdEmpty: 4
    },

    tuning: {
      audio: {
        beat: {
          min: 20, max: 30, step: 1,
          lower: {
          es: "20–22 Hz: zona beta/gamma. Muy sostenible, ideal para 2–4 horas de trabajo.",
          en: "20–22 Hz: beta/gamma zone. Very sustainable, ideal for 2–4 hours of work.",
          fr: "20–22 Hz : zone bêta/gamma. Très durable, idéal pour 2 à 4 heures de travail.",
          pt: "20–22 Hz: zona beta/gama. Muito sustentável, ideal para 2 a 4 horas de trabalho.",
          zh: "20–22 Hz：β/γ频段。非常持久，适合2–4小时工作。",
          hi: "20-22 हर्ट्ज़: बीटा/गामा ज़ोन। बेहद टिकाऊ, 2-4 घंटे के काम के लिए आदर्श।"
        },
          higher: {
          es: "27–30 Hz: gamma medio. Mayor activación, útil para tareas complejas de análisis. Máximo 2 horas seguidas.",
          en: "27–30 Hz: mid gamma. Greater activation, useful for complex analysis tasks. Maximum 2 hours continuous.",
          fr: "27–30 Hz : gamma moyen. Activation accrue, utile pour les tâches d’analyse complexes. Durée maximale : 2 heures en continu.",
          pt: "27–30 Hz: gama média. Maior ativação, útil para tarefas de análise complexas. Máximo de 2 horas contínuas.",
          zh: "27–30 Hz：中伽马波段。激活程度较高，适用于复杂的分析任务。最长连续使用时间为 2 小时。",
          hi: "27–30 हर्ट्ज़: मध्य गामा। अधिक सक्रियता, जटिल विश्लेषण कार्यों के लिए उपयोगी। अधिकतम 2 घंटे निरंतर।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Capacidad de mantener múltiples hilos de pensamiento simultáneamente",
          "Lectura y comprensión más fluidas — menos necesidad de releer",
          "Sensación de 'estar en la zona' sin tensión",
          "Menos distracción ante interrupciones"
        ],
        en: [
          "Ability to maintain multiple simultaneous thought threads",
          "More fluid reading and comprehension — less need to reread",
          "'In the zone' feeling without tension",
          "Less distraction from interruptions"
        ]
      },
      adjust: {
          es: "Si 40 Hz te resulta intenso o genera ansiedad, empieza aquí. Este preset es el punto de entrada gamma para personas sensibles a la estimulación alta. Mueve hacia 30 Hz cuando necesites más activación, hacia 20 Hz si hay tensión.",
          en: "If 40 Hz feels intense or generates anxiety, start here. This preset is the gamma entry point for people sensitive to high stimulation. Move toward 30 Hz when more activation is needed, toward 20 Hz if tension arises.",
          fr: "Si la fréquence de 40 Hz vous semble intense ou anxiogène, commencez par celle-ci. Ce préréglage est le point d&#39;entrée gamma pour les personnes sensibles aux fortes stimulations. Passez à 30 Hz si vous avez besoin de plus d&#39;activation, ou à 20 Hz si vous ressentez des tensions.",
          pt: "Se 40 Hz parecer intenso ou gerar ansiedade, comece por aqui. Essa configuração predefinida é o ponto de entrada gama para pessoas sensíveis a alta estimulação. Passe para 30 Hz quando precisar de mais ativação e para 20 Hz se surgir tensão.",
          zh: "如果 40 Hz 的频率让你感觉过于强烈或引发焦虑，请从这里开始。这个预设频率是伽马波的起始点，适合对高刺激敏感的人。如果需要更多激活，请逐渐降低到 30 Hz；如果感到紧张，请逐渐降低到 20 Hz。",
          hi: "यदि 40 हर्ट्ज़ तीव्र लगता है या चिंता उत्पन्न करता है, तो यहीं से शुरू करें। यह प्रीसेट उन लोगों के लिए गामा का प्रारंभिक बिंदु है जो उच्च उत्तेजना के प्रति संवेदनशील होते हैं। अधिक सक्रियता की आवश्यकता होने पर 30 हर्ट्ज़ की ओर बढ़ें, और तनाव उत्पन्न होने पर 20 हर्ट्ज़ की ओर बढ़ें।"
        },
      unexpected: {
          es: "Sensación de 'calor mental': normal. Es la mayor actividad metabólica cortical del gamma.",
          en: "'Mental warmth' sensation: normal. It's the higher cortical metabolic activity of gamma.",
          fr: "Sensation de « chaleur mentale » : normale. Elle correspond à une activité métabolique corticale accrue due aux ondes gamma.",
          pt: "Sensação de &quot;calor mental&quot;: normal. Trata-se da atividade metabólica cortical superior da faixa gama.",
          zh: "“精神温暖”的感觉：正常。这是伽马波段较高的皮层代谢活动所致。",
          hi: "&#39;मानसिक गर्माहट&#39; की अनुभूति: सामान्य। यह गामा की उच्च कॉर्टिकल मेटाबोलिक गतिविधि है।"
        },
      stop: {
          es: "Dolor de cabeza sostenido (más de 5 min): reduce el beat o cambia a Beta 16 Hz. No usar con migraña activa.",
          en: "Sustained headache (more than 5 min): reduce beat or switch to Beta 16 Hz. Don't use with active migraine.",
          fr: "En cas de céphalée persistante (plus de 5 min) : réduire la fréquence ou passer à la bande bêta 16 Hz. Ne pas utiliser en cas de migraine aiguë.",
          pt: "Dor de cabeça persistente (mais de 5 minutos): reduza a frequência ou mude para Beta 16 Hz. Não use em caso de enxaqueca ativa.",
          zh: "持续性头痛（超过5分钟）：降低节拍或切换至16赫兹β波。偏头痛发作时请勿使用。",
          hi: "लगातार सिरदर्द (5 मिनट से अधिक): बीट कम करें या बीटा 16 हर्ट्ज़ पर स्विच करें। सक्रिय माइग्रेन में इसका प्रयोग न करें।"
        }
    },

    guide: {
      when: {
          es: "Mañana o tarde temprana. Puede usarse como fondo continuo durante sesiones de trabajo largas.",
          en: "Morning or early afternoon. Can be used as continuous background during long work sessions.",
          fr: "Le matin ou en début d&#39;après-midi. Peut être utilisé comme fond d&#39;écran continu lors de longues sessions de travail.",
          pt: "Manhã ou início da tarde. Pode ser usado como fundo contínuo durante longas sessões de trabalho.",
          zh: "上午或午后早些时候。可用作长时间工作时的连续背景音。",
          hi: "सुबह या दोपहर के शुरुआती समय में। लंबे कार्य सत्रों के दौरान इसे निरंतर पृष्ठभूमि ध्वनि के रूप में उपयोग किया जा सकता है।"
        },
      duration: { min: 10, recommended: 45, max: 120 },
      sequence: {
          es: "Puede precederse con Alpha 10 Hz (5 min) y terminarse con Alpha 10 Hz (5 min). Menos exigente que Gamma 40 — no requiere transición obligatoria.",
          en: "Can be preceded by Alpha 10 Hz (5 min) and ended with Alpha 10 Hz (5 min). Less demanding than Gamma 40 — doesn't require mandatory transition.",
          fr: "Peut être précédé et terminé par Alpha 10 Hz (5 min). Moins exigeant que Gamma 40 : aucune transition n’est requise.",
          pt: "Pode ser precedido por Alpha 10 Hz (5 min) e finalizado com Alpha 10 Hz (5 min). Menos exigente que Gamma 40 — não requer transição obrigatória.",
          zh: "可以先进行 Alpha 10 Hz（5 分钟）训练，再以 Alpha 10 Hz（5 分钟）训练结束。比 Gamma 40 训练要求低——不需要强制过渡。",
          hi: "इससे पहले अल्फा 10 हर्ट्ज़ (5 मिनट) का प्रयोग किया जा सकता है और इसका समापन भी अल्फा 10 हर्ट्ज़ (5 मिनट) से ही किया जा सकता है। यह गामा 40 की तुलना में कम जटिल है - इसमें अनिवार्य संक्रमण की आवश्यकता नहीं होती है।"
        },
      contraindications: {
          es: "Epilepsia, migraña activa. Precaución con ansiedad clínica.",
          en: "Epilepsy, active migraine. Caution with clinical anxiety.",
          fr: "Épilepsie, migraine active. Prudence en cas d&#39;anxiété clinique.",
          pt: "Epilepsia, enxaqueca ativa. Cuidado com ansiedade clínica.",
          zh: "癫痫、活动性偏头痛。伴有临床焦虑症时需谨慎。",
          hi: "मिर्गी, सक्रिय माइग्रेन। चिकित्सकीय चिंता के मामलों में सावधानी बरतें।"
        }
    },

    tags: ["gamma", "cognitivo", "cognitive", "trabajo", "work", "sostenible", "sustainable", "box-breathing"]
  },


  // ══════════════════════════════════════════════════════════════════════
  // HEALING — SOLFEGGIO & FRECUENCIAS TERAPÉUTICAS
  // ══════════════════════════════════════════════════════════════════════
  // Todos los presets healing añaden un beat binaural COHERENTE con el
  // estado target. El tono puro solfeggio actúa como frecuencia de
  // resonancia principal; el binaural actúa como estado portador del SNA.
  // Los dos mecanismos son independientes y se potencian mutuamente.
  // ══════════════════════════════════════════════════════════════════════

  {
    id: "hz174",
    category: "healing",
    type: ["tone", "binaural", "breathing"],
    sessions: [
      { id: "calma",      priority: 4 },
      { id: "liberacion", priority: 3 },
      { id: "sueno",      priority: 3 }
    ],
    scientificLevel: "traditional",
    color: "#e05555",

    name: { es: "174 Hz — Analgésico", en: "174 Hz — Analgesic", fr: "174 Hz — Analgésique", pt: "174 Hz — Analgésico" },
    description: {
      es: "Alivio del Dolor",
      en: "Pain Relief",
      fr: "Soulagement de la Douleur",
      pt: "Alívio da Dor"
    },
    longDescription: {
          es: "174 Hz es la frecuencia solfeggio más grave, asociada con efecto analgésico y alivio de tensión muscular crónica. Su mecanismo fisiológico más plausible es la estimulación del nervio vago a través de las vibraciones de baja frecuencia percibidas en el tronco. Se añade un binaural theta (5 Hz) que pone el SNA en estado de profunda relajación parasimpática — el estado en que la percepción del dolor disminuye más eficientemente.",
          en: "174 Hz is the lowest solfeggio frequency, associated with analgesic effects and chronic muscle tension relief. Its most plausible physiological mechanism is vagal nerve stimulation through low-frequency vibrations perceived in the trunk. A theta binaural (5 Hz) is added that puts the ANS in a state of deep parasympathetic relaxation — the state where pain perception decreases most efficiently.",
          fr: "La fréquence de 174 Hz est la plus basse du système solfège ; elle est associée à des effets analgésiques et au soulagement des tensions musculaires chroniques. Son mécanisme physiologique le plus plausible repose sur la stimulation du nerf vague par des vibrations de basse fréquence perçues dans le tronc. Un stimulus binaural thêta (5 Hz) est ajouté, induisant un état de relaxation parasympathique profonde du système nerveux autonome – état dans lequel la perception de la douleur diminue le plus efficacement.",
          pt: "174 Hz é a frequência solfeggio mais baixa, associada a efeitos analgésicos e alívio da tensão muscular crônica. Seu mecanismo fisiológico mais plausível é a estimulação do nervo vago por meio de vibrações de baixa frequência percebidas no tronco. Um sinal binaural theta (5 Hz) é adicionado, colocando o SNA em um estado de profundo relaxamento parassimpático — o estado em que a percepção da dor diminui com maior eficiência.",
          zh: "174赫兹是最低的唱名频率，与镇痛效果和缓解慢性肌肉紧张有关。其最可能的生理机制是通过躯干感知到的低频振动刺激迷走神经。加入θ双耳节拍（5赫兹）可使自主神经系统进入深度副交感神经放松状态——在这种状态下，疼痛感知会最有效地降低。",
          hi: "174 हर्ट्ज़ सबसे कम सोलफेगियो आवृत्ति है, जो दर्द निवारक प्रभावों और पुरानी मांसपेशियों के तनाव से राहत दिलाने से संबंधित है। इसका सबसे संभावित शारीरिक तंत्र धड़ में महसूस होने वाले निम्न-आवृत्ति कंपन के माध्यम से वेगस तंत्रिका की उत्तेजना है। इसमें एक थीटा बाइनॉरल (5 हर्ट्ज़) जोड़ा जाता है जो एएनएस को गहरी पैरासिम्पेथेटिक विश्राम की स्थिति में डालता है - वह स्थिति जहां दर्द की अनुभूति सबसे प्रभावी ढंग से कम हो जाती है।"
        },

    audio: {
      binaural: true,
      beat: 5,
      carrier: 174,
      tone: 174,
      perception: {
        optimal: { min: 160, max: 200 },
        degradation: {
          es: "174 Hz ES el carrier en este preset. El beat binaural de 5 Hz se crea como diferencia entre 174 Hz (oído izquierdo) y 179 Hz (oído derecho). Esta es la única forma de mantener el tono solfeggio original mientras se añade el efecto binaural. Con auriculares, el tono principal es 174 Hz y el beat theta emerge como pulsación suave sobre él.",
          en: "174 Hz IS the carrier in this preset. The 5 Hz binaural beat is created as the difference between 174 Hz (left ear) and 179 Hz (right ear). This is the only way to maintain the original solfeggio tone while adding the binaural effect. With headphones, the main tone is 174 Hz and the theta beat emerges as a soft pulsation over it.",
          fr: "Dans ce préréglage, la fréquence porteuse est de 174 Hz. Le battement binaural de 5 Hz est créé par la différence entre 174 Hz (oreille gauche) et 179 Hz (oreille droite). C&#39;est le seul moyen de conserver la note solfège originale tout en ajoutant l&#39;effet binaural. Avec un casque, la note principale est de 174 Hz et le battement thêta apparaît comme une douce pulsation superposée.",
          pt: "174 Hz é a portadora nesta predefinição. A batida binaural de 5 Hz é criada como a diferença entre 174 Hz (ouvido esquerdo) e 179 Hz (ouvido direito). Esta é a única maneira de manter o tom original do solfejo enquanto se adiciona o efeito binaural. Com fones de ouvido, o tom principal é 174 Hz e a batida theta surge como uma pulsação suave sobreposta a ele.",
          zh: "在这个预设中，174 Hz 是载波频率。5 Hz 的双耳节拍是通过 174 Hz（左耳）和 179 Hz（右耳）之间的频率差产生的。这是在添加双耳效果的同时保持原始唱名音调的唯一方法。使用耳机时，主音为 174 Hz，θ 节拍则以柔和的脉动形式叠加在其上。",
          hi: "इस प्रीसेट में 174 Hz मुख्य आवृत्ति है। 5 Hz की द्विध्वनिक ध्वनि 174 Hz (बाएँ कान) और 179 Hz (दाएँ कान) के अंतर से उत्पन्न होती है। द्विध्वनिक प्रभाव जोड़ते हुए मूल सोलफेगियो ध्वनि को बनाए रखने का यही एकमात्र तरीका है। हेडफ़ोन के साथ, मुख्य ध्वनि 174 Hz होती है और थीटा ध्वनि इसके ऊपर एक हल्की स्पंदन के रूप में उभरती है।"
        },
        why: {
          es: "La frecuencia de 174 Hz cae en el rango de máxima conducción de vibración del cráneo humano (150–200 Hz). Esto significa que además de escucharse, se percibe como vibración física en el cráneo y el pecho — lo que amplifica el efecto somatosensorial del tono.",
          en: "The 174 Hz frequency falls in the range of maximum vibration conduction of the human skull (150–200 Hz). This means that in addition to being heard, it is perceived as physical vibration in the skull and chest — amplifying the somatosensory effect of the tone.",
          fr: "La fréquence de 174 Hz se situe dans la plage de conduction vibratoire maximale du crâne humain (150–200 Hz). Cela signifie qu&#39;en plus d&#39;être entendue, elle est perçue comme une vibration physique au niveau du crâne et de la poitrine, amplifiant ainsi l&#39;effet somatosensoriel du son.",
          pt: "A frequência de 174 Hz situa-se na faixa de condução máxima de vibração do crânio humano (150–200 Hz). Isso significa que, além de ser ouvida, ela é percebida como uma vibração física no crânio e no tórax — amplificando o efeito somatossensorial do tom.",
          zh: "174赫兹的频率落在人类头骨最大振动传导范围（150-200赫兹）内。这意味着，除了能听到声音之外，它还能被感知为头骨和胸部的物理振动——从而增强音调的体感效应。",
          hi: "174 हर्ट्ज़ की आवृत्ति मानव खोपड़ी की अधिकतम कंपन संचरण सीमा (150-200 हर्ट्ज़) में आती है। इसका अर्थ यह है कि इसे सुनने के साथ-साथ खोपड़ी और छाती में शारीरिक कंपन के रूप में भी महसूस किया जाता है, जिससे ध्वनि का स्पर्श संवेदी प्रभाव बढ़ जाता है।"
        }
      }
    },

    breathing: {
      pattern: "coherencia",
      bpm: 5,
      ratio: 1.0,
      holdFull: 3,
      holdEmpty: 5
    },

    tuning: {
      audio: {
        tone: {
          min: 168, max: 180, step: 1,
          lower: {
          es: "168–172 Hz: más oscuro y grave. Mayor vibración percibida en el tórax. Para tensión profunda o dolor muscular crónico.",
          en: "168–172 Hz: darker and lower. Greater vibration perceived in the chest. For deep tension or chronic muscle pain.",
          fr: "168–172 Hz : son plus grave et plus sombre. Vibrations plus intenses perçues dans la poitrine. En cas de tension profonde ou de douleurs musculaires chroniques.",
          pt: "168–172 Hz: mais escuro e grave. Maior vibração percebida no peito. Para tensão profunda ou dor muscular crônica.",
          zh: "168–172 Hz：音调更低沉，声音更暗淡。胸部能感受到更强烈的振动感。适用于深层肌肉紧张或慢性肌肉疼痛。",
          hi: "168–172 हर्ट्ज़: गहरा और धीमा। सीने में अधिक कंपन महसूस होता है। गहरे तनाव या दीर्घकालिक मांसपेशियों के दर्द के लिए।"
        },
          higher: {
          es: "175–180 Hz: más brillante. Transición hacia el siguiente armónico solfeggio. Para sensibilidad auditiva alta o si el grave resulta incómodo.",
          en: "175–180 Hz: brighter. Transition toward the next solfeggio harmonic. For high auditory sensitivity or if the low tone feels uncomfortable.",
          fr: "175–180 Hz : son plus clair. Transition vers l’harmonique suivante du solfège. À recommander aux personnes ayant une forte sensibilité auditive ou si le son grave est désagréable.",
          pt: "175–180 Hz: mais brilhante. Transição para o próximo harmônico do solfejo. Para alta sensibilidade auditiva ou se o tom grave causar desconforto.",
          zh: "175–180 Hz：更明亮。过渡到下一个唱名谐波。适用于听觉敏感度较高或低音感觉不适的情况。",
          hi: "175–180 हर्ट्ज़: अधिक चमकदार। अगले सोल्फेगियो हार्मोनिक की ओर संक्रमण। उच्च श्रवण संवेदनशीलता वाले लोगों के लिए या यदि निम्न स्वर असहज लगता हो।"
        }
        }
      },
      breathing: {
        holdEmpty: {
          min: 0, max: 8, step: 1,
          lower: {
          es: "0–2s: flujo continuo. Bueno para personas con tensión muy alta o que no toleran las retenciones.",
          en: "0–2s: continuous flow. Good for people with very high tension or who don't tolerate retentions.",
          fr: "0–2 s : flux continu. Convient aux personnes souffrant d’une tension très élevée ou ne supportant pas la rétention urinaire.",
          pt: "0–2s: fluxo contínuo. Bom para pessoas com tensão muito alta ou que não toleram retenções.",
          zh: "0-2秒：持续流速。适合血压极高或无法耐受尿潴留的人。",
          hi: "0–2 सेकंड: निरंतर प्रवाह। बहुत अधिक तनाव वाले लोगों या जो पेशाब रोकने में असमर्थ हैं, उनके लिए अच्छा है।"
        },
          higher: {
          es: "6–8s: activación vagal máxima. La combinación de holdEmpty largo + 174 Hz puede producir una sensación de alivio muy marcada. Solo si no hay mareo.",
          en: "6–8s: maximum vagal activation. The combination of long holdEmpty + 174 Hz can produce a very marked sense of relief. Only if no dizziness.",
          fr: "6 à 8 s : activation vagale maximale. La combinaison d’un maintien prolongé du stimulus vide et d’une fréquence de 174 Hz peut procurer une sensation de soulagement très marquée, uniquement en l’absence de vertiges.",
          pt: "6–8 s: ativação vagal máxima. A combinação de uma respiração prolongada (Vazio) + 174 Hz pode produzir uma sensação de alívio muito acentuada. Somente se não houver tontura.",
          zh: "6-8秒：迷走神经最大程度激活。长时间保持空穴呼吸并配合174赫兹的刺激，可以产生非常明显的缓解感。前提是不会出现眩晕。",
          hi: "6-8 सेकंड: अधिकतम वेगस तंत्रिका सक्रियण। लंबे समय तक खाली रखने और 174 हर्ट्ज़ के संयोजन से काफी राहत मिल सकती है। केवल तभी जब चक्कर न आ रहे हों।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Reducción perceptible de tensión muscular (especialmente hombros, mandíbula, cuello)",
          "Sensación de 'peso' que cede en el área de tensión",
          "Calor suave irradiando desde el centro hacia la periferia",
          "Respiración que se profundiza espontáneamente"
        ],
        en: [
          "Perceptible reduction in muscle tension (especially shoulders, jaw, neck)",
          "Sensation of 'weight' releasing from the tension area",
          "Gentle warmth radiating from center to periphery",
          "Breathing deepening spontaneously"
        ]
      },
      adjust: {
          es: "Si después de 5 min no hay cambio perceptible: mueve el tono ±2 Hz. Tu frecuencia analgésica personal produce relajación muscular casi inmediata. No cambies más de 1 Hz cada vez y espera 1 min antes de ajustar.",
          en: "If after 5 min there's no perceptible change: move the tone ±2 Hz. Your personal analgesic frequency produces near-immediate muscle relaxation. Don't change more than 1 Hz at a time and wait 1 min before adjusting.",
          fr: "Si aucun changement n&#39;est perceptible après 5 minutes : modifiez la fréquence de ±2 Hz. Votre fréquence analgésique personnelle procure une relaxation musculaire quasi immédiate. Ne modifiez pas la fréquence de plus de 1 Hz à la fois et attendez 1 minute avant de procéder à un nouvel ajustement.",
          pt: "Se após 5 minutos não houver nenhuma mudança perceptível: ajuste o tom em ±2 Hz. Sua frequência analgésica pessoal produz relaxamento muscular quase imediato. Não altere mais de 1 Hz por vez e aguarde 1 minuto antes de ajustar.",
          zh: "如果 5 分钟后没有明显变化：将音调调整 ±2 Hz。您个人的镇痛频率能使肌肉几乎立即放松。每次调整不要超过 1 Hz，并且每次调整后等待 1 分钟。",
          hi: "यदि 5 मिनट के बाद भी कोई स्पष्ट परिवर्तन न दिखे, तो टोन को ±2 हर्ट्ज़ तक बदलें। आपकी व्यक्तिगत दर्द निवारक आवृत्ति लगभग तुरंत मांसपेशियों को शिथिल कर देती है। एक बार में 1 हर्ट्ज़ से अधिक न बदलें और समायोजन करने से पहले 1 मिनट प्रतीक्षा करें।"
        },
      unexpected: {
          es: "Sensación de vibración física en el pecho o cabeza: es el tono de 174 Hz siendo conducido por el cráneo. Es normal y es el mecanismo de acción somatosensorial.",
          en: "Sensation of physical vibration in the chest or head: it's the 174 Hz tone being conducted by the skull. Normal and it's the somatosensory mechanism of action.",
          fr: "Sensation de vibration physique dans la poitrine ou la tête : il s’agit du son de 174 Hz conduit par le crâne. C’est normal et cela relève du mécanisme somatosensoriel.",
          pt: "Sensação de vibração física no peito ou na cabeça: trata-se do tom de 174 Hz sendo conduzido pelo crânio. É normal e faz parte do mecanismo de ação somatossensorial.",
          zh: "胸部或头部感觉到物理振动：这是174赫兹的音调通过颅骨传导所致。这是正常现象，属于体感机制。",
          hi: "छाती या सिर में शारीरिक कंपन की अनुभूति: यह खोपड़ी द्वारा संचालित 174 हर्ट्ज़ की ध्वनि है। यह सामान्य है और यह सोमैटोसेंसरी क्रियाविधि का परिणाम है।"
        },
      stop: {
          es: "No reemplaza tratamiento médico para dolor agudo o crónico. Detener si el tono grave genera malestar gástrico.",
          en: "Does not replace medical treatment for acute or chronic pain. Stop if the low tone generates gastric discomfort.",
          fr: "Ne remplace pas un traitement médical pour les douleurs aiguës ou chroniques. Arrêtez l&#39;utilisation si la diminution du tonus provoque des troubles gastriques.",
          pt: "Não substitui o tratamento médico para dor aguda ou crônica. Interrompa o uso se a hipotonia causar desconforto gástrico.",
          zh: "不能替代急性或慢性疼痛的医疗治疗。如果低张力引起胃部不适，请停止使用。",
          hi: "यह तीव्र या दीर्घकालिक दर्द के लिए चिकित्सीय उपचार का विकल्प नहीं है। यदि निम्न टोन से पेट में असुविधा उत्पन्न होती है तो इसका उपयोग बंद कर दें।"
        }
    },

    guide: {
      when: {
          es: "Cuando hay tensión muscular activa, dolor de cabeza de tensión, o al final del día para liberar el cuerpo. Acostado es ideal.",
          en: "When there is active muscle tension, tension headache, or at end of day to release the body. Lying down is ideal.",
          fr: "En cas de tension musculaire, de céphalée de tension ou en fin de journée pour détendre le corps, la position allongée est idéale.",
          pt: "Quando há tensão muscular ativa, cefaleia tensional ou no final do dia para relaxar o corpo, deitar-se é o ideal.",
          zh: "当肌肉紧张、头痛加剧，或者一天结束时需要放松身体时，躺下是理想的选择。",
          hi: "जब मांसपेशियों में तनाव हो, सिरदर्द हो, या दिन के अंत में शरीर को आराम देने के लिए लेटना सबसे अच्छा होता है।"
        },
      duration: { min: 10, recommended: 20, max: 40 },
      sequence: {
          es: "Puede seguirse de Delta o Theta si el objetivo es sueño profundo después.",
          en: "Can be followed by Delta or Theta if the objective is deep sleep afterward.",
          fr: "Peut être suivi d&#39;ondes Delta ou Theta si l&#39;objectif est un sommeil profond par la suite.",
          pt: "Pode ser seguido por ondas Delta ou Theta se o objetivo for um sono profundo posteriormente.",
          zh: "如果目的是之后进入深度睡眠，可以接着进行Delta波或Theta波训练。",
          hi: "यदि उद्देश्य बाद में गहरी नींद लाना है तो इसके बाद डेल्टा या थीटा थेरेपी का प्रयोग किया जा सकता है।"
        },
      contraindications: {
          es: "No usar con dolores de causa desconocida sin evaluación médica. No reemplaza diagnóstico.",
          en: "Don't use with pain of unknown cause without medical evaluation. Doesn't replace diagnosis.",
          fr: "Ne pas utiliser en cas de douleur d&#39;origine inconnue sans avis médical. Ne remplace pas un diagnostic.",
          pt: "Não utilize em caso de dor de causa desconhecida sem avaliação médica. Não substitui o diagnóstico.",
          zh: "请勿在未进行医疗评估的情况下，对不明原因的疼痛使用本品。本品不能代替诊断。",
          hi: "बिना चिकित्सकीय जांच के अज्ञात कारण से होने वाले दर्द में इसका प्रयोग न करें। यह निदान का विकल्प नहीं है।"
        }
    },

    tags: ["dolor", "pain", "analgésico", "analgesic", "solfeggio", "vagal", "tensión", "tension", "noche", "evening"]
  },


  {
    id: "hz396",
    category: "healing",
    type: ["tone", "binaural", "breathing"],
    sessions: [
      { id: "liberacion", priority: 1 },
      { id: "calma",      priority: 3 }
    ],
    scientificLevel: "traditional",
    color: "#e8a020",

    name: { es: "396 Hz — Liberación", en: "396 Hz — Liberation", fr: "396 Hz — Libération", pt: "396 Hz — Liberação" },
    description: {
      es: "Libera Miedo & Culpa",
      en: "Releases Fear & Guilt",
      fr: "Libère Peur & Culpabilité",
      pt: "Libera Medo & Culpa"
    },
    longDescription: {
          es: "396 Hz es la frecuencia solfeggio de liberación emocional. Se añade un binaural alpha bajo (7 Hz) que reduce la actividad del córtex prefrontal — el área donde el juicio autocrítico reside — y permite que las emociones se muevan con menos filtro cognitivo. La exhale más larga (ratio 0.7) y el holdEmpty extendido crean el 'espacio de soltar': un momento de vaciamiento fisiológico que el sistema nervioso usa para procesar y liberar tensión emocional acumulada.",
          en: "396 Hz is the solfeggio frequency of emotional release. A low alpha binaural (7 Hz) is added that reduces prefrontal cortex activity — the area where self-critical judgment resides — allowing emotions to move with less cognitive filtering. The longer exhale (ratio 0.7) and extended holdEmpty create the 'release space': a moment of physiological emptying the nervous system uses to process and release accumulated emotional tension.",
          fr: "396 Hz est la fréquence solfège de la libération émotionnelle. Un stimulus binaural alpha faible (7 Hz) est ajouté afin de réduire l&#39;activité du cortex préfrontal – la zone où se situe le jugement autocritique – permettant ainsi aux émotions de s&#39;exprimer avec moins de filtrage cognitif. L&#39;expiration plus longue (ratio 0,7) et la rétention prolongée créent « l&#39;espace de libération » : un moment de vidange physiologique que le système nerveux utilise pour traiter et libérer les tensions émotionnelles accumulées.",
          pt: "396 Hz é a frequência solfeggio da liberação emocional. Um sinal binaural alfa baixo (7 Hz) é adicionado para reduzir a atividade do córtex pré-frontal — a área onde reside o julgamento autocrítico — permitindo que as emoções fluam com menos filtragem cognitiva. A expiração mais longa (proporção de 0,7) e a retenção prolongada da respiração criam o &quot;espaço de liberação&quot;: um momento de esvaziamento fisiológico que o sistema nervoso utiliza para processar e liberar a tensão emocional acumulada.",
          zh: "396赫兹是情绪释放的唱名频率。加入低频α双耳节拍（7赫兹）可以降低前额叶皮层的活动——前额叶皮层是自我批判判断的所在区域——从而使情绪能够更少地受到认知过滤。更长的呼气（比例0.7）和更长时间的屏息创造了“释放空间”：这是神经系统用来处理和释放累积情绪紧张的生理空虚时刻。",
          hi: "396 हर्ट्ज़ भावनात्मक मुक्ति की सोलफेगियो आवृत्ति है। इसमें एक कम अल्फा बाइनॉरल (7 हर्ट्ज़) जोड़ा गया है जो प्रीफ्रंटल कॉर्टेक्स की गतिविधि को कम करता है - वह क्षेत्र जहां आत्म-आलोचनात्मक निर्णय मौजूद होते हैं - जिससे भावनाओं को कम संज्ञानात्मक फ़िल्टरिंग के साथ प्रवाहित होने की अनुमति मिलती है। लंबी साँस छोड़ना (अनुपात 0.7) और लंबे समय तक साँस रोके रखना &#39;मुक्ति स्थान&#39; बनाते हैं: तंत्रिका तंत्र द्वारा संचित भावनात्मक तनाव को संसाधित करने और मुक्त करने के लिए उपयोग किया जाने वाला शारीरिक रूप से खाली होने का एक क्षण।"
        },

    audio: {
      binaural: true,
      beat: 7,
      carrier: 396,
      tone: 396,
      perception: {
        optimal: { min: 380, max: 420 },
        degradation: {
          es: "396 Hz como carrier con beat 7 Hz: oído izquierdo recibe 396 Hz, derecho 403 Hz. La diferencia de 7 Hz genera el beat alpha. En este rango de carrier (400 Hz) la percepción binaural es muy eficiente. No bajar el carrier de 380 Hz para mantener la relación señal/beat correcta.",
          en: "396 Hz as carrier with 7 Hz beat: left ear receives 396 Hz, right ear 403 Hz. The 7 Hz difference generates the alpha beat. In this carrier range (400 Hz) binaural perception is very efficient. Don't lower carrier below 380 Hz to maintain the correct signal/beat relationship.",
          fr: "Signal porteur à 396 Hz avec un battement à 7 Hz : l’oreille gauche reçoit 396 Hz, l’oreille droite 403 Hz. La différence de 7 Hz génère le battement alpha. Dans cette gamme de fréquences (400 Hz), la perception binaurale est optimale. Il est important de ne pas abaisser la fréquence porteuse en dessous de 380 Hz afin de préserver le rapport signal/battement.",
          pt: "396 Hz como portadora com batimento de 7 Hz: o ouvido esquerdo recebe 396 Hz e o ouvido direito 403 Hz. A diferença de 7 Hz gera o batimento alfa. Nessa faixa de portadora (400 Hz), a percepção binaural é muito eficiente. Não reduza a portadora abaixo de 380 Hz para manter a relação correta entre sinal e batimento.",
          zh: "以 396 Hz 为载波频率，7 Hz 为拍频：左耳接收到 396 Hz，右耳接收到 403 Hz。这 7 Hz 的频率差产生了 α 拍频。在这个载波频率范围（400 Hz）内，双耳听觉非常有效。为了保持正确的信号/拍频关系，请勿将载波频率降低到 380 Hz 以下。",
          hi: "396 हर्ट्ज़ को वाहक ध्वनि के रूप में और 7 हर्ट्ज़ की प्रतिध्वनि (बीट) के साथ प्रयोग करने पर, बायां कान 396 हर्ट्ज़ और दायां कान 403 हर्ट्ज़ की प्रतिध्वनि ग्रहण करता है। 7 हर्ट्ज़ का यह अंतर अल्फा प्रतिध्वनि उत्पन्न करता है। इस वाहक सीमा (400 हर्ट्ज़) में द्विकर्णीय बोध अत्यंत प्रभावी होता है। सही संकेत/प्रतिध्वनि संबंध बनाए रखने के लिए वाहक आवृत्ति को 380 हर्ट्ज़ से नीचे न करें।"
        },
        why: {
          es: "396 Hz cae en el rango medio-bajo de la voz humana. Es una frecuencia que el sistema auditivo procesa con alta resolución emocional — el mismo rango donde las inflexiones de la voz comunican miedo o consuelo. Esto puede explicar por qué algunos usuarios sienten esta frecuencia como 'familiar' o 'materna'.",
          en: "396 Hz falls in the mid-low range of the human voice. It's a frequency the auditory system processes with high emotional resolution — the same range where voice inflections communicate fear or comfort. This may explain why some users feel this frequency as 'familiar' or 'maternal'.",
          fr: "La fréquence de 396 Hz se situe dans le registre médium-grave de la voix humaine. C&#39;est une fréquence que le système auditif traite avec une grande précision émotionnelle — la même gamme où les intonations vocales communiquent la peur ou le réconfort. Cela peut expliquer pourquoi certains utilisateurs perçoivent cette fréquence comme « familière » ou « maternelle ».",
          pt: "A frequência de 396 Hz situa-se na faixa médio-grave da voz humana. É uma frequência que o sistema auditivo processa com alta resolução emocional — a mesma faixa em que as inflexões da voz comunicam medo ou conforto. Isso pode explicar por que alguns usuários percebem essa frequência como &quot;familiar&quot; ou &quot;maternal&quot;.",
          zh: "396赫兹位于人声的中低频段。听觉系统能够以较高的情感分辨率处理这个频率——语音语调的变化也正是在这个频段内传递恐惧或安慰等情绪。这或许可以解释为什么有些用户会觉得这个频率“熟悉”或“充满母爱”。",
          hi: "396 हर्ट्ज़ मानव आवाज की मध्य-निम्न श्रेणी में आता है। यह एक ऐसी आवृत्ति है जिसे श्रवण तंत्र उच्च भावनात्मक स्पष्टता के साथ संसाधित करता है - वही श्रेणी जहां आवाज के उतार-चढ़ाव भय या आराम को व्यक्त करते हैं। शायद यही कारण है कि कुछ उपयोगकर्ताओं को यह आवृत्ति &#39;परिचित&#39; या &#39;मातृवत&#39; लगती ���ै।"
        }
      }
    },

    breathing: {
      pattern: "coherencia",
      bpm: 5,
      ratio: 0.7,
      holdFull: 2,
      holdEmpty: 6
    },

    tuning: {
      audio: {
        tone: {
          min: 390, max: 404, step: 1,
          lower: {
          es: "390–393 Hz: más oscuro y grave. Sensación de liberación hacia abajo y hacia dentro. Para liberación de miedo profundo o culpa arraigada.",
          en: "390–393 Hz: darker and lower. Releasing sensation downward and inward. For releasing deep fear or rooted guilt.",
          fr: "390–393 Hz : fréquences plus sombres et plus graves. Libération des sensations vers le bas et l’intérieur. Pour libérer les peurs profondes ou la culpabilité enracinée.",
          pt: "390–393 Hz: frequência mais escura e grave. Libera sensações para baixo e para dentro. Indicado para liberar medo profundo ou culpa enraizada.",
          zh: "390–393赫兹：音调更低沉、更暗淡。向下向内释放感觉。用于释放深层的恐惧或根深蒂固的内疚感。",
          hi: "390–393 हर्ट्ज़: गहरा और नीचा। संवेदना को नीचे और भीतर की ओर मुक्त करता है। गहरे भय या जड़ जमाए अपराधबोध से मुक्ति दिलाने में सहायक।"
        },
          higher: {
          es: "398–404 Hz: más brillante. Liberación hacia afuera y hacia adelante. Para liberar resentimiento o vergüenza social.",
          en: "398–404 Hz: brighter. Releasing sensation outward and forward. For releasing resentment or social shame.",
          fr: "398–404 Hz : plus lumineux. Libère les sensations vers l’extérieur et vers l’avant. Pour se libérer du ressentiment ou de la honte sociale.",
          pt: "398–404 Hz: mais brilhante. Libera sensações para fora e para frente. Para liberar ressentimento ou vergonha social.",
          zh: "398–404 赫兹：更明亮。将感觉向外向前释放。用于释放怨恨或社会羞耻感。",
          hi: "398–404 हर्ट्ज़: अधिक चमकदार। संवेदना को बाहर और आगे की ओर मुक्त करता है। आक्रोश या सामाजिक शर्म से मुक्ति पाने के लिए।"
        }
        }
      },
      breathing: {
        holdEmpty: {
          min: 3, max: 10, step: 1,
          lower: {
          es: "3–4s: retención suave. Introductoria. Para personas que nunca han trabajado con respiración y retenciones.",
          en: "3–4s: gentle retention. Introductory. For people who have never worked with breathing and retentions.",
          fr: "3 à 4 secondes : rétention douce. Niveau débutant. Pour les personnes n’ayant jamais pratiqué la respiration et la rétention.",
          pt: "3–4 segundos: retenção suave. Introdutório. Para pessoas que nunca trabalharam com respiração e retenções.",
          zh: "3-4秒：轻柔屏息。入门级练习。适合从未进行过呼吸和屏息练习的人。",
          hi: "3-4 सेकंड: धीरे-धीरे सांस रोकें। परिचयात्मक। उन लोगों के लिए जिन्होंने पहले कभी सांस लेने और सांस रोकने का अभ्यास नहीं किया है।"
        },
          higher: {
          es: "7–10s: el 'espacio de soltar' profundo. En este rango pueden surgir llanto o risas espontáneas — son señales de liberación, no de disfunción. No las suprimas.",
          en: "7–10s: the deep 'release space'. In this range spontaneous crying or laughter may arise — they are signals of release, not dysfunction. Don't suppress them.",
          fr: "7 à 10 secondes : l’espace de libération profonde. Durant cette période, des pleurs ou des rires spontanés peuvent survenir ; ce sont des signes de libération, et non de dysfonctionnement. Ne les réprimez pas.",
          pt: "7 a 10 segundos: o profundo &quot;espaço de liberação&quot;. Nessa faixa, podem surgir choro ou riso espontâneos — são sinais de liberação, não de disfunção. Não os reprima.",
          zh: "7-10秒：深度“释放空间”。在这个时间段内，可能会自发地哭泣或大笑——这是释放的信号，而非功能障碍的信号。不要压抑它们。",
          hi: "7-10 सेकंड: यह गहरी &#39;राहत की अवस्था&#39; है। इस दौरान अनायास ही रोना या हंसना आ सकता है—ये राहत के संकेत हैं, न कि किसी विकार के। इन्हें दबाएं नहीं।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Nudo en el estómago o garganta que cede gradualmente",
          "Impulso de suspirar profundo o de forma involuntaria",
          "Sensación de 'aligerar' — como si un peso físico real se fuera",
          "Llanto suave o risas espontáneas (señales positivas, no de alarma)"
        ],
        en: [
          "Knot in stomach or throat that gradually releases",
          "Impulse to sigh deeply or involuntarily",
          "Sensation of 'lightening' — as if a real physical weight leaves",
          "Soft crying or spontaneous laughter (positive signals, not alarms)"
        ]
      },
      adjust: {
          es: "El holdEmpty largo es la clave. Si sientes resistencia a retener: empieza con 3s y sube 1s por sesión. La liberación emocional no se fuerza — se invita. Si la emoción es muy intensa y desbordante: reduce el holdEmpty a 4s y la bpm a 4.",
          en: "The long holdEmpty is the key. If you feel resistance to retaining: start with 3s and add 1s per session. Emotional release isn't forced — it's invited. If the emotion is very intense and overwhelming: reduce holdEmpty to 4s and bpm to 4.",
          fr: "Maintenir la contraction à vide pendant une longue durée est essentiel. Si vous éprouvez une résistance : commencez par 3 secondes et ajoutez 1 seconde par séance. La libération émotionnelle ne se force pas, elle se provoque. Si l’émotion est très intense et accablante : réduisez la contraction à vide à 4 secondes et le rythme à 4.",
          pt: "A chave é manter a respiração vazia por um longo período. Se sentir resistência em reter a respiração, comece com 3 segundos e adicione 1 segundo por sessão. A liberação emocional não é forçada, mas sim convidada. Se a emoção for muito intensa e avassaladora, reduza o tempo de retenção para 4 segundos e a frequência cardíaca para 4.",
          zh: "保持较长的空穴时间是关键。如果你感觉难以保持：从 3 秒开始，每次增加 1 秒。情绪释放不是强迫的，而是自然而然的。如果情绪非常强烈且难以承受：将空穴时间缩短至 4 秒，并将每分钟心跳数 (bpm) 缩短至 4。",
          hi: "लंबे समय तक सांस रोके रखना ही कुंजी है। अगर आपको सांस रोके रखने में कठिनाई हो रही है, तो 3 सेकंड से शुरू करें और हर सेशन में 1 सेकंड बढ़ाते जाएं। भावनाओं को जबरदस्ती बाहर निकालना जरूरी नहीं है, बल्कि यह स्वाभाविक है। अगर भावना बहुत तीव्र और हावी करने वाली हो, तो सांस रोके रखने का समय घटाकर 4 ���ेकंड कर दें और बीपीएम को 4 पर सेट कर दें।"
        },
      unexpected: {
          es: "Sensación de frío o de escalofríos: activación del sistema nervioso parasimpático profundo. Normal y señal positiva.",
          en: "Sensation of cold or chills: deep parasympathetic nervous system activation. Normal and positive signal.",
          fr: "Sensation de froid ou frissons : activation profonde du système nerveux parasympathique. Signal normal et positif.",
          pt: "Sensação de frio ou calafrios: ativação profunda do sistema nervoso parassimpático. Sinal normal e positivo.",
          zh: "感到寒冷或发冷：副交感神经系统深度激活。这是正常且积极的信号。",
          hi: "ठंड लगना या कंपकंपी महसूस होना: गहरे पैरासिम्पेथेटिक तंत्रिका तंत्र का सक्रिय होना। सामान्य और सकारात्मक संकेत।"
        },
      stop: {
          es: "Si el material emocional que emerge es traumático o perturbador: para la sesión. Este tipo de material requiere acompañamiento profesional, no solo audio.",
          en: "If the emotional material that emerges is traumatic or disturbing: stop the session. This type of material requires professional support, not just audio.",
          fr: "Si le contenu émotionnel qui émerge est traumatisant ou perturbant : interrompez la séance. Ce type de contenu nécessite un accompagnement professionnel, et non un simple enregistrement audio.",
          pt: "Se o material emocional que emergir for traumático ou perturbador, interrompa a sessão. Esse tipo de material requer apoio profissional, não apenas áudio.",
          zh: "如果录音中流露出的情绪内容令人痛苦或不安，请立即停止录音。这类内容需要专业人士的帮助，而不仅仅是录音。",
          hi: "यदि भावनात्मक सामग्री दर्दनाक या विचलित करने वाली हो, तो सत्र रोक दें। इस प्रकार की सामग्री के लिए केवल ऑडियो ही नहीं, बल्कि पेशेवर सहायता की आवश्यकता होती है।"
        }
    },

    guide: {
      when: {
          es: "Tarde o noche. Nunca antes de reuniones o tareas que requieran control emocional. Necesitas tiempo y espacio para procesar después.",
          en: "Afternoon or evening. Never before meetings or tasks requiring emotional control. You need time and space to process afterward.",
          fr: "L&#39;après-midi ou le soir. Jamais avant des réunions ou des tâches exigeant une maîtrise émotionnelle. Vous aurez besoin de temps et d&#39;espace pour assimiler l&#39;information ensuite.",
          pt: "À tarde ou à noite. Nunca antes de reuniões ou tarefas que exijam controle emocional. Você precisa de tempo e espaço para processar tudo depois.",
          zh: "下午或晚上。切勿在需要情绪控制的会议或任务之前进行。事后你需要时间和空间来消化吸收。",
          hi: "दोपहर या शाम के समय। बैठकों या भावनात्मक नियंत्रण की आवश्यकता वाले कार्यों से पहले कभी नहीं। आपको बाद में सोचने-समझने के लिए समय और स्थान चाहिए।"
        },
      duration: { min: 10, recommended: 20, max: 35 },
      sequence: {
          es: "Después: Alpha 10 Hz 5 min como integración. No hacer trabajo intelectual inmediatamente después.",
          en: "Afterward: Alpha 10 Hz 5 min as integration. Don't do intellectual work immediately afterward.",
          fr: "Ensuite : Alpha 10 Hz pendant 5 minutes pour l’intégration. Évitez toute activité intellectuelle immédiatement après.",
          pt: "Em seguida: Alfa 10 Hz por 5 minutos para integração. Não realize trabalho intelectual imediatamente após.",
          zh: "之后：以 10 Hz 的 Alpha 频率进行 5 分钟的整合训练。之后不要立即进行脑力工作。",
          hi: "इसके बाद: अल्फा 10 हर्ट्ज़ पर 5 मिनट का एकीकरण करें। इसके तुरंत बाद कोई बौद्धिक कार्य न करें।"
        },
      contraindications: {
          es: "Proceder con cuidado si hay historial de trauma no resuelto. No usar en estado de crisis emocional activa sin apoyo.",
          en: "Proceed with caution with history of unresolved trauma. Don't use in active emotional crisis without support.",
          fr: "À utiliser avec prudence en cas d&#39;antécédents de traumatisme non résolu. Ne pas utiliser en période de crise émotionnelle aiguë sans accompagnement.",
          pt: "Proceda com cautela em casos de histórico de trauma não resolvido. Não utilize durante crises emocionais ativas sem acompanhamento médico.",
          zh: "如有未解决的创伤史，请谨慎使用。在没有支持的情况下，请勿在情绪危机发作时使用。",
          hi: "यदि आपको पहले से कोई गंभीर आघात लगा हो जिसका समाधान न हुआ हो, तो सावधानी बरतें। भावनात्मक संकट की स्थिति में बिना किसी सहायता के इसका प्रयोग न करें।"
        }
    },

    tags: ["liberacion", "liberation", "miedo", "fear", "culpa", "guilt", "emocional", "emotional", "solfeggio"]
  },


  {
    id: "hz432",
    category: "healing",
    type: ["tone", "binaural", "breathing"],
    sessions: [
      { id: "calma",       priority: 5 },
      { id: "creatividad", priority: 4 },
      { id: "conexion",    priority: 4 }
    ],
    scientificLevel: "traditional",
    color: "#50b4c8",

    name: { es: "432 Hz — Natural", en: "432 Hz — Natural", fr: "432 Hz — Naturel", pt: "432 Hz — Natural" },
    description: {
      es: "Armonía Natural",
      en: "Natural Harmony",
      fr: "Harmonie Naturelle",
      pt: "Harmonia Natural"
    },
    longDescription: {
          es: "432 Hz es la afinación alternativa al LA estándar (440 Hz), usada históricamente en música clásica y folclórica de muchas culturas. Aunque la evidencia científica de sus propiedades únicas es limitada, la experiencia subjetiva de muchos usuarios es de mayor calidez y resonancia. Se añade un binaural alpha (10 Hz) para anclar el SNA en coherencia cardíaca mientras se explora el tono.",
          en: "432 Hz is the alternative tuning to standard A (440 Hz), historically used in classical and folk music of many cultures. While scientific evidence of its unique properties is limited, the subjective experience of many users is one of greater warmth and resonance. An alpha binaural (10 Hz) is added to anchor the ANS in heart coherence while exploring the tone.",
          fr: "Le 432 Hz est un accordage alternatif au la standard (440 Hz), utilisé historiquement dans la musique classique et folklorique de nombreuses cultures. Bien que les preuves scientifiques de ses propriétés uniques soient limitées, de nombreux utilisateurs ressentent subjectivement une plus grande chaleur et une meilleure résonance. Un stimulus binaural alpha (10 Hz) est ajouté pour ancrer le système nerveux autonome dans la cohérence cardiaque lors de l&#39;exploration de cette tonalité.",
          pt: "432 Hz é a afinação alternativa ao Lá padrão (440 Hz), historicamente usada na música clássica e folclórica de diversas culturas. Embora as evidências científicas de suas propriedades únicas sejam limitadas, a experiência subjetiva de muitos usuários é de maior calor e ressonância. Um estímulo binaural alfa (10 Hz) é adicionado para ancorar o SNA (Sistema Nervoso Autônomo) na coerência cardíaca durante a exploração do timbre.",
          zh: "432 Hz 是标准 A 音（440 Hz）的替代调音，历史上曾被许多文化的古典音乐和民间音乐所采用。虽然其独特特性的科学证据有限，但许多用户的主观体验是它更温暖、更有共鸣。在探索音调的过程中，会加入一个 10 Hz 的 α 双耳节拍，以帮助自主神经系统与心率保持同步。",
          hi: "432 हर्ट्ज़ मानक ए (440 हर्ट्ज़) का वैकल्पिक ट्यूनिंग है, जिसका उपयोग ऐतिहासिक रूप से कई संस्कृतियों के शास्त्रीय और लोक संगीत में किया जाता रहा है। हालांकि इसके अनूठे गुणों के वैज्ञानिक प्रमाण सीमित हैं, लेकिन कई उपयोगकर्ताओं का व्यक्तिगत अनुभव इसे अधिक गर्माहट और अनुनाद प्रदान करता है��� स्वर का अन्वेषण करते समय हृदय सामंजस्य में एएनएस को स्थिर करने के लिए एक अल्फा बाइनॉरल (10 हर्ट्ज़) जोड़ा जाता है।"
        },

    audio: {
      binaural: true,
      beat: 10,
      carrier: 432,
      tone: 432,
      perception: {
        optimal: { min: 420, max: 450 },
        degradation: {
          es: "432 Hz como carrier con beat 10 Hz: oído izquierdo 432 Hz, derecho 442 Hz. La diferencia de 10 Hz es la más fácilmente perceptible del sistema binaural. El carrier 432 Hz está en el rango óptimo para percepción clara del beat.",
          en: "432 Hz as carrier with 10 Hz beat: left ear 432 Hz, right ear 442 Hz. The 10 Hz difference is the most easily perceptible in the binaural system. The 432 Hz carrier is in the optimal range for clear beat perception.",
          fr: "Fréquence porteuse de 432 Hz avec un battement de 10 Hz : oreille gauche 432 Hz, oreille droite 442 Hz. La différence de 10 Hz est la plus facilement perceptible dans le système binaural. La fréquence porteuse de 432 Hz se situe dans la plage optimale pour une perception claire du battement.",
          pt: "432 Hz como portadora com batimento de 10 Hz: ouvido esquerdo 432 Hz, ouvido direito 442 Hz. A diferença de 10 Hz é a mais facilmente perceptível no sistema binaural. A portadora de 432 Hz está na faixa ideal para uma percepção clara do batimento.",
          zh: "以 432 Hz 为载波频率，10 Hz 为拍频：左耳 432 Hz，右耳 442 Hz。10 Hz 的频率差在双耳系统中最容易被感知。432 Hz 的载波频率处于清晰感知拍频的最佳范围内。",
          hi: "432 हर्ट्ज़ को वाहक ध्वनि के रूप में और 10 हर्ट्ज़ की लय के साथ: बाएँ कान में 432 हर्ट्ज़, दाएँ कान में 442 हर्ट्ज़। 10 हर्ट्ज़ का अंतर द्विश्रव्य प्रणाली में सबसे आसानी से महसूस किया जा सकता है। 432 हर्ट्ज़ वाहक ध्वनि स्पष्ट लय बोध के लिए इष्टतम सीमा में है।"
        },
        why: {
          es: "432 Hz y 440 Hz (LA estándar) son perceptiblemente diferentes para el sistema auditivo entrenado — solo 8 Hz de diferencia, pero en el rango donde la sensibilidad auditiva humana es máxima (300–500 Hz). Esto hace que la diferencia entre las dos afinaciones sea más notable subjetivamente que matemáticamente.",
          en: "432 Hz and 440 Hz (standard A) are perceptibly different for the trained auditory system — only 8 Hz difference, but in the range where human auditory sensitivity is maximum (300–500 Hz). This makes the difference between the two tunings more notable subjectively than mathematically.",
          fr: "Les fréquences 432 Hz et 440 Hz (la norme) sont perceptibles pour un système auditif entraîné — seulement 8 Hz d&#39;écart, mais dans la plage où la sensibilité auditive humaine est maximale (300-500 Hz). Cela rend la différence entre les deux accordages plus perceptible subjectivement que mathématiquement.",
          pt: "As frequências de 432 Hz e 440 Hz (padrão A) são perceptivelmente diferentes para o sistema auditivo treinado — apenas 8 Hz de diferença, mas na faixa em que a sensibilidade auditiva humana é máxima (300–500 Hz). Isso faz com que a diferença entre as duas afinações seja mais notável subjetivamente do que matematicamente.",
          zh: "对于训练有素的听觉系统而言，432 Hz 和 440 Hz（标准 A）之间存在可感知的差异——虽然仅相差 8 Hz，但这恰好处于人类听觉最敏感的频率范围（300–500 Hz）。这使得两种调谐方式之间的差异在主观上比在数学上更为显著。",
          hi: "प्रशिक्षित श्रवण प्रणाली के लिए 432 हर्ट्ज़ और 440 हर्ट्ज़ (मानक ए) में स्पष्ट अंतर है - केवल 8 हर्ट्ज़ का अंतर, लेकिन यह उस सीमा में है जहां मानव श्रवण संवेदनशीलता अधिकतम होती है (300-500 हर्ट्ज़)। इससे दोनों ट्यूनिंग के बीच का अंतर गणितीय रूप से अधिक व्यक्तिपरक रूप से उल्लेखनीय हो जाता है।"
        }
      }
    },

    breathing: {
      pattern: "coherencia",
      bpm: 6,
      ratio: 1.0,
      holdFull: 2,
      holdEmpty: 2
    },

    tuning: {
      audio: {
        tone: {
          min: 426, max: 440, step: 1,
          lower: {
          es: "426–430 Hz: zona más oscura e introspectiva. Para exploración contemplativa y meditación.",
          en: "426–430 Hz: darker and more introspective zone. For contemplative exploration and meditation.",
          fr: "426–430 Hz : zone plus sombre et introspective. Pour l’exploration contemplative et la méditation.",
          pt: "426–430 Hz: zona mais escura e introspectiva. Para exploração contemplativa e meditação.",
          zh: "426–430赫兹：较为阴暗、内省的区域。适合沉思探索和冥想。",
          hi: "426–430 हर्ट्ज़: अधिक गहन और आत्मनिरीक्षण वाला क्षेत्र। चिंतनशील अन्वेषण और ध्यान के लिए।"
        },
          higher: {
          es: "433–440 Hz: transición hacia 440 Hz estándar. Si en 432 Hz no percibes diferencia con la música habitual, intenta 435 Hz — es el punto donde muchos oídos detectan la transición.",
          en: "433–440 Hz: transition toward standard 440 Hz. If at 432 Hz you don't perceive difference from usual music, try 435 Hz — it's the point where many ears detect the transition.",
          fr: "433–440 Hz : transition vers la fréquence standard de 440 Hz. Si à 432 Hz vous ne percevez aucune différence avec la musique habituelle, essayez 435 Hz ; c’est à ce niveau que beaucoup d’oreilles détectent la transition.",
          pt: "433–440 Hz: transição para o padrão de 440 Hz. Se em 432 Hz você não perceber diferença em relação à música usual, tente 435 Hz — este é o ponto em que muitos ouvidos detectam a transição.",
          zh: "433–440 Hz：向标准 440 Hz 过渡。如果您在 432 Hz 时感觉不到与普通音乐的区别，请尝试 435 Hz——这是许多人耳朵能够察觉到过渡的点。",
          hi: "433–440 हर्ट्ज़: मानक 440 हर्ट्ज़ की ओर संक्रमण। यदि 432 हर्ट्ज़ पर आपको सामान्य संगीत से कोई अंतर महसूस नहीं होता है, तो 435 हर्ट्ज़ पर प्रयास करें — यह वह बिंदु है जहाँ कई श्रोता संक्रमण को पहचान लेते हैं।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "El tono se siente 'cálido' — no invasivo ni brillante en exceso",
          "Estado de presencia sin pensamiento activo",
          "Vibración perceptible en el cráneo o el pecho",
          "Sensación de que la música circundante 'suena diferente' o más rica"
        ],
        en: [
          "The tone feels 'warm' — not invasive or overly bright",
          "State of presence without active thinking",
          "Perceptible vibration in skull or chest",
          "Sensation that surrounding music 'sounds different' or richer"
        ]
      },
      adjust: {
          es: "Este preset tiene el mayor componente subjetivo. Tu frecuencia puede estar en 429, 433 o 436 Hz. Mueve de a 1 Hz con 1 min de escucha en cada punto. La señal correcta es un tono que se siente 'en casa' — sin buscar activamente el efecto.",
          en: "This preset has the largest subjective component. Your frequency may be at 429, 433 or 436 Hz. Move in 1 Hz steps with 1 min of listening at each point. The correct signal is a tone that feels 'at home' — without actively seeking the effect.",
          fr: "Ce préréglage présente la plus grande composante subjective. Votre fréquence peut être de 429, 433 ou 436 Hz. Procédez par paliers de 1 Hz, en écoutant pendant 1 minute à chaque palier. Le signal idéal est une tonalité qui vous semble naturelle, sans que vous ayez à rechercher activement cet effet.",
          pt: "Esta predefinição tem o maior componente subjetivo. Sua frequência pode ser de 429, 433 ou 436 Hz. Mova-se em incrementos de 1 Hz, ouvindo por 1 minuto em cada ponto. O sinal correto é um tom que parece &quot;natural&quot; — sem que você precise buscar ativamente o efeito.",
          zh: "这个预设的主观因素最多。你的频率可能是 429、433 或 436 Hz。以 1 Hz 为步长调整频率，每个频率点聆听 1 分钟。正确的信号是一种让你感觉“自在”的音调——无需刻意追求这种效果。",
          hi: "इस प्रीसेट में व्यक्तिपरक पहलू सबसे अधिक महत्वपूर्ण है। आपकी आवृत्ति 429, 433 या 436 हर्ट्ज़ हो सकती है। प्रत्येक बिंदु पर 1 मिनट तक सुनते हुए 1 हर्ट्ज़ के चरणों में आगे बढ़ें। सही सिग्नल वह टोन है जो सहज और स्वाभाविक लगे — बिना किसी विशेष प्रभाव की तलाश किए।"
        },
      unexpected: {
          es: "Nada inesperado reportado. Es el preset más suave del sistema.",
          en: "Nothing unexpected reported. It's the system's softest preset.",
          fr: "Aucun problème inattendu n&#39;a été signalé. Il s&#39;agit du préréglage le plus doux du système.",
          pt: "Nada de inesperado foi relatado. É a configuração mais suave do sistema.",
          zh: "一切正常，未出现任何意外情况。这是系统最柔和的预设模式。",
          hi: "कोई अप्रत्याशित घटना दर्ज नहीं की गई। यह सिस्टम का सबसे नरम प्रीसेट है।"
        },
      stop: {
          es: "Sin contraindicaciones conocidas.",
          en: "No known contraindications.",
          fr: "Aucune contre-indication connue.",
          pt: "Não há contraindicações conhecidas.",
          zh: "无已知禁忌症。",
          hi: "कोई ज्ञात विपरीत संकेत नहीं हैं।"
        }
    },

    guide: {
      when: {
          es: "Cualquier momento. Especialmente bueno como fondo de trabajo, meditación o lectura.",
          en: "Any time. Especially good as background for work, meditation or reading.",
          fr: "À tout moment. Particulièrement agréable comme fond sonore pour travailler, méditer ou lire.",
          pt: "A qualquer hora. Especialmente bom como música de fundo para trabalho, meditação ou leitura.",
          zh: "任何时间都适用。尤其适合作为工作、冥想或阅读时的背景音乐。",
          hi: "किसी भी समय। काम करते समय, ध्यान लगाते समय या पढ़ते समय बैकग्राउंड म्यूजिक के रूप में विशेष रूप से अच्छा है।"
        },
      duration: { min: 5, recommended: 20, max: 60 },
      sequence: {
          es: "Puede combinarse con cualquier actividad. No requiere secuencia específica.",
          en: "Can be combined with any activity. Doesn't require specific sequence.",
          fr: "Peut être combiné avec n&#39;importe quelle activité. Ne nécessite pas de séquence spécifique.",
          pt: "Pode ser combinado com qualquer atividade. Não requer uma sequência específica.",
          zh: "可以与任何活动结合使用，无需特定顺序。",
          hi: "इसे किसी भी गतिविधि के साथ जोड़ा जा सकता है। इसके लिए किसी विशिष्ट क्रम की आवश्यकता नहीं है।"
        },
      contraindications: {
          es: "Ninguna conocida.",
          en: "None known.",
          fr: "Aucun connu.",
          pt: "Nenhuma conhecida.",
          zh: "目前尚无已知信息。",
          hi: "कोई ज्ञात नहीं।"
        }
    },

    tags: ["armonía", "harmony", "432", "natural", "musical", "exploratorio", "exploratory"]
  },


  {
    id: "hz528",
    category: "healing",
    type: ["tone", "binaural", "breathing"],
    sessions: [
      { id: "conexion",   priority: 1 },
      { id: "liberacion", priority: 2 },
      { id: "meditacion", priority: 4 }
    ],
    scientificLevel: "traditional",
    color: "#4ecb8a",

    name: { es: "528 Hz — Transformación", en: "528 Hz — Transformation", fr: "528 Hz — Transformation", pt: "528 Hz — Transformação" },
    description: {
      es: "Reparación & Corazón",
      en: "Repair & Heart",
      fr: "Réparation & Cœur",
      pt: "Reparação & Coração"
    },
    longDescription: {
          es: "528 Hz es la frecuencia solfeggio de transformación y reparación. Se asocia con el chakra del corazón y con la nota MI en temperamento justo. Se añade un binaural alpha (10 Hz) para coherencia cardíaca simultánea — el estado en que el campo electromagnético del corazón es más ordenado. Las retenciones equilibradas (holdFull = holdEmpty = 4s) crean un ciclo simétrico de 'recepción' y 'integración'.",
          en: "528 Hz is the solfeggio frequency of transformation and repair. It's associated with the heart chakra and with the note MI in just temperament. An alpha binaural (10 Hz) is added for simultaneous heart coherence — the state where the heart's electromagnetic field is most ordered. Balanced retentions (holdFull = holdEmpty = 4s) create a symmetric cycle of 'reception' and 'integration'.",
          fr: "528 Hz est la fréquence solfège de transformation et de réparation. Elle est associée au chakra du cœur et à la note mi en tempérament juste. Un stimulus binaural alpha (10 Hz) est ajouté pour une cohérence cardiaque simultanée – l’état où le champ électromagnétique du cœur est le plus harmonieux. Des rétentions équilibrées (maintien de la pleine conscience = maintien de la vide = 4 s) créent un cycle symétrique de « réception » et d’« intégration ».",
          pt: "528 Hz é a frequência solfeggio de transformação e reparação. Está associada ao chakra do coração e à nota MI no temperamento justo. Um sinal binaural alfa (10 Hz) é adicionado para coerência cardíaca simultânea — o estado em que o campo eletromagnético do coração está mais ordenado. Retenções equilibradas (segurar Completo = segurar Vazio = 4s) criam um ciclo simétrico de &#39;recepção&#39; e &#39;integração&#39;.",
          zh: "528赫兹是转化与修复的唱名频率，它与心轮以及纯律中的MI音符相关联。同时加入10赫兹的α双耳节拍，以达到心轮同步——此时心脏的电磁场最为有序。平衡的保持时间（满声保持 = 空声保持 = 4秒）创造了一个对称的“接收”与“整合”循环。",
          hi: "528 हर्ट्ज़ रूपांतरण और मरम्मत की सोल्फेगियो आवृत्ति है। यह हृदय चक्र और जस्ट टेम्परमेंट्स में MI नोट से संबंधित है। हृदय की समरूपता के लिए एक अल्फा बाइनॉरल (10 हर्ट्ज़) भी जोड़ा जाता है - यह वह अवस्था है जहाँ हृदय का विद्युतचुंबकीय क्षेत्र सबसे व्यवस्थित होता है। संतुलित प्रतिधारण (होल्ड फुल = होल्ड एम्प्टी = 4 सेकंड) &#39;ग्रहण&#39; और &#39;एकीकरण&#39; का एक सममित चक्र बनाते हैं।"
        },

    audio: {
      binaural: true,
      beat: 10,
      carrier: 528,
      tone: 528,
      perception: {
        optimal: { min: 510, max: 550 },
        degradation: {
          es: "528 Hz con beat 10 Hz: oído izquierdo 528 Hz, derecho 538 Hz. El carrier está justo en el rango de mayor sensibilidad auditiva humana (500–600 Hz), lo que hace que el beat de 10 Hz sea muy fácilmente perceptible. Es uno de los presets con mejor percepción binaural natural del sistema.",
          en: "528 Hz with 10 Hz beat: left ear 528 Hz, right ear 538 Hz. The carrier is right in the range of greatest human auditory sensitivity (500–600 Hz), making the 10 Hz beat very easily perceptible. It's one of the presets with the best natural binaural perception in the system.",
          fr: "528 Hz avec un battement de 10 Hz : oreille gauche 528 Hz, oreille droite 538 Hz. La fréquence porteuse se situe dans la plage de sensibilité auditive humaine maximale (500–600 Hz), ce qui rend le battement de 10 Hz très facilement perceptible. C’est l’un des préréglages offrant la meilleure perception binaurale naturelle du système.",
          pt: "528 Hz com batimento de 10 Hz: ouvido esquerdo 528 Hz, ouvido direito 538 Hz. A portadora está exatamente na faixa de maior sensibilidade auditiva humana (500–600 Hz), tornando o batimento de 10 Hz muito facilmente perceptível. É uma das predefinições com a melhor percepção binaural natural do sistema.",
          zh: "528 Hz 频率，10 Hz 节拍：左耳 528 Hz，右耳 538 Hz。载波频率恰好位于人耳听觉最敏感的频率范围（500–600 Hz）内，因此 10 Hz 的节拍非常容易被感知。它是系统中双耳听觉体验最佳的预设之一。",
          hi: "528 हर्ट्ज़, 10 हर्ट्ज़ की बीट के साथ: बायां कान 528 हर्ट्ज़, दायां कान 538 हर्ट्ज़। कैरियर ध्वनि मानव श्रवण संवेदनशीलता की उच्चतम सीमा (500-600 हर्ट्ज़) में आती है, जिससे 10 हर्ट्ज़ की बीट आसानी से सुनाई देती है। यह सिस्टम में सबसे अच्छी प्राकृतिक द्विश्रव्य अनुभूति प्रदान करने वाले प्रीसेट में से ��क है।"
        },
        why: {
          es: "528 Hz está en el rango de mayor amplitud de respuesta del oído humano. Esto significa que a igual volumen, se percibe como más 'presente' que frecuencias más bajas. Esta mayor presencia puede explicar la intensidad de la respuesta subjetiva que muchos usuarios reportan con este preset.",
          en: "528 Hz is in the range of greatest response amplitude of the human ear. This means that at equal volume, it is perceived as more 'present' than lower frequencies. This greater presence may explain the intensity of the subjective response many users report with this preset.",
          fr: "La fréquence de 528 Hz se situe dans la plage de réponse maximale de l&#39;oreille humaine. Cela signifie qu&#39;à volume égal, elle est perçue comme plus « présente » que les fréquences plus basses. Cette présence accrue pourrait expliquer l&#39;intensité de la réponse subjective rapportée par de nombreux utilisateurs avec ce préréglage.",
          pt: "A frequência de 528 Hz está na faixa de maior amplitude de resposta do ouvido humano. Isso significa que, com o mesmo volume, ela é percebida como mais &quot;presente&quot; do que as frequências mais baixas. Essa maior presença pode explicar a intensidade da resposta subjetiva que muitos usuários relatam com essa predefinição.",
          zh: "528 Hz 处于人耳响应幅度最大的频率范围内。这意味着在相同音量下，它比低频声音更“清晰”。这种更强的存在感或许可以解释许多用户在使用此预设时所报告的强烈主观感受。",
          hi: "528 हर्ट्ज़ मानव कान की अधिकतम प्रतिक्रिया आयाम सीमा में आता है। इसका अर्थ है कि समान वॉल्यूम पर, यह निम्न आवृत्तियों की तुलना में अधिक &#39;मौजूद&#39; महसूस होता है। यह अधिक मौजूदगी इस प्रीसेट के साथ कई उपयोगकर्ताओं द्वारा बताई गई तीव्र व्यक्तिपरक प्रतिक्रिया का कारण हो सकती है।"
        }
      }
    },

    breathing: {
      pattern: "coherencia",
      bpm: 5,
      ratio: 1.0,
      holdFull: 4,
      holdEmpty: 4
    },

    tuning: {
      audio: {
        tone: {
          min: 520, max: 540, step: 1,
          lower: {
          es: "520–524 Hz: zona más terrestre y cálida. Resonancia más en el pecho.",
          en: "520–524 Hz: more earthy and warm zone. Resonance more in the chest.",
          fr: "520–524 Hz : zone plus chaleureuse et terreuse. Résonance plus marquée dans la poitrine.",
          pt: "520–524 Hz: zona mais terrosa e quente. Ressonância mais presente no peito.",
          zh: "520–524 Hz：更偏向泥土气息和温暖感。共鸣点更多地位于胸腔。",
          hi: "520–524 हर्ट्ज़: अधिक प्राकृतिक और गर्म क्षेत्र। छाती में अधिक प्रतिध्वनि।"
        },
          higher: {
          es: "530–540 Hz: más brillante, resonancia hacia cabeza y garganta. Algunos sienten más apertura en la zona de la garganta.",
          en: "530–540 Hz: brighter, resonance toward head and throat. Some feel more opening in the throat area.",
          fr: "530–540 Hz : son plus brillant, résonance vers la tête et la gorge. Certaines personnes ressentent une plus grande ouverture au niveau de la gorge.",
          pt: "530–540 Hz: mais brilhante, ressonância em direção à cabeça e garganta. Alguns sentem maior abertura na área da garganta.",
          zh: "530–540 赫兹：声音更明亮，共鸣点偏向头部和喉咙。有些人感觉喉咙区域更加舒展。",
          hi: "530–540 हर्ट्ज़: अधिक चमकदार, सिर और गले की ओर अनुनाद। कुछ लोगों को गले के क्षेत्र में अधिक खुलापन महसूस होता है।"
        }
        },
        beat: {
          min: 8, max: 12, step: 0.5,
          lower: {
          es: "8 Hz: alpha profundo. Mayor receptividad emocional. Para trabajo de corazón más profundo.",
          en: "8 Hz: deep alpha. Greater emotional receptivity. For deeper heart work.",
          fr: "8 Hz : ondes alpha profondes. Réceptivité émotionnelle accrue. Pour un travail émotionnel plus profond.",
          pt: "8 Hz: alfa profundo. Maior receptividade emocional. Para um trabalho mais profundo com o coração.",
          zh: "8赫兹：深层阿尔法波。更强的情感感知力。用于更深层次的心灵疗愈。",
          hi: "8 हर्ट्ज़: डीप अल्फा। भावनात्मक ग्रहणशीलता में वृद्धि। गहन हृदय कार्य के लिए।"
        },
          higher: {
          es: "12 Hz: alpha alto. Más alerta. Para integración activa o si la profundidad alpha genera somnolencia.",
          en: "12 Hz: high alpha. More alert. For active integration or if alpha depth generates drowsiness.",
          fr: "12 Hz : ondes alpha élevées. Plus d’éveil. Pour une intégration active ou si la profondeur des ondes alpha engendre de la somnolence.",
          pt: "12 Hz: alfa alto. Mais alerta. Para integração ativa ou se a profundidade alfa gerar sonolência.",
          zh: "12赫兹：高α波。更清醒。适用于积极整合注意力或α波深度导致困倦的情况。",
          hi: "12 हर्ट्ज़: उच्च अल्फा आवृत्ति। अधिक सतर्कता। सक्रिय एकीकरण के लिए या यदि अल्फा आवृत्ति की अधिकता से उनींदापन महसूस होता है।"
        }
        }
      },
      breathing: {
        holdFull: {
          min: 2, max: 8, step: 1,
          lower: {
          es: "2s: mínimo funcional. Para principiantes con el sistema.",
          en: "2s: functional minimum. For system beginners.",
          fr: "2s : configuration minimale fonctionnelle. Pour les débutants.",
          pt: "2s: mínimo funcional. Para iniciantes no sistema.",
          zh: "2秒：功能最低要求。适用于系统初学者。",
          hi: "2s: कार्यात्मक न्यूनतम। सिस्टम के शुरुआती उपयोगकर्ताओं के लिए।"
        },
          higher: {
          es: "6–8s: máxima activación barorreceptora — el momento de mayor 'recepción'. La vibración de 528 Hz se percibe con mayor intensidad. Solo si la sensación es cómoda.",
          en: "6–8s: maximum baroreflex activation — the greatest 'reception' moment. The 528 Hz vibration is perceived with greater intensity. Only if the sensation is comfortable.",
          fr: "6 à 8 s : activation maximale du baroréflexe – moment de « réception » optimal. La vibration de 528 Hz est perçue avec une intensité accrue. Uniquement si la sensation est confortable.",
          pt: "6–8 s: ativação máxima do barorreflexo — o momento de maior &quot;recepção&quot;. A vibração de 528 Hz é percebida com maior intensidade. Somente se a sensação for confortável.",
          zh: "6-8秒：压力反射激活达到最大值——这是“接收”效果最强的时刻。此时，528赫兹的振动被感知得更加强烈。但前提是这种感觉是舒适的。",
          hi: "6-8 सेकंड: अधिकतम बैरोरिफ्लेक्स सक्रियण — सबसे तीव्र &#39;संवेदन&#39; क्षण। 528 हर्ट्ज़ कंपन को अधिक तीव्रता से महसूस किया जाता है। केवल तभी जब यह अनुभूति सुखद हो।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Vibración perceptible en el centro del pecho (zona del corazón)",
          "Desaparición del diálogo interno sin esfuerzo",
          "El tono se siente 'familiar', como un recuerdo antiguo",
          "Apertura o calor espontáneo en el pecho sin razón aparente"
        ],
        en: [
          "Perceptible vibration in the center of the chest (heart area)",
          "Internal dialogue disappearing without effort",
          "The tone feels 'familiar', like an old memory",
          "Spontaneous opening or warmth in the chest without apparent reason"
        ]
      },
      adjust: {
          es: "El 528 Hz es el preset más personal del sistema. Empieza en 528, mueve 1 Hz arriba, pausa 1 min. Luego 1 Hz abajo. Cuando el tono 'aterriza' en el pecho, no querrás ajustar más. Tu frecuencia puede estar en 524, 530, 533 o 535 Hz.",
          en: "528 Hz is the most personal preset in the system. Start at 528, move 1 Hz up, pause 1 min. Then 1 Hz down. When the tone 'lands' in the chest, you won't want to adjust further. Your frequency may be at 524, 530, 533 or 535 Hz.",
          fr: "528 Hz est le préréglage le plus personnalisé du système. Commencez à 528 Hz, augmentez de 1 Hz, faites une pause d&#39;une minute, puis diminuez de 1 Hz. Lorsque le son vous semblera bien centré sur la poitrine, vous n&#39;aurez plus besoin de le modifier. Votre fréquence idéale se situera peut-être à 524, 530, 533 ou 535 Hz.",
          pt: "528 Hz é a predefinição mais pessoal do sistema. Comece em 528 Hz, suba 1 Hz, faça uma pausa de 1 minuto e depois desça 1 Hz. Quando o tom &quot;chegar&quot; ao peito, você não precisará ajustar mais. Sua frequência pode estar em 524, 530, 533 ou 535 Hz.",
          zh: "528 Hz 是系统中最为个性化的预设频率。从 528 Hz 开始，向上调整 1 Hz，暂停 1 分钟。然后再向下调整 1 Hz。当声音“落入”胸腔时，就无需再进行调整。你的频率可能在 524 Hz、530 Hz、533 Hz 或 535 Hz。",
          hi: "528 हर्ट्ज़ इस सिस्टम का सबसे व्यक्तिगत प्रीसेट है। 528 से शुरू करें, 1 हर्ट्ज़ ऊपर जाएं, 1 मिनट रुकें। फिर 1 हर्ट्ज़ नीचे जाएं। जब ध्वनि आपके सीने में महसूस होने लगे, तो आपको आगे समायोजन करने की आवश्यकता नहीं होगी। आपकी आवृत्ति 524, 530, 533 या 535 हर्ट्ज़ हो सकती है।"
        },
      unexpected: {
          es: "Impulso de llorar sin saber por qué: respuesta emocional al campo cardíaco. Normal. No lo suprimas.",
          en: "Urge to cry without knowing why: emotional response to the cardiac field. Normal. Don't suppress it.",
          fr: "Envie de pleurer sans raison apparente : réaction émotionnelle au champ cardiaque. Normal. Ne la refoulez pas.",
          pt: "Vontade de chorar sem motivo aparente: resposta emocional ao estímulo cardíaco. Normal. Não reprima esse sentimento.",
          zh: "莫名其妙地想哭：这是心脏电场的正常反应，属于情绪反应，不要压抑。",
          hi: "बिना कारण जाने रोने की तीव्र इच्छा होना: हृदय क्षेत्र के प्रति भावनात्मक प्रतिक्रिया। सामान्य है। इसे दबाएँ नहीं।"
        },
      stop: {
          es: "Sin contraindicaciones agudas. Si el tono genera malestar en los oídos: baja el volumen — 528 Hz puede ser intenso a volúmenes altos.",
          en: "No acute contraindications. If the tone causes ear discomfort: lower volume — 528 Hz can be intense at high volumes.",
          fr: "Aucune contre-indication aiguë. Si le son provoque une gêne à l&#39;oreille : baisser le volume – le son à 528 Hz peut être intense à volume élevé.",
          pt: "Não há contraindicações agudas. Se o som causar desconforto no ouvido: diminua o volume — 528 Hz pode ser intenso em volumes altos.",
          zh: "无急性禁忌症。如果音调引起耳部不适：降低音量——528 Hz 的声音在高音量下可能过于刺耳。",
          hi: "कोई तत्काल विपरीत संकेत नहीं हैं। यदि ध्वनि से कान में असुविधा हो: वॉल्यूम कम करें — 528 हर्ट्ज़ उच्च वॉल्यूम पर तीव्र हो सकता है।"
        }
    },

    guide: {
      when: {
          es: "Mañana o mediodía. Antes de conversaciones importantes o trabajo de conexión emocional.",
          en: "Morning or midday. Before important conversations or emotional connection work.",
          fr: "Le matin ou en milieu de journée. Avant les conversations importantes ou le travail de connexion émotionnelle.",
          pt: "De manhã ou ao meio-dia. Antes de conversas importantes ou atividades que exijam conexão emocional.",
          zh: "上午或中午。在进行重要谈话或情感交流之前。",
          hi: "सुबह या दोपहर के समय। महत्वपूर्ण बातचीत या भावनात्मक जुड़ाव से पहले।"
        },
      duration: { min: 10, recommended: 20, max: 40 },
      sequence: {
          es: "Puede seguirse de 639 Hz para trabajo de conexión interpersonal.",
          en: "Can be followed by 639 Hz for interpersonal connection work.",
          fr: "Peut être suivi par 639 Hz pour le travail de connexion interpersonnelle.",
          pt: "Pode ser seguido por 639 Hz para trabalhos de conexão interpessoal.",
          zh: "之后可接 639 Hz 进行人际沟通工作。",
          hi: "पारस्परिक संबंधों को बेहतर बनाने के लिए इसके बाद 639 हर्ट्ज़ का उपयोग किया जा सकता है।"
        },
      contraindications: {
          es: "Ninguna conocida.",
          en: "None known.",
          fr: "Aucun connu.",
          pt: "Nenhuma conhecida.",
          zh: "目前尚无已知信息。",
          hi: "कोई ज्ञात नहीं।"
        }
    },

    tags: ["transformacion", "transformation", "528", "corazon", "heart", "solfeggio", "coherencia", "DNA"]
  },


  {
    id: "hz639",
    category: "healing",
    type: ["tone", "binaural", "breathing"],
    sessions: [
      { id: "conexion",    priority: 1 },
      { id: "calma",       priority: 4 }
    ],
    scientificLevel: "traditional",
    color: "#d4a84b",

    name: { es: "639 Hz — Conexión", en: "639 Hz — Connection", fr: "639 Hz — Connexion", pt: "639 Hz — Conexão" },
    description: {
      es: "Relaciones & Corazón",
      en: "Relationships & Heart",
      fr: "Relations & Cœur",
      pt: "Relações & Coração"
    },
    longDescription: {
          es: "639 Hz es la frecuencia solfeggio de las relaciones y la conexión interpersonal. Se añade un binaural alpha (10 Hz) para coherencia cardíaca — el estado en que el corazón irradia su campo electromagnético más ordenado hacia el entorno, lo que puede afectar la percepción de empatía y apertura. La retención llena de 3s es el momento de mayor campo cardíaco. El holdEmpty mínimo mantiene un estado de apertura, no de vaciamiento.",
          en: "639 Hz is the solfeggio frequency of relationships and interpersonal connection. An alpha binaural (10 Hz) is added for heart coherence — the state where the heart radiates its most ordered electromagnetic field to the environment, which can affect the perception of empathy and openness. The 3s full retention is the moment of greatest cardiac field. The minimal holdEmpty maintains a state of openness, not emptying.",
          fr: "639 Hz est la fréquence solfège des relations et des liens interpersonnels. Un stimulus alpha binaural (10 Hz) est ajouté pour favoriser la cohérence cardiaque – l’état dans lequel le cœur rayonne son champ électromagnétique le plus ordonné vers l’environnement, ce qui peut influencer la perception de l’empathie et de l’ouverture. La rétention complète de 3 secondes correspond au moment où le champ cardiaque est le plus intense. La rétention minimale (ou « holdEmpty ») maintient un état d’ouverture, sans vider complètement le potentiel.",
          pt: "639 Hz é a frequência solfeggio dos relacionamentos e da conexão interpessoal. Um sinal binaural alfa (10 Hz) é adicionado para promover a coerência cardíaca — o estado em que o coração irradia seu campo eletromagnético mais ordenado para o ambiente, o que pode afetar a percepção de empatia e abertura. A retenção completa de 3 segundos representa o momento de maior campo cardíaco. A retenção mínima (Vazio) mantém um estado de abertura, não de esvaziamento.",
          zh: "639赫兹是人际关系和人际联结的唱名频率。加入10赫兹的α双耳节拍，是为了增强心脏的协调性——在这种状态下，心脏向周围环境辐射出最有序的电磁场，这会影响同理心和开放性的感知。3秒的完全保持是心脏场最强的时刻。最小的保持空隙则维持一种开放的状态，而非清空。",
          hi: "639 हर्ट्ज़ रिश्तों और पारस्परिक जुड़ाव की सोलफेगियो आवृत्ति है। हृदय सामंजस्य के लिए एक अल्फा बाइनॉरल (10 हर्ट्ज़) जोड़ा गया है - वह अवस्था जहाँ हृदय अपने सबसे व्यवस्थित विद्युत चुम्बकीय क्षेत्र को वातावरण में विकीर्ण करता है, जो सहानुभूति और खुलेपन की अनुभूति को प्रभावित कर सकता है। 3 ��ेकंड का पूर्ण प्रतिधारण सबसे अधिक हृदय क्षेत्र का क्षण है। न्यूनतम होल्डएम्प्टी खुलेपन की स्थिति बनाए रखता है, न कि खालीपन की।"
        },

    audio: {
      binaural: true,
      beat: 10,
      carrier: 639,
      tone: 639,
      perception: {
        optimal: { min: 620, max: 660 },
        degradation: {
          es: "639 Hz con beat 10 Hz: oído izquierdo 639 Hz, derecho 649 Hz. El carrier está en el rango de alta sensibilidad auditiva (600–700 Hz). El beat de 10 Hz es muy perceptible en este carrier. Este es uno de los presets donde el binaural alpha se siente más claro.",
          en: "639 Hz with 10 Hz beat: left ear 639 Hz, right ear 649 Hz. The carrier is in the high auditory sensitivity range (600–700 Hz). The 10 Hz beat is very perceptible at this carrier. This is one of the presets where the alpha binaural is felt most clearly.",
          fr: "639 Hz avec un battement de 10 Hz : oreille gauche 639 Hz, oreille droite 649 Hz. La fréquence porteuse se situe dans la plage de haute sensibilité auditive (600–700 Hz). Le battement de 10 Hz est très perceptible à cette fréquence. C’est l’un des préréglages où le stimulus binaural alpha est le plus clairement ressenti.",
          pt: "639 Hz com batimento de 10 Hz: ouvido esquerdo 639 Hz, ouvido direito 649 Hz. A portadora está na faixa de alta sensibilidade auditiva (600–700 Hz). O batimento de 10 Hz é muito perceptível nesta portadora. Esta é uma das predefinições onde o estímulo binaural alfa é sentido com maior clareza.",
          zh: "639 Hz 频率，10 Hz 节拍：左耳 639 Hz，右耳 649 Hz。载波频率位于高听觉敏感度范围（600–700 Hz）。在此载波频率下，10 Hz 节拍非常明显。这是 alpha 双耳节拍感受最清晰的预设之一。",
          hi: "639 हर्ट्ज़, 10 हर्ट्ज़ बीट के साथ: बायां कान 639 हर्ट्ज़, दायां कान 649 हर्ट्ज़। कैरियर उच्च श्रवण संवेदनशीलता सीमा (600-700 हर्ट्ज़) में है। इस कैरियर पर 10 हर्ट्ज़ बीट स्पष्ट रूप से सुनाई देती है। यह उन प्रीसेट में से एक है जहां अल्फा बाइनॉरल प्रभाव सबसे स्पष्ट रूप से महसूस होता है।"
        },
        why: {
          es: "639 Hz está cerca del rango de la voz humana femenina aguda (soprano). El sistema auditivo tiene alta resolución emocional en este rango — las voces en este registro se perciben como cálidas, abiertas y conectoras. Esto puede explicar por qué este tono activa respuestas de conexión interpersonal.",
          en: "639 Hz is near the range of the high female human voice (soprano). The auditory system has high emotional resolution in this range — voices in this register are perceived as warm, open and connecting. This may explain why this tone activates interpersonal connection responses.",
          fr: "La fréquence de 639 Hz se situe à proximité de la tessiture de la voix féminine aiguë (soprano). Le système auditif possède une grande sensibilité émotionnelle dans cette gamme de fréquences : les voix de ce registre sont perçues comme chaleureuses, ouvertes et engageantes. Ceci pourrait expliquer pourquoi cette tonalité favorise les interactions sociales.",
          pt: "639 Hz está próximo da faixa da voz feminina aguda (soprano). O sistema auditivo possui alta resolução emocional nessa faixa — vozes nesse registro são percebidas como calorosas, abertas e que inspiram conexão. Isso pode explicar por que esse tom ativa respostas de conexão interpessoal.",
          zh: "639赫兹接近女性高音（女高音）的音域。听觉系统在这个频段具有很高的情感分辨力——这个音域的声音听起来温暖、开朗且富有感染力。这或许可以解释为什么这种音调能够激发人际交往的情感。",
          hi: "639 हर्ट्ज़ महिलाओं की उच्च स्वर-शैली (सोप्रानो) के करीब है। श्रवण तंत्र इस श्रेणी में उच्च भावनात्मक संवेदनशीलता रखता है - इस श्रेणी की आवाज़ें गर्मजोशी भरी, खुली और जुड़ाव पैदा करने वाली मानी जाती हैं। शायद यही कारण है कि यह स्वर पारस्परिक जुड़ाव की प्रतिक्रियाओं को सक्रिय करता है।"
        }
      }
    },

    breathing: {
      pattern: "coherencia",
      bpm: 6,
      ratio: 1.0,
      holdFull: 3,
      holdEmpty: 2
    },

    tuning: {
      audio: {
        tone: {
          min: 632, max: 646, step: 1,
          lower: {
          es: "632–635 Hz: más oscuro. Conexión más introspectiva, con uno mismo. Para preparar un estado de apertura interna.",
          en: "632–635 Hz: darker. More introspective connection, with oneself. For preparing a state of inner openness.",
          fr: "632–635 Hz : fréquences plus sombres. Connexion plus introspective avec soi-même. Pour préparer un état d’ouverture intérieure.",
          pt: "632–635 Hz: mais escuro. Conexão mais introspectiva, consigo mesmo. Para preparar um estado de abertura interior.",
          zh: "632–635 赫兹：较为暗沉。更内省，与自我连接。用于准备进入一种内心开放的状态。",
          hi: "632–635 हर्ट्ज़: अधिक गंभीर। आत्मनिरीक्षण, स्वयं से जुड़ाव। आंतरिक खुलेपन की स्थिति तैयार करने के लिए।"
        },
          higher: {
          es: "640–646 Hz: más brillante. Conexión más hacia afuera y hacia otros. Para antes de conversaciones o tiempo con seres queridos.",
          en: "640–646 Hz: brighter. More outward and other-directed connection. For before conversations or time with loved ones.",
          fr: "640–646 Hz : plus lumineux. Connexion plus tournée vers l’extérieur et vers autrui. À privilégier avant les conversations ou les moments passés avec ses proches.",
          pt: "640–646 Hz: mais brilhante. Conexão mais voltada para o exterior e para o outro. Para antes de conversas ou momentos com entes queridos.",
          zh: "640–646 赫兹：更明亮。更外向、更注重与他人的联系。适合在谈话前或与爱人相处时聆听。",
          hi: "640–646 हर्ट्ज़: अधिक चमकदार। अधिक बाहरी और दूसरों से जुड़ाव। बातचीत से पहले या प्रियजनों के साथ समय बिताने के लिए उपयुक्त।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Apertura espontánea en el centro del pecho",
          "Pensamiento espontáneo en personas queridas — sin nostalgia ni dolor",
          "Sensación de que el corazón 'late más amplio'",
          "Aumento de empatía — los estados de otros se perciben con más claridad"
        ],
        en: [
          "Spontaneous opening in the center of the chest",
          "Spontaneous thinking of loved ones — without nostalgia or pain",
          "Sensation that the heart 'beats more broadly'",
          "Increased empathy — others' states are perceived with more clarity"
        ]
      },
      adjust: {
          es: "Ideal para usar 10–15 min antes de conversaciones importantes. El holdFull 3s es el momento de mayor campo cardíaco — en ese espacio, visualiza brevemente a la persona con quien vas a hablar.",
          en: "Ideal for use 10–15 min before important conversations. HoldFull 3s is the moment of greatest cardiac field — in that space, briefly visualize the person you're going to talk with.",
          fr: "Idéal à utiliser 10 à 15 minutes avant une conversation importante. HoldFull 3s correspond au moment où votre champ cardiaque est le plus intense ; pendant ce court instant, visualisez brièvement la personne avec qui vous allez parler.",
          pt: "Ideal para usar de 10 a 15 minutos antes de conversas importantes. O HoldFull 3s é o momento de maior campo cardíaco — nesse espaço, visualize brevemente a pessoa com quem você vai conversar.",
          zh: "建议在重要谈话前 10-15 分钟使用。保持 3 秒是心率最强的时刻——在这段时间内，短暂地想象你即将谈话的对象。",
          hi: "महत्वपूर्ण बातचीत से 10-15 मिनट पहले उपयोग के लिए आदर्श। होल्डफुल 3 सेकंड वह क्षण होता है जब हृदय गति सबसे अधिक होती है - उस समय, संक्षेप में उस व्यक्ति की कल्पना करें जिससे आप बात करने वाले हैं।"
        },
      unexpected: {
          es: "Pensamientos de personas con quienes hay conflicto: señal de que el campo cardíaco está procesando esa relación. No los sigas activamente — observa y continúa.",
          en: "Thoughts of people with whom there's conflict: signal that the cardiac field is processing that relationship. Don't actively follow them — observe and continue.",
          fr: "Les pensées concernant les personnes avec lesquelles vous êtes en conflit indiquent que votre champ cardiaque est en train de traiter cette relation. N&#39;essayez pas de les suivre activement ; observez-les et poursuivez votre chemin.",
          pt: "Pensamentos sobre pessoas com quem há conflito: sinalizam que o campo cardíaco está processando esse relacionamento. Não os siga ativamente — observe e continue.",
          zh: "脑海中浮现与你存在冲突的人的念头：这表明你的心脏正在处理这段关系。不要主动去关注这些念头——观察并继续你的生活。",
          hi: "जिन लोगों से मतभेद हैं, उनके बारे में विचार आना यह संकेत देता है कि हृदय प्रणाली उस रिश्ते को संसाधित कर रही है। उन विचारों का सक्रिय रूप से अनुसरण न करें - बस अवलोकन करें और आगे बढ़ते रहें।"
        },
      stop: {
          es: "Sin contraindicaciones agudas.",
          en: "No acute contraindications.",
          fr: "Aucune contre-indication aiguë.",
          pt: "Não há contraindicações agudas.",
          zh: "无急性禁忌症。",
          hi: "कोई तीव्र विपरीत संकेत नहीं हैं।"
        }
    },

    guide: {
      when: {
          es: "Antes de conversaciones difíciles, reuniones importantes o tiempo en familia. También como práctica de gratitud o de amor incondicional.",
          en: "Before difficult conversations, important meetings or family time. Also as gratitude or unconditional love practice.",
          fr: "Avant des conversations difficiles, des réunions importantes ou des moments en famille. Également comme pratique de gratitude ou d&#39;amour inconditionnel.",
          pt: "Antes de conversas difíceis, reuniões importantes ou momentos em família. Também como prática de gratidão ou amor incondicional.",
          zh: "在进行艰难的谈话、重要会议或与家人共度时光之前。也可以作为感恩或无条件爱的练习。",
          hi: "कठिन बातचीत, महत्वपूर्ण बैठकों या पारिवारिक समय से पहले। साथ ही कृतज्ञता या निःशर्त प्रेम के अभ्यास के रूप में भी।"
        },
      duration: { min: 7, recommended: 15, max: 30 },
      sequence: {
          es: "Puede precederse de 528 Hz para mayor profundidad de apertura cardíaca.",
          en: "Can be preceded by 528 Hz for greater depth of cardiac opening.",
          fr: "Peut être précédé de 528 Hz pour une plus grande profondeur d&#39;ouverture cardiaque.",
          pt: "Pode ser precedido por 528 Hz para maior profundidade de abertura cardíaca.",
          zh: "可以先施加 528 Hz 的频率，以获得更深的心脏开放度。",
          hi: "हृदय के अधिक गहराई तक खुलने के लिए इससे पहले 528 हर्ट्ज़ का उपयोग किया जा सकता है।"
        },
      contraindications: {
          es: "Ninguna conocida.",
          en: "None known.",
          fr: "Aucun connu.",
          pt: "Nenhuma conhecida.",
          zh: "目前尚无已知信息。",
          hi: "कोई ज्ञात नहीं।"
        }
    },

    tags: ["conexion", "connection", "relaciones", "relationships", "corazon", "heart", "empatia", "empathy", "solfeggio"]
  },


  {
    id: "hz777",
    category: "healing",
    type: ["tone", "binaural", "breathing"],
    sessions: [
      { id: "meditacion", priority: 2 },
      { id: "liberacion", priority: 4 }
    ],
    scientificLevel: "traditional",
    color: "#9b7de8",

    name: { es: "777 Hz — Sanación", en: "777 Hz — Healing", fr: "777 Hz — Guérison", pt: "777 Hz — Cura" },
    description: {
      es: "Sanación Profunda",
      en: "Deep Healing",
      fr: "Guérison Profonde",
      pt: "Cura Profunda"
    },
    longDescription: {
          es: "777 Hz es una frecuencia de uso meditativo con raíces en numerología sagrada y tradiciones de sanación energética. Se añade un binaural theta (5 Hz) que lleva el SNA al estado contemplativo más profundo del sistema — el estado donde la percepción interna se amplifica y la resistencia del ego se reduce. Las retenciones largas y simétricas crean el máximo espacio de receptividad del sistema.",
          en: "777 Hz is a frequency of meditative use with roots in sacred numerology and energy healing traditions. A theta binaural (5 Hz) is added that takes the ANS to the system's deepest contemplative state — where internal perception is amplified and ego resistance decreases. The long symmetric retentions create the maximum receptivity space in the system.",
          fr: "La fréquence de 777 Hz est utilisée en méditation et puise ses racines dans la numérologie sacrée et les traditions de guérison énergétique. Un stimulus binaural thêta (5 Hz) y est ajouté, amenant le système nerveux autonome à un état contemplatif profond, où la perception interne est amplifiée et la résistance de l&#39;ego diminuée. Les longues périodes de rétention symétriques créent un espace de réceptivité maximal au sein du système.",
          pt: "777 Hz é uma frequência utilizada em meditação, com raízes na numerologia sagrada e nas tradições de cura energética. Um sinal binaural theta (5 Hz) é adicionado, levando o SNA (Sistema Nervoso Autônomo) ao estado contemplativo mais profundo do sistema — onde a percepção interna é amplificada e a resistência do ego diminui. As longas retenções simétricas criam o espaço de máxima receptividade no sistema.",
          zh: "777赫兹是一种冥想频率，源于神圣的数字命理学和能量疗愈传统。加入5赫兹的θ双耳节拍，能将自主神经系统带入最深层的冥想状态——在这种状态下，内在感知得到增强，自我阻力降低。长时间的对称保持能最大程度地提升系统的接受度。",
          hi: "777 हर्ट्ज़ एक ऐसी आवृत्ति है जिसका उपयोग ध्यान में किया जाता है और इसकी जड़ें पवित्र अंकशास्त्र और ऊर्जा उपचार परंपराओं में हैं। इसमें एक थीटा बाइनॉरल (5 हर्ट्ज़) जोड़ा गया है जो एएनएस को प्रणाली की सबसे गहरी चिंतनशील अवस्था में ले जाता है - जहाँ आंतरिक बोध तीव्र होता है और अहंकार का प्रतिरोध कम होता है। लंबे समय तक सममित प्रतिधारण प्रणाली में अधिकतम ग्रहणशीलता का स्थान बनाते हैं।"
        },

    audio: {
      binaural: true,
      beat: 5,
      carrier: 777,
      tone: 777,
      perception: {
        optimal: { min: 760, max: 800 },
        degradation: {
          es: "777 Hz con beat 5 Hz: oído izquierdo 777 Hz, derecho 782 Hz. A este carrier (700–800 Hz), el oído humano está acercándose al rango donde la detección de diferencias de fase es menos eficiente. El beat de 5 Hz es perceptible pero puede ser más sutil que en carriers más bajos. Si el beat no se percibe claramente, no subir más el carrier — en cambio, subir ligeramente el volumen del canal más suave.",
          en: "777 Hz with 5 Hz beat: left ear 777 Hz, right ear 782 Hz. At this carrier (700–800 Hz), the human ear is approaching the range where phase difference detection is less efficient. The 5 Hz beat is perceptible but may be more subtle than at lower carriers. If the beat isn't clearly perceived, don't raise the carrier further — instead, slightly raise the volume of the softer channel.",
          fr: "777 Hz avec un battement de 5 Hz : oreille gauche 777 Hz, oreille droite 782 Hz. À cette fréquence porteuse (700–800 Hz), l’oreille humaine approche de la plage où la détection des différences de phase est moins efficace. Le battement de 5 Hz est perceptible, mais peut être plus subtil qu’à des fréquences porteuses plus basses. Si le battement n’est pas clairement perçu, n’augmentez pas davantage la fréquence porteuse ; augmentez plutôt légèrement le volume du canal le plus faible.",
          pt: "777 Hz com batimento de 5 Hz: ouvido esquerdo 777 Hz, ouvido direito 782 Hz. Nessa frequência portadora (700–800 Hz), o ouvido humano se aproxima da faixa em que a detecção da diferença de fase é menos eficiente. O batimento de 5 Hz é perceptível, mas pode ser mais sutil do que em frequências portadoras mais baixas. Se o batimento não for claramente percebido, não aumente ainda mais a frequência portadora — em vez disso, aumente ligeiramente o volume do canal mais baixo.",
          zh: "777 Hz 带 5 Hz 拍频：左耳 777 Hz，右耳 782 Hz。在这个载波频率（700–800 Hz）下，人耳接近相位差检测效率较低的范围。5 Hz 拍频可以感知，但可能比低载波频率下更细微。如果拍频不明显，不要进一步提高载波频率，而是稍微提高音量较小的声道的音量。",
          hi: "777 हर्ट्ज़, 5 हर्ट्ज़ की बीट के साथ: बायां कान 777 हर्ट्ज़, दायां कान 782 हर्ट्ज़। इस कैरियर (700-800 हर्ट्ज़) पर, मानव कान उस सीमा के करीब पहुंच रहा है जहां फेज़ अंतर का पता लगाना कम कुशल होता है। 5 हर्ट्ज़ की बीट सुनाई देती है, लेकिन कम कैरियर की तुलना में यह कम स्पष्ट हो सकती है। यदि बीट स्पष्ट रूप से ���ुनाई नहीं देती है, तो कैरियर को और न बढ़ाएं - इसके बजाय, कम ध्वनि वाले चैनल की आवाज़ को थोड़ा बढ़ाएं।"
        },
        why: {
          es: "Por encima de 700 Hz, la capacidad del sistema auditivo de detectar diferencias de fase se reduce. Sin embargo, el efecto binaural aún es perceptible hasta ~1000 Hz. En el rango de 777 Hz la percepción del beat es más suave — lo que puede ser apropiado para un estado de máxima receptividad donde la estimulación fuerte sería contraproducente.",
          en: "Above 700 Hz, the auditory system's ability to detect phase differences decreases. However, the binaural effect is still perceptible up to ~1000 Hz. In the 777 Hz range beat perception is softer — which can be appropriate for a state of maximum receptivity where strong stimulation would be counterproductive.",
          fr: "Au-delà de 700 Hz, la capacité du système auditif à détecter les différences de phase diminue. Cependant, l&#39;effet binaural reste perceptible jusqu&#39;à environ 1 000 Hz. Dans la gamme des 777 Hz, la perception des battements est plus douce, ce qui peut convenir à un état de réceptivité maximale où une forte stimulation serait contre-productive.",
          pt: "Acima de 700 Hz, a capacidade do sistema auditivo de detectar diferenças de fase diminui. No entanto, o efeito binaural ainda é perceptível até aproximadamente 1000 Hz. Na faixa de 777 Hz, a percepção do batimento é mais suave — o que pode ser apropriado para um estado de receptividade máxima, onde uma estimulação forte seria contraproducente.",
          zh: "高于 700 赫兹时，听觉系统检测相位差的能力会下降。然而，双耳效应在 1000 赫兹左右仍然可感知。在 777 赫兹范围内，节拍感知较为柔和——这或许更适合处于最佳听觉状态，因为此时强烈的刺激反而会适得其反。",
          hi: "700 हर्ट्ज़ से ऊपर, श्रवण तंत्र की चरण भेदों को पहचानने की क्षमता कम हो जाती है। हालांकि, द्विश्रव्य प्रभाव लगभग 1000 हर्ट्ज़ तक अभी भी अनुभव किया जा सकता है। 777 हर्ट्ज़ की सीमा में ताल बोध धीमा हो जाता है - जो अधिकतम ग्रहणशीलता की स्थिति के लिए उपयुक्त हो सकता है, जहां तीव्र उत्तेजना प्रतिकूल हो सकती है।"
        }
      }
    },

    breathing: {
      pattern: "coherencia",
      bpm: 4,
      ratio: 1.0,
      holdFull: 4,
      holdEmpty: 6
    },

    tuning: {
      audio: {
        tone: {
          min: 770, max: 786, step: 1,
          lower: {
          es: "770–774 Hz: zona más grave. Sanación más corporal, arraigo espiritual.",
          en: "770–774 Hz: lower zone. More bodily healing, spiritual grounding.",
          fr: "770–774 Hz : zone inférieure. Favorise la guérison corporelle et l’ancrage spirituel.",
          pt: "770–774 Hz: zona inferior. Mais voltada para a cura corporal e o enraizamento espiritual.",
          zh: "770–774 赫兹：低频频段。更侧重于身体疗愈和精神安定。",
          hi: "770–774 हर्ट्ज़: निचला क्षेत्र। शारीरिक उपचार और आध्यात्मिक स्थिरता के लिए अधिक उपयुक्त।"
        },
          higher: {
          es: "780–786 Hz: zona más aguda. Sanación más etérea, expansión espacial.",
          en: "780–786 Hz: higher zone. More ethereal healing, spatial expansion.",
          fr: "780–786 Hz : zone supérieure. Guérison plus éthérée, expansion spatiale.",
          pt: "780–786 Hz: zona superior. Cura mais etérea, expansão espacial.",
          zh: "780–786 Hz：高频频段。更具空灵疗愈效果，空间扩展。",
          hi: "780–786 हर्ट्ज़: उच्चतर क्षेत्र। अधिक सूक्ष्म उपचार, स्थानिक विस्तार।"
        }
        }
      },
      breathing: {
        holdEmpty: {
          min: 3, max: 10, step: 1,
          lower: {
          es: "3–4s: entrada. Para principiantes con retenciones largas.",
          en: "3–4s: entry. For long-retention beginners.",
          fr: "3–4 s : entrée. Pour les débutants à rétention longue.",
          pt: "3–4 segundos: nível inicial. Para iniciantes com foco em retenção prolongada.",
          zh: "3-4秒：入门级。适合需要长时间记忆的初学者。",
          hi: "3–4 अंक: प्रवेश स्तर। लंबे समय तक याद रखने की क्षमता वाले शुरुआती छात्रों के लिए।"
        },
          higher: {
          es: "7–10s: zona de sanación activa. El espacio de mayor 'vaciamiento' y receptividad. No fuerces — el cuerpo sabe cuánto puede retener.",
          en: "7–10s: active healing zone. The greatest 'emptying' and receptivity space. Don't force — the body knows how long it can retain.",
          fr: "7 à 10 secondes : zone de guérison active. Espace de « vidange » et de réceptivité maximal. N’insistez pas : le corps sait combien de temps il peut retenir l’énergie.",
          pt: "7 a 10 segundos: zona de cura ativa. O maior espaço para &quot;esvaziamento&quot; e receptividade. Não force — o corpo sabe por quanto tempo consegue reter.",
          zh: "7-10秒：活跃的修复期。这是身体最大限度“清空”和接纳的空间。不要强迫自己——身体知道自己能保持多久。",
          hi: "7-10 सेकंड: सक्रिय उपचार क्षेत्र। यह सबसे अधिक &#39;खालीपन&#39; और ग्रहणशीलता का समय है। ज़बरदस्ती न करें—शरीर जानता है कि वह कितनी देर तक इसे सहन कर सकता है।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Silencio interno profundo — no quietud forzada, silencio real",
          "Sensación de que el tiempo se detiene o se expande",
          "Calor o luz percibida en el campo visual interno (ojos cerrados)",
          "Alivio de tensión crónica en hombros, mandíbula o plexo solar"
        ],
        en: [
          "Deep internal silence — not forced stillness, real silence",
          "Sensation that time stops or expands",
          "Warmth or light perceived in the internal visual field (eyes closed)",
          "Relief of chronic tension in shoulders, jaw or solar plexus"
        ]
      },
      adjust: {
          es: "Este preset requiere más paciencia. El estado óptimo aparece después de 7–10 min. Si los primeros minutos son inquietos: es normal — el SNA necesita ese tiempo para cambiar de modo. No ajustes nada en los primeros 5 min.",
          en: "This preset requires more patience. The optimal state appears after 7–10 min. If the first minutes feel restless: that's normal — the ANS needs that time to shift modes. Don't adjust anything in the first 5 min.",
          fr: "Ce réglage demande plus de patience. L&#39;état optimal est atteint après 7 à 10 minutes. Si les premières minutes vous semblent agitées, c&#39;est normal : le système nerveux autonome a besoin de ce temps pour s&#39;adapter. Ne modifiez aucun paramètre pendant les 5 premières minutes.",
          pt: "Esta configuração predefinida requer mais paciência. O estado ideal surge após 7 a 10 minutos. Se os primeiros minutos parecerem inquietos, isso é normal — o SNA precisa desse tempo para mudar de modo. Não ajuste nada nos primeiros 5 minutos.",
          zh: "这个预设需要更多耐心。最佳状态会在7-10分钟后出现。如果最初几分钟感觉烦躁不安：这是正常的——自主神经系统需要时间来切换模式。前5分钟不要做任何调整。",
          hi: "इस प्रीसेट के लिए अधिक धैर्य की आवश्यकता है। इष्टतम स्थिति 7-10 मिनट के बाद प्राप्त होती है। यदि शुरुआती मिनटों में बेचैनी महसूस हो, तो यह सामान्य है - एएनएस को मोड बदलने के लिए इतना समय चाहिए होता है। पहले 5 मिनट में कुछ भी समायोजित न करें।"
        },
      unexpected: {
          es: "Sensaciones visuales con ojos cerrados (colores, geometrías): respuesta normal del córtex visual en estado theta profundo.",
          en: "Visual sensations with eyes closed (colors, geometries): normal response of the visual cortex in deep theta state.",
          fr: "Sensations visuelles les yeux fermés (couleurs, géométries) : réponse normale du cortex visuel en état thêta profond.",
          pt: "Sensações visuais com os olhos fechados (cores, geometrias): resposta normal do córtex visual em estado theta profundo.",
          zh: "闭眼时的视觉感觉（颜色、几何形状）：视觉皮层在深度 theta 状态下的正常反应。",
          hi: "आंखें बंद करके की जाने वाली दृश्य संवेदनाएं (रंग, ज्यामिति): गहरी थीटा अवस्था में दृश्य प्रांतस्था की सामान्य प्रतिक्रिया।"
        },
      stop: {
          es: "Si el estado meditativo genera angustia: abrir los ojos, respirar normalmente. Este preset no es de emergencia.",
          en: "If the meditative state generates distress: open eyes, breathe normally. This preset is not for emergencies.",
          fr: "Si l&#39;état méditatif provoque un malaise : ouvrez les yeux, respirez normalement. Ce mode prédéfini n&#39;est pas destiné aux situations d&#39;urgence.",
          pt: "Se o estado meditativo gerar desconforto: abra os olhos e respire normalmente. Esta configuração não se destina a emergências.",
          zh: "如果冥想状态引起不适：睁开眼睛，正常呼吸。此预设并非用于紧急情况。",
          hi: "यदि ध्यान की अवस्था में बेचैनी उत्पन्न हो: आंखें खोलें, सामान्य रूप से सांस लें। यह सेटिंग आपातकालीन स्थितियों के लिए नहीं है।"
        }
    },

    guide: {
      when: {
          es: "Tarde o noche. Ambiente oscuro. Mínimo 30 min libres después para integración.",
          en: "Afternoon or evening. Dark environment. Minimum 30 min free afterward for integration.",
          fr: "Après-midi ou soirée. Ambiance tamisée. Prévoir au minimum 30 minutes de temps libre ensuite pour l&#39;intégration.",
          pt: "Tarde ou noite. Ambiente escuro. Mínimo de 30 minutos livres após a atividade para integração.",
          zh: "下午或晚上。光线昏暗的环境。之后至少留出30分钟自由时间进行整合。",
          hi: "दोपहर या शाम। अंधेरा वातावरण। इसके बाद कम से कम 30 मिनट का समय दिया जाएगा ताकि व्यक्ति उसमें घुल-मिल सके।"
        },
      duration: { min: 15, recommended: 30, max: 60 },
      sequence: {
          es: "Preceded by Alpha 10 Hz (5 min). Después: no hacer trabajo inmediato — dejar tiempo de integración.",
          en: "Preceded by Alpha 10 Hz (5 min). Afterward: don't do immediate work — allow integration time.",
          fr: "Précédé de Alpha 10 Hz (5 min). Ensuite : ne pas entreprendre de travail immédiatement ; laisser le temps à l’intégration de se faire.",
          pt: "Precedido por Alpha 10 Hz (5 min). Depois: não trabalhe imediatamente — aguarde o tempo de integração.",
          zh: "先进行 Alpha 10 Hz（5 分钟）实验。之后：不要立即进行任何操作——留出积分时间。",
          hi: "इससे पहले अल्फा 10 हर्ट्ज़ (5 मिनट) प्रसारित होगा। इसके बाद: तुरंत कोई काम न करें — एकीकरण के लिए समय दें।"
        },
      contraindications: {
          es: "Proceder con cuidado en personas con historial de disociación. No usar en crisis.",
          en: "Proceed with caution in people with history of dissociation. Don't use in crisis.",
          fr: "À utiliser avec prudence chez les personnes ayant des antécédents de dissociation. Ne pas utiliser en situation de crise.",
          pt: "Proceda com cautela em pessoas com histórico de dissociação. Não use em situações de crise.",
          zh: "有分离性障碍病史者应谨慎使用。危机时期禁用。",
          hi: "जिन लोगों में पहले से ही वियोग के लक्षण दिखाई देते हों, उनके मामले में सावधानी बरतें। संकट की स्थिति में इसका प्रयोग न करें।"
        }
    },

    tags: ["sanacion", "healing", "profundo", "deep", "contemplativo", "contemplative", "espiritual", "spiritual", "777"]
  },


  {
    id: "hz852",
    category: "healing",
    type: ["tone", "binaural", "breathing"],
    sessions: [
      { id: "meditacion", priority: 3 },
      { id: "conexion",   priority: 3 }
    ],
    scientificLevel: "traditional",
    color: "#9b7de8",

    name: { es: "852 Hz — Intuición", en: "852 Hz — Intuition", fr: "852 Hz — Intuition", pt: "852 Hz — Intuição" },
    description: {
      es: "Despertar Espiritual",
      en: "Spiritual Awakening",
      fr: "Éveil Spirituel",
      pt: "Despertar Espiritual"
    },
    longDescription: {
          es: "852 Hz es la frecuencia solfeggio asociada con el despertar de la intuición y el 'tercer ojo'. Se añade un binaural theta (6 Hz) para llevar el SNA a la banda donde los insights y la percepción extrasensorial subjetiva son más reportados. Las retenciones simétricas de 5s crean ciclos de 'subida' (holdFull) y 'apertura' (holdEmpty) que los practicantes de contemplación asocian con mayor claridad perceptiva.",
          en: "852 Hz is the solfeggio frequency associated with awakening intuition and the 'third eye'. A theta binaural (6 Hz) is added to bring the ANS to the band where insights and subjective extrasensory perception are most reported. Symmetric 5s retentions create cycles of 'ascent' (holdFull) and 'opening' (holdEmpty) that contemplative practitioners associate with greater perceptual clarity.",
          fr: "La fréquence de 852 Hz correspond à la fréquence solfège associée à l&#39;éveil de l&#39;intuition et au « troisième œil ». Un stimulus binaural thêta (6 Hz) est ajouté pour amener le système nerveux autonome dans la bande de fréquence où les intuitions et les perceptions extrasensorielles subjectives sont les plus fréquemment rapportées. Des rétentions symétriques de 5 secondes créent des cycles d&#39;« ascension » (maintien de la pleine conscience) et d&#39;« ouverture » (maintien de la conscience vide) que les pratiquants contemplatifs associent à une plus grande clarté perceptive.",
          pt: "852 Hz é a frequência solfeggio associada ao despertar da intuição e do &#39;terceiro olho&#39;. Um sinal binaural theta (6 Hz) é adicionado para trazer o SNA (Sistema Nervoso Autônomo) para a faixa onde insights e percepções extrassensoriais subjetivas são mais relatados. Retenções simétricas de 5 segundos criam ciclos de &#39;ascensão&#39; (segurar Completo) e &#39;abertura&#39; (segurar Vazio) que praticantes de meditação contemplativa associam a uma maior clareza perceptiva.",
          zh: "852赫兹是与唤醒直觉和“第三眼”相关的唱名频率。加入6赫兹的θ双耳节拍，将自主神经系统带入到最常被提及的洞察力和主观超感官知觉频段。对称的5秒保持音程创造了“上升”（保持满音）和“开启”（保持空音）的循环，冥想练习者认为这与更高的感知清晰度相关。",
          hi: "852 हर्ट्ज़ वह आवृत्ति है जो अंतर्ज्ञान जागृत करने और &#39;तीसरे नेत्र&#39; से जुड़ी है। थीटा बाइनॉरल (6 हर्ट्ज़) आवृत्ति को इसमें जोड़ा जाता है ताकि एएनएस उस बैंड में आ जाए जहां अंतर्दृष्टि और व्यक्तिपरक अलौकिक अनुभूति सबसे अधिक होती है। सममित 5 सेकंड के प्रतिधारण &#39;आरोहण&#39; (होल्डफुल) और &#39;खुलने&#39; (होल्डएम्प्टी) के चक्र बनाते हैं, जिन्हें ध्यान साधक अधिक स्पष्टता से जोड़ते हैं।"
        },

    audio: {
      binaural: true,
      beat: 6,
      carrier: 852,
      tone: 852,
      perception: {
        optimal: { min: 830, max: 880 },
        degradation: {
          es: "852 Hz es el carrier más alto del sistema healing. Con beat 6 Hz: oído izquierdo 852 Hz, derecho 858 Hz. En este rango (800–900 Hz) la detección binaural es posible pero requiere mayor concentración auditiva. El beat puede percibirse más como una leve variación de amplitud que como un pulso claro. Esto es normal y no reduce el efecto — solo cambia la textura perceptiva.",
          en: "852 Hz is the highest carrier in the healing system. With 6 Hz beat: left ear 852 Hz, right ear 858 Hz. In this range (800–900 Hz) binaural detection is possible but requires greater auditory concentration. The beat may be perceived more as a slight amplitude variation than as a clear pulse. This is normal and doesn't reduce the effect — it only changes the perceptual texture.",
          fr: "852 Hz est la fréquence porteuse la plus élevée du système de guérison. Avec un battement de 6 Hz : oreille gauche 852 Hz, oreille droite 858 Hz. Dans cette gamme (800–900 Hz), la détection binaurale est possible, mais exige une plus grande concentration auditive. Le battement peut être perçu davantage comme une légère variation d&#39;amplitude que comme une impulsion distincte. Ceci est normal et n&#39;altère en rien l&#39;effet ; cela modifie seulement la perception.",
          pt: "852 Hz é a frequência portadora mais alta no sistema de cura. Com uma batida de 6 Hz: ouvido esquerdo 852 Hz, ouvido direito 858 Hz. Nessa faixa (800–900 Hz), a detecção binaural é possível, mas requer maior concentração auditiva. A batida pode ser percebida mais como uma leve variação de amplitude do que como um pulso nítido. Isso é normal e não reduz o efeito — apenas altera a textura perceptiva.",
          zh: "852 Hz 是治疗系统中最高的载波频率。以 6 Hz 的节拍为例：左耳 852 Hz，右耳 858 Hz。在这个频率范围（800–900 Hz）内，双耳可以感知到节拍，但这需要更高的听觉集中度。节拍可能更多地被感知为轻微的振幅变化，而不是清晰的脉冲。这是正常的，不会降低效果——它只会改变感知的质感。",
          hi: "852 हर्ट्ज़ ध्वनि आवृत्ति उपचार प्रणाली में उच्चतम वाहक आवृत्ति है। 6 हर्ट्ज़ की लय के साथ: बायां कान 852 हर्ट्ज़, दायां कान 858 हर्ट्ज़। इस सीमा (800-900 हर्ट्ज़) में दोनों कानों से ध्वनि का पता लगाना संभव है, लेकिन इसके लिए श्रवण एकाग्रता की अधिक आवश्यकता होती है। लय को स्पष्ट स्पंदन के बजाय आयाम में मामूली बदलाव के रूप में महसूस किया जा सकता है। यह सामान्य है और प्रभाव को कम नहीं करता - यह केवल अनुभूति की प्रकृति को बदलता है।"
        },
        why: {
          es: "Por encima de 800 Hz el oído humano procesa los tonos más como 'timbre' que como 'pitch' preciso. Esto hace que los beats binaurales en este rango sean más difíciles de percibir conscientemente pero el cerebro sigue procesando la diferencia de frecuencia subconscientemente. Algunos estudios sugieren que la respuesta binaural persiste incluso cuando no es percibida conscientemente.",
          en: "Above 800 Hz the human ear processes tones more as 'timbre' than precise 'pitch'. This makes binaural beats in this range harder to perceive consciously, but the brain continues processing the frequency difference subconsciously. Some studies suggest the binaural response persists even when not consciously perceived.",
          fr: "Au-delà de 800 Hz, l&#39;oreille humaine perçoit les sons davantage comme un timbre que comme une hauteur précise. De ce fait, les battements binauraux dans cette gamme sont plus difficiles à percevoir consciemment, mais le cerveau continue de traiter la différence de fréquence de manière inconsciente. Certaines études suggèrent que la réponse binaurale persiste même lorsqu&#39;elle n&#39;est pas perçue consciemment.",
          pt: "Acima de 800 Hz, o ouvido humano processa os tons mais como &quot;timbre&quot; do que como &quot;altura&quot; precisa. Isso torna as batidas binaurais nessa faixa mais difíceis de serem percebidas conscientemente, mas o cérebro continua processando a diferença de frequência subconscientemente. Alguns estudos sugerem que a resposta binaural persiste mesmo quando não é percebida conscientemente.",
          zh: "高于 800 赫兹的频率下，人耳对音调的处理更多地侧重于“音色”而非精确的“音高”。这使得人耳难以有意识地感知此频率范围内的双耳节拍，但大脑仍会在潜意识中持续处理这种频率差异。一些研究表明，即使未被有意识地感知，双耳反应仍然存在。",
          hi: "800 हर्ट्ज़ से ऊपर की आवृत्तियों पर मानव कान ध्वनियों को सटीक &#39;पिच&#39; के बजाय &#39;टिम्बर&#39; के रूप में संसाधित करता है। इस कारण इस सीमा में द्विकर्णीय ध्वनियों को सचेत रूप से समझना कठिन हो जाता है, लेकिन मस्तिष्क अवचेतन रूप से आवृत्ति अंतर को संसाधित करता रहता है। कुछ अध्ययनों से पता चलता ह�� कि द्विकर्णीय प्रतिक्रिया सचेत रूप से महसूस न होने पर भी बनी रहती है।"
        }
      }
    },

    breathing: {
      pattern: "coherencia",
      bpm: 4,
      ratio: 1.0,
      holdFull: 5,
      holdEmpty: 5
    },

    tuning: {
      audio: {
        tone: {
          min: 845, max: 860, step: 1,
          lower: {
          es: "845–849 Hz: zona más oscura. Conexión con la intuición corporal — el 'saber sin saber'.",
          en: "845–849 Hz: darker zone. Connection with body intuition — 'knowing without knowing'.",
          fr: "845–849 Hz : zone plus sombre. Connexion avec l’intuition corporelle — « savoir sans savoir ».",
          pt: "845–849 Hz: zona mais escura. Conexão com a intuição corporal — &#39;saber sem saber&#39;.",
          zh: "845–849 Hz：较暗的区域。与身体直觉相连——“无知的知晓”。",
          hi: "845–849 हर्ट्ज़: गहरा क्षेत्र। शरीर की सहज बुद्धि से संबंध — &#39;बिना जाने जानना&#39;।"
        },
          higher: {
          es: "853–860 Hz: zona más aguda. Mayor activación del área del entrecejo. Para clarividencia y percepción visual interna.",
          en: "853–860 Hz: higher zone. Greater activation of the brow area. For clairvoyance and inner visual perception.",
          fr: "853–860 Hz : zone supérieure. Activation accrue de la zone des sourcils. Pour la clairvoyance et la perception visuelle intérieure.",
          pt: "853–860 Hz: zona superior. Maior ativação da área da testa. Para clarividência e percepção visual interna.",
          zh: "853–860 Hz：高频区域。眉心区域更活跃。用于透视和内在视觉感知。",
          hi: "853–860 हर्ट्ज़: उच्चतर क्षेत्र। भौंहों के क्षेत्र में अधिक सक्रियता। अंतर्ज्ञान और आंतरिक दृश्य बोध के लिए।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Sensación de 'ya saber' — insight sin proceso lógico previo",
          "Pulsación o calor en el entrecejo (área del tercer ojo)",
          "Geometrías o colores espontáneos en el campo visual cerrado",
          "Desaparición completa del monólogo interno"
        ],
        en: [
          "'Already knowing' sensation — insight without prior logic process",
          "Pulsation or warmth at the brow center (third eye area)",
          "Spontaneous geometries or colors in the closed visual field",
          "Complete disappearance of internal monologue"
        ]
      },
      adjust: {
          es: "Usa en ayunas o 3h después de comer. Ambiente oscuro. El holdEmpty 5s es el portal — durante ese espacio no busques nada: solo recibe. Si el tono genera incomodidad en los oídos a 852: baja 2 Hz.",
          en: "Use on an empty stomach or 3h after eating. Dark environment. HoldEmpty 5s is the portal — during that space don't seek anything: just receive. If the tone causes ear discomfort at 852: lower by 2 Hz.",
          fr: "À utiliser à jeun ou 3 heures après un repas. Dans un environnement sombre. HoldEmpty 5s est un portail : pendant cet espace, ne cherchez rien, contentez-vous de recevoir. Si le son provoque une gêne auditive à 852 Hz : baissez-le de 2 Hz.",
          pt: "Use com o estômago vazio ou 3 horas após as refeições. Ambiente escuro. O HoldEmpty 5s é o portal — durante esse período, não busque nada: apenas receba. Se o tom causar desconforto no ouvido em 852 Hz: diminua em 2 Hz.",
          zh: "空腹或餐后3小时使用。黑暗环境。按住Empty键5秒是进入状态——在此期间不要寻找任何东西：只需接收。如果852赫兹的音调引起耳部不适：降低2赫兹。",
          hi: "खाली पेट या खाना खाने के 3 घंटे बाद प्रयोग करें। अंधेरा वातावरण। 5 सेकंड तक खाली रखना पोर्टल है - इस दौरान कुछ भी न खोजें: बस ग्रहण करें। यदि 852 हर्ट्ज़ पर ध्वनि से कान में असुविधा हो, तो उसे 2 हर्ट्ज़ कम कर दें।"
        },
      unexpected: {
          es: "Sensación de vibración entre los ojos: activación del área nasal/frontal por resonancia del cráneo. Normal.",
          en: "Vibration sensation between the eyes: activation of the nasal/frontal area by skull resonance. Normal.",
          fr: "Sensation vibratoire entre les yeux : activation de la région naso-frontale par résonance crânienne. Normal.",
          pt: "Sensação de vibração entre os olhos: ativação da área nasal/frontal por ressonância craniana. Normal.",
          zh: "两眼间有振动感：颅骨共振激活鼻/额区。正常现象。",
          hi: "आँखों के बीच कंपन का अनुभव: खोपड़ी के अनुनाद द्वारा नाक/ललाट क्षेत्र की सक्रियता। सामान्य।"
        },
      stop: {
          es: "Sin contraindicaciones agudas. Si el tono agudo genera cefalea: bajar volumen o cambiar preset.",
          en: "No acute contraindications. If the high-pitched tone generates headache: lower volume or change preset.",
          fr: "Aucune contre-indication aiguë. Si le son aigu provoque des maux de tête : baissez le volume ou changez de préréglage.",
          pt: "Não há contraindicações agudas. Se o tom agudo causar dor de cabeça: diminua o volume ou altere a predefinição.",
          zh: "无急性禁忌症。如果高音调引起头痛：降低音量或更换预设模式。",
          hi: "कोई तीव्र विपरीत संकेत नहीं हैं। यदि तेज़ आवाज़ से सिरदर्द होता है: तो वॉल्यूम कम करें या प्रीसेट बदलें।"
        }
    },

    guide: {
      when: {
          es: "Mañana temprano, preferiblemente en ayunas. Ambiente oscuro. Sentado.",
          en: "Early morning, preferably fasting. Dark environment. Seated.",
          fr: "Tôt le matin, de préférence à jeun. Dans l&#39;obscurité. Assis.",
          pt: "De manhã cedo, de preferência em jejum. Ambiente escuro. Sentado.",
          zh: "清晨，最好空腹。黑暗环境。坐姿。",
          hi: "सुबह-सुबह, खाली पेट, बेहतर होगा। अंधेरा वातावरण। बैठकर।"
        },
      duration: { min: 10, recommended: 25, max: 45 },
      sequence: {
          es: "Puede seguirse de 777 Hz para profundizar en la experiencia meditativa.",
          en: "Can be followed by 777 Hz to deepen the meditative experience.",
          fr: "Peut être suivi de 777 Hz pour approfondir l&#39;expérience méditative.",
          pt: "Pode ser seguido por 777 Hz para aprofundar a experiência meditativa.",
          zh: "可以接着使用 777 Hz 来加深冥想体验。",
          hi: "ध्यान की अनुभूति को और गहरा करने के लिए इसके बाद 777 हर्ट्ज़ का प्रयोग किया जा सकता है।"
        },
      contraindications: {
          es: "Precaución si hay hiperacusia o sensibilidad auditiva alta a frecuencias agudas.",
          en: "Caution if there is hyperacusis or high auditory sensitivity to high-pitched frequencies.",
          fr: "À utiliser avec précaution en cas d&#39;hyperacousie ou d&#39;hypersensibilité auditive aux fréquences aiguës.",
          pt: "Atenção em casos de hiperacusia ou alta sensibilidade auditiva a frequências agudas.",
          zh: "如果患有听觉过敏或对高频声音高度敏感，请谨慎使用。",
          hi: "यदि हाइपरएक्यूसिस हो या उच्च-पिच आवृत्तियों के प्रति श्रवण संवेदनशीलता अधिक हो तो सावधानी बरतें।"
        }
    },

    tags: ["intuicion", "intuition", "tercer-ojo", "third-eye", "espiritual", "spiritual", "pineal", "solfeggio", "852"]
  },


  // ══════════════════════════════════════════════════════════════════════
  // PRANAYAMA & RETENCIÓN
  // ══════════════════════════════════════════════════════════════════════

  {
    id: "478",
    category: "pranayama",
    type: ["breathing", "binaural"],
    sessions: [
      { id: "calma",   priority: 1 },
      { id: "sueno",   priority: 2 },
      { id: "liberacion", priority: 5 }
    ],
    scientificLevel: "validated",
    color: "#50b4c8",

    name: { es: "4-7-8 Pranayama", en: "4-7-8 Pranayama", fr: "4-7-8 Pranayama", pt: "4-7-8 Pranayama" },
    description: {
      es: "Activación Parasimpática",
      en: "Parasympathetic Activation",
      fr: "Activation Parasympathique",
      pt: "Ativação Parassimpática"
    },
    longDescription: {
          es: "El 4-7-8 de Andrew Weil es la técnica de activación parasimpática más rápida y validada del sistema. La retención de 7s con pulmón lleno es el núcleo: la presión intratorácica alta activa los barorreceptores aórticos que envían señales calmantes directas al tronco encefálico, modulando la amígdala en 1–2 min. La exhale de 8s maximiza el tono vagal. Se añade un binaural alpha (9 Hz) para acelerar la transición al estado calmado.",
          en: "Andrew Weil's 4-7-8 is the system's fastest and most validated parasympathetic activation technique. The 7s full-lung retention is the core: high intrathoracic pressure activates aortic baroreceptors that send calming signals directly to the brainstem, modulating the amygdala in 1–2 min. The 8s exhale maximizes vagal tone. An alpha binaural (9 Hz) is added to accelerate the transition to the calm state.",
          fr: "La méthode 4-7-8 d&#39;Andrew Weil est la technique d&#39;activation parasympathique la plus rapide et la plus validée. La rétention pulmonaire complète de 7 secondes en est l&#39;élément central : la pression intrathoracique élevée active les barorécepteurs aortiques qui envoient des signaux apaisants directement au tronc cérébral, modulant ainsi l&#39;amygdale en 1 à 2 minutes. L&#39;expiration de 8 secondes maximise le tonus vagal. Un stimulus binaural alpha (9 Hz) est ajouté pour accélérer la transition vers un état de calme.",
          pt: "O método 4-7-8 de Andrew Weil é a técnica de ativação parassimpática mais rápida e validada do sistema. A retenção pulmonar total de 7 segundos é o ponto central: a alta pressão intratorácica ativa os barorreceptores aórticos que enviam sinais calmantes diretamente para o tronco encefálico, modulando a amígdala em 1 a 2 minutos. A expiração de 8 segundos maximiza o tônus vagal. Um estímulo binaural alfa (9 Hz) é adicionado para acelerar a transição para o estado de calma.",
          zh: "安德鲁·威尔的4-7-8呼吸法是目前最快速、最有效的副交感神经激活技术。7秒的全肺屏气是其核心：较高的胸内压激活主动脉压力感受器，将镇静信号直接传递至脑干，在1-2分钟内调节杏仁核。8秒的呼气可最大程度地提高迷走神经张力。此外，还会加入α双耳节拍（9赫兹）以加速进入平静状态。",
          hi: "एंड्रयू वेल की 4-7-8 प्रणाली पैरासिम्पेथेटिक तंत्रिका तंत्र को सक्रिय करने की सबसे तेज़ और सबसे प्रमाणित तकनीक है। 7 सेकंड तक फेफड़ों में पूरी तरह से सांस रोके रखना इसका मूल है: छाती के भीतर उच्च दबाव महाधमनी बैरोरिसेप्टर्स को सक्रिय करता है जो सीधे ब्रेनस्टेम को शांत करने वाले संकेत भे���ते हैं, जिससे 1-2 मिनट में एमिग्डाला नियंत्रित हो जाता है। 8 सेकंड तक सांस छोड़ने से वेगस तंत्रिका की सक्रियता अधिकतम हो जाती है। शांत अवस्था में तेजी से पहुंचने के लिए अल्फा बाइनॉरल (9 हर्ट्ज़) ध्वनि भी जोड़ी जाती है।"
        },

    audio: {
      binaural: true,
      beat: 9,
      carrier: 250,
      perception: {
        optimal: { min: 200, max: 350 },
        degradation: {
          es: "Beat 9 Hz / Carrier 250 Hz: percepción óptima en el rango alpha. El carrier 250 Hz es el punto medio del rango de máxima eficiencia binaural para beats lentos. Si no se percibe el beat claramente durante la retención de 7s (porque la atención está en el cuerpo): es correcto — el efecto binaural funciona también sin percepción consciente activa.",
          en: "Beat 9 Hz / Carrier 250 Hz: optimal perception in the alpha range. The 250 Hz carrier is the midpoint of the maximum binaural efficiency range for slow beats. If the beat isn't clearly perceived during the 7s retention (because attention is on the body): this is correct — the binaural effect works even without active conscious perception.",
          fr: "Battement 9 Hz / Porteuse 250 Hz : perception optimale dans la gamme alpha. La porteuse de 250 Hz correspond au point médian de la plage d’efficacité binaurale maximale pour les battements lents. Si le battement n’est pas clairement perçu pendant les 7 secondes de rétention (car l’attention est portée sur le corps), c’est normal : l’effet binaural fonctionne même sans perception consciente active.",
          pt: "Batida de 9 Hz / Portadora de 250 Hz: percepção ideal na faixa alfa. A portadora de 250 Hz é o ponto médio da faixa de máxima eficiência binaural para batidas lentas. Se a batida não for claramente percebida durante a retenção de 7 segundos (porque a atenção está no corpo): isso é normal — o efeito binaural funciona mesmo sem percepção consciente ativa.",
          zh: "节拍频率 9 Hz / 载波频率 250 Hz：在 α 波段感知最佳。250 Hz 载波频率是慢速节拍双耳效应效率最高范围的中点。如果在 7 秒的保持时间内没有清晰地感知到节拍（因为注意力集中在身体上）：这是正常的——即使没有主动的意识感知，双耳效应仍然有效。",
          hi: "बीट 9 हर्ट्ज़ / कैरियर 250 हर्ट्ज़: अल्फा रेंज में इष्टतम अनुभूति। 250 हर्ट्ज़ कैरियर धीमी बीट्स के लिए अधिकतम बाइनॉरल दक्षता रेंज का मध्यबिंदु है। यदि 7 सेकंड के प्रतिधारण के दौरान बीट स्पष्ट रूप से महसूस नहीं होती है (क्योंकि ध्यान शरीर पर केंद्रित है): तो यह सही है - बाइनॉरल प्रभाव सक्रिय सचेत अनुभूति के बिना भी काम करता है।"
        },
        why: {
          es: "El binaural alpha (9 Hz) actúa como ancla del estado calmado al que el 4-7-8 lleva fisiológicamente. Mientras la retención actúa sobre el sistema cardiovascular, el binaural actúa sobre el córtex auditivo. Los dos mecanismos convergen en el mismo estado target: reducción de actividad amigdalina y aumento de tono parasimpático.",
          en: "The alpha binaural (9 Hz) acts as an anchor for the calm state that the 4-7-8 leads to physiologically. While the retention acts on the cardiovascular system, the binaural acts on the auditory cortex. Both mechanisms converge on the same target state: reduced amygdala activity and increased parasympathetic tone.",
          fr: "Le stimulus alpha binaural (9 Hz) sert d&#39;ancrage à l&#39;état de calme induit physiologiquement par la séquence 4-7-8. Tandis que la rétention agit sur le système cardiovasculaire, le stimulus binaural agit sur le cortex auditif. Ces deux mécanismes convergent vers un même objectif : une réduction de l&#39;activité de l&#39;amygdale et une augmentation du tonus parasympathique.",
          pt: "O estímulo binaural alfa (9 Hz) atua como uma âncora para o estado de calma que o esquema 4-7-8 proporciona fisiologicamente. Enquanto a retenção atua no sistema cardiovascular, o estímulo binaural atua no córtex auditivo. Ambos os mecanismos convergem para o mesmo estado-alvo: redução da atividade da amígdala e aumento do tônus parassimpático.",
          zh: "α双耳节拍（9赫兹）起到锚定作用，巩固了4-7-8节奏在生理上引导人们进入的平静状态。虽然保持法作用于心血管系统，但双耳节拍作用于听觉皮层。这两种机制最终都指向同一个目标状态：降低杏仁核活动，增强副交感神经张力。",
          hi: "अल्फा बाइनॉरल (9 हर्ट्ज़) उस शांत अवस्था के लिए आधार का काम करता है जो 4-7-8 आवृत्ति से शारीरिक रूप से उत्पन्न होती है। जहां अल्फा बाइनॉरल हृदय प्रणाली पर प्रभाव डालता है, वहीं बाइनॉरल श्रवण प्रांतस्था पर प्रभाव डालता है। दोनों तंत्र एक ही लक्ष्य अवस्था की ओर अभिसरित होते हैं: एमिग्डाला की गतिविधि में कमी और पैरासिम्पेथेटिक तंत्रिका तंत्र की सक्रियता में वृद्धि।"
        }
      }
    },

    breathing: {
      pattern: "478",
      bpm: 3.16,  // 4+7+8 = 19s por ciclo = 3.16 rpm (informativo)
      ratio: 1.0,
      holdFull: 7,
      holdEmpty: 0
    },

    tuning: {
      breathing: {
        holdFull: {
          min: 4, max: 9, step: 1,
          lower: {
          es: "4s: retención de entrada. Accesible para todos. Aún produce activación barorreceptora. La exhale de 8s sigue siendo el componente más importante.",
          en: "4s: entry retention. Accessible for all. Still produces baroreflex activation. The 8s exhale remains the most important component.",
          fr: "4s : rétention à l’entrée. Accessible à tous. Provoque toujours une activation du baroréflexe. L’expiration de 8 s reste l’élément le plus important.",
          pt: "4s: retenção na entrada. Acessível a todos. Ainda produz ativação do barorreflexo. A expiração de 8s continua sendo o componente mais importante.",
          zh: "4秒：保持呼吸的起始状态。适合所有人。仍然能够激活压力反射。8秒的呼气仍然是最重要的部分。",
          hi: "4 सेकंड: प्रवेश प्रतिधारण। सभी के लिए सुलभ। फिर भी बैरोरिफ्लेक्स सक्रियण उत्पन्न करता है। 8 सेकंड की साँस छोड़ना सबसे महत्वपूर्ण घटक बना हुआ है।"
        },
          higher: {
          es: "8–9s: solo practicantes con capacidad pulmonar alta y experiencia en retenciones. El efecto ansiolítico no aumenta proporcionalmente por encima de 7s — el estándar de Weil está optimizado.",
          en: "8–9s: only practitioners with high lung capacity and retention experience. The anxiolytic effect doesn't increase proportionally above 7s — Weil's standard is optimized.",
          fr: "8 à 9 secondes : réservé aux praticiens ayant une capacité pulmonaire et une expérience de rétention élevées. L’effet anxiolytique n’augmente pas proportionnellement au-delà de 7 secondes ; la norme de Weil est optimale.",
          pt: "8–9s: apenas para profissionais com alta capacidade pulmonar e experiência em retenção de ar. O efeito ansiolítico não aumenta proporcionalmente acima de 7s — o padrão de Weil é o ideal.",
          zh: "8-9秒：仅适用于肺活量大且有经验的练习者。超过7秒后，抗焦虑效果不会成比例增加——韦尔的标准已经达到最佳状态。",
          hi: "8-9 सेकंड: केवल उच्च फेफड़ों की क्षमता और प्रतिधारण अनुभव वाले अभ्यासकर्ता ही इसका उपयोग कर सकते हैं। 7 सेकंड से ऊपर चिंता-निवारक प्रभाव आनुपातिक रूप से नहीं बढ़ता है - वेल का मानक अनुकूलित है।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Durante la retención de 7s: el latido cardíaco se vuelve perceptible y regular",
          "Al exhalar: sensación de 'drenaje' de tensión en hombros y mandíbula",
          "Después de 3–4 ciclos: pensamiento significativamente ralentizado",
          "Los ojos 'pesan' — el sistema parasimpático ha tomado el control"
        ],
        en: [
          "During 7s retention: heartbeat becomes perceptible and regular",
          "On exhale: 'draining' sensation of tension from shoulders and jaw",
          "After 3–4 cycles: thinking significantly slowed",
          "Eyes 'feel heavy' — parasympathetic system has taken control"
        ]
      },
      adjust: {
          es: "Si 7s de retención es muy largo: empieza con 4s y sube 1s por semana. El 4-7-8 produce beneficios desde 4s de retención. NO acortes la exhale — 8s es no negociable.",
          en: "If 7s retention is too long: start with 4s and add 1s per week. 4-7-8 produces benefits from 4s retention. DON'T shorten the exhale — 8s is non-negotiable.",
          fr: "Si une rétention de 7 secondes vous paraît trop longue : commencez par 4 secondes et ajoutez 1 seconde par semaine. Le cycle 4-7-8 secondes permet de tirer pleinement profit d&#39;une rétention de 4 secondes. Ne raccourcissez surtout pas l&#39;expiration : 8 secondes, c&#39;est indispensable.",
          pt: "Se a retenção de 7 segundos for muito longa: comece com 4 segundos e adicione 1 segundo por semana. O método 4-7-8 traz benefícios mesmo com a retenção de 4 segundos. NÃO encurte a expiração — 8 segundos é imprescindível.",
          zh: "如果7秒的屏息时间太长：从4秒开始，每周增加1秒。4-7-8的循环可以达到4秒屏息的效果。不要缩短呼气时间——8秒是必须的。",
          hi: "यदि 7 सेकंड तक सांस रोकना बहुत लंबा लगता है, तो 4 सेकंड से शुरू करें और हर हफ्ते 1 सेकंड बढ़ाते जाएं। 4-7-8 का क्रम 4 सेकंड तक सांस रोकने से लाभ देता है। सांस छोड़ने का समय कम न करें — 8 सेकंड तक सांस रोकना अनिवार्य है।"
        },
      unexpected: {
          es: "Ligero mareo después de la exhale larga: hipocapnia leve, normal. Siéntate o recuéstate si persiste más de 30s.",
          en: "Slight dizziness after the long exhale: mild hypocapnia, normal. Sit or lie down if it persists more than 30s.",
          fr: "Légers vertiges après une expiration prolongée : hypocapnie légère, normale. Asseyez-vous ou allongez-vous si cela persiste plus de 30 secondes.",
          pt: "Leve tontura após uma expiração longa: hipocapnia leve, normal. Se persistir por mais de 30 segundos, sente-se ou deite-se.",
          zh: "长呼气后轻微头晕：轻度低碳酸血症，正常现象。如果持续超过30秒，请坐下或躺下。",
          hi: "लंबी सांस छोड़ने के बाद हल्का चक्कर आना: हल्का हाइपोकैपनिया, सामान्य। यदि यह 30 सेकंड से अधिक समय तक बना रहता है, तो बैठ जाएं या लेट जाएं।"
        },
      stop: {
          es: "Sensación de angustia durante la retención: no continuar la retención — exhalar libremente y respirar normalmente. La retención no debe generar pánico.",
          en: "Distress sensation during retention: don't continue retention — exhale freely and breathe normally. Retention should not generate panic.",
          fr: "Sensation de malaise pendant la rétention : arrêtez la rétention – expirez librement et respirez normalement. La rétention ne doit pas provoquer de panique.",
          pt: "Sensação de desconforto durante a retenção: não continue a retenção — expire livremente e respire normalmente. A retenção não deve gerar pânico.",
          zh: "屏息过程中若感到不适：不要继续屏息——自由呼气，正常呼吸。屏息不应引起恐慌。",
          hi: "सांस रोकने के दौरान बेचैनी महसूस होने पर: सांस रोकने की कोशिश न करें — खुलकर सांस छोड़ें और सामान्य रूप से सांस लें। सांस रोकने से घबराहट नहीं होनी चाहिए।"
        }
    },

    guide: {
      when: {
          es: "Cualquier momento de ansiedad, antes de dormir, antes de situaciones estresantes. Es el preset de primera respuesta para estados de activación alta.",
          en: "Any moment of anxiety, before sleep, before stressful situations. It's the first-response preset for high activation states.",
          fr: "Tout moment d&#39;anxiété, avant de dormir, avant une situation stressante. C&#39;est le premier réflexe en cas d&#39;état d&#39;activation intense.",
          pt: "Em qualquer momento de ansiedade, antes de dormir, antes de situações estressantes. É a primeira resposta pré-configurada para estados de alta ativação.",
          zh: "任何焦虑的时刻，睡前，压力情境之前。这是高度激活状态下的第一反应预设。",
          hi: "चिंता का कोई भी क्षण, सोने से पहले, तनावपूर्ण स्थितियों से पहले। यह अत्यधिक सक्रियता की अवस्थाओं के लिए पहली प्रतिक्रिया का पूर्व निर्धारित रूप है।"
        },
      duration: { min: 4, recommended: 8, max: 15 },
      sequence: {
          es: "No necesita secuencia. Es autosuficiente. Si se quiere profundizar: seguir con Alpha 10 Hz o Delta.",
          en: "Doesn't need sequence. It's self-sufficient. If wanting to deepen: follow with Alpha 10 Hz or Delta.",
          fr: "Pas besoin de séquence. C&#39;est autonome. Pour approfondir : enchaîner avec Alpha 10 Hz ou Delta.",
          pt: "Não precisa de sequência. É autossuficiente. Se quiser aprofundar: use em seguida Alpha 10 Hz ou Delta.",
          zh: "无需按顺序练习，它本身就足够了。如果想要加深练习：可以接着练习 Alpha 10 Hz 或 Delta 波。",
          hi: "इसमें क्रम की आवश्यकता नहीं है। यह अपने आप में पूर्ण है। यदि आप इसे और गहराई से समझना चाहते हैं, तो अल्फा 10 हर्ट्ज़ या डेल्टा का प्रयोग करें।"
        },
      contraindications: {
          es: "Embarazo (retenciones prolongadas). Asma activa o EPOC. Presión arterial muy baja.",
          en: "Pregnancy (prolonged retentions). Active asthma or COPD. Very low blood pressure.",
          fr: "Grossesse (rétentions prolongées). Asthme ou BPCO actifs. Hypotension sévère.",
          pt: "Gravidez (retenção urinária prolongada). Asma ativa ou DPOC. Pressão arterial muito baixa.",
          zh: "妊娠（尿潴留时间延长）。活动性哮喘或慢性阻塞性肺病。极低血压。",
          hi: "गर्भावस्था (लंबे समय तक पेशाब रुकना)। सक्रिय अस्थमा या सीओपीडी। बहुत कम रक्तचाप।"
        }
    },

    tags: ["ansiedad", "anxiety", "parasimpático", "parasympathetic", "sueno", "sleep", "vagal", "validado", "validated", "4-7-8"]
  },


  {
    id: "box",
    category: "pranayama",
    type: ["breathing", "binaural"],
    sessions: [
      { id: "foco",    priority: 4 },
      { id: "calma",   priority: 2 },
      { id: "energia", priority: 5 }
    ],
    scientificLevel: "validated",
    color: "#d4a84b",

    name: { es: "Box Breathing 4-4-4-4", en: "Box Breathing 4-4-4-4", fr: "Respiration en Carré 4-4-4-4", pt: "Respiração Quadrada 4-4-4-4" },
    description: {
      es: "Equilibrio SNA",
      en: "ANS Balance",
      fr: "Équilibre SNA",
      pt: "Equilíbrio SNA"
    },
    longDescription: {
          es: "Box Breathing es el preset más versátil del sistema. Sus retenciones simétricas exactas (holdFull = holdEmpty) equilibran con precisión el sistema simpático (holdFull = presión intratorácica alta) y parasimpático (holdEmpty = presión negativa). El resultado es un estado de ecuanimidad: ni activado ni sedado — claridad neutral y cortisol regulado. Se usa en Navy SEALs, atletas de élite y entornos de alta presión. Se añade un binaural alpha (10 Hz) para potenciar el estado de calma-alerta.",
          en: "Box Breathing is the system's most versatile preset. Its exact symmetric retentions (holdFull = holdEmpty) precisely balance the sympathetic (holdFull = high intrathoracic pressure) and parasympathetic (holdEmpty = negative pressure) systems. The result is a state of equanimity: neither activated nor sedated — neutral clarity and regulated cortisol. Used in Navy SEALs, elite athletes and high-pressure environments. An alpha binaural (10 Hz) is added to potentiate the calm-alert state.",
          fr: "La respiration carrée est le préréglage le plus polyvalent du système. Ses rétentions symétriques exactes (respiration pleine = respiration vide) équilibrent précisément les systèmes sympathique (respiration pleine = pression intrathoracique élevée) et parasympathique (respiration vide = pression négative). Il en résulte un état d&#39;équanimité : ni activé, ni sédaté – clarté neutre et cortisol régulé. Utilisée par les Navy SEALs, les athlètes de haut niveau et dans les environnements à haute pression. Un stimulus binaural alpha (10 Hz) est ajouté pour potentialiser cet état de calme-vigilance.",
          pt: "A Respiração Quadrada é a configuração predefinida mais versátil do sistema. Suas retenções simétricas exatas (retenção completa = retenção vazia) equilibram com precisão os sistemas simpático (retenção completa = alta pressão intratorácica) e parassimpático (retenção vazia = pressão negativa). O resultado é um estado de equanimidade: nem ativado nem sedado — clareza neutra e cortisol regulado. Utilizado por membros da Marinha dos EUA (Navy SEALs), atletas de elite e em ambientes de alta pressão. Um estímulo binaural alfa (10 Hz) é adicionado para potencializar o estado de calma e alerta.",
          zh: "箱式呼吸法是该系统中最通用的预设模式。其精确对称的屏息（吸满气 = 吸空气）能够精准平衡交感神经系统（吸满气 = 高胸内压）和副交感神经系统（吸空气 = 负压）。最终达到一种平静的状态：既不亢奋也不昏沉——头脑清醒，皮质醇水平稳定。该方法被应用于海豹突击队、精英运动员和高压环境。此外，还会添加一段α双耳节拍（10 Hz）来增强这种平静警觉的状态。",
          hi: "बॉक्स ब्रीदिंग इस सिस्टम का सबसे बहुमुखी प्रीसेट है। इसकी सटीक सममित श्वास प्रतिधारण (होल्ड फुल = होल्ड एम्प्टी) सहानुभूति तंत्रिका तंत्र (होल्ड फुल = उच्च अंतःवक्षीय दबाव) और परासहानुभूति तंत्रिका तंत्र (होल्ड एम्प्टी = नकारात्मक दबाव) को सटीक रूप से संतुलित करती है। इसका परिणाम एक श���ंत अवस्था है: न तो सक्रिय और न ही सुस्त — तटस्थ स्पष्टता और नियंत्रित कोर्टिसोल। इसका उपयोग नेवी सील्स, विशिष्ट एथलीटों और उच्च दबाव वाले वातावरण में किया जाता है। शांत-सतर्क अवस्था को और अधिक प्रभावी बनाने के लिए इसमें अल्फा बाइनॉरल (10 हर्ट्ज़) ध्वनि जोड़ी गई है।"
        },

    audio: {
      binaural: true,
      beat: 10,
      carrier: 300,
      perception: {
        optimal: { min: 250, max: 380 },
        degradation: {
          es: "Beat 10 Hz / Carrier 300 Hz: percepción óptima. El carrier 300 Hz (ligeramente más alto que Alpha 10 Hz estándar) da un carácter más 'vivo' al binaural que complementa el estado activo-calmado del Box. Por debajo de 220 Hz el beat puede sentirse más hipnótico que equilibrante.",
          en: "Beat 10 Hz / Carrier 300 Hz: optimal perception. The 300 Hz carrier (slightly higher than standard Alpha 10 Hz) gives a more 'alive' character to the binaural that complements Box's active-calm state. Below 220 Hz the beat can feel more hypnotic than balancing.",
          fr: "Fréquence de battement 10 Hz / Porteuse 300 Hz : perception optimale. La porteuse à 300 Hz (légèrement supérieure à la fréquence alpha standard de 10 Hz) confère un caractère plus dynamique au son binaural, ce qui complète l’état actif-calme induit par Box. En dessous de 220 Hz, le battement peut avoir un effet plus hypnotique qu’équilibrant.",
          pt: "Batida de 10 Hz / Portadora de 300 Hz: percepção ideal. A portadora de 300 Hz (ligeiramente superior à portadora Alfa padrão de 10 Hz) confere um caráter mais &quot;vivo&quot; ao som binaural, complementando o estado ativo-calmo do Box. Abaixo de 220 Hz, a batida pode parecer mais hipnótica do que equilibradora.",
          zh: "节拍频率 10 Hz / 载波频率 300 Hz：最佳感知。300 Hz 的载波频率（略高于标准的 Alpha 10 Hz）赋予双耳节拍更“鲜活”的特质，与 Box 的动静平衡状态相得益彰。低于 220 Hz 的节拍频率可能会让人感觉更像催眠而非平衡。",
          hi: "बीट 10 हर्ट्ज़ / कैरियर 300 हर्ट्ज़: सर्वोत्तम अनुभव। 300 हर्ट्ज़ कैरियर (मानक अल्फा 10 हर्ट्ज़ से थोड़ा अधिक) बाइनॉरल को अधिक जीवंतता प्रदान करता है, जो बॉक्स की सक्रिय-शांत अवस्था का पूरक है। 220 हर्ट्ज़ से नीचे की बीट संतुलन बनाने के बजाय सम्मोहक प्रतीत हो सकती है।"
        },
        why: {
          es: "El Box Breathing genera alternancia rítmica entre simpático y parasimpático. El binaural alpha (10 Hz) actúa como estabilizador del SNA durante esa alternancia — un punto de referencia neutral al que el sistema vuelve después de cada retención. Esta es la razón por la que el carrier ligeramente más alto (300 Hz vs 250 Hz en Alpha 10 Hz) es más apropiado aquí.",
          en: "Box Breathing generates rhythmic alternation between sympathetic and parasympathetic. The alpha binaural (10 Hz) acts as an ANS stabilizer during that alternation — a neutral reference point the system returns to after each retention. This is why the slightly higher carrier (300 Hz vs 250 Hz in Alpha 10 Hz) is more appropriate here.",
          fr: "La respiration carrée génère une alternance rythmique entre les systèmes sympathique et parasympathique. Le stimulus alpha binaural (10 Hz) stabilise le système nerveux autonome durant cette alternance, constituant un point de référence neutre auquel le système revient après chaque contraction. C&#39;est pourquoi la fréquence porteuse légèrement plus élevée (300 Hz contre 250 Hz pour l&#39;alpha à 10 Hz) est plus appropriée dans ce cas.",
          pt: "A respiração quadrada gera alternância rítmica entre os sistemas simpático e parassimpático. O estímulo alfa binaural (10 Hz) atua como um estabilizador do SNA (Sistema Nervoso Autônomo) durante essa alternância — um ponto de referência neutro ao qual o sistema retorna após cada retenção. É por isso que a portadora ligeiramente mais alta (300 Hz em vez de 250 Hz no Alfa 10 Hz) é mais apropriada neste caso.",
          zh: "箱式呼吸法会在交感神经和副交感神经之间产生节律性的交替。α双耳节拍（10赫兹）在这种交替过程中起到稳定自主神经系统的作用——为系统每次保持呼吸后恢复到中性参考点。这就是为什么稍高的载波频率（300赫兹，而α 10赫兹节拍的载波频率为250赫兹）在这里更为合适。",
          hi: "बॉक्स ब्रीदिंग से सिंपैथेटिक और पैरासिंपैथेटिक तंत्रिकाओं के बीच लयबद्ध बदलाव होता है। अल्फा बाइनॉरल (10 हर्ट्ज़) उस बदलाव के दौरान एएनएस स्टेबलाइज़र का काम करता है—एक तटस्थ संदर्भ बिंदु जिस पर सिस्टम प्रत्येक रिटेंशन के बाद लौटता है। यही कारण है कि यहां थोड़ी अधिक कैरियर आवृत्ति (अ���्फा 10 हर्ट्ज़ में 250 हर्ट्ज़ की तुलना में 300 हर्ट्ज़) अधिक उपयुक्त है।"
        }
      }
    },

    breathing: {
      pattern: "box",
      bpm: 3.75,  // 4+4+4+4 = 16s por ciclo = 3.75 rpm (informativo)
      ratio: 1.0,
      holdFull: 4,
      holdEmpty: 4
    },

    tuning: {
      breathing: {
        holdFull: {
          min: 3, max: 6, step: 1,
          lower: {
          es: "3s: Box suave. Bueno para entrada al sistema o si las retenciones de 4s generan ansiedad.",
          en: "3s: gentle Box. Good for system entry or if 4s retentions generate anxiety.",
          fr: "3s : Boîte douce. Idéale pour une première prise en main ou si les rétentions de 4s génèrent de l’anxiété.",
          pt: "3s: Box suave. Bom para entrada no sistema ou se as retenções de 4s gerarem ansiedade.",
          zh: "3秒：温和型方框。适合系统建立初期，或4秒滞留引起焦虑时使用。",
          hi: "3s: सौम्य बॉक्स। सिस्टम में प्रवेश के लिए या यदि 4s प्रतिधारण से चिंता उत्पन्न होती है तो अच्छा है।"
        },
          higher: {
          es: "5–6s: Box intenso. Mayor equilibrio SNA, usado en protocolos de alto rendimiento. OBLIGATORIO: mantener holdFull = holdEmpty para preservar la simetría del Box.",
          en: "5–6s: intense Box. Greater ANS balance, used in high-performance protocols. MANDATORY: keep holdFull = holdEmpty to preserve Box symmetry.",
          fr: "5 à 6 s : Box intense. Meilleur équilibre du SNA, utilisé dans les protocoles de haute performance. OBLIGATOIRE : maintenir holdFull = holdEmpty pour préserver la symétrie de la Box.",
          pt: "5–6s: Box intenso. Maior equilíbrio do SNA, usado em protocolos de alto desempenho. OBRIGATÓRIO: manter holdFull = holdEmpty para preservar a simetria do Box.",
          zh: "5-6秒：高强度方框训练。增强自主神经系统平衡，适用于高强度训练方案。必须注意：保持满格状态 = 空格状态，以维持方框对称性。",
          hi: "5–6 सेकंड: तीव्र बॉक्स क्रिया। बेहतर एएनएस संतुलन, उच्च-प्रदर्शन प्रोटोकॉल में उपयोग किया जाता है। अनिवार्य: बॉक्स समरूपता बनाए रखने के लिए holdFull = holdEmpty रखें।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Sensación de ecuanimidad — ni excitado ni somnoliento después de 4–5 ciclos",
          "Claridad mental sin esfuerzo",
          "Hombros que bajan solos — el cortisol está bajando",
          "Capaz de pensar en el problema estresante sin activación emocional"
        ],
        en: [
          "Equanimity — neither excited nor drowsy after 4–5 cycles",
          "Effortless mental clarity",
          "Shoulders sinking on their own — cortisol is dropping",
          "Able to think about the stressor without emotional activation"
        ]
      },
      adjust: {
          es: "Si la retención se siente larga: empieza con 3-3-3-3. Si el estado es demasiado sedante: sube a 5-5-5-5. Siempre manteniendo la simetría.",
          en: "If retention feels long: start with 3-3-3-3. If the state is too sedating: raise to 5-5-5-5. Always maintaining symmetry.",
          fr: "Si la rétention vous paraît longue : commencez par 3-3-3-3. Si l’effet est trop sédatif : passez à 5-5-5-5. Veillez toujours à conserver une certaine symétrie.",
          pt: "Se a retenção parecer prolongada: comece com 3-3-3-3. Se o estado for muito sedativo: aumente para 5-5-5-5. Sempre mantendo a simetria.",
          zh: "如果感觉保持时间过长：从 3-3-3-3 开始。如果感觉过于镇静：增加到 5-5-5-5。始终保持对称。",
          hi: "यदि लय बनाए रखने में लंबा समय लगे: 3-3-3-3 से शुरू करें। यदि लय बहुत सुस्ती भरी लगे: तो इसे 5-5-5-5 तक बढ़ा दें। हमेशा लय को संतुलित रखें।"
        },
      unexpected: {
          es: "Calor en las manos durante holdFull y fresco durante holdEmpty: variaciones de circulación periférica normales del ciclo simpático/parasimpático.",
          en: "Warmth in hands during holdFull and coolness during holdEmpty: normal peripheral circulation variations of the sympathetic/parasympathetic cycle.",
          fr: "Chaleur des mains pendant la préhension. Sensation de fraîcheur pendant la préhension. Sensation de vide : variations normales de la circulation périphérique du cycle sympathique/parasympathique.",
          pt: "Sensação de calor nas mãos durante o contato com a pele cheia e sensação de frio durante o contato com a pele vazia: variações normais da circulação periférica no ciclo simpático/parassimpático.",
          zh: "握持时手部温暖（充满时）和握持时手部凉爽（空时）：交感神经/副交感神经循环的正常外周循环变化。",
          hi: "हाथों को पकड़ते समय गर्माहट और पकड़ते समय ठंडक का अनुभव होना: सामान्य परिधीय परिसंचरण और सहानुभूति तंत्रिका तंत्र/पैरासिम्पेथेटिक चक्र में होने वाले बदलाव।"
        },
      stop: {
          es: "Hipertensión no controlada: no usar retenciones. Sustituir por coherencia cardíaca sin holdFull ni holdEmpty.",
          en: "Uncontrolled hypertension: don't use retentions. Replace with heart coherence without holdFull or holdEmpty.",
          fr: "Hypertension non contrôlée : ne pas utiliser de rétention. Les remplacer par la cohérence cardiaque sans holdFull ni holdEmpty.",
          pt: "Hipertensão não controlada: não use retenções. Substitua por coerência cardíaca sem holdFull ou holdEmpty.",
          zh: "未控制的高血压：请勿使用保留液。请用无需使用 holdFull 或 holdEmpty 功能的心脏协调液代替。",
          hi: "अनियंत्रित उच्च रक्तचाप: रिटेंशन का उपयोग न करें। इसके स्थान पर होल्डफुल या होल्डएम्प्टी के बिना हार्ट कोहेरेंस का प्रयोग करें।"
        }
    },

    guide: {
      when: {
          es: "Antes de hablar en público, después de una discusión, antes de una decisión importante. Es el preset de regulación universal — funciona en cualquier contexto.",
          en: "Before public speaking, after an argument, before an important decision. It's the universal regulation preset — works in any context.",
          fr: "Avant de prendre la parole en public, après une dispute, avant une décision importante. C&#39;est le réflexe universel — il fonctionne dans tous les contextes.",
          pt: "Antes de falar em público, depois de uma discussão, antes de uma decisão importante. É a regra universal predefinida — funciona em qualquer contexto.",
          zh: "公开演讲前、争论后、做出重要决定前，这都是一条通用的预设规则——适用于任何场合。",
          hi: "सार्वजनिक भाषण से पहले, किसी बहस के बाद, किसी महत्वपूर्ण निर्णय से पहले। यह एक सार्वभौमिक नियम है - जो हर स्थिति में लागू होता है।"
        },
      duration: { min: 4, recommended: 10, max: 20 },
      sequence: {
          es: "Puede ir antes de Beta 16 Hz (foco) o después de Gamma 40 Hz (descenso). Es el preset puente del sistema.",
          en: "Can precede Beta 16 Hz (focus) or follow Gamma 40 Hz (descent). It's the system's bridge preset.",
          fr: "Peut précéder Beta 16 Hz (mise au point) ou suivre Gamma 40 Hz (descente). Il s&#39;agit du préréglage de pont du système.",
          pt: "Pode preceder Beta 16 Hz (foco) ou seguir Gamma 40 Hz (descida). É a predefinição de ponte do sistema.",
          zh: "可以置于 Beta 16 Hz（对焦）之前，也可以置于 Gamma 40 Hz（下降）之后。这是系统的桥接预设。",
          hi: "यह बीटा 16 हर्ट्ज़ (फोकस) से पहले या गामा 40 हर्ट्ज़ (अवरोहण) के बाद उपयोग किया जा सकता है। यह सिस्टम का ब्रिज प्रीसेट है।"
        },
      contraindications: {
          es: "Hipertensión no controlada (evitar retenciones). Asma activa (modificar holdEmpty a 0).",
          en: "Uncontrolled hypertension (avoid retentions). Active asthma (modify holdEmpty to 0).",
          fr: "Hypertension non contrôlée (éviter les rétentions). Asthme actif (modifier holdEmpty à 0).",
          pt: "Hipertensão não controlada (evitar retenções). Asma ativa (modificar holdEmpty para 0).",
          zh: "未控制的高血压（避免潴留）。活动性哮喘（将 holdEmpty 修改为 0）。",
          hi: "अनियंत्रित उच्च रक्तचाप (मूत्र प्रतिधारण से बचें)। सक्रिय अस्थमा (होल्डएम्प्टी को 0 पर सेट करें)।"
        }
    },

    tags: ["equilibrio", "balance", "SNA", "cortisol", "validado", "validated", "militar", "military", "box-breathing", "rendimiento", "performance"]
  },


  {
    id: "nadi",
    category: "pranayama",
    type: ["breathing", "binaural"],
    sessions: [
      { id: "calma",    priority: 3 },
      { id: "conexion", priority: 5 },
      { id: "foco",     priority: 5 }
    ],
    scientificLevel: "emerging",
    color: "#4ecb8a",

    name: { es: "Nadi Shodhana", en: "Nadi Shodhana", fr: "Nadi Shodhana", pt: "Nadi Shodhana" },
    description: {
      es: "Equilibrio Hemisférico",
      en: "Hemispheric Balance",
      fr: "Équilibre Hémisphérique",
      pt: "Equilíbrio Hemisférico"
    },
    longDescription: {
          es: "Nadi Shodhana (respiración nasal alterna) es el pranayama clásico de equilibrio hemisférico. La respiración por fosa nasal derecha activa el hemisferio izquierdo (lógico); por fosa izquierda, el derecho (holístico). La alternancia rítmica equilibra ambos. El binaural alpha (10 Hz) refuerza la sincronización interhemisférica. El kumbhaka (holdFull) clásico de 4s profundiza el efecto de equilibrio. Puede hacerse con alternancia física (dedos) o mental.",
          en: "Nadi Shodhana (alternate nostril breathing) is the classic hemispheric balance pranayama. Breathing through the right nostril activates the left hemisphere (logical); through the left, the right (holistic). Rhythmic alternation balances both. The alpha binaural (10 Hz) reinforces interhemispheric synchronization. The classic kumbhaka (holdFull) of 4s deepens the balance effect. Can be done with physical (fingers) or mental alternation.",
          fr: "Nadi Shodhana (respiration alternée) est le pranayama classique d&#39;équilibrage hémisphérique. Respirer par la narine droite active l&#39;hémisphère gauche (logique) ; par la gauche, l&#39;hémisphère droit (holistique). L&#39;alternance rythmique équilibre les deux. Les sons alpha binauraux (10 Hz) renforcent la synchronisation interhémisphérique. Le kumbhaka classique (retenue) de 4 secondes approfondit l&#39;effet d&#39;équilibrage. Cette technique peut être pratiquée par alternance physique (doigts) ou mentale.",
          pt: "Nadi Shodhana (respiração alternada pelas narinas) é o pranayama clássico para o equilíbrio hemisférico. Respirar pela narina direita ativa o hemisfério esquerdo (lógico); pela esquerda, o direito (holístico). A alternância rítmica equilibra ambos. O estímulo binaural alfa (10 Hz) reforça a sincronização inter-hemisférica. O kumbhaka clássico (retenção da respiração) de 4 segundos aprofunda o efeito de equilíbrio. Pode ser praticado com alternância física (com os dedos) ou mental.",
          zh: "纳迪舒丹（交替鼻孔呼吸法）是经典的半球平衡调息法。用右鼻孔呼吸激活左脑（逻辑思维），用左鼻孔呼吸激活右脑（整体思维）。有节奏的交替呼吸可以平衡左右脑。α双耳节拍（10赫兹）可以增强半球间的同步性。经典的4秒屏息（保持呼吸完全）可以加深平衡效果。可以通过手指的交替呼吸或意念交替呼吸来进行练习。",
          hi: "नाड़ी शोधन (एक के बाद एक नासिका श्वास लेना) गोलार्ध संतुलन प्राणायाम का एक उत्कृष्ट उदाहरण है। दाहिनी नासिका से श्वास लेने पर बायां गोलार्ध (तार्किक) सक्रिय होता है; बाईं नासिका से श्वास लेने पर दायां (समग्र) सक्रिय होता है। लयबद्ध रूप से बारी-बारी से श्वास लेने से दोनों गोलार्ध संतुलि�� रहते हैं। अल्फा बाइनॉरल (10 हर्ट्ज़) दोनों गोलार्धों के बीच सामंजस्य को मजबूत करता है। 4 सेकंड का उत्कृष्ट कुंभक (श्वास धारण) संतुलन प्रभाव को और गहरा करता है। इसे शारीरिक (उंगलियों) या मानसिक रूप से बारी-बारी से किया जा सकता है।"
        },

    audio: {
      binaural: true,
      beat: 10,
      carrier: 250,
      perception: {
        optimal: { min: 200, max: 350 },
        degradation: {
          es: "Igual que Alpha 10 Hz estándar. El binaural de 10 Hz es el más perceptible del sistema. Carrier 250 Hz ofrece balance óptimo entre calidez y claridad del beat.",
          en: "Same as standard Alpha 10 Hz. The 10 Hz binaural is the most perceptible in the system. Carrier 250 Hz offers optimal balance between warmth and beat clarity.",
          fr: "Identique au signal Alpha standard à 10 Hz. Le signal binaural à 10 Hz est le plus perceptible du système. Le signal porteur à 250 Hz offre un équilibre optimal entre chaleur et clarté des battements.",
          pt: "Igual ao Alpha 10 Hz padrão. O binaural de 10 Hz é o mais perceptível no sistema. A portadora de 250 Hz oferece o equilíbrio ideal entre calor e clareza da batida.",
          zh: "与标准 Alpha 10 Hz 相同。10 Hz 双耳采样是该系统中最容易察觉的。250 Hz 载波频率在温暖感和节拍清晰度之间实现了最佳平衡。",
          hi: "मानक अल्फा 10 हर्ट्ज़ के समान। सिस्टम में 10 हर्ट्ज़ बाइनॉरल सबसे अधिक स्पष्ट है। कैरियर 250 हर्ट्ज़ गर्माहट और बीट की स्पष्टता के बीच इष्टतम संतुलन प्रदान करता है।"
        },
        why: {
          es: "El Nadi Shodhana produce una alternancia rítmica del flujo de aire que genera señales propioceptivas desde la mucosa nasal al hipotálamo. El binaural alpha (10 Hz) actúa sobre el córtex auditivo bilateralmente — dos mecanismos diferentes que convergen en el mismo estado de equilibrio hemisférico.",
          en: "Nadi Shodhana produces rhythmic alternation of airflow that generates proprioceptive signals from the nasal mucosa to the hypothalamus. The alpha binaural (10 Hz) acts on the auditory cortex bilaterally — two different mechanisms converging on the same state of hemispheric balance.",
          fr: "Nadi Shodhana produit une alternance rythmique du flux d&#39;air qui génère des signaux proprioceptifs de la muqueuse nasale à l&#39;hypothalamus. Le stimulus alpha binaural (10 Hz) agit bilatéralement sur le cortex auditif ; deux mécanismes différents convergent vers un même état d&#39;équilibre hémisphérique.",
          pt: "Nadi Shodhana produz alternância rítmica do fluxo de ar que gera sinais proprioceptivos da mucosa nasal para o hipotálamo. O estímulo alfa binaural (10 Hz) atua bilateralmente no córtex auditivo — dois mecanismos diferentes convergindo para o mesmo estado de equilíbrio hemisférico.",
          zh: "鼻腔调理法（Nadi Shodhana）可产生有节奏的气流交替，从而产生从鼻黏膜到下丘脑的本体感觉信号。双耳α波（10 Hz）作用于双侧听觉皮层——两种不同的机制最终都达到半球平衡的状态。",
          hi: "नाड़ी शोधन से वायु प्रवाह में लयबद्ध परिवर्तन होता है, जिससे नाक की श्लेष्मा से हाइपोथैलेमस तक प्रोप्रियोसेप्टिव संकेत उत्पन्न होते हैं। अल्फा बाइनॉरल (10 हर्ट्ज़) श्रवण प्रांतस्था पर दोनों ओर से कार्य करता है - दो अलग-अलग तंत्र एक ही गोलार्धीय संतुलन की स्थिति में अभिसरित होते हैं।"
        }
      }
    },

    breathing: {
      pattern: "nadi",
      bpm: 6,
      ratio: 1.0,
      holdFull: 4,
      holdEmpty: 2
    },

    tuning: {
      audio: {
        beat: {
          min: 8, max: 12, step: 0.5,
          lower: {
          es: "8–9 Hz: alpha profundo. Nadi más meditativo, para integración profunda o antes de dormir.",
          en: "8–9 Hz: deep alpha. More meditative Nadi, for deep integration or before sleep.",
          fr: "8–9 Hz : fréquence alpha profonde. Nadi plus méditatif, pour une intégration profonde ou avant le sommeil.",
          pt: "8–9 Hz: alfa profundo. Nadi mais meditativo, para integração profunda ou antes de dormir.",
          zh: "8–9 赫兹：深度α波。更具冥想效果的纳迪脉轮，适合深度整合或睡前练习。",
          hi: "8-9 हर्ट्ज़: गहरा अल्फा। अधिक ध्यानपूर्ण नाड़ी, गहन एकीकरण के लिए या सोने से पहले।"
        },
          higher: {
          es: "11–12 Hz: alpha alto. Nadi activo. Bueno para mañana con objetivo de foco y claridad.",
          en: "11–12 Hz: high alpha. Active Nadi. Good for morning with focus and clarity objective.",
          fr: "11–12 Hz : alpha élevé. Nadi actif. Idéal le matin pour favoriser la concentration et la clarté d’esprit.",
          pt: "11–12 Hz: alfa alto. Nadi ativo. Bom para uso matinal com foco e clareza de visão.",
          zh: "11–12 Hz：高α波。活跃的脉轮。适合早晨专注、头脑清晰地聆听。",
          hi: "11–12 हर्ट्ज़: उच्च अल्फा। सक्रिय नाड़ी। एकाग्रता और स्पष्टता के उद्देश्य से सुबह के समय के लिए अच्छा।"
        }
        }
      },
      breathing: {
        holdFull: {
          min: 0, max: 8, step: 1,
          lower: {
          es: "0s: Nadi básico sin kumbhaka. Accesible para principiantes. El efecto de equilibrio hemisférico persiste sin retención.",
          en: "0s: basic Nadi without kumbhaka. Accessible for beginners. Hemispheric balance effect persists without retention.",
          fr: "0s : Nadi de base sans kumbhaka. Accessible aux débutants. L’effet d’équilibre hémisphérique persiste sans rétention.",
          pt: "0s: Nadi básico sem kumbhaka. Acessível para iniciantes. O efeito de equilíbrio hemisférico persiste sem retenção.",
          zh: "0秒：基础脉轮呼吸法，无需屏息。适合初学者。半球平衡效果持久，无需记忆保持。",
          hi: "0s: कुंभक के बिना बुनियादी नाड़ी। शुरुआती लोगों के लिए सुलभ। गोलार्ध संतुलन प्रभाव बिना रुके बना रहता है।"
        },
          higher: {
          es: "6–8s: kumbhaka antara clásico. El pranayama completo según el Hatha Yoga Pradipika. Solo con práctica previa.",
          en: "6–8s: classic antara kumbhaka. The complete pranayama according to Hatha Yoga Pradipika. Only with prior practice.",
          fr: "6 à 8 secondes : antara kumbhaka classique. Le pranayama complet selon la Hatha Yoga Pradipika. Nécessite une pratique préalable.",
          pt: "6–8 segundos: antara kumbhaka clássico. O pranayama completo de acordo com o Hatha Yoga Pradipika. Somente com prática prévia.",
          zh: "6-8秒：经典的内屏息法（antara kumbhaka）。根据《哈他瑜伽之光》（Hatha Yoga Pradipika）的完整调息法。需事先练习。",
          hi: "6–8 सेकंड: क्लासिक अंतरा कुंभक। हठ योग प्रदीपिका के अनुसार संपूर्ण प्राणायाम। केवल पूर्व अभ्यास के साथ।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Sensación de que los dos lados del cuerpo se 'alinean'",
          "Reducción del diálogo interno — pensamientos más espaciados",
          "Capacidad de ver una situación desde múltiples perspectivas simultáneamente",
          "Temperatura nasal percibida como equilibrada en ambas fosas"
        ],
        en: [
          "Sensation that both sides of the body 'align'",
          "Internal dialogue decreases — thoughts more spaced apart",
          "Ability to see a situation from multiple perspectives simultaneously",
          "Nasal temperature perceived as balanced in both nostrils"
        ]
      },
      adjust: {
          es: "Si no puedes hacer la alternancia física: hazla mentalmente (visualiza el aire entrando por una fosa y saliendo por la otra). El efecto es perceptiblemente menor pero sigue siendo real.",
          en: "If you can't do the physical alternation: do it mentally (visualize air entering one nostril and exiting the other). The effect is perceptibly lesser but still real.",
          fr: "Si vous ne pouvez pas effectuer l&#39;alternance physique : faites-le mentalement (visualisez l&#39;air entrant par une narine et sortant par l&#39;autre). L&#39;effet est sensiblement moindre, mais toujours réel.",
          pt: "Se você não consegue fazer a alternância física, faça-a mentalmente (visualize o ar entrando por uma narina e saindo pela outra). O efeito é perceptivelmente menor, mas ainda real.",
          zh: "如果你无法做到实际的交替吸气：那就用意念来模拟（想象空气从一个鼻孔进入，从另一个鼻孔流出）。效果虽然不如实际吸气明显，但仍然有效。",
          hi: "यदि आप शारीरिक रूप से हवा का संचार नहीं कर सकते, तो इसे मानसिक रूप से करें (कल्पना करें कि हवा एक नथुने से प्रवेश कर रही है और दूसरे से बाहर निकल रही है)। इसका प्रभाव प्रत्यक्ष रूप से कम होगा, लेकिन फिर भी वास्तविक होगा।"
        },
      unexpected: {
          es: "Una fosa más tapada que la otra al inicio: normal. El ciclo nasal tiene una duración de 90–120 min — la fosa dominante alterna naturalmente. El Nadi acelerará el equilibrio.",
          en: "One nostril more blocked than the other at the start: normal. The nasal cycle has a 90–120 min duration — the dominant nostril alternates naturally. Nadi will accelerate the balance.",
          fr: "Une narine plus bouchée que l&#39;autre au départ : c&#39;est normal. Le cycle nasal dure de 90 à 120 minutes ; la narine dominante alterne naturellement. Nadi accélérera cet équilibre.",
          pt: "Uma narina mais obstruída que a outra no início: normal. O ciclo nasal tem duração de 90 a 120 minutos — a narina dominante alterna naturalmente. O Nadi acelera esse equilíbrio.",
          zh: "开始时一侧鼻孔比另一侧堵塞更严重：正常现象。鼻腔周期为90-120分钟——优势鼻孔会自然交替。脉轮疗法可以加速这种平衡。",
          hi: "शुरुआत में एक नथुने का दूसरे की तुलना में अधिक बंद होना सामान्य है। नाक की क्रिया का चक्र 90-120 मिनट का होता है - प्रमुख नथुना स्वाभाविक रूप से बारी-बारी से काम करता है। नाड़ी इस संतुलन को तेज करती है।"
        },
      stop: {
          es: "Sin contraindicaciones agudas. Si hay obstrucción nasal severa: practicar mentalmente.",
          en: "No acute contraindications. If there is severe nasal obstruction: practice mentally.",
          fr: "Aucune contre-indication aiguë. En cas d&#39;obstruction nasale sévère : se préparer mentalement.",
          pt: "Não há contraindicações agudas. Em caso de obstrução nasal grave: pratique mentalmente.",
          zh: "无急性禁忌症。若鼻塞严重：可在脑海中进行练习。",
          hi: "कोई तत्काल विपरीत संकेत नहीं हैं। यदि नाक में गंभीर रुकावट हो तो मानसिक रूप से अभ्यास करें।"
        }
    },

    guide: {
      when: {
          es: "Mañana antes de trabajo creativo o decisiones importantes. También bueno para transitar entre tareas muy diferentes.",
          en: "Morning before creative work or important decisions. Also good for transitioning between very different tasks.",
          fr: "Le matin avant un travail créatif ou des décisions importantes. Idéal également pour la transition entre des tâches très différentes.",
          pt: "De manhã, antes de trabalhos criativos ou decisões importantes. Também é uma boa opção para fazer a transição entre tarefas muito diferentes.",
          zh: "清晨，适合进行创意工作或做出重要决定之前。也适合在截然不同的任务之间转换时使用。",
          hi: "रचनात्मक कार्य या महत्वपूर्ण निर्णय लेने से पहले की सुबह। यह दो बिल्कुल अलग-अलग कार्यों के बीच तालमेल बिठाने के लिए भी अच्छा है।"
        },
      duration: { min: 7, recommended: 15, max: 30 },
      sequence: {
          es: "Excelente como entrada a Alpha 8 Hz (creatividad) o Beta 16 Hz (foco) — el equilibrio hemisférico potencia ambos.",
          en: "Excellent as entry to Alpha 8 Hz (creativity) or Beta 16 Hz (focus) — hemispheric balance potentiates both.",
          fr: "Excellent comme introduction à Alpha 8 Hz (créativité) ou Beta 16 Hz (concentration) — l&#39;équilibre hémisphérique potentialise les deux.",
          pt: "Excelente como porta de entrada para as ondas Alfa de 8 Hz (criatividade) ou Beta de 16 Hz (foco) — o equilíbrio hemisférico potencializa ambas.",
          zh: "非常适合作为进入 Alpha 8 Hz（创造力）或 Beta 16 Hz（专注力）的入口——半球平衡可以增强这两种能力。",
          hi: "अल्फा 8 हर्ट्ज़ (रचनात्मकता) या बीटा 16 हर्ट्ज़ (एकाग्रता) में प्रवेश के लिए उत्कृष्ट - गोलार्ध संतुलन दोनों को सशक्त बनाता है।"
        },
      contraindications: {
          es: "Obstrucción nasal severa (practicar mentalmente). Cirugía nasal reciente.",
          en: "Severe nasal obstruction (practice mentally). Recent nasal surgery.",
          fr: "Obstruction nasale sévère (entraînement mental). Chirurgie nasale récente.",
          pt: "Obstrução nasal grave (pratique mentalmente). Cirurgia nasal recente.",
          zh: "严重鼻塞（需进行心理练习）。近期做过鼻部手术。",
          hi: "नाक में गंभीर रुकावट (मानसिक रूप से अभ्यास करें)। हाल ही में नाक की सर्जरी हुई है।"
        }
    },

    tags: ["pranayama", "hemisférico", "hemispheric", "equilibrio", "balance", "yoga", "nadi", "decisiones", "decisions"]
  },


  {
    id: "dispenza",
    category: "pranayama",
    type: ["breathing", "binaural"],
    sessions: [
      { id: "meditacion", priority: 4 },
      { id: "energia",    priority: 6 }
    ],
    scientificLevel: "traditional",
    color: "#9b7de8",

    name: { es: "Maha Bandha · Dispenza", en: "Maha Bandha · Dispenza", fr: "Maha Bandha · Dispenza", pt: "Maha Bandha · Dispenza" },
    description: {
      es: "Activación Pineal",
      en: "Pineal Activation",
      fr: "Activation Pinéale",
      pt: "Ativação Pineal"
    },
    longDescription: {
          es: "Maha Bandha (exhale + holdEmpty profundo + contracción del suelo pélvico + contracción abdominal) es el pranayama de activación del LCR según la tradición yóguica. La técnica de Joe Dispenza incorpora visualización de energía ascendente durante la retención. El mecanismo fisiológico plausible: la presión negativa intratorácica + contracción pélvica (Mula Bandha) crea un gradiente de presión en el LCR desde el sacro hacia el cráneo. Se añade un binaural theta (6 Hz) durante la fase activa para acompañar el estado contemplativo profundo.",
          en: "Maha Bandha (exhale + deep holdEmpty + pelvic floor contraction + abdominal contraction) is the CSF activation pranayama according to yogic tradition. Joe Dispenza's technique incorporates visualization of ascending energy during retention. Plausible physiological mechanism: negative intrathoracic pressure + pelvic contraction (Mula Bandha) creates a pressure gradient in the CSF from sacrum to skull. A theta binaural (6 Hz) is added during the active phase to accompany the deep contemplative state.",
          fr: "Maha Bandha (expiration + rétention profonde + contraction du plancher pelvien + contraction abdominale) est le pranayama d&#39;activation du LCR selon la tradition yogique. La technique de Joe Dispenza intègre la visualisation de l&#39;énergie ascendante pendant la rétention. Mécanisme physiologique plausible : la pression intrathoracique négative associée à la contraction pelvienne (Mula Bandha) crée un gradient de pression dans le LCR, du sacrum au crâne. Un son binaural thêta (6 Hz) est ajouté pendant la phase active pour accompagner l&#39;état contemplatif profond.",
          pt: "Maha Bandha (expiração + retenção profunda + contração do assoalho pélvico + contração abdominal) é o pranayama de ativação do LCR segundo a tradição iogue. A técnica de Joe Dispenza incorpora a visualização da energia ascendente durante a retenção. Mecanismo fisiológico plausível: a pressão intratorácica negativa + contração pélvica (Mula Bandha) cria um gradiente de pressão no LCR do sacro ao crânio. Um som binaural theta (6 Hz) é adicionado durante a fase ativa para acompanhar o estado contemplativo profundo.",
          zh: "根据瑜伽传统，Maha Bandha（呼气+深屏息+盆底肌收缩+腹部收缩）是一种激活脑脊液的呼吸法。乔·迪斯潘萨的技巧在屏息过程中融入了能量上升的视觉化。其可能的生理机制是：胸腔内负压+盆底肌收缩（根锁）会在从骶骨到颅骨的脑脊液中形成压力梯度。在练习的活跃阶段，会加入θ双耳节拍（6赫兹），以辅助深度冥想状态。",
          hi: "योग परंपरा के अनुसार, महा बंध (श्वास छोड़ना + गहरी साँस रोकना + श्रोणि तल का संकुचन + उदर का संकुचन) सीएसएफ सक्रियण प्राणायाम है। जो डिस्पेंज़ा की तकनीक में श्वास रोकते समय ऊपर की ओर बढ़ती ऊर्जा की कल्पना शामिल है। संभावित शारीरिक क्रियाविधि: वक्षीय दबाव में कमी + श्रोणि संकुचन (मूला बंध) ��्रिकास्थि से खोपड़ी तक सीएसएफ में दबाव प्रवणता उत्पन्न करता है। गहन ध्यान अवस्था के साथ सक्रिय चरण के दौरान थीटा बाइनॉरल (6 हर्ट्ज़) ध्वनि जोड़ी जाती है।"
        },

    audio: {
      binaural: true,
      beat: 6,
      carrier: 200,
      perception: {
        optimal: { min: 180, max: 280 },
        degradation: {
          es: "Beat 6 Hz / Carrier 200 Hz: igual que Theta 6 Hz. La percepción del binaural durante la retención vacía larga es secundaria — lo importante es la sensación corporal. El binaural actúa como ancla del estado theta en el fondo.",
          en: "Beat 6 Hz / Carrier 200 Hz: same as Theta 6 Hz. Binaural perception during the long empty retention is secondary — what matters is the bodily sensation. The binaural acts as a theta state anchor in the background.",
          fr: "Battement 6 Hz / Porteuse 200 Hz : équivalent à Thêta 6 Hz. La perception binaurale durant la longue période de rétention vide est secondaire ; seule la sensation corporelle importe. Le stimulus binaural sert d’ancrage à l’état thêta en arrière-plan.",
          pt: "Batida de 6 Hz / Portadora de 200 Hz: o mesmo que Theta de 6 Hz. A percepção binaural durante a longa retenção vazia é secundária — o que importa é a sensação corporal. O sinal binaural atua como uma âncora do estado theta em segundo plano.",
          zh: "节拍频率 6 Hz / 载波频率 200 Hz：与 6 Hz 的 Theta 波相同。在长时间的空耳保持期间，双耳感知是次要的——重要的是身体感觉。双耳感知在背景中起到 Theta 波状态锚点的作用。",
          hi: "बीट 6 हर्ट्ज़ / कैरियर 200 हर्ट्ज़: थीटा 6 हर्ट्ज़ के समान। लंबे समय तक खाली प्रतिधारण के दौरान द्विश्रव्य बोध गौण है - महत्वपूर्ण शारीरिक संवेदना है। द्विश्रव्य पृष्ठभूमि में थीटा अवस्था के आधार के रूप में कार्य करता है।"
        },
        why: {
          es: "Durante el holdEmpty de 20–30s, la atención interna es intensa. El binaural theta (6 Hz) actúa como soporte del estado contemplativo sin requerir percepción activa — funciona a nivel de procesamiento auditivo subcortical. Es el único preset donde el binaural es deliberadamente secundario al trabajo corporal.",
          en: "During the 20–30s holdEmpty, internal attention is intense. The theta binaural (6 Hz) acts as support for the contemplative state without requiring active perception — it works at the subcortical auditory processing level. It's the only preset where the binaural is deliberately secondary to the body work.",
          fr: "Pendant les 20 à 30 secondes de la phase de vide, l&#39;attention intérieure est intense. Le son binaural thêta (6 Hz) soutient l&#39;état contemplatif sans nécessiter de perception active ; il agit au niveau du traitement auditif sous-cortical. C&#39;est le seul préréglage où le son binaural est délibérément secondaire au travail corporel.",
          pt: "Durante os 20 a 30 segundos em que a postura é mantida vazia, a atenção interna é intensa. O estímulo binaural theta (6 Hz) serve de suporte para o estado contemplativo sem exigir percepção ativa — ele atua no nível do processamento auditivo subcortical. É a única configuração predefinida em que o estímulo binaural é deliberadamente secundário ao trabalho corporal.",
          zh: "在20-30秒的“保持空虚”阶段，内在注意力高度集中。θ双耳节拍（6赫兹）无需主动感知即可辅助冥想状态——它作用于皮层下听觉处理层面。这是唯一一个双耳节拍被刻意置于身体练习之后的预设模式。",
          hi: "20-30 सेकंड के होल्डएम्प्टी के दौरान, आंतरिक ध्यान तीव्र होता है। थीटा बाइनॉरल (6 हर्ट्ज़) सक्रिय बोध की आवश्यकता के बिना चिंतनशील अवस्था के लिए सहायक होता है - यह सबकोर्टिकल श्रवण प्रसंस्करण स्तर पर कार्य करता है। यह एकमात्र प्रीसेट है जहां बाइनॉरल को जानबूझकर शारीरिक क्रिया के लिए गौण ��खा गया है।"
        }
      }
    },

    breathing: {
      pattern: "dispenza",
      bpm: 5,
      ratio: 1.0,
      holdFull: 0,
      holdEmpty: 20
    },

    tuning: {
      breathing: {
        holdEmpty: {
          min: 10, max: 45, step: 5,
          lower: {
          es: "10–15s: entrada segura. Para principiantes. El Mula Bandha (contracción pélvica) debe estar activo todo el tiempo del hold. Sin él, el efecto se reduce a hipocapnia simple.",
          en: "10–15s: safe entry. For beginners. Mula Bandha (pelvic contraction) must be active throughout the hold. Without it, the effect reduces to simple hypocapnia.",
          fr: "10 à 15 secondes : entrée en douceur. Pour les débutants. Le Mula Bandha (contraction du plancher pelvien) doit être maintenu pendant toute la durée de la contraction. Sans cela, l’effet se limite à une simple hypocapnie.",
          pt: "10–15 segundos: entrada segura. Para iniciantes. Mula Bandha (contração pélvica) deve estar ativo durante toda a postura. Sem ela, o efeito se reduz a uma simples hipocapnia.",
          zh: "10-15秒：安全进入。适合初学者。在整个保持过程中，必须保持根锁（骨盆收缩）。否则，效果将仅限于单纯的低碳酸血症。",
          hi: "10-15 सेकंड: सुरक्षित प्रवेश। शुरुआती लोगों के लिए। पूरे समय मुला बंध (श्रोणि संकुचन) सक्रिय रहना चाहिए। इसके बिना, प्रभाव केवल हाइपोकैपनिया तक सीमित हो जाता है।"
        },
          higher: {
          es: "25–45s: zona avanzada del protocolo. Solo acostado. Solo si no hay mareo previo. Construye 5s por semana. NUNCA fuerces más allá del impulso natural de respirar.",
          en: "25–45s: advanced protocol zone. Only lying down. Only if no prior dizziness. Build 5s per week. NEVER force beyond the natural impulse to breathe.",
          fr: "25 à 45 secondes : protocole avancé. Position allongée uniquement. Uniquement en l’absence de vertiges antérieurs. Augmenter de 5 secondes par semaine. Ne jamais forcer la respiration.",
          pt: "25–45s: zona de protocolo avançado. Somente deitado. Somente se não houver tontura prévia. Aumente 5 segundos por semana. NUNCA force além do impulso natural da respiração.",
          zh: "25-45秒：进阶训练阶段。仅限平躺。仅限无眩晕症状者。每周增加5秒。切勿强迫呼吸，以免超出自然呼吸的节奏。",
          hi: "25-45 सेकंड: उन्नत प्रोटोकॉल क्षेत्र। केवल लेटकर अभ्यास करें। केवल तभी जब पहले कभी चक्कर न आए हों। प्रति सप्ताह 5 सेकंड बढ़ाएं। सांस लेने की स्वाभाविक प्रवृत्ति से अधिक ज़ोर न लगाएं।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Hormigueo o calor en la base de la columna durante holdEmpty",
          "Sensación de 'subida' de energía desde el sacro hacia la cabeza",
          "Pulsación o calor en el entrecejo durante la retención",
          "Al inhalar después del hold: sensación de 'llenarse de luz' o calidez total"
        ],
        en: [
          "Tingling or heat at the base of the spine during holdEmpty",
          "'Rising' energy sensation from sacrum to head",
          "Pulsation or warmth at the brow center during retention",
          "Upon inhale after hold: sensation of 'filling with light' or total warmth"
        ]
      },
      adjust: {
          es: "La contracción del suelo pélvico (Mula Bandha) es esencial. Si no la practicas: empieza con 10 ciclos de contracción/relajación antes de la sesión. Sin Mula Bandha el holdEmpty es solo hipocapnia — real pero no el mecanismo completo.",
          en: "Pelvic floor contraction (Mula Bandha) is essential. If you don't practice it: start with 10 contraction/relaxation cycles before the session. Without Mula Bandha the holdEmpty is just hypocapnia — real but not the complete mechanism.",
          fr: "La contraction du plancher pelvien (Mula Bandha) est essentielle. Si vous ne la pratiquez pas : commencez par 10 cycles de contraction/relâchement avant la séance. Sans Mula Bandha, la sensation de vide abdominal n&#39;est qu&#39;une hypocapnie, réelle certes, mais qui n&#39;explique pas tout.",
          pt: "A contração do assoalho pélvico (Mula Bandha) é essencial. Se você não a pratica: comece com 10 ciclos de contração/relaxamento antes da sessão. Sem Mula Bandha, a contração isométrica (holdEmpty) resulta apenas em hipocapnia — real, mas não o mecanismo completo.",
          zh: "盆底肌收缩（根锁）至关重要。如果您不熟悉盆底肌收缩：请在正式练习前先进行10次收缩/放松循环。如果没有根锁，保持空腹状态（holdEmpty）只是低碳酸血症——虽然确实存在，但并非完整的机制。",
          hi: "पेल्विक फ्लोर संकुचन (मूला बंध) आवश्यक है। यदि आप इसका अभ्यास नहीं करते हैं, तो सत्र से पहले 10 संकुचन/शिथिलता चक्रों से शुरुआत करें। मूला बंध के बिना, खाली पेट की स्थिति केवल हाइपोकैपनिया (शरीर में रक्त प्रवाह में कमी) है - वास्तविक तो है, लेकिन पूरी प्रक्रिया नहीं।"
        },
      unexpected: {
          es: "Hormigueo intenso en manos o cara: hipocapnia moderada. Reduce el holdEmpty 5s en la próxima ronda. Espasmos musculares involuntarios: normal con retenciones largas, son contracciones de los intercostales.",
          en: "Intense tingling in hands or face: moderate hypocapnia. Reduce holdEmpty by 5s in the next round. Involuntary muscle spasms: normal with long retentions, they are intercostal contractions.",
          fr: "Picotements intenses dans les mains ou le visage : hypocapnie modérée. Réduisez le temps de rétention de 5 s au tour suivant. Spasmes musculaires involontaires : normaux lors de rétentions prolongées, il s’agit de contractions intercostales.",
          pt: "Formigamento intenso nas mãos ou no rosto: hipocapnia moderada. Reduza o tempo de retenção em 5 segundos na próxima rodada. Espasmos musculares involuntários: normais em retenções prolongadas, são contrações intercostais.",
          zh: "手部或面部出现强烈刺痛感：中度低碳酸血症。下一轮保持空腹时间减少 5 秒。不自主肌肉痉挛：长时间保持空腹时正常现象，是肋间肌收缩。",
          hi: "हाथों या चेहरे में तीव्र झुनझुनी: मध्यम हाइपोकैपनिया। अगले दौर में होल्ड-एम्प्टी अवधि को 5 सेकंड कम करें। अनैच्छिक मांसपेशी ऐंठन: लंबे समय तक श्वास रोकने पर सामान्य है, ये पसलियों के बीच की मांसपेशियों का संकुचन है।"
        },
      stop: {
          es: "Mareo, sensación de desmayo, o visión en túnel: inhala INMEDIATAMENTE y respira normalmente. SIEMPRE acostado. NUNCA en agua, conduciendo, ni de pie.",
          en: "Dizziness, fainting sensation, or tunnel vision: inhale IMMEDIATELY and breathe normally. ALWAYS lying down. NEVER in water, while driving, or standing.",
          fr: "Vertiges, sensation de malaise ou vision trouble : inspirez immédiatement et respirez normalement. Toujours en position allongée. Jamais dans l’eau, en conduisant ou en position debout.",
          pt: "Tontura, sensação de desmaio ou visão em túnel: inspire IMEDIATAMENTE e respire normalmente. SEMPRE deitado(a). NUNCA na água, dirigindo ou em pé.",
          zh: "头晕、昏厥感或视野缩小：立即吸气并正常呼吸。务必躺下。切勿在水中、驾驶时或站立时服用。",
          hi: "चक्कर आना, बेहोशी का एहसास होना, या धुंधला दिखाई देना: तुरंत गहरी सांस लें और सामान्य रूप से सांस लें। हमेशा लेटकर ही सांस लें। पानी में, गाड़ी चलाते समय या खड़े होकर कभी भी सांस न लें।"
        }
    },

    guide: {
      when: {
          es: "Mañana, en ayunas. SIEMPRE acostado. Mínimo 45 min libres después para integración.",
          en: "Morning, fasting. ALWAYS lying down. Minimum 45 min free afterward for integration.",
          fr: "Le matin, à jeun. Toujours allongé. Minimum 45 minutes de repos ensuite pour l&#39;intégration.",
          pt: "De manhã, em jejum. SEMPRE deitado(a). No mínimo 45 minutos livres depois para integração.",
          zh: "早晨空腹。全程平躺。之后至少留出45分钟自由时间进行消化吸收。",
          hi: "सुबह, खाली पेट। हमेशा लेटकर। उसके बाद कम से कम 45 मिनट का समय दें ताकि शरीर उसे आत्मसात कर सके।"
        },
      duration: { min: 10, recommended: 20, max: 30 },
      sequence: {
          es: "Después: Theta 6 Hz (10 min) para integración. No hacer actividad mental inmediatamente.",
          en: "Afterward: Theta 6 Hz (10 min) for integration. Don't do mental activity immediately.",
          fr: "Ensuite : stimulation thêta à 6 Hz (10 min) pour l’intégration. Évitez toute activité mentale immédiate.",
          pt: "Em seguida: Theta 6 Hz (10 min) para integração. Não realize atividades mentais imediatamente.",
          zh: "之后：进行 6 Hz Theta 波训练（10 分钟）以巩固效果。不要立即进行任何脑力活动。",
          hi: "इसके बाद: 10 मिनट के लिए थीटा 6 हर्ट्ज़ का प्रयोग करें। तुरंत कोई मानसिक गतिविधि न करें।"
        },
      contraindications: {
          es: "Embarazo, epilepsia, hipertensión, problemas cardiovasculares, historial de desmayos. Este preset es de práctica avanzada — requiere comprensión completa antes de intentarlo.",
          en: "Pregnancy, epilepsy, hypertension, cardiovascular problems, history of fainting. This preset is advanced practice — requires complete understanding before attempting.",
          fr: "Grossesse, épilepsie, hypertension, problèmes cardiovasculaires, antécédents de syncope. Ce programme est un exercice avancé ; une compréhension complète est indispensable avant de l’essayer.",
          pt: "Gravidez, epilepsia, hipertensão, problemas cardiovasculares, histórico de desmaios. Esta configuração predefinida é de prática avançada — requer compreensão completa antes de ser tentada.",
          zh: "怀孕、癫痫、高血压、心血管疾病、晕厥史。此预设为高级练习——尝试前需完全理解。",
          hi: "गर्भावस्था, मिर्गी, उच्च रक्तचाप, हृदय संबंधी समस्याएं, बेहोशी का इतिहास। यह अभ्यास सत्र उन्नत स्तर का है - इसे आज़माने से पहले पूरी तरह समझना आवश्यक है।"
        }
    },

    tags: ["avanzado", "advanced", "Maha-Bandha", "LCR", "CSF", "pineal", "Dispenza", "yoga", "precaucion", "caution", "acostado", "lying-down"]
  },


  {
    id: "wimhof",
    category: "pranayama",
    type: ["breathing", "binaural"],
    sessions: [
      { id: "energia",    priority: 1 },
      { id: "foco",       priority: 5 }
    ],
    scientificLevel: "validated",
    color: "#e8a020",

    name: { es: "Wim Hof Method", en: "Wim Hof Method", fr: "Méthode Wim Hof", pt: "Método Wim Hof" },
    description: {
      es: "Activación Sistema Simpático",
      en: "Sympathetic Activation",
      fr: "Activation Sympathique",
      pt: "Ativação Simpática"
    },
    longDescription: {
          es: "El método Wim Hof tiene respaldo científico directo (Kox et al., PNAS 2014): practicantes entrenados pueden modular su respuesta inmune voluntariamente. El mecanismo: 30 respiraciones rápidas → hipocapnia + alcalosis respiratoria → activación del eje simpático-adrenal → liberación de epinefrina. La retención con pulmones vacíos crea hipoxia relativa + acumulación de CO₂ que activa reflejos de supervivencia. La recovery breath (inhale + holdFull 15s) re-oxigena la sangre y es donde el efecto inmune es más documentado.",
          en: "The Wim Hof method has direct scientific backing (Kox et al., PNAS 2014): trained practitioners can voluntarily modulate their immune response. The mechanism: 30 rapid breaths → hypocapnia + respiratory alkalosis → activation of the sympathetic-adrenal axis → epinephrine release. Empty-lung retention creates relative hypoxia + CO₂ accumulation that activates survival reflexes. The recovery breath (inhale + holdFull 15s) re-oxygenates the blood and is where the immune effect is most documented.",
          fr: "La méthode Wim Hof bénéficie d&#39;un soutien scientifique direct (Kox et al., PNAS 2014) : les personnes formées peuvent moduler volontairement leur réponse immunitaire. Le mécanisme : 30 respirations rapides → hypocapnie + alcalose respiratoire → activation de l&#39;axe sympatho-surrénalien → libération d&#39;adrénaline. La rétention d&#39;air dans les poumons vides crée une hypoxie relative et une accumulation de CO₂ qui activent les réflexes de survie. La respiration de récupération (inspiration + apnée complète de 15 secondes) réoxygène le sang et c&#39;est à ce moment que l&#39;effet immunitaire est le plus clairement documenté.",
          pt: "O método Wim Hof possui respaldo científico direto (Kox et al., PNAS 2014): praticantes treinados podem modular voluntariamente sua resposta imunológica. O mecanismo: 30 respirações rápidas → hipocapnia + alcalose respiratória → ativação do eixo simpático-adrenal → liberação de epinefrina. A retenção pulmonar com os pulmões vazios cria hipóxia relativa + acúmulo de CO₂ que ativa reflexos de sobrevivência. A respiração de recuperação (inspiração + retenção completa por 15 segundos) reoxigena o sangue e é onde o efeito imunológico é mais documentado.",
          zh: "Wim Hof呼吸法有直接的科学依据（Kox等人，PNAS 2014）：经过训练的练习者可以自主调节免疫反应。其机制如下：30次快速呼吸→低碳酸血症+呼吸性碱中毒→激活交感-肾上腺轴→肾上腺素释放。肺空屏气造成相对缺氧+二氧化碳积聚，从而激活生存反射。恢复呼吸（吸气+屏气15秒）使血液重新氧合，免疫效应在此阶段得到最充分的证实。",
          hi: "विम हॉफ विधि को प्रत्यक्ष वैज्ञानिक समर्थन प्राप्त है (कोक्स एट अल., पीएनएएस 2014): प्रशिक्षित चिकित्सक स्वेच्छा से अपनी प्रतिरक्षा प्रतिक्रिया को नियंत्रित कर सकते हैं। क्रियाविधि: 30 तीव्र साँसें → हाइपोकैपनिया + श्वसन क्षारीयता → सहानुभूति-अधिवृक्क अक्ष की सक्रियता → एपिनेफ्रिन का स्राव। फेफड़ों में ऑक्सीजन का खाली रहना सापेक्षिक हाइपोक्सिया + CO₂ संचय उत्पन्न करता है जो जीवन रक्षा प्रतिवर्त को सक्रिय करता है। पुनर्प्राप्ति साँस (साँस लेना + 15 सेकंड तक रोकना) रक्त को पुनः ऑक्सीजन प्रदान करती है और यहीं पर प्रतिरक्षा प्रभाव का सबसे अधिक प्रमाण मिलता है।"
        },

    audio: {
      binaural: true,
      beat: 10,
      carrier: 300,
      perception: {
        optimal: { min: 250, max: 400 },
        degradation: {
          es: "Durante las 30 respiraciones rápidas el binaural actúa como marcador de ritmo — el beat de 10 Hz coincide aproximadamente con la frecuencia de respiración (10 rpm) y ayuda a mantener el ritmo. Durante el holdEmpty, el binaural theta/alpha actúa como ancla del estado contemplativo. Carrier 300 Hz ofrece claridad sin sobre-estimulación durante la fase activa.",
          en: "During the 30 rapid breaths the binaural acts as a rhythm marker — the 10 Hz beat roughly coincides with the breathing frequency (10 rpm) and helps maintain rhythm. During holdEmpty, the theta/alpha binaural acts as a contemplative state anchor. Carrier 300 Hz offers clarity without over-stimulation during the active phase.",
          fr: "Durant les 30 respirations rapides, le stimulus binaural sert de marqueur rythmique : le battement à 10 Hz coïncide approximativement avec la fréquence respiratoire (10 respirations par minute) et contribue à maintenir le rythme. Pendant la phase de maintien de la respiration (holdEmpty), le stimulus binaural thêta/alpha favorise un état contemplatif. Le stimulus porteur à 300 Hz offre une clarté mentale sans surstimulation durant la phase active.",
          pt: "Durante as 30 respirações rápidas, o sinal binaural atua como um marcador de ritmo — a batida de 10 Hz coincide aproximadamente com a frequência respiratória (10 rpm) e ajuda a manter o ritmo. Durante a fase de &quot;holdEmpty&quot; (manter vazio), o sinal binaural theta/alfa atua como uma âncora para o estado contemplativo. A frequência portadora de 300 Hz oferece clareza sem superestimulação durante a fase ativa.",
          zh: "在30次快速呼吸期间，双耳节拍起到节奏标记的作用——10赫兹的节拍大致与呼吸频率（每分钟10次）一致，有助于维持节奏。在“保持空虚”阶段，θ/α双耳节拍起到冥想状态锚点的作用。300赫兹载波在活跃阶段提供清晰的听觉体验，而不会过度刺激。",
          hi: "30 तीव्र साँसों के दौरान बाइनॉरल एक लय सूचक के रूप में कार्य करता है — 10 हर्ट्ज़ की बीट लगभग साँस लेने की आवृत्ति (10 आरपीएम) के साथ मेल खाती है और लय बनाए रखने में मदद करती है। होल्डएम्प्टी के दौरान, थीटा/अल्फा बाइनॉरल एक चिंतनशील अवस्था के आधार के रूप में कार्य करता है। कैरियर 300 हर्ट्ज़ सक्रिय चरण के दौरान अत्यधिक उत्तेजना के बिना स्पष्टता प्रदान करता है।"
        },
        why: {
          es: "El Wim Hof tiene dos fases muy distintas: activación (30 respiraciones) y contemplación (holdEmpty). Un solo binaural no puede optimizar ambas. El alpha 10 Hz es el mejor compromiso: activo pero no excesivo durante la fase de respiración, y suficientemente tranquilizador durante el holdEmpty inesperadamente pacífico que muchos practicantes reportan.",
          en: "Wim Hof has two very distinct phases: activation (30 breaths) and contemplation (holdEmpty). A single binaural cannot optimize both. Alpha 10 Hz is the best compromise: active but not excessive during the breathing phase, and sufficiently calming during the unexpectedly peaceful holdEmpty many practitioners report.",
          fr: "La méthode Wim Hof comporte deux phases bien distinctes : l’activation (30 respirations) et la contemplation (maintien du vide). Un seul son binaural ne peut optimiser les deux. Le son Alpha à 10 Hz offre le meilleur compromis : actif sans être excessif pendant la phase de respiration, et suffisamment apaisant pendant le maintien du vide, une phase de calme inattendue et paisible, comme le rapportent de nombreux pratiquants.",
          pt: "O método Wim Hof possui duas fases bem distintas: ativação (30 respirações) e contemplação (retenção do vazio). Um único fone de ouvido binaural não consegue otimizar ambas. O Alpha 10 Hz é o melhor compromisso: ativo, mas não excessivo durante a fase de respiração, e suficientemente calmante durante a inesperada e tranquila retenção do vazio relatada por muitos praticantes.",
          zh: "Wim Hof呼吸法分为两个截然不同的阶段：激活阶段（30次呼吸）和冥想阶段（保持空心）。单一的双耳节拍器无法同时优化这两个阶段。10赫兹的Alpha波是最佳折衷方案：在呼吸阶段保持活跃但不至于过度，在冥想阶段又能带来许多练习者所体验到的意想不到的平静感。",
          hi: "विम हॉफ के दो बिल्कुल अलग-अलग चरण हैं: सक्रियता (30 सांसें) और चिंतन (श्वास रोकना)। एक ही बाइनॉरल हेडफ़ोन इन दोनों चरणों का सर्वोत्तम उपयोग नहीं कर सकता। अल्फा 10 हर्ट्ज़ सबसे अच्छा विकल्प है: सांस लेने के चरण के दौरान सक्रिय लेकिन अत्यधिक नहीं, और कई अभ्यासकर्ताओं द्वारा बताए गए अप्रत्याशित रूप से शांतिपूर्ण विश्राम के दौरान पर्याप्त रूप से शांत करने वाला।"
        }
      }
    },

    // ─────────────────────────────────────────────────────────────────
    // PROTOCOLO WIM HOF CORREGIDO v3.0
    // Flujo real por ronda:
    //   1. 30 respiraciones rápidas (inhale profundo → exhale sin forzar)
    //   2. Exhale completa → HOLDEMPILY (retención con pulmones VACÍOS)
    //      → usuario presiona ▶ cuando necesite respirar
    //      → meta sugerida por ronda (configurable):
    //           Ronda 1: holdEmptyTarget[0]  (ej. 30s)
    //           Ronda 2: holdEmptyTarget[1]  (ej. 45s)
    //           Ronda 3: holdEmptyTarget[2]  (ej. 60s)
    //           Ronda 4: holdEmptyTarget[3]  (ej. 60s)
    //   3. Inhala PROFUNDO → HOLDFUL 15s fijos (recovery breath)
    //   4. Exhale lenta → siguiente ronda
    //   Repetir wimhof.rounds veces
    // ─────────────────────────────────────────────────────────────────
    breathing: {
      pattern: "wimhof",
      bpm: 30,
      ratio: 1.0,
      holdFull: 0,   // En ciclo base — el holdFull real está en wimhof.recoveryHold
      holdEmpty: 0,  // En ciclo base — el holdEmpty real está en wimhof.holdEmptyTarget

      wimhof: {
        breathCount: 30,            // Nº de respiraciones rápidas por ronda
        rounds: 4,                  // Nº de rondas totales

        // Meta sugerida de holdEmpty por ronda (segundos)
        // El usuario puede retener MÁS tiempo presionando ▶ cuando quiera inhalar
        // La UI muestra el cronómetro en tiempo real y el target como referencia
        holdEmptyTarget: [30, 45, 60, 60],

        // Límite de seguridad máximo en UI (seg) — pasado este tiempo, UI pide que inhale
        holdEmptyMax: 120,

        // Recovery breath: inhale profundo + retención PULMONES LLENOS
        recoveryHold: 15,           // Fijo en 15 segundos (estándar Wim Hof)
      }
    },

    tuning: {
      breathing: {
        breathCount: {
          min: 20, max: 40, step: 5,
          lower: {
          es: "20–25 respiraciones: hiperventilación moderada. Alcalosis suave. Recomendado para principiantes — el efecto es real pero más gradual y con menos mareo.",
          en: "20–25 breaths: moderate hyperventilation. Gentle alkalosis. Recommended for beginners — the effect is real but more gradual and with less dizziness.",
          fr: "20 à 25 respirations : hyperventilation modérée. Alcalose légère. Recommandé aux débutants : l’effet est réel, mais plus progressif et avec moins de vertiges.",
          pt: "20 a 25 respirações: hiperventilação moderada. Alcalose leve. Recomendado para iniciantes — o efeito é real, mas mais gradual e com menos tontura.",
          zh: "20-25次呼吸：中度过度换气。轻度碱中毒。推荐给初学者——效果真实存在，但更缓慢，头晕症状也较轻。",
          hi: "20-25 सांसें: मध्यम हाइपरवेंटिलेशन। हल्का एल्कलोसिस। शुरुआती लोगों के लिए अनुशंसित - इसका प्रभाव वास्तविक है लेकिन अधिक धीरे-धीरे होता है और चक्कर कम आते हैं।"
        },
          higher: {
          es: "35–40 respiraciones: máxima activación simpático-adrenal. Solo para practicantes con experiencia. La velocidad de respiración importa tanto como el número — 40 respiraciones lentas son menos efectivas que 30 rápidas y profundas.",
          en: "35–40 breaths: maximum sympathetic-adrenal activation. Only for experienced practitioners. Breathing speed matters as much as count — 40 slow breaths are less effective than 30 fast and deep ones.",
          fr: "35 à 40 respirations : activation maximale du système sympathique et surrénalien. Réservé aux praticiens expérimentés. La vitesse respiratoire est aussi importante que le nombre de respirations : 40 respirations lentes sont moins efficaces que 30 respirations rapides et profondes.",
          pt: "35 a 40 respirações: ativação simpática-adrenal máxima. Apenas para praticantes experientes. A velocidade da respiração é tão importante quanto a contagem — 40 respirações lentas são menos eficazes do que 30 respirações rápidas e profundas.",
          zh: "35-40次呼吸：交感神经-肾上腺系统最大程度激活。仅适用于经验丰富的练习者。呼吸速度与次数同样重要——40次缓慢呼吸的效果不如30次快速深呼吸。",
          hi: "35-40 सांसें: अधिकतम सिंपैथेटिक-एड्रेनल सक्रियता। केवल अनुभवी अभ्यासकर्ताओं के लिए। सांस लेने की गति उतनी ही महत्वपूर्ण है जितनी कि संख्या — 40 धीमी सांसें 30 तेज और गहरी सांसों की तुलना में कम प्रभावी होती हैं।"
        }
        },
        holdEmptyTarget: {
          // Los 4 valores son los targets por ronda
          // Mínimo por ronda: 15s | Máximo recomendado: 90s
          perRound: {
            min: 15, max: 90, step: 15,
            lower: {
          es: "15–30s: para principiantes o primeras sesiones. El efecto simpático-adrenal ya es perceptible en este rango. La calidad de la calma durante el hold importa más que la duración.",
          en: "15–30s: for beginners or first sessions. The sympathetic-adrenal effect is already perceptible in this range. The quality of calm during the hold matters more than duration.",
          fr: "15 à 30 secondes : pour les débutants ou les premières séances. L’effet sympathique-surrénalien est déjà perceptible dans cette plage de temps. La qualité du calme pendant la contraction est plus importante que sa durée.",
          pt: "15–30 segundos: para iniciantes ou primeiras sessões. O efeito simpático-adrenal já é perceptível nesse intervalo. A qualidade da calma durante a sustentação é mais importante do que a duração.",
          zh: "15-30秒：适合初学者或初次尝试。在这个时间范围内，交感肾上腺素的作用已经可以感受到。保持这个姿势时，平静的质量比持续时间更重要。",
          hi: "15-30 सेकंड: शुरुआती लोगों या पहले सत्रों के लिए। इस अवधि में ही सहानुभूति-अधिवृक्क तंत्रिका तंत्र का प्रभाव महसूस होने लगता है। इस दौरान मिलने वाली शांति की गुणवत्ता अवधि से अधिक महत्वपूर्ण है।"
        },
            higher: {
          es: "60–90s: rango avanzado. El hold largo activa el reflejo de buceo (diving reflex): bradicardia + vasoconstricción periférica. Muy poderoso pero requiere experiencia. SIEMPRE acostado para retenciones >60s.",
          en: "60–90s: advanced range. Long hold activates the diving reflex: bradycardia + peripheral vasoconstriction. Very powerful but requires experience. ALWAYS lying down for retentions >60s.",
          fr: "60–90 s : plage avancée. Un maintien prolongé active le réflexe d’immersion : bradycardie et vasoconstriction périphérique. Très puissant, mais nécessite de l’expérience. Toujours rester allongé pour les rétentions supérieures à 60 s.",
          pt: "60–90s: faixa avançada. A retenção prolongada ativa o reflexo de mergulho: bradicardia + vasoconstrição periférica. Muito potente, mas requer experiência. SEMPRE deitado para retenções superiores a 60s.",
          zh: "60-90秒：进阶范围。长时间屏气会激活潜水反射：心动过缓+外周血管收缩。效果非常显著，但需要经验。屏气时间超过60秒时，务必保持平躺姿势。",
          hi: "60-90 सेकंड: उन्नत स्तर। लंबे समय तक सांस रोके रखने से डाइविंग रिफ्लेक्स सक्रिय हो जाता है: ब्रैडीकार्डिया + परिधीय वाहिकासंकुचन। बहुत शक्तिशाली है लेकिन अनुभव की आवश्यकता होती है। 60 सेकंड से अधिक समय तक सांस रोके रखने के लिए हमेशा लेटकर ही करें।"
        }
          }
        },
        rounds: {
          min: 1, max: 6, step: 1,
          lower: {
          es: "1–2 rondas: sesión corta de exploración. Para principiantes. El efecto es real en 1 ronda.",
          en: "1–2 rounds: short exploration session. For beginners. The effect is real in 1 round.",
          fr: "1 à 2 séances : courte séance d’exploration. Pour les débutants. L’effet est réel dès la première séance.",
          pt: "1 a 2 rodadas: sessão de exploração curta. Para iniciantes. O efeito é perceptível em 1 rodada.",
          zh: "1-2轮：简短的探索性练习。适合初学者。一轮即可见效。",
          hi: "1-2 राउंड: संक्षिप्त प्रयोग सत्र। शुरुआती लोगों के लिए। इसका असर पहले ही राउंड में दिखने लगता है।"
        },
          higher: {
          es: "5–6 rondas: protocolo extendido. El efecto acumulativo es significativamente mayor. Solo practicantes experimentados. Sesión completa de 45–60 min.",
          en: "5–6 rounds: extended protocol. The cumulative effect is significantly greater. Experienced practitioners only. Full 45–60 min session.",
          fr: "5 à 6 séances : protocole étendu. L’effet cumulatif est nettement supérieur. Réservé aux praticiens expérimentés. Séance complète de 45 à 60 minutes.",
          pt: "5 a 6 sessões: protocolo estendido. O efeito cumulativo é significativamente maior. Apenas para profissionais experientes. Sessão completa de 45 a 60 minutos.",
          zh: "5-6轮：强化方案。累积效果显著增强。仅限经验丰富的治疗师。完整疗程45-60分钟。",
          hi: "5-6 राउंड: विस्तारित प्रोटोकॉल। संचयी प्रभाव काफी अधिक होता है। केवल अनुभवी चिकित्सकों के लिए। पूरा 45-60 मिनट का सत्र।"
        }
        }
      }
    },

    markers: {
      positive: {
        es: [
          "Hormigueo en manos, pies y cara después de ronda 1 (hipocapnia, normal y esperado)",
          "Durante holdEmpty: tranquilidad inesperada con los pulmones vacíos",
          "Al inhalar en recovery breath: energía que sube desde el pecho",
          "Después de las 4 rondas: alerta limpia, energética y sin nerviosismo"
        ],
        en: [
          "Tingling in hands, feet and face after round 1 (hypocapnia, normal and expected)",
          "During holdEmpty: unexpected tranquility with empty lungs",
          "On recovery breath inhale: energy rising from chest",
          "After 4 rounds: clean, energetic alertness without nervousness"
        ]
      },
      adjust: {
          es: "El holdEmpty es el núcleo del método. No lo midas por duración — mídelo por la calidad de la calma. Cuando el hold se vuelve natural (sin urgencia de respirar), el SNA ha alcanzado la zona de Kox et al. (2014). Si el hold se siente angustiante: inhala de inmediato — nunca fuerces.",
          en: "The holdEmpty is the core of the method. Don't measure it by duration — measure it by the quality of calm. When the hold becomes natural (no urgency to breathe), the ANS has reached the Kox et al. (2014) zone. If the hold feels distressing: inhale immediately — never force.",
          fr: "L&#39;apnée est au cœur de la méthode. Ne la mesurez pas par sa durée, mais par la qualité du calme ressenti. Lorsque l&#39;apnée devient naturelle (sans besoin urgent de respirer), le système nerveux autonome a atteint la zone décrite par Kox et al. (2014). Si l&#39;apnée est désagréable : inspirez immédiatement, sans forcer.",
          pt: "A retenção da respiração vazia é o cerne do método. Não a meça pela duração, mas sim pela qualidade da sensação de calma. Quando a retenção se torna natural (sem urgência para respirar), o SNA (Sistema Nervoso Autônomo) atingiu a zona de Kox et al. (2014). Se a retenção parecer desconfortável: inspire imediatamente — nunca force.",
          zh: "屏息是该方法的核心。不要以持续时间来衡量，而要以平静的质量来衡量。当屏息变得自然（没有呼吸的紧迫感）时，自主神经系统就达到了 Kox 等人 (2014) 所描述的状态。如果屏息感到不适：立即吸气——切勿强迫。",
          hi: "इस विधि का मूल तत्व है &#39;होल्ड एम्प्टी&#39; (खाली सांस लेना)। इसे अवधि से नहीं मापें, बल्कि शांति की गुणवत्ता से मापें। जब यह ठहराव स्वाभाविक हो जाए (सांस लेने की कोई जल्दी न हो), तो एएनएस (ANS) कोक्स एट अल. (2014) के स्तर तक पहुंच जाता है। यदि ठहराव कष्टदायक लगे, तो तुरंत सांस लें - कभी भी ज़बरदस्ती न क��ें।"
        },
      unexpected: {
          es: "Espasmos musculares durante el hold: contracciones de los intercostales, normales. Sensación de euforia después de inhalar: liberación de endorfinas por la activación simpática-adrenal. Mareo ligero en ronda 1: normal. Mareo en rondas 3–4 sin haberse tenido antes: reduce breathCount a 25.",
          en: "Muscle spasms during hold: intercostal contractions, normal. Euphoria sensation after inhaling: endorphin release from sympathetic-adrenal activation. Slight dizziness in round 1: normal. Dizziness in rounds 3–4 without having had it before: reduce breathCount to 25.",
          fr: "Spasmes musculaires pendant l&#39;apnée : contractions intercostales, normales. Sensation d&#39;euphorie après l&#39;inspiration : libération d&#39;endorphines suite à l&#39;activation du système sympathique-surrénalien. Légers vertiges au premier round : normaux. Vertiges aux rounds 3 et 4, sans antécédent : réduire le nombre de respirations à 25.",
          pt: "Espasmos musculares durante a retenção da respiração: contrações intercostais, normal. Sensação de euforia após a inspiração: liberação de endorfinas devido à ativação simpático-adrenal. Leve tontura na primeira rodada: normal. Tontura nas rodadas 3 e 4, sem histórico prévio: reduzir a contagem de respirações para 25.",
          zh: "屏息期间肌肉痉挛：肋间肌收缩，正常。吸气后欣快感：交感肾上腺激活导致内啡肽释放。第一轮轻微头晕：正常。第三至第四轮出现头晕（之前未出现过）：将呼吸次数减少至25次。",
          hi: "सांस रोकते समय मांसपेशियों में ऐंठन: पसलियों के बीच की मांसपेशियों का संकुचन, सामान्य। सांस लेने के बाद उत्साह का अनुभव: सहानुभूति तंत्रिका-अधिवृक्क सक्रियता से एंडोर्फिन का स्राव। पहले दौर में हल्का चक्कर आना: सामान्य। तीसरे-चौथे दौर में चक्कर आना, जबकि पहले कभी नहीं आया हो: सांस धी��ी करें और 25 तक गिनें।"
        },
      stop: {
          es: "Pérdida de consciencia, dolor de pecho o visión en túnel: para inmediatamente. NUNCA hacer Wim Hof de pie, en agua, conduciendo o solo si hay historial de síncope.",
          en: "Loss of consciousness, chest pain or tunnel vision: stop immediately. NEVER do Wim Hof standing, in water, driving or alone if there is history of syncope.",
          fr: "En cas de perte de connaissance, de douleur thoracique ou de vision tubulaire, arrêtez immédiatement. Ne pratiquez JAMAIS la méthode Wim Hof debout, dans l&#39;eau, en conduisant ou seul(e) si vous avez des antécédents de syncope.",
          pt: "Perda de consciência, dor no peito ou visão em túnel: pare imediatamente. NUNCA faça o exercício de Wim Hof em pé, na água, dirigindo ou sozinho se houver histórico de síncope.",
          zh: "意识丧失、胸痛或视野狭窄：立即停止。如有晕厥史，切勿站立、在水中、驾驶时或独自一人进行维姆·霍夫呼吸法练习。",
          hi: "बेहोशी, सीने में दर्द या धुंधला दिखाई देना: तुरंत रुक जाएं। यदि आपको पहले कभी बेहोशी हुई हो, तो विम हॉफ व्यायाम खड़े होकर, पानी में, गाड़ी चलाते हुए या अकेले न करें।"
        }
    },

    guide: {
      when: {
          es: "Mañana, en ayunas o 2h después de comer. SIEMPRE acostado o sentado en el suelo. Nunca antes de actividades que requieran reflejos rápidos.",
          en: "Morning, fasting or 2h after eating. ALWAYS lying or sitting on the floor. Never before activities requiring fast reflexes.",
          fr: "Le matin, à jeun ou 2 heures après un repas. Toujours allongé ou assis par terre. Jamais avant une activité nécessitant des réflexes rapides.",
          pt: "De manhã, em jejum ou 2 horas após as refeições. SEMPRE deitado ou sentado no chão. Nunca antes de atividades que exijam reflexos rápidos.",
          zh: "早晨空腹或餐后2小时。务必平躺或坐在地板上。切勿在需要快速反应的活动前进行。",
          hi: "सुबह, खाली पेट या खाना खाने के 2 घंटे बाद। हमेशा ज़मीन पर लेटकर या बैठकर ही इसका इस्तेमाल करें। तेज़ प्रतिक्रिया की आवश्यकता वाली गतिविधियों से पहले कभी भी इसका इस्तेमाल न करें।"
        },
      duration: { min: 15, recommended: 30, max: 45 },
      sequence: {
          es: "Después de Wim Hof: Alpha 10 Hz o Box Breathing 5 min para bajar de la activación simpática antes de cualquier actividad cognitiva.",
          en: "After Wim Hof: Alpha 10 Hz or Box Breathing 5 min to come down from sympathetic activation before any cognitive activity.",
          fr: "Après la méthode Wim Hof : Alpha 10 Hz ou respiration carrée pendant 5 minutes pour réduire l’activation sympathique avant toute activité cognitive.",
          pt: "Após o método Wim Hof: Respiração Alfa de 10 Hz ou Respiração Quadrada por 5 minutos para reduzir a ativação simpática antes de qualquer atividade cognitiva.",
          zh: "在进行任何认知活动之前，先进行 5 分钟的 Alpha 10 Hz 呼吸法或箱式呼吸法，以降低交感神经兴奋状态。",
          hi: "विम हॉफ के अनुसार: किसी भी संज्ञानात्मक गतिविधि से पहले सहानुभूति तंत्रिका तंत्र की सक्रियता को कम करने के लिए 5 मिनट तक अल्फा 10 हर्ट्ज या बॉक्स ब्रीदिंग करें।"
        },
      contraindications: {
          es: "Embarazo, epilepsia, cardiovascular, hipertensión, EPOC, historial de síncope o desmayo. Este es el preset con más contraindicaciones — leer el wizard completo antes de intentar.",
          en: "Pregnancy, epilepsy, cardiovascular, hypertension, COPD, history of syncope or fainting. This is the preset with the most contraindications — read the complete wizard before attempting.",
          fr: "Grossesse, épilepsie, troubles cardiovasculaires, hypertension, BPCO, antécédents de syncope ou d&#39;évanouissement : ce préréglage présente le plus de contre-indications. Veuillez lire attentivement la notice avant toute utilisation.",
          pt: "Gravidez, epilepsia, problemas cardiovasculares, hipertensão, DPOC, histórico de síncope ou desmaios. Esta é a configuração predefinida com o maior número de contraindicações — leia o guia completo antes de tentar.",
          zh: "怀孕、癫痫、心血管疾病、高血压、慢性阻塞性肺病、晕厥或昏厥史。这是禁忌症最多的预设方案——尝试前请务必阅读完整的操作指南。",
          hi: "गर्भावस्था, मिर्गी, हृदय रोग, उच्च रक्तचाप, सीओपीडी, बेहोशी या चक्कर आने का इतिहास। यह वह प्रीसेट है जिसमें सबसे अधिक विपरीत संकेत हैं - उपयोग करने से पहले पूरी गाइड पढ़ें।"
        }
    },

    tags: ["energia", "energy", "inmune", "immune", "simpatico", "sympathetic", "adrenalina", "adrenaline", "validado", "validated", "mañana", "morning", "avanzado", "advanced", "acostado", "lying-down", "wim-hof"]
  }

];


// ════════════════════════════════════════════════════════════════════════════
// SESSIONS CATALOG
// Mapa de objetivos de sesión para onboarding y filtrado.
// Usado por el motor de recomendación para ordenar presets por prioridad.
// ════════════════════════════════════════════════════════════════════════════

export const SESSIONS = {
  foco: {
    icon: "◈",
    color: "#d4a84b",
    name: { es: "Foco & Trabajo", en: "Focus & Work", fr: "Focus & Travail", pt: "Foco & Trabalho" },
    description: {
      es: "Trabajo analítico, productividad, atención sostenida, estudio",
      en: "Analytical work, productivity, sustained attention, study",
      fr: "Travail analytique, productivité, attention soutenue, étude",
      pt: "Trabalho analítico, produtividade, atenção sustentada, estudo"
    }
  },
  creatividad: {
    icon: "◇",
    color: "#50b4c8",
    name: { es: "Creatividad & Flow", en: "Creativity & Flow", fr: "Créativité & Flux", pt: "Criatividade & Fluxo" },
    description: {
      es: "Estado de flow, escritura, arte, pensamiento lateral, diseño",
      en: "Flow state, writing, art, lateral thinking, design",
      fr: "État de flux, écriture, art, pensée latérale, design",
      pt: "Estado de fluxo, escrita, arte, pensamento lateral, design"
    }
  },
  calma: {
    icon: "○",
    color: "#4ecb8a",
    name: { es: "Calma & Reset", en: "Calm & Reset", fr: "Calme & Réinitialisation", pt: "Calma & Reset" },
    description: {
      es: "Reducir ansiedad, regulación emocional, reset del SNA, estrés",
      en: "Reduce anxiety, emotional regulation, ANS reset, stress",
      fr: "Réduire l'anxiété, régulation émotionnelle, réinitialisation SNA, stress",
      pt: "Reduzir ansiedade, regulação emocional, reset do SNA, estresse"
    }
  },
  meditacion: {
    icon: "◉",
    color: "#9b7de8",
    name: { es: "Meditación", en: "Meditation", fr: "Méditation", pt: "Meditação" },
    description: {
      es: "Estados contemplativos, insight, profundidad, silencio interior",
      en: "Contemplative states, insight, depth, inner silence",
      fr: "États contemplatifs, insight, profondeur, silence intérieur",
      pt: "Estados contemplativos, insight, profundidade, silêncio interior"
    }
  },
  energia: {
    icon: "◆",
    color: "#e8a020",
    name: { es: "Energía & Activación", en: "Energy & Activation", fr: "Énergie & Activation", pt: "Energia & Ativação" },
    description: {
      es: "Activación matutina, antes de ejercicio, reto físico o mental, despertar",
      en: "Morning activation, before exercise, physical or mental challenge, awakening",
      fr: "Activation matinale, avant l'exercice, défi physique ou mental, éveil",
      pt: "Ativação matinal, antes do exercício, desafio físico ou mental, despertar"
    }
  },
  conexion: {
    icon: "◎",
    color: "#d4a84b",
    name: { es: "Conexión & Corazón", en: "Connection & Heart", fr: "Connexion & Cœur", pt: "Conexão & Coração" },
    description: {
      es: "Apertura emocional, empatía, antes de conversaciones, relaciones",
      en: "Emotional openness, empathy, before conversations, relationships",
      fr: "Ouverture émotionnelle, empathie, avant les conversations, relations",
      pt: "Abertura emocional, empatia, antes de conversas, relacionamentos"
    }
  },
  sueno: {
    icon: "◌",
    color: "#4488cc",
    name: { es: "Sueño", en: "Sleep", fr: "Sommeil", pt: "Sono" },
    description: {
      es: "Inducción al sueño, relajación nocturna, descanso profundo",
      en: "Sleep induction, nighttime relaxation, deep rest",
      fr: "Induction du sommeil, relaxation nocturne, repos profond",
      pt: "Indução ao sono, relaxamento noturno, descanso profundo"
    }
  },
  liberacion: {
    icon: "◗",
    color: "#e05555",
    name: { es: "Liberación Emocional", en: "Emotional Release", fr: "Libération Émotionnelle", pt: "Liberação Emocional" },
    description: {
      es: "Soltar, procesamiento emocional, trabajo con miedo o culpa, integración",
      en: "Letting go, emotional processing, working with fear or guilt, integration",
      fr: "Lâcher prise, traitement émotionnel, travail avec la peur ou la culpabilité, intégration",
      pt: "Soltar, processamento emocional, trabalho com medo ou culpa, integração"
    }
  }
};


// ════════════════════════════════════════════════════════════════════════════
// HELPER: getPresetsBySession(sessionId, lang)
// Retorna presets ordenados por priority para un objetivo de sesión dado.
// ════════════════════════════════════════════════════════════════════════════

export function getPresetsBySession(sessionId, lang = 'es') {
  return PRESETS
    .filter(p => p.sessions.some(s => s.id === sessionId))
    .sort((a, b) => {
      const pa = a.sessions.find(s => s.id === sessionId).priority;
      const pb = b.sessions.find(s => s.id === sessionId).priority;
      return pa - pb;
    });
}


// ════════════════════════════════════════════════════════════════════════════
// HELPER: getPresetsForOnboarding(sessionId)
// Retorna los 3 presets principales para mostrar como recomendación en onboarding.
// ════════════════════════════════════════════════════════════════════════════

export function getPresetsForOnboarding(sessionId) {
  return getPresetsBySession(sessionId).slice(0, 3);
}


// ════════════════════════════════════════════════════════════════════════════
// WIZARD GENERATOR
// Genera wizards educativos de 4 pasos desde los datos de cada preset
// ════════════════════════════════════════════════════════════════════════════

export function generateWizard(presetId, lang = 'es') {
  const preset = PRESETS.find(p => p.id === presetId);
  if (!preset) return null;

  // Helper function para obtener traducción con fallback: lang → en → es
  const getText = (obj, key) => {
    if (!obj) return '';
    if (obj[lang]) return obj[lang];
    if (obj.en) return obj.en;
    if (obj.es) return obj.es;
    return '';
  };

  const wizard = {
    id: presetId,
    color: preset.color,
    band: getText(preset.name, lang),
    steps: []
  };

  // ──────────────────────────────────────────────────────────────────────
  // PASO 1: FUNDAMENTO — ¿Qué es y cómo funciona?
  // ──────────────────────────────────────────────────────────────────────
  const step1Labels = {
    es: "Fundamento",
    en: "Foundation",
    fr: "Fondement",
    pt: "Fundamento",
    zh: "基础",
    hi: "आधार"
  };
  const step1Titles = {
    es: "¿Qué es y cómo funciona?",
    en: "What is it and how does it work?",
    fr: "Qu'est-ce que c'est et comment ça marche?",
    pt: "O que é e como funciona?",
    zh: "这是什么以及如何工作？",
    hi: "यह क्या है और यह कैसे काम करता है?"
  };

  let step1Body = `<strong>${getText(preset.name, lang)}</strong><br><br>${getText(preset.longDescription, lang)}<br><br>`;
  
  // Añadir información de percepción auditiva si existe
  if (preset.audio?.perception?.why) {
    const whyLabel = {
      es: "<strong>¿Por qué esta frecuencia?</strong><br>",
      en: "<strong>Why this frequency?</strong><br>",
      fr: "<strong>Pourquoi cette fréquence?</strong><br>",
      pt: "<strong>Por que esta frequência?</strong><br>",
      zh: "<strong>为什么是这个频率？</strong><br>",
      hi: "<strong>यह आवृत्ति क्यों?</strong><br>"
    };
    step1Body += (whyLabel[lang] || whyLabel.en) + getText(preset.audio.perception.why, lang);
  }

  wizard.steps.push({
    label: step1Labels[lang] || step1Labels.en,
    title: step1Titles[lang] || step1Titles.en,
    body: step1Body
  });

  // ──────────────────────────────────────────────────────────────────────
  // PASO 2: PROTOCOLO — Cómo usarlo correctamente
  // ──────────────────────────────────────────────────────────────────────
  const step2Labels = {
    es: "Protocolo",
    en: "Protocol",
    fr: "Protocole",
    pt: "Protocolo",
    zh: "协议",
    hi: "प्रोटोकॉल"
  };
  const step2Titles = {
    es: "Cómo usarlo correctamente",
    en: "How to use it correctly",
    fr: "Comment l'utiliser correctement",
    pt: "Como usar corretamente",
    zh: "如何正确使用",
    hi: "इसे सही तरीके से कैसे उपयोग करें"
  };

  let step2Body = "";

  // Mejor momento
  if (preset.guide?.when) {
    const whenLabel = {
      es: "<strong>Mejor momento:</strong> ",
      en: "<strong>Best time:</strong> ",
      fr: "<strong>Meilleur moment:</strong> ",
      pt: "<strong>Melhor momento:</strong> ",
      zh: "<strong>最佳时间：</strong> ",
      hi: "<strong>सर्वोत्तम समय:</strong> "
    };
    step2Body += (whenLabel[lang] || whenLabel.en) + getText(preset.guide.when, lang) + "<br><br>";
  }

  // Duración
  if (preset.guide?.duration) {
    const durationLabel = {
      es: "<strong>Duración:</strong> ",
      en: "<strong>Duration:</strong> ",
      fr: "<strong>Durée:</strong> ",
      pt: "<strong>Duração:</strong> ",
      zh: "<strong>持续时间：</strong> ",
      hi: "<strong>अवधि:</strong> "
    };
    const minLabel = { es: "mínimo", en: "minimum", fr: "minimum", pt: "mínimo", zh: "最少", hi: "न्यूनतम" };
    const recLabel = { es: "recomendado", en: "recommended", fr: "recommandé", pt: "recomendado", zh: "推荐", hi: "अनुशंसित" };
    const maxLabel = { es: "máximo", en: "maximum", fr: "maximum", pt: "máximo", zh: "最多", hi: "अधिकतम" };
    
    step2Body += (durationLabel[lang] || durationLabel.en) + 
      `${preset.guide.duration.min} min ${minLabel[lang] || minLabel.en}, ` +
      `${preset.guide.duration.recommended} min ${recLabel[lang] || recLabel.en}, ` +
      `${preset.guide.duration.max} min ${maxLabel[lang] || maxLabel.en}<br><br>`;
  }

  // Patrón respiratorio
  if (preset.breathing?.pattern) {
    const breathLabel = {
      es: "<strong>Respiración:</strong> ",
      en: "<strong>Breathing:</strong> ",
      fr: "<strong>Respiration:</strong> ",
      pt: "<strong>Respiração:</strong> ",
      zh: "<strong>呼吸：</strong> ",
      hi: "<strong>श्वास:</strong> "
    };
    const patterns = {
      coherencia: { es: "Coherencia cardíaca", en: "Heart coherence", fr: "Cohérence cardiaque", pt: "Coerência cardíaca", zh: "心脏一致性", hi: "हृदय सुसंगतता" },
      nadi: { es: "Nadi Shodhana (alternada)", en: "Nadi Shodhana (alternate)", fr: "Nadi Shodhana (alternée)", pt: "Nadi Shodhana (alternada)", zh: "鼻孔交替呼吸", hi: "नाड़ी शोधन (एकांतर)" },
      "478": { es: "4-7-8 (inhala 4s, retiene 7s, exhala 8s)", en: "4-7-8 (inhale 4s, hold 7s, exhale 8s)", fr: "4-7-8 (inspire 4s, retient 7s, expire 8s)", pt: "4-7-8 (inspira 4s, retém 7s, expira 8s)", zh: "4-7-8（吸气4秒，屏息7秒，呼气8秒）", hi: "4-7-8 (4से श्वास लें, 7से रोकें, 8से छोड़ें)" },
      box: { es: "Box 4-4-4-4 (inhala, retiene, exhala, retiene)", en: "Box 4-4-4-4 (inhale, hold, exhale, hold)", fr: "Box 4-4-4-4 (inspire, retient, expire, retient)", pt: "Box 4-4-4-4 (inspira, retém, expira, retém)", zh: "方形呼吸 4-4-4-4", hi: "बॉक्स 4-4-4-4" },
      dispenza: { es: "Maha Bandha (exhala + retiene vacío + contracción)", en: "Maha Bandha (exhale + empty hold + contraction)", fr: "Maha Bandha (expire + retient vide + contraction)", pt: "Maha Bandha (expira + retém vazio + contração)", zh: "大锁印（呼气+空息+收缩）", hi: "महा बंध (निःश्वास + खाली कुंभक + संकुचन)" },
      bhastrika: { es: "Bhastrika (respiración de fuelle rápida)", en: "Bhastrika (rapid bellows breathing)", fr: "Bhastrika (respiration de soufflet rapide)", pt: "Bhastrika (respiração de fole rápida)", zh: "风箱式呼吸（快速）", hi: "भस्त्रिका (तीव्र धौंकनी श्वास)" },
      wimhof: { es: "Wim Hof (30 resp. + retención vacía + recuperación)", en: "Wim Hof (30 breaths + empty hold + recovery)", fr: "Wim Hof (30 resp. + rétention vide + récupération)", pt: "Wim Hof (30 resp. + retenção vazia + recuperação)", zh: "维姆·霍夫法（30次呼吸+空息+恢复）", hi: "विम होफ (30 श्वास + खाली कुंभक + पुनर्प्राप्ति)" },
      ujjayi: { es: "Ujjayi (con fricción glótica)", en: "Ujjayi (with glottal friction)", fr: "Ujjayi (avec friction glottique)", pt: "Ujjayi (com fricção glótica)", zh: "喉式呼吸", hi: "उज्जायी (कंठ घर्षण के साथ)" }
    };
    
    const patternName = patterns[preset.breathing.pattern]?.[lang] || patterns[preset.breathing.pattern]?.en || preset.breathing.pattern;
    step2Body += (breathLabel[lang] || breathLabel.en) + patternName;
    
    if (preset.breathing.bpm) {
      const rpmLabel = { es: " — ", en: " — ", fr: " — ", pt: " — ", zh: " — ", hi: " — " };
      const perMinLabel = { es: " respiraciones/min", en: " breaths/min", fr: " respirations/min", pt: " respirações/min", zh: " 次/分钟", hi: " श्वास/मिनट" };
      step2Body += (rpmLabel[lang] || rpmLabel.en) + preset.breathing.bpm + (perMinLabel[lang] || perMinLabel.en);
    }
    step2Body += "<br><br>";
  }

  // Secuencia recomendada
  if (preset.guide?.sequence) {
    const seqLabel = {
      es: "<strong>Secuencia:</strong> ",
      en: "<strong>Sequence:</strong> ",
      fr: "<strong>Séquence:</strong> ",
      pt: "<strong>Sequência:</strong> ",
      zh: "<strong>顺序：</strong> ",
      hi: "<strong>क्रम:</strong> "
    };
    step2Body += (seqLabel[lang] || seqLabel.en) + getText(preset.guide.sequence, lang);
  }

  wizard.steps.push({
    label: step2Labels[lang] || step2Labels.en,
    title: step2Titles[lang] || step2Titles.en,
    body: step2Body
  });

  // ──────────────────────────────────────────────────────────────────────
  // PASO 3: AJUSTES — Qué buscar y cómo ajustar
  // ──────────────────────────────────────────────────────────────────────
  const step3Labels = {
    es: "Ajustes",
    en: "Adjustments",
    fr: "Ajustements",
    pt: "Ajustes",
    zh: "调整",
    hi: "समायोजन"
  };
  const step3Titles = {
    es: "Qué buscar y cómo ajustar",
    en: "What to look for and how to adjust",
    fr: "Que rechercher et comment ajuster",
    pt: "O que procurar e como ajustar",
    zh: "寻找什么以及如何调整",
    hi: "क्या देखें और कैसे समायोजित करें"
  };

  let step3Body = "";

  // Señales positivas
  if (preset.markers?.positive) {
    const posLabel = {
      es: "<strong>Señales positivas (funciona):</strong><br>",
      en: "<strong>Positive signals (it's working):</strong><br>",
      fr: "<strong>Signaux positifs (ça marche):</strong><br>",
      pt: "<strong>Sinais positivos (está funcionando):</strong><br>",
      zh: "<strong>积极信号（有效）：</strong><br>",
      hi: "<strong>सकारात्मक संकेत (काम कर रहा है):</strong><br>"
    };
    step3Body += (posLabel[lang] || posLabel.en);
    // Usar fallback a inglés si el idioma no tiene traducción
    const signals = preset.markers.positive[lang] || preset.markers.positive.en || preset.markers.positive.es || [];
    signals.forEach(signal => {
      step3Body += `• ${signal}<br>`;
    });
    step3Body += "<br>";
  }

  // Cómo ajustar si no funciona
  if (preset.markers?.adjust) {
    const adjLabel = {
      es: "<strong>Si no sientes nada:</strong><br>",
      en: "<strong>If you don't feel anything:</strong><br>",
      fr: "<strong>Si vous ne ressentez rien:</strong><br>",
      pt: "<strong>Se não sentir nada:</strong><br>",
      zh: "<strong>如果没有感觉：</strong><br>",
      hi: "<strong>यदि कुछ महसूस नहीं होता:</strong><br>"
    };
    // Usar fallback a inglés si el idioma no tiene traducción
    const adjustText = preset.markers.adjust[lang] || preset.markers.adjust.en || preset.markers.adjust.es || "";
    step3Body += (adjLabel[lang] || adjLabel.en) + adjustText + "<br><br>";
  }

  // Sensaciones inesperadas pero normales
  if (preset.markers?.unexpected) {
    const unexpLabel = {
      es: "<strong>Sensaciones normales (no te alarmes):</strong><br>",
      en: "<strong>Normal sensations (don't be alarmed):</strong><br>",
      fr: "<strong>Sensations normales (ne vous inquiétez pas):</strong><br>",
      pt: "<strong>Sensações normais (não se alarme):</strong><br>",
      zh: "<strong>正常感觉（不要惊慌）：</strong><br>",
      hi: "<strong>सामान्य संवेदनाएं (चिंता न करें):</strong><br>"
    };
    // Usar fallback a inglés si el idioma no tiene traducción
    const unexpectedText = preset.markers.unexpected[lang] || preset.markers.unexpected.en || preset.markers.unexpected.es || "";
    step3Body += (unexpLabel[lang] || unexpLabel.en) + unexpectedText;
  }

  // Añadir tips de tuning si existen
  if (preset.tuning) {
    step3Body += "<br><br>";
    const tuningLabel = {
      es: "<em>Usa los controles de ajuste para personalizar la experiencia según estas señales.</em>",
      en: "<em>Use the tuning controls to personalize the experience based on these signals.</em>",
      fr: "<em>Utilisez les contrôles de réglage pour personnaliser l'expérience selon ces signaux.</em>",
      pt: "<em>Use os controles de ajuste para personalizar a experiência com base nesses sinais.</em>",
      zh: "<em>使用调整控件根据这些信号个性化体验。</em>",
      hi: "<em>इन संकेतों के आधार पर अनुभव को वैयक्तिकृत करने के लिए ट्यूनिंग नियंत्रणों का उपयोग करें।</em>"
    };
    step3Body += (tuningLabel[lang] || tuningLabel.en);
  }

  wizard.steps.push({
    label: step3Labels[lang] || step3Labels.en,
    title: step3Titles[lang] || step3Titles.en,
    body: step3Body
  });

  // ──────────────────────────────────────────────────────────────────────
  // PASO 4: SEGURIDAD — Precauciones y contraindicaciones
  // ──────────────────────────────────────────────────────────────────────
  const step4Labels = {
    es: "Seguridad",
    en: "Safety",
    fr: "Sécurité",
    pt: "Segurança",
    zh: "安全",
    hi: "सुरक्षा"
  };
  const step4Titles = {
    es: "Precauciones y contraindicaciones",
    en: "Precautions and contraindications",
    fr: "Précautions et contre-indications",
    pt: "Precauções e contraindicações",
    zh: "注意事项和禁忌症",
    hi: "सावधानियां और मतभेद"
  };

  let step4Body = "";

  // Cuándo parar inmediatamente
  if (preset.markers?.stop) {
    const stopLabel = {
      es: "<strong>⚠️ Para inmediatamente si:</strong><br>",
      en: "<strong>⚠️ Stop immediately if:</strong><br>",
      fr: "<strong>⚠️ Arrêtez immédiatement si:</strong><br>",
      pt: "<strong>⚠️ Pare imediatamente se:</strong><br>",
      zh: "<strong>⚠️ 如果出现以下情况请立即停止：</strong><br>",
      hi: "<strong>⚠️ तुरंत रोकें यदि:</strong><br>"
    };
    // Usar fallback a inglés si el idioma no tiene traducción
    const stopText = preset.markers.stop[lang] || preset.markers.stop.en || preset.markers.stop.es || "";
    step4Body += (stopLabel[lang] || stopLabel.en) + stopText + "<br><br>";
  }

  // Contraindicaciones
  if (preset.guide?.contraindications) {
    const contraLabel = {
      es: "<strong>Contraindicaciones:</strong><br>",
      en: "<strong>Contraindications:</strong><br>",
      fr: "<strong>Contre-indications:</strong><br>",
      pt: "<strong>Contraindicações:</strong><br>",
      zh: "<strong>禁忌症：</strong><br>",
      hi: "<strong>मतभेद:</strong><br>"
    };
    // Usar fallback a inglés si el idioma no tiene traducción
    const contraText = preset.guide.contraindications[lang] || preset.guide.contraindications.en || preset.guide.contraindications.es || "";
    step4Body += (contraLabel[lang] || contraLabel.en) + contraText;
  }

  // Si no hay contraindicaciones conocidas
  if (!preset.guide?.contraindications || (preset.guide.contraindications[lang] || preset.guide.contraindications.en || preset.guide.contraindications.es || "").toLowerCase().includes('ninguna')) {
    const safeLabel = {
      es: "<strong>✓ Este preset es seguro para la mayoría de personas.</strong><br><br>Escucha siempre a tu cuerpo y para si algo no se siente bien.",
      en: "<strong>✓ This preset is safe for most people.</strong><br><br>Always listen to your body and stop if something doesn't feel right.",
      fr: "<strong>✓ Ce preset est sûr pour la plupart des gens.</strong><br><br>Écoutez toujours votre corps et arrêtez si quelque chose ne va pas.",
      pt: "<strong>✓ Este preset é seguro para a maioria das pessoas.</strong><br><br>Sempre ouça seu corpo e pare se algo não parecer certo.",
      zh: "<strong>✓ 此预设对大多数人是安全的。</strong><br><br>始终倾听您的身体，如果感觉不适请停止。",
      hi: "<strong>✓ यह प्रीसेट अधिकांश लोगों के लिए सुरक्षित है।</strong><br><br>हमेशा अपने शरीर को सुनें और यदि कुछ सही नहीं लगता है तो रुकें।"
    };
    if (!step4Body) step4Body = (safeLabel[lang] || safeLabel.en);
  }

  wizard.steps.push({
    label: step4Labels[lang] || step4Labels.en,
    title: step4Titles[lang] || step4Titles.en,
    body: step4Body
  });

  return wizard;
}


// ════════════════════════════════════════════════════════════════════════════
// HELPER: getAllWizards(lang)
// Genera todos los wizards para todos los presets
// ════════════════════════════════════════════════════════════════════════════

export function getAllWizards(lang = 'es') {
  const wizards = {};
  PRESETS.forEach(preset => {
    wizards[preset.id] = generateWizard(preset.id, lang);
  });
  return wizards;
}
