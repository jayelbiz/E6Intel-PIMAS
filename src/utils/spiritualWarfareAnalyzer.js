// Spiritual Warfare Classifications based on Testament of Solomon
const spiritualClassifications = {
  DECEPTION: {
    name: 'Deception Spirits',
    description: 'Entities that spread lies and confusion',
    biblicalReference: 'Revelation 12:9',
    keywords: [
      'great reset', 'new world order', 'false peace', 'unity', 'global governance',
      'sustainable development', 'transformation', 'paradigm shift'
    ],
    patterns: [
      'promise of peace without repentance',
      'mixing truth with lies',
      'redefining biblical terms',
      'moral relativism'
    ]
  },
  CONTROL: {
    name: 'Control & Dominion',
    description: 'Spirits seeking to establish illegitimate authority',
    biblicalReference: 'Ephesians 6:12',
    keywords: [
      'mandate', 'compliance', 'regulation', 'surveillance', 'social credit',
      'digital identity', 'central control', 'emergency powers'
    ],
    patterns: [
      'centralization of power',
      'removal of freedoms',
      'behavioral modification',
      'social engineering'
    ]
  },
  FALSE_LIGHT: {
    name: 'False Light Bearers',
    description: 'Entities masquerading as sources of truth',
    biblicalReference: '2 Corinthians 11:14',
    keywords: [
      'enlightenment', 'awakening', 'consciousness', 'evolution',
      'ascension', 'divine feminine', 'ancient wisdom', 'mystery teachings'
    ],
    patterns: [
      'mixing occult with scripture',
      'eastern mysticism',
      'gnostic teachings',
      'new age spirituality'
    ]
  },
  PROPHECY_MOCKERY: {
    name: 'Prophecy Mockers',
    description: 'Spirits that mock or distort biblical prophecy',
    biblicalReference: '2 Peter 3:3-4',
    keywords: [
      'climate crisis', 'population control', 'sustainable future',
      'global threats', 'existential risk', 'scientific consensus'
    ],
    patterns: [
      'fear-based narratives',
      'alternative end-times scenarios',
      'man-made solutions to prophecy',
      'mockery of biblical warnings'
    ]
  },
  CHAOS: {
    name: 'Chaos Spirits',
    description: 'Entities promoting disorder and destruction',
    biblicalReference: 'James 3:16',
    keywords: [
      'disruption', 'uprising', 'revolution', 'crisis', 'collapse',
      'emergency', 'breakdown', 'radical change'
    ],
    patterns: [
      'order out of chaos',
      'orchestrated crisis',
      'controlled demolition',
      'problem-reaction-solution'
    ]
  }
};

// Ancient deity references and their modern manifestations
const occultSymbolism = {
  deities: {
    'moloch': ['sacrifice', 'child welfare', 'future generations'],
    'baal': ['prosperity', 'economic growth', 'abundance'],
    'isis': ['mother earth', 'divine feminine', 'nature worship'],
    'jupiter': ['global authority', 'international law', 'world governance'],
    'saturn': ['time', 'age', 'cycles', 'great reset']
  },
  symbols: {
    'eye': ['surveillance', 'awareness', 'consciousness'],
    'pyramid': ['hierarchy', 'structure', 'order'],
    'serpent': ['wisdom', 'knowledge', 'transformation'],
    'sun': ['illumination', 'enlightenment', 'awakening'],
    'moon': ['mystery', 'cycles', 'change']
  },
  numbers: {
    '13': 'rebellion',
    '33': 'mastery',
    '666': 'human governance',
    '888': 'new order'
  }
};

// Ritualistic language patterns
const ritualisticPatterns = [
  'must be done',
  'time has come',
  'new era',
  'great awakening',
  'divine timing',
  'sacred duty',
  'manifest destiny',
  'cosmic alignment'
];

// Detect spiritual warfare indicators in text
const detectWarfareIndicators = (text) => {
  const indicators = {
    classifications: [],
    occultReferences: [],
    ritualisticLanguage: [],
    severity: 0
  };

  const normalizedText = text.toLowerCase();

  // Check each classification
  Object.entries(spiritualClassifications).forEach(([key, classification]) => {
    const matches = {
      keywords: [],
      patterns: []
    };

    // Check keywords
    classification.keywords.forEach(keyword => {
      if (normalizedText.includes(keyword.toLowerCase())) {
        matches.keywords.push(keyword);
      }
    });

    // Check patterns
    classification.patterns.forEach(pattern => {
      if (normalizedText.includes(pattern.toLowerCase())) {
        matches.patterns.push(pattern);
      }
    });

    if (matches.keywords.length > 0 || matches.patterns.length > 0) {
      indicators.classifications.push({
        type: key,
        name: classification.name,
        description: classification.description,
        biblicalReference: classification.biblicalReference,
        matches
      });
    }
  });

  // Check for occult references
  Object.entries(occultSymbolism.deities).forEach(([deity, terms]) => {
    terms.forEach(term => {
      if (normalizedText.includes(term.toLowerCase())) {
        indicators.occultReferences.push({
          type: 'deity',
          name: deity,
          reference: term
        });
      }
    });
  });

  // Check for ritualistic language
  ritualisticPatterns.forEach(pattern => {
    if (normalizedText.includes(pattern.toLowerCase())) {
      indicators.ritualisticLanguage.push(pattern);
    }
  });

  // Calculate severity (0-100)
  indicators.severity = Math.min(100, Math.round(
    (indicators.classifications.length * 20) +
    (indicators.occultReferences.length * 15) +
    (indicators.ritualisticLanguage.length * 10)
  ));

  // Generate interpretation
  indicators.interpretation = generateInterpretation(indicators);

  return indicators;
};

// Generate a spiritual interpretation of the findings
const generateInterpretation = (indicators) => {
  const parts = [];

  if (indicators.classifications.length > 0) {
    parts.push(`This content shows characteristics of ${indicators.classifications.map(c => c.name).join(', ')}. `);
  }

  if (indicators.occultReferences.length > 0) {
    parts.push(`Contains references associated with ancient deities (${indicators.occultReferences.map(r => r.name).join(', ')}). `);
  }

  if (indicators.ritualisticLanguage.length > 0) {
    parts.push('Uses ritualistic language patterns common in occult communications. ');
  }

  parts.push(`Overall spiritual warfare severity: ${
    indicators.severity < 30 ? 'Low' :
    indicators.severity < 60 ? 'Moderate' :
    'High'
  } (${indicators.severity}/100)`);

  return parts.join('');
};

export {
  detectWarfareIndicators,
  spiritualClassifications,
  occultSymbolism,
  ritualisticPatterns
};
