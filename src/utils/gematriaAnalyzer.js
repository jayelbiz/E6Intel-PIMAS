// Hebrew alphabet and their numerical values
const hebrewGematria = {
  'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
  'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
  'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400,
  'ך': 20, 'ם': 40, 'ן': 50, 'ף': 80, 'ץ': 90 // Final forms
};

// English to Hebrew transliteration mapping
const transliterationMap = {
  'a': 'א', 'b': 'ב', 'g': 'ג', 'd': 'ד', 'h': 'ה', 'v': 'ו', 'z': 'ז',
  'ch': 'ח', 't': 'ט', 'y': 'י', 'k': 'כ', 'l': 'ל', 'm': 'מ', 'n': 'נ',
  's': 'ס', 'p': 'פ', 'ts': 'צ', 'q': 'ק', 'r': 'ר', 'sh': 'ש', 'th': 'ת'
};

// Biblical number meanings
const biblicalNumbers = {
  1: 'Unity, primacy, God\'s supremacy',
  2: 'Witness, testimony, partnership',
  3: 'Divine perfection, completeness',
  4: 'Creation, world, universal truth',
  5: 'Grace, God\'s goodness',
  6: 'Man, human weakness, sin',
  7: 'Spiritual perfection, divine completion',
  8: 'New beginnings, resurrection',
  9: 'Divine completeness, finality',
  10: 'Divine order, government',
  12: 'Governmental perfection',
  13: 'Rebellion, apostasy',
  17: 'Victory, spiritual order',
  40: 'Testing, trials, probation',
  70: 'Perfect spiritual order',
  144: 'Divine election',
  666: 'Ultimate human rebellion'
};

// Get the closest biblical numbers for a given value
const findClosestBiblicalNumbers = (value) => {
  const numbers = Object.keys(biblicalNumbers).map(Number);
  const closest = numbers.reduce((prev, curr) => {
    return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
  });
  
  // Return the closest and any exact matches
  const results = [];
  if (biblicalNumbers[value]) {
    results.push({ number: value, meaning: biblicalNumbers[value], type: 'exact' });
  }
  if (!results.length || closest !== value) {
    results.push({ 
      number: closest, 
      meaning: biblicalNumbers[closest], 
      type: 'approximate',
      difference: Math.abs(closest - value)
    });
  }
  return results;
};

// Convert English text to Hebrew transliteration
const transliterateToHebrew = (text) => {
  let hebrew = '';
  const words = text.toLowerCase().split(' ');
  
  words.forEach(word => {
    let transliterated = '';
    let i = 0;
    while (i < word.length) {
      // Check for two-letter combinations first
      if (i < word.length - 1) {
        const twoChars = word.substr(i, 2);
        if (transliterationMap[twoChars]) {
          transliterated += transliterationMap[twoChars];
          i += 2;
          continue;
        }
      }
      // Single letter transliteration
      const char = word[i];
      if (transliterationMap[char]) {
        transliterated += transliterationMap[char];
      }
      i++;
    }
    hebrew += transliterated + ' ';
  });
  
  return hebrew.trim();
};

// Calculate Gematria value for Hebrew text
const calculateGematria = (hebrewText) => {
  return hebrewText.split('').reduce((sum, char) => {
    return sum + (hebrewGematria[char] || 0);
  }, 0);
};

// Extract key terms from text (names, places, important phrases)
const extractKeyTerms = (text) => {
  // Simple extraction based on capitalization and common patterns
  const words = text.split(/\s+/);
  const keyTerms = new Set();
  
  words.forEach((word, index) => {
    // Capture capitalized words (potential names/places)
    if (/^[A-Z]/.test(word)) {
      keyTerms.add(word);
    }
    
    // Capture phrases in quotes
    if (word.startsWith('"') && index < words.length - 1) {
      let phrase = word;
      let j = index + 1;
      while (j < words.length && !words[j].endsWith('"')) {
        phrase += ' ' + words[j];
        j++;
      }
      if (j < words.length) {
        phrase += ' ' + words[j];
        keyTerms.add(phrase.replace(/"/g, ''));
      }
    }
  });
  
  return Array.from(keyTerms);
};

// Main analysis function
const analyzeText = (text) => {
  const keyTerms = extractKeyTerms(text);
  const analysis = [];
  
  keyTerms.forEach(term => {
    const hebrew = transliterateToHebrew(term);
    const value = calculateGematria(hebrew);
    const biblicalSignificance = findClosestBiblicalNumbers(value);
    
    analysis.push({
      term,
      hebrew,
      value,
      biblicalSignificance
    });
  });
  
  return {
    keyTerms: analysis,
    totalValue: analysis.reduce((sum, item) => sum + item.value, 0)
  };
};

export {
  analyzeText,
  transliterateToHebrew,
  calculateGematria,
  findClosestBiblicalNumbers,
  biblicalNumbers
};
