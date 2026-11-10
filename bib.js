// ════════════════════════════════════════════════════
// bib.js — Sección «Ciencia» (bibliografía) en 6 idiomas
// La estructura (colores, referencias) es común; los textos
// van por idioma. Las referencias académicas se citan en su
// idioma original y no se traducen.
// ════════════════════════════════════════════════════

const C = {
  green:  'background:rgba(78,203,138,.12);color:var(--green);border-color:rgba(78,203,138,.3)',
  cyan:   'background:rgba(80,180,200,.12);color:var(--cyan);border-color:rgba(80,180,200,.3)',
  red:    'background:rgba(255,107,107,.12);color:#ff6b6b;border-color:rgba(255,107,107,.3)',
  purple: 'background:rgba(155,125,232,.12);color:var(--purple);border-color:rgba(155,125,232,.3)',
  gold:   'background:rgba(212,168,75,.12);color:var(--gold);border-color:rgba(212,168,75,.3)',
};

// Estructura común: orden de pestañas, color de cada hallazgo y referencias
const STRUCTURE = [
  {
    id: 'binaural',
    colors: ['green', 'cyan', 'red'],
    refs: [
      '[1] Ingendoh et al. (2023). Binaural beats to entrain the brain? <em>PLoS ONE</em>. DOI: 10.1371/journal.pone.0286023',
      '[2] Cooper &amp; Hawk (2025). Parametric investigation of binaural beats. <em>Scientific Reports</em>, 15, 4308.',
      '[3] Iaccarino et al. (2016). Gamma frequency entrainment attenuates amyloid load. <em>Nature</em>, 540, 230–235.',
    ],
  },
  {
    id: 'pranayama',
    colors: ['green', 'purple', 'gold'],
    refs: [
      '[4] Bhargav et al. (2026). Pranayama, an ancient self-directed approach to neuromodulation. <em>Asian J Psychiatry</em>, 115, 104788.',
      '[5] Zaccaro et al. (2022). Neural Correlates of Non-ordinary States in Pranayama Practitioners. <em>Front. Systems Neuroscience</em>.',
      '[6] Luo et al. (2025). Slow breathing EEG analysis. <em>PMC12341363</em>.',
    ],
  },
  {
    id: 'vago',
    colors: ['green', 'cyan'],
    refs: [
      '[7] Ferrer-Uris et al. (2025). Brain-heart connection: HRV and cognitive functioning. <em>Neuroscience</em>, 565, 369–376.',
      '[8] McCraty &amp; Shaffer (2015). Heart Rate Variability: New Perspectives. <em>Global Advances in Health and Medicine</em>, 4(1). [HeartMath]',
    ],
  },
  {
    id: 'lcr',
    colors: ['green', 'purple'],
    refs: [
      '[9] Yildiz et al. (2022). Yogic breathing impact on pulsatile CSF dynamics. <em>Scientific Reports</em>, 12, 10666.',
      '[10] Iliff et al. (2012). A paravascular pathway facilitates CSF flow. <em>Science Translational Medicine</em>, 4(147).',
    ],
  },
];

// Textos por idioma. findings: [[badge, texto], ...] en el mismo orden que colors.
export const BIB = {
  es: {
    title: 'Base Científica',
    sub: 'Literatura revisada · 2025–2026',
    refsTitle: 'Referencias',
    disclaimer: 'Herramienta educativa y de bienestar. No constituye diagnóstico médico. Consulta a un profesional ante cualquier condición de salud.',
    close: 'Cerrar',
    tabs: { binaural: 'Frecuencias Binaurales', pranayama: 'Pranayama & EEG', vago: 'Nervio Vago & HRV', lcr: 'LCR & Respiración' },
    sections: {
      binaural: {
        intro: 'Las frecuencias binaurales presentan dos tonos ligeramente distintos — el cerebro percibe la diferencia como un tercer tono de baja frecuencia. La revisión sistemática más reciente señala que los efectos más robustos se observan en ansiedad clínica y coherencia cardíaca, mientras que el arrastre EEG puro sigue siendo inconsistente.',
        findings: [
          ['Meta-análisis · 2025 · 15 ECA · +1000 pacientes', 'El audio binaural perioperatorio redujo significativamente la ansiedad, el dolor postoperatorio, la presión arterial sistólica y la frecuencia cardíaca en comparación con los controles.'],
          ['Revisión sistemática · 2023 · PLoS ONE', 'De 14 estudios EEG: 5 confirman arrastre y 8 muestran resultados contradictorios. El obstáculo es la heterogeneidad metodológica, no la ausencia de mecanismo.'],
          ['MIT Tsai Lab · 40 Hz · 2016–2023', 'La estimulación multisensorial a 40 Hz reduce las placas amiloides en modelos de Alzheimer hasta un 40–50 %, posiblemente vía sincronización de células gliales y del sistema glinfático.'],
        ],
      },
      pranayama: {
        intro: 'El pranayama modula el sistema nervioso autónomo, el EEG y el flujo de LCR a través de múltiples mecanismos: estimulación vagal vía barorreceptores, señalización olfativa hacia la corteza prefrontal y variación de la presión intracraneal con los ciclos respiratorios.',
        findings: [
          ['Harvard/NIMHANS · Asian J Psychiatry · 2026', 'Una revisión sistemática confirma que técnicas específicas de pranayama producen efectos equivalentes a la neuromodulación transcraneal no invasiva, modulando la función autonómica, el rendimiento cognitivo y la dinámica cerebral.'],
          ['Método Wim Hof · Fisiología', 'La hiperventilación controlada (30 respiraciones profundas) reduce el CO₂ (hipocapnia), alcaliniza temporalmente el pH sanguíneo y activa el eje simpático-adrenal. La retención con pulmones vacíos genera un estado de hipoxia-hipercapnia que activa reflejos de supervivencia y libera epinefrina.'],
          ['PMC · 2025 — Respiración lenta y EEG', 'Incluso 2 minutos de respiración lenta aumentan la HRV de forma medible. La respiración lenta frente a la rápida muestra aumentos simultáneos en delta, theta, alpha y beta del EEG: un estado integrador dual, calmado pero alerta.'],
        ],
      },
      vago: {
        intro: 'El nervio vago conecta corazón y cerebro de forma bidireccional, con más del 80 % de fibras aferentes (cuerpo → cerebro). La coherencia cardíaca a 0,1 Hz (6 resp/min) maximiza la señal vagal hacia la corteza prefrontal y la amígdala: es el mecanismo mejor documentado de la aplicación.',
        findings: [
          ['Neuroscience (Elsevier) · Enero 2025', 'La HRV mediada vagalmente es un índice de control cognitivo descendente. Una mayor vmHRV se asocia con mejor rendimiento en funciones ejecutivas, memoria, atención y lenguaje, lo que convierte la coherencia cardíaca en una herramienta de mejora cognitiva.'],
          ['Spandidos Publications · Jul 2025', 'La RSA (arritmia sinusal respiratoria) a ~0,1 Hz es el estado de coherencia fisiológica que maximiza la eficiencia del intercambio gaseoso y la resiliencia cardiovascular. Es el fundamento de los presets a 6 resp/min.'],
        ],
      },
      lcr: {
        intro: 'El LCR (líquido cefalorraquídeo) fluye de forma pulsátil, sincronizado con la respiración. La respiración consciente es un mecanismo real de modulación del flujo cerebroespinal, no solo metafórico. El sistema glinfático de limpieza cerebral opera principalmente en delta (sueño profundo).',
        findings: [
          ['Oregon Health & Science University · Scientific Reports · 2022', 'La resonancia magnética en tiempo real demostró que la respiración yóguica modifica de forma inmediata el flujo pulsátil del LCR. Las técnicas de pranayama tienen un efecto fisiológico real sobre el SNC.'],
          ['Nedergaard Lab · Sistema glinfático · 2013–2024', 'El sistema glinfático opera principalmente durante el sueño delta. Transporta LCR eliminando beta-amiloide y tau. La estimulación a 40 Hz podría activarlo parcialmente en vigilia.'],
        ],
      },
    },
  },

  en: {
    title: 'Scientific Basis',
    sub: 'Reviewed literature · 2025–2026',
    refsTitle: 'References',
    disclaimer: 'Educational and wellness tool. Not a medical diagnosis. Consult a professional about any health condition.',
    close: 'Close',
    tabs: { binaural: 'Binaural Beats', pranayama: 'Pranayama & EEG', vago: 'Vagus Nerve & HRV', lcr: 'CSF & Breathing' },
    sections: {
      binaural: {
        intro: 'Binaural beats present two slightly different tones — the brain perceives the difference as a third, low-frequency tone. The most recent systematic review indicates that the strongest effects are seen in clinical anxiety and heart coherence, while pure EEG entrainment remains inconsistent.',
        findings: [
          ['Meta-analysis · 2025 · 15 RCTs · 1000+ patients', 'Perioperative binaural audio significantly reduced anxiety, postoperative pain, systolic blood pressure and heart rate compared with controls.'],
          ['Systematic review · 2023 · PLoS ONE', 'Of 14 EEG studies, 5 confirm entrainment and 8 show contradictory results. The obstacle is methodological heterogeneity, not the absence of a mechanism.'],
          ['MIT Tsai Lab · 40 Hz · 2016–2023', 'Multisensory 40 Hz stimulation reduces amyloid plaques in Alzheimer’s models by up to 40–50%, possibly through synchronization of glial cells and the glymphatic system.'],
        ],
      },
      pranayama: {
        intro: 'Pranayama modulates the autonomic nervous system, the EEG and CSF flow through several mechanisms: vagal stimulation via baroreceptors, olfactory signalling to the prefrontal cortex, and changes in intracranial pressure across the breathing cycle.',
        findings: [
          ['Harvard/NIMHANS · Asian J Psychiatry · 2026', 'A systematic review confirms that specific pranayama techniques produce effects comparable to non-invasive transcranial neuromodulation, modulating autonomic function, cognitive performance and brain dynamics.'],
          ['Wim Hof Method · Physiology', 'Controlled hyperventilation (30 deep breaths) lowers CO₂ (hypocapnia), temporarily alkalizes blood pH and activates the sympatho-adrenal axis. Holding with empty lungs creates a hypoxic-hypercapnic state that triggers survival reflexes and releases epinephrine.'],
          ['PMC · 2025 — Slow breathing and EEG', 'Even 2 minutes of slow breathing measurably increase HRV. Slow versus fast breathing shows simultaneous increases in EEG delta, theta, alpha and beta — a dual integrative state: calm yet alert.'],
        ],
      },
      vago: {
        intro: 'The vagus nerve connects heart and brain in both directions, with more than 80% afferent fibres (body → brain). Heart coherence at 0.1 Hz (6 breaths/min) maximizes the vagal signal to the prefrontal cortex and amygdala — the best-documented mechanism in this app.',
        findings: [
          ['Neuroscience (Elsevier) · January 2025', 'Vagally mediated HRV is an index of top-down cognitive control. Higher vmHRV is associated with better executive function, memory, attention and language, making heart coherence a tool for cognitive enhancement.'],
          ['Spandidos Publications · Jul 2025', 'RSA (respiratory sinus arrhythmia) at ~0.1 Hz is the physiological coherence state that maximizes gas-exchange efficiency and cardiovascular resilience. It is the basis of the 6 breaths/min presets.'],
        ],
      },
      lcr: {
        intro: 'CSF (cerebrospinal fluid) flows in pulses synchronized with breathing. Conscious breathing is a real mechanism for modulating cerebrospinal flow, not just a metaphor. The glymphatic brain-cleaning system works mainly in delta (deep sleep).',
        findings: [
          ['Oregon Health & Science University · Scientific Reports · 2022', 'Real-time MRI showed that yogic breathing immediately changes pulsatile CSF flow. Pranayama techniques have a real physiological effect on the CNS.'],
          ['Nedergaard Lab · Glymphatic system · 2013–2024', 'The glymphatic system works mainly during delta sleep. It moves CSF and clears beta-amyloid and tau. 40 Hz stimulation may partially activate it while awake.'],
        ],
      },
    },
  },

  fr: {
    title: 'Base Scientifique',
    sub: 'Littérature revue · 2025–2026',
    refsTitle: 'Références',
    disclaimer: 'Outil éducatif et de bien-être. Ne constitue pas un diagnostic médical. Consultez un professionnel pour tout problème de santé.',
    close: 'Fermer',
    tabs: { binaural: 'Battements Binauraux', pranayama: 'Pranayama & EEG', vago: 'Nerf Vague & VFC', lcr: 'LCR & Respiration' },
    sections: {
      binaural: {
        intro: 'Les battements binauraux présentent deux tons légèrement différents — le cerveau perçoit la différence comme un troisième ton de basse fréquence. La revue systématique la plus récente indique que les effets les plus solides concernent l’anxiété clinique et la cohérence cardiaque, tandis que l’entraînement EEG pur reste inconstant.',
        findings: [
          ['Méta-analyse · 2025 · 15 ECR · plus de 1000 patients', 'L’audio binaural périopératoire a réduit significativement l’anxiété, la douleur postopératoire, la pression artérielle systolique et la fréquence cardiaque par rapport aux témoins.'],
          ['Revue systématique · 2023 · PLoS ONE', 'Sur 14 études EEG, 5 confirment l’entraînement et 8 montrent des résultats contradictoires. L’obstacle est l’hétérogénéité méthodologique, pas l’absence de mécanisme.'],
          ['MIT Tsai Lab · 40 Hz · 2016–2023', 'La stimulation multisensorielle à 40 Hz réduit les plaques amyloïdes dans des modèles d’Alzheimer jusqu’à 40–50 %, peut-être par synchronisation des cellules gliales et du système glymphatique.'],
        ],
      },
      pranayama: {
        intro: 'Le pranayama module le système nerveux autonome, l’EEG et le flux de LCR par plusieurs mécanismes : stimulation vagale via les barorécepteurs, signalisation olfactive vers le cortex préfrontal et variation de la pression intracrânienne au fil des cycles respiratoires.',
        findings: [
          ['Harvard/NIMHANS · Asian J Psychiatry · 2026', 'Une revue systématique confirme que des techniques spécifiques de pranayama produisent des effets comparables à la neuromodulation transcrânienne non invasive, en modulant la fonction autonome, les performances cognitives et la dynamique cérébrale.'],
          ['Méthode Wim Hof · Physiologie', 'L’hyperventilation contrôlée (30 respirations profondes) réduit le CO₂ (hypocapnie), alcalinise temporairement le pH sanguin et active l’axe sympatho-surrénalien. La rétention poumons vides crée un état d’hypoxie-hypercapnie qui déclenche des réflexes de survie et libère de l’adrénaline.'],
          ['PMC · 2025 — Respiration lente et EEG', 'Même 2 minutes de respiration lente augmentent la VFC de façon mesurable. La respiration lente, comparée à la rapide, montre des hausses simultanées des ondes delta, thêta, alpha et bêta : un état intégratif double, calme mais alerte.'],
        ],
      },
      vago: {
        intro: 'Le nerf vague relie le cœur et le cerveau dans les deux sens, avec plus de 80 % de fibres afférentes (corps → cerveau). La cohérence cardiaque à 0,1 Hz (6 resp/min) maximise le signal vagal vers le cortex préfrontal et l’amygdale : c’est le mécanisme le mieux documenté de l’application.',
        findings: [
          ['Neuroscience (Elsevier) · Janvier 2025', 'La VFC d’origine vagale est un indice du contrôle cognitif descendant. Une vmVFC plus élevée est associée à de meilleures fonctions exécutives, mémoire, attention et langage, ce qui fait de la cohérence cardiaque un outil d’amélioration cognitive.'],
          ['Spandidos Publications · Juil. 2025', 'L’ASR (arythmie sinusale respiratoire) à ~0,1 Hz est l’état de cohérence physiologique qui maximise l’efficacité des échanges gazeux et la résilience cardiovasculaire. C’est le fondement des préréglages à 6 resp/min.'],
        ],
      },
      lcr: {
        intro: 'Le LCR (liquide céphalo-rachidien) s’écoule de manière pulsatile, synchronisé avec la respiration. La respiration consciente est un véritable mécanisme de modulation du flux céphalo-rachidien, et pas seulement une métaphore. Le système glymphatique de nettoyage cérébral fonctionne surtout en delta (sommeil profond).',
        findings: [
          ['Oregon Health & Science University · Scientific Reports · 2022', 'L’IRM en temps réel a montré que la respiration yogique modifie immédiatement le flux pulsatile du LCR. Les techniques de pranayama ont un effet physiologique réel sur le SNC.'],
          ['Nedergaard Lab · Système glymphatique · 2013–2024', 'Le système glymphatique fonctionne surtout pendant le sommeil delta. Il fait circuler le LCR et élimine la bêta-amyloïde et la protéine tau. La stimulation à 40 Hz pourrait l’activer partiellement à l’état de veille.'],
        ],
      },
    },
  },

  pt: {
    title: 'Base Científica',
    sub: 'Literatura revisada · 2025–2026',
    refsTitle: 'Referências',
    disclaimer: 'Ferramenta educativa e de bem-estar. Não constitui diagnóstico médico. Consulte um profissional diante de qualquer condição de saúde.',
    close: 'Fechar',
    tabs: { binaural: 'Batidas Binaurais', pranayama: 'Pranayama & EEG', vago: 'Nervo Vago & VFC', lcr: 'LCR & Respiração' },
    sections: {
      binaural: {
        intro: 'As batidas binaurais apresentam dois tons ligeiramente diferentes — o cérebro percebe a diferença como um terceiro tom de baixa frequência. A revisão sistemática mais recente indica que os efeitos mais robustos aparecem na ansiedade clínica e na coerência cardíaca, enquanto o arrastamento EEG puro continua inconsistente.',
        findings: [
          ['Meta-análise · 2025 · 15 ECR · mais de 1000 pacientes', 'O áudio binaural perioperatório reduziu significativamente a ansiedade, a dor pós-operatória, a pressão arterial sistólica e a frequência cardíaca em comparação com os controles.'],
          ['Revisão sistemática · 2023 · PLoS ONE', 'De 14 estudos de EEG, 5 confirmam o arrastamento e 8 mostram resultados contraditórios. O obstáculo é a heterogeneidade metodológica, não a ausência de mecanismo.'],
          ['MIT Tsai Lab · 40 Hz · 2016–2023', 'A estimulação multissensorial a 40 Hz reduz as placas amiloides em modelos de Alzheimer em até 40–50 %, possivelmente via sincronização das células gliais e do sistema glinfático.'],
        ],
      },
      pranayama: {
        intro: 'O pranayama modula o sistema nervoso autônomo, o EEG e o fluxo de LCR por vários mecanismos: estimulação vagal via barorreceptores, sinalização olfativa para o córtex pré-frontal e variação da pressão intracraniana com os ciclos respiratórios.',
        findings: [
          ['Harvard/NIMHANS · Asian J Psychiatry · 2026', 'Uma revisão sistemática confirma que técnicas específicas de pranayama produzem efeitos equivalentes à neuromodulação transcraniana não invasiva, modulando a função autonômica, o desempenho cognitivo e a dinâmica cerebral.'],
          ['Método Wim Hof · Fisiologia', 'A hiperventilação controlada (30 respirações profundas) reduz o CO₂ (hipocapnia), alcaliniza temporariamente o pH do sangue e ativa o eixo simpático-adrenal. A retenção com os pulmões vazios gera um estado de hipóxia-hipercapnia que ativa reflexos de sobrevivência e libera epinefrina.'],
          ['PMC · 2025 — Respiração lenta e EEG', 'Mesmo 2 minutos de respiração lenta aumentam a VFC de forma mensurável. A respiração lenta, comparada à rápida, mostra aumentos simultâneos de delta, theta, alpha e beta no EEG: um estado integrador duplo, calmo mas alerta.'],
        ],
      },
      vago: {
        intro: 'O nervo vago conecta coração e cérebro nos dois sentidos, com mais de 80 % de fibras aferentes (corpo → cérebro). A coerência cardíaca a 0,1 Hz (6 resp/min) maximiza o sinal vagal para o córtex pré-frontal e a amígdala: é o mecanismo mais bem documentado do aplicativo.',
        findings: [
          ['Neuroscience (Elsevier) · Janeiro 2025', 'A VFC mediada pelo vago é um índice do controle cognitivo descendente. Uma vmVFC maior está associada a melhor desempenho em funções executivas, memória, atenção e linguagem, tornando a coerência cardíaca uma ferramenta de melhora cognitiva.'],
          ['Spandidos Publications · Jul 2025', 'A ASR (arritmia sinusal respiratória) a ~0,1 Hz é o estado de coerência fisiológica que maximiza a eficiência das trocas gasosas e a resiliência cardiovascular. É a base dos presets a 6 resp/min.'],
        ],
      },
      lcr: {
        intro: 'O LCR (líquido cefalorraquidiano) flui de forma pulsátil, sincronizado com a respiração. A respiração consciente é um mecanismo real de modulação do fluxo cerebroespinhal, não apenas uma metáfora. O sistema glinfático de limpeza cerebral atua principalmente em delta (sono profundo).',
        findings: [
          ['Oregon Health & Science University · Scientific Reports · 2022', 'A ressonância magnética em tempo real mostrou que a respiração yóguica altera imediatamente o fluxo pulsátil do LCR. As técnicas de pranayama têm efeito fisiológico real sobre o SNC.'],
          ['Nedergaard Lab · Sistema glinfático · 2013–2024', 'O sistema glinfático atua principalmente durante o sono delta. Transporta LCR e elimina beta-amiloide e tau. A estimulação a 40 Hz pode ativá-lo parcialmente durante a vigília.'],
        ],
      },
    },
  },

  zh: {
    title: '科学依据',
    sub: '文献综述 · 2025–2026',
    refsTitle: '参考文献',
    disclaimer: '本工具用于教育和健康养护，不构成医学诊断。如有任何健康问题，请咨询专业人士。',
    close: '关闭',
    tabs: { binaural: '双耳节拍', pranayama: '调息法与脑电', vago: '迷走神经与心率变异性', lcr: '脑脊液与呼吸' },
    sections: {
      binaural: {
        intro: '双耳节拍向两耳分别播放频率略有不同的两个音——大脑将两者的差值感知为第三个低频音。最新的系统综述指出，效果最稳健的领域是临床焦虑和心脏相干，而单纯的脑电同步效应仍不一致。',
        findings: [
          ['荟萃分析 · 2025 · 15 项随机对照试验 · 1000 余名患者', '与对照组相比，围手术期双耳音频显著降低了焦虑、术后疼痛、收缩压和心率。'],
          ['系统综述 · 2023 · PLoS ONE', '在 14 项脑电研究中，5 项证实存在同步效应，8 项结果相互矛盾。障碍在于方法学的异质性，而非缺乏作用机制。'],
          ['MIT Tsai 实验室 · 40 Hz · 2016–2023', '40 Hz 多感官刺激可使阿尔茨海默病模型中的淀粉样斑块减少多达 40–50%，可能是通过胶质细胞和类淋巴系统的同步实现的。'],
        ],
      },
      pranayama: {
        intro: '调息法（Pranayama）通过多种机制调节自主神经系统、脑电和脑脊液流动：经压力感受器的迷走神经刺激、通向前额叶皮层的嗅觉信号，以及随呼吸周期变化的颅内压。',
        findings: [
          ['哈佛/NIMHANS · Asian J Psychiatry · 2026', '一项系统综述证实，特定的调息技术可产生与非侵入性经颅神经调控相当的效果，可调节自主神经功能、认知表现和大脑动态。'],
          ['Wim Hof 呼吸法 · 生理学', '有控制的过度通气（30 次深呼吸）会降低二氧化碳（低碳酸血症），暂时使血液 pH 偏碱，并激活交感-肾上腺轴。空肺屏息会形成低氧-高碳酸状态，触发生存反射并释放肾上腺素。'],
          ['PMC · 2025 — 慢呼吸与脑电', '即使只有 2 分钟的慢呼吸，也能使心率变异性出现可测量的提升。与快呼吸相比，慢呼吸时脑电的 delta、theta、alpha 和 beta 波同时增强——一种平静而警觉的双重整合状态。'],
        ],
      },
      vago: {
        intro: '迷走神经双向连接心脏与大脑，其中超过 80% 是传入纤维（身体 → 大脑）。0.1 Hz（每分钟 6 次呼吸）的心脏相干可使传向前额叶皮层和杏仁核的迷走信号最大化——这是本应用中证据最充分的机制。',
        findings: [
          ['Neuroscience（Elsevier）· 2025 年 1 月', '迷走神经介导的心率变异性是自上而下认知控制的指标。较高的 vmHRV 与更好的执行功能、记忆、注意力和语言表现相关，使心脏相干成为提升认知的工具。'],
          ['Spandidos Publications · 2025 年 7 月', '约 0.1 Hz 的呼吸性窦性心律不齐（RSA）是一种生理相干状态，可使气体交换效率和心血管韧性达到最佳。这是每分钟 6 次呼吸预设的依据。'],
        ],
      },
      lcr: {
        intro: '脑脊液随呼吸同步地脉动流动。有意识的呼吸是调节脑脊液流动的真实机制，而不仅仅是比喻。负责清洁大脑的类淋巴系统主要在 delta 状态（深度睡眠）下运作。',
        findings: [
          ['俄勒冈健康与科学大学 · Scientific Reports · 2022', '实时磁共振成像显示，瑜伽呼吸会立即改变脑脊液的脉动流动。调息技术对中枢神经系统具有真实的生理作用。'],
          ['Nedergaard 实验室 · 类淋巴系统 · 2013–2024', '类淋巴系统主要在 delta 睡眠期间运作。它推动脑脊液流动，清除 β-淀粉样蛋白和 tau 蛋白。40 Hz 刺激可能在清醒时部分激活该系统。'],
        ],
      },
    },
  },

  hi: {
    title: 'वैज्ञानिक आधार',
    sub: 'समीक्षित साहित्य · 2025–2026',
    refsTitle: 'संदर्भ',
    disclaimer: 'यह एक शैक्षिक और स्वास्थ्य-कल्याण उपकरण है। यह चिकित्सीय निदान नहीं है। किसी भी स्वास्थ्य समस्या के लिए किसी विशेषज्ञ से परामर्श लें।',
    close: 'बंद करें',
    tabs: { binaural: 'बाइनॉरल बीट्स', pranayama: 'प्राणायाम और EEG', vago: 'वेगस तंत्रिका और HRV', lcr: 'CSF और श्वास' },
    sections: {
      binaural: {
        intro: 'बाइनॉरल बीट्स में दोनों कानों को थोड़ी अलग आवृत्ति वाले दो स्वर सुनाए जाते हैं — मस्तिष्क इनके अंतर को एक तीसरे, कम आवृत्ति वाले स्वर के रूप में अनुभव करता है। सबसे हालिया व्यवस्थित समीक्षा के अनुसार सबसे ठोस प्रभाव नैदानिक चिंता और हृदय सामंजस्य में दिखते हैं, जबकि केवल EEG एन्ट्रेनमेंट के परिणाम अब भी असंगत हैं।',
        findings: [
          ['मेटा-विश्लेषण · 2025 · 15 RCT · 1000+ रोगी', 'सर्जरी के आसपास बाइनॉरल ऑडियो ने नियंत्रण समूह की तुलना में चिंता, सर्जरी के बाद के दर्द, सिस्टोलिक रक्तचाप और हृदय गति को उल्लेखनीय रूप से कम किया।'],
          ['व्यवस्थित समीक्षा · 2023 · PLoS ONE', '14 EEG अध्ययनों में से 5 एन्ट्रेनमेंट की पुष्टि करते हैं और 8 के परिणाम परस्पर विरोधी हैं। बाधा कार्यप्रणाली की विविधता है, तंत्र का अभाव नहीं।'],
          ['MIT Tsai Lab · 40 Hz · 2016–2023', '40 Hz बहु-संवेदी उत्तेजना अल्ज़ाइमर मॉडलों में एमिलॉयड प्लाक को 40–50% तक कम करती है, संभवतः ग्लियल कोशिकाओं और ग्लिम्फैटिक प्रणाली के तालमेल के माध्यम से।'],
        ],
      },
      pranayama: {
        intro: 'प्राणायाम कई तंत्रों के माध्यम से स्वायत्त तंत्रिका तंत्र, EEG और CSF प्रवाह को प्रभावित करता है: बैरोरिसेप्टर के ज़रिए वेगस उत्तेजना, प्रीफ्रंटल कॉर्टेक्स तक घ्राण संकेत, और श्वास-चक्र के साथ अंतःकपालीय दबाव में बदलाव।',
        findings: [
          ['Harvard/NIMHANS · Asian J Psychiatry · 2026', 'एक व्यवस्थित समीक्षा पुष्टि करती है कि प्राणायाम की विशिष्ट तकनीकें गैर-आक्रामक ट्रांसक्रेनियल न्यूरोमॉड्यूलेशन जैसे प्रभाव उत्पन्न करती हैं, जो स्वायत्त कार्य, संज्ञानात्मक प्रदर्शन और मस्तिष्क की गतिकी को प्रभावित करती हैं।'],
          ['विम हॉफ विधि · शरीरक्रिया विज्ञान', 'नियंत्रित हाइपरवेंटिलेशन (30 गहरी साँसें) CO₂ को घटाता है (हाइपोकैप्निया), रक्त के pH को अस्थायी रूप से क्षारीय बनाता है और सिम्पैथो-एड्रिनल अक्ष को सक्रिय करता है। खाली फेफड़ों के साथ साँस रोकने से हाइपोक्सिया-हाइपरकैप्निया की स्थिति बनती है, जो अस्तित्व-रक्षा प्रतिवर्तों को सक्रिय करती है और एपिनेफ्रिन मुक्त करती है।'],
          ['PMC · 2025 — धीमी श्वास और EEG', 'केवल 2 मिनट की धीमी श्वास भी HRV को मापने योग्य रूप से बढ़ाती है। तेज़ श्वास की तुलना में धीमी श्वास में EEG की delta, theta, alpha और beta तरंगें एक साथ बढ़ती हैं — शांत किंतु सतर्क, एक दोहरी एकीकृत अवस्था।'],
        ],
      },
      vago: {
        intro: 'वेगस तंत्रिका हृदय और मस्तिष्क को दोनों दिशाओं में जोड़ती है, और इसके 80% से अधिक तंतु अभिवाही हैं (शरीर → मस्तिष्क)। 0.1 Hz (6 साँस/मिनट) पर हृदय सामंजस्य प्रीफ्रंटल कॉर्टेक्स और एमिग्डाला तक वेगस संकेत को अधिकतम करता है — यह इस ऐप का सबसे अच्छी तरह प्रमाणित तंत्र है।',
        findings: [
          ['Neuroscience (Elsevier) · जनवरी 2025', 'वेगस-मध्यस्थ HRV ऊपर-से-नीचे संज्ञानात्मक नियंत्रण का सूचक है। अधिक vmHRV बेहतर कार्यकारी क्षमता, स्मृति, ध्यान और भाषा से जुड़ा है, जिससे हृदय सामंजस्य संज्ञानात्मक सुधार का साधन बनता है।'],
          ['Spandidos Publications · जुलाई 2025', '~0.1 Hz पर RSA (श्वसन साइनस अतालता) वह शारीरिक सामंजस्य अवस्था है जो गैस-विनिमय की दक्षता और हृदय-संवहनी लचीलेपन को अधिकतम करती है। यही 6 साँस/मिनट वाले प्रीसेट का आधार है।'],
        ],
      },
      lcr: {
        intro: 'CSF (मस्तिष्कमेरु द्रव) श्वास के साथ तालमेल में स्पंदित रूप से बहता है। सचेत श्वास मस्तिष्कमेरु प्रवाह को नियंत्रित करने का एक वास्तविक तंत्र है, केवल रूपक नहीं। मस्तिष्क की सफ़ाई करने वाली ग्लिम्फैटिक प्रणाली मुख्यतः delta (गहरी नींद) में काम करती है।',
        findings: [
          ['Oregon Health & Science University · Scientific Reports · 2022', 'रियल-टाइम MRI से पता चला कि योगिक श्वास CSF के स्पंदित प्रवाह को तुरंत बदल देती है। प्राणायाम तकनीकों का केंद्रीय तंत्रिका तंत्र पर वास्तविक शारीरिक प्रभाव होता है।'],
          ['Nedergaard Lab · ग्लिम्फैटिक प्रणाली · 2013–2024', 'ग्लिम्फैटिक प्रणाली मुख्यतः delta नींद के दौरान काम करती है। यह CSF को प्रवाहित करती है और बीटा-एमिलॉयड व टाउ को हटाती है। 40 Hz उत्तेजना जागते समय इसे आंशिक रूप से सक्रिय कर सकती है।'],
        ],
      },
    },
  },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Pinta la sección «Ciencia» en el idioma pedido, conservando la pestaña activa.
export function renderBib(lang) {
  const L = BIB[lang] || BIB.es;
  const body = document.getElementById('bibBody');
  const tabs = document.getElementById('bibTabs');
  if (!body || !tabs) return;

  const activeTab = tabs.querySelector('.bib-tab.active')?.dataset.btab || 'binaural';

  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  set('bibTitle', L.title);
  set('bibSub', L.sub);
  set('bibDisclaimer', L.disclaimer);
  set('bibCloseBtn', L.close);

  tabs.innerHTML = STRUCTURE.map(s =>
    `<div class="bib-tab${s.id === activeTab ? ' active' : ''}" data-btab="${s.id}" role="tab" tabindex="0" onclick="window.switchBibTab(this)">${esc(L.tabs[s.id])}</div>`
  ).join('');

  body.innerHTML = STRUCTURE.map(s => {
    const sec = L.sections[s.id];
    const findings = sec.findings.map(([badge, text], i) => `
        <div class="bib-finding">
          <div class="bib-finding-badge" style="${C[s.colors[i]] || C.cyan}">${esc(badge)}</div>
          <div class="bib-finding-text">${esc(text)}</div>
        </div>`).join('');
    const refs = s.refs.map(r => `<div class="bib-ref">${r}</div>`).join('');
    return `
      <div class="bib-section${s.id === activeTab ? ' active' : ''}" id="bib-${s.id}">
        <div class="bib-intro">${esc(sec.intro)}</div>
        ${findings}
        <div class="bib-refs">
          <div class="bib-ref-title">${esc(L.refsTitle)}</div>
          ${refs}
        </div>
      </div>`;
  }).join('');
}
