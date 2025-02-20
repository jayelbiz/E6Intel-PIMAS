export const NEWS_CATEGORIES = {
  GEOPOLITICAL: {
    id: 'geopolitical',
    label: '🌍 Geopolitical & Conflict',
    subcategories: {
      MILITARY: {
        id: 'military_defense',
        label: '🪖 Military & Defense',
        description: 'Wars, troop movements, military alliances'
      },
      POLITICAL: {
        id: 'political_upheaval',
        label: '🏛️ Political Upheaval',
        description: 'Coups, protests, government crackdowns'
      },
      TERRORISM: {
        id: 'terrorism',
        label: '💣 Terrorism & Insurgency',
        description: 'Attacks, threats, extremist movements'
      },
      CYBER: {
        id: 'cyber_warfare',
        label: '🖥️ Cyber Warfare',
        description: 'State-sponsored cyberattacks, hacking groups'
      },
      LEGISLATIVE: {
        id: 'legislative',
        label: '📜 Legislative Movements',
        description: 'New laws, policies, international treaties'
      },
      BORDER: {
        id: 'border_disputes',
        label: '🚧 Border Disputes',
        description: 'Territorial conflicts, border tensions'
      },
      SANCTIONS: {
        id: 'sanctions_diplomacy',
        label: '🤝 Sanctions & Diplomacy',
        description: 'Trade wars, sanctions, diplomatic expulsions'
      }
    }
  },
  SECURITY: {
    id: 'security',
    label: '🛑 Security & Unrest',
    description: 'Security threats, civil unrest, and surveillance',
    subcategories: {
      RIOTS: {
        id: 'civil_unrest',
        label: '🔥 Riots & Civil Unrest',
        description: 'Mass protests, riots, civil disorder',
        severity: 'high'
      },
      CRIME: {
        id: 'organized_crime',
        label: '💰 Organized Crime & Cartels',
        description: 'Drug trafficking, human smuggling, black markets',
        severity: 'high'
      },
      SURVEILLANCE: {
        id: 'surveillance',
        label: '📡 Surveillance & Privacy',
        description: 'Government spying, data leaks, AI surveillance',
        severity: 'medium'
      },
      PSYOPS: {
        id: 'psyops',
        label: '🎭 False Flags & PsyOps',
        description: 'Disinformation campaigns, deception tactics',
        severity: 'high'
      }
    }
  },
  NATURAL_DISASTERS: {
    id: 'natural_disasters',
    label: '🌪️ Natural & Environmental Disasters',
    description: 'Natural disasters, environmental events, and climate-related phenomena',
    subcategories: {
      EARTHQUAKES: {
        id: 'earthquakes',
        label: '🌎 Earthquakes',
        description: 'Seismic activity, tectonic events, and their impacts',
        severity: 'high'
      },
      HURRICANES: {
        id: 'hurricanes',
        label: '🌪️ Hurricanes & Typhoons',
        description: 'Tropical storms, cyclones, and severe weather systems',
        severity: 'high'
      },
      WILDFIRES: {
        id: 'wildfires',
        label: '🔥 Wildfires',
        description: 'Forest fires, bush fires, and wildland fire events',
        severity: 'high'
      },
      FLOODING: {
        id: 'flooding',
        label: '🌊 Flooding & Tsunamis',
        description: 'Coastal flooding, storm surges, and tsunami events',
        severity: 'high'
      },
      DROUGHT: {
        id: 'drought',
        label: '🚱 Drought & Water Shortages',
        description: 'Water scarcity, drought conditions, and resource depletion',
        severity: 'medium'
      },
      ENVIRONMENTAL: {
        id: 'environmental',
        label: '🌫️ Environmental Pollution & Climate Manipulation',
        description: 'HAARP theories, geoengineering, and environmental modification',
        severity: 'medium'
      }
    }
  },
  ECONOMIC: {
    id: 'economic',
    label: '📊 Economic & Financial',
    description: 'Global financial markets, economic trends, and monetary systems',
    subcategories: {
      MARKET_SHIFTS: {
        id: 'market_shifts',
        label: '📉 Global Economic Shifts',
        description: 'Stock market crashes, inflation spikes, economic downturns',
        severity: 'high'
      },
      RESOURCES: {
        id: 'resources',
        label: '⛽ Resource Control & Energy Wars',
        description: 'Oil, gas, water, rare earth minerals competition and control',
        severity: 'high'
      },
      BANKING: {
        id: 'banking',
        label: '🏦 Banking System Instabilities',
        description: 'Bank failures, central bank policies, financial system risks',
        severity: 'high'
      },
      CRYPTO: {
        id: 'crypto',
        label: '₿ Cryptocurrency & Digital Currencies',
        description: 'Regulations, market crashes, adoption trends in digital finance',
        severity: 'medium'
      }
    }
  },
  INFO_WARFARE: {
    id: 'info_warfare',
    label: '🧠 Information Warfare & Media Manipulation',
    description: 'Digital manipulation, propaganda, and information control tactics',
    subcategories: {
      AI_MISINFO: {
        id: 'ai_misinfo',
        label: '🤖 AI-Generated Misinformation',
        description: 'Deepfakes, AI-driven propaganda, synthetic media manipulation',
        severity: 'high'
      },
      SOCIAL_OPS: {
        id: 'social_ops',
        label: '🕵️ Social Media Influence Operations',
        description: 'Bot activity, mass opinion shaping, coordinated campaigns',
        severity: 'high'
      },
      CENSORSHIP: {
        id: 'censorship',
        label: '🚫 Censorship & Free Speech Suppression',
        description: 'Platform bans, media blackouts, content restrictions',
        severity: 'high'
      },
      LEAKS: {
        id: 'leaks',
        label: '🕶️ Whistleblower Leaks & Exposés',
        description: 'Government leaks, corporate corruption revelations, classified information',
        severity: 'high'
      }
    }
  },
  SUPERNATURAL: {
    id: 'supernatural',
    label: '🛸 Supernatural & Unexplained',
    description: 'Supernatural phenomena, spiritual warfare, and unexplained events',
    subcategories: {
      UFO: {
        id: 'ufo_sightings',
        label: '🛸 UFO/UAP Sightings',
        description: 'Government declassified reports, mass sightings, aerial phenomena',
        severity: 'high'
      },
      SUPERNATURAL: {
        id: 'supernatural_phenomena',
        label: '👁️ Supernatural Phenomena',
        description: 'Exorcisms, paranormal activity, curses, spiritual manifestations',
        severity: 'high'
      },
      PROPHECIES: {
        id: 'prophecies',
        label: '📜 Ancient Prophecies & Eschatology',
        description: 'End-times prophecy fulfillment, biblical predictions, prophetic signs',
        severity: 'high'
      },
      DEMONIC: {
        id: 'demonic_influence',
        label: '👹 Demonic Influence & Possessions',
        description: 'Spiritual warfare, possession cases, demonic manifestations',
        severity: 'high'
      },
      NEPHILIM: {
        id: 'nephilim',
        label: '🏺 Nephilim & Forbidden Archaeology',
        description: 'Ancient giants, lost civilizations, hidden historical evidence',
        severity: 'high'
      },
      DIVINE_MOCKERY: {
        id: 'divine_mockery',
        label: '🔥 God\'s Strategy of Mockery Against Darkness',
        description: 'Plagues, divine judgments, cosmic warnings, supernatural interventions',
        severity: 'high'
      }
    }
  }
};

export const flattenCategories = () => {
  const flattened = [];
  Object.values(NEWS_CATEGORIES).forEach(category => {
    flattened.push({
      id: category.id,
      label: category.label,
      isGroup: true
    });
    Object.values(category.subcategories).forEach(sub => {
      flattened.push({
        id: sub.id,
        label: sub.label,
        description: sub.description,
        parentId: category.id
      });
    });
  });
  return flattened;
};

export const getCategoryById = (id) => {
  const flattened = flattenCategories();
  return flattened.find(cat => cat.id === id);
};

export const getCategoryHierarchy = (id) => {
  const category = getCategoryById(id);
  if (!category) return null;
  
  if (category.parentId) {
    const parent = getCategoryById(category.parentId);
    return {
      group: parent,
      subcategory: category
    };
  }
  
  return {
    group: category,
    subcategory: null
  };
};
