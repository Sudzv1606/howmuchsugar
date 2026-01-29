// State
let state = {
    inputValue: '',
    currentUnit: 'tsp', // 'tsp' or 'tbsp'
    country: 'us', // 'us' or 'uk'
    isReverseMode: false
};

// Conversion factors (grams per spoon)
const CONVERSION = {
    us: { tsp: 4.2, tbsp: 12.6 },
    uk: { tsp: 5.0, tbsp: 15.0 }
};

// DOM Elements
const elements = {
    input: document.getElementById('sugarInput'),
    stepper: document.getElementById('stepperBtn'),
    output: document.getElementById('outputSection'),
    spoonCount: document.getElementById('spoonCount'),
    spoonEmojis: document.getElementById('spoonEmojis'),
    oneLiner: document.getElementById('oneLiner'),
    toggleBtns: document.querySelectorAll('.toggle-btn'),
    flipBtn: document.getElementById('flipBtn'),
    countrySelect: document.getElementById('countrySelect')
};

// Load saved preferences
function loadPreferences() {
    const savedUnit = localStorage.getItem('sugarUnit');
    const savedCountry = localStorage.getItem('sugarCountry');

    if (savedUnit) {
        state.currentUnit = savedUnit;
        updateUnitToggle();
    }
    if (savedCountry) {
        state.country = savedCountry;
        elements.countrySelect.value = savedCountry;
    }
}

// Save preferences
function savePreferences() {
    localStorage.setItem('sugarUnit', state.currentUnit);
    localStorage.setItem('sugarCountry', state.country);
}

// Convert grams to spoons
function gramsToSpoons(grams, unit, country) {
    const gPerSpoon = CONVERSION[country][unit];
    return Math.round((grams / gPerSpoon) * 10) / 10;
}

// Convert spoons to grams
function spoonsToGrams(spoons, unit, country) {
    const gPerSpoon = CONVERSION[country][unit];
    return Math.round(spoons * gPerSpoon);
}

// Get teaspoon equivalent (for one-liner tiering)
function getTeaspoonEquivalent(inputValue) {
    if (state.isReverseMode) {
        // Input is spoons - convert to teaspoons
        if (state.currentUnit === 'tsp') {
            return inputValue;
        }
        return inputValue * 3; // 1 tbsp = 3 tsp
    } else {
        // Input is grams - convert to teaspoons
        const gPerTsp = CONVERSION[state.country].tsp;
        return inputValue / gPerTsp;
    }
}

// Generate spoon emoji string
function generateSpoonEmojis(count) {
    const maxVisible = 12;
    const displayCount = Math.min(Math.floor(count), maxVisible);
    let emojis = '';
    for (let i = 0; i < displayCount; i++) {
        emojis += '🥄';
    }
    if (count > maxVisible) {
        emojis += ` (+${Math.floor(count - maxVisible)} more)`;
    }
    return emojis;
}

// Update output display
function updateOutput() {
    const value = parseFloat(state.inputValue);

    if (isNaN(value) || state.inputValue === '') {
        elements.output.classList.add('hidden');
        return;
    }

    let outputValue, tspEquivalent;

    if (state.isReverseMode) {
        // Reverse mode: input spoons → output grams
        outputValue = spoonsToGrams(value, state.currentUnit, state.country);
        elements.spoonCount.textContent = `${outputValue}g`;
        tspEquivalent = getTeaspoonEquivalent(value);
    } else {
        // Normal mode: input grams → output spoons
        outputValue = gramsToSpoons(value, state.currentUnit, state.country);
        elements.spoonCount.textContent = outputValue;
        elements.spoonEmojis.textContent = generateSpoonEmojis(outputValue);
        tspEquivalent = getTeaspoonEquivalent(value);
    }

    elements.oneLiner.textContent = getOneLiner(tspEquivalent);
    elements.output.classList.remove('hidden');
}

// Update unit toggle visual state
function updateUnitToggle() {
    elements.toggleBtns.forEach(btn => {
        if (btn.dataset.unit === state.currentUnit) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Input change handler
elements.input.addEventListener('input', (e) => {
    state.inputValue = e.target.value;
    updateOutput();
});

// Stepper button (+5g or +1 spoon)
elements.stepper.addEventListener('click', () => {
    const current = parseFloat(state.inputValue) || 0;
    const increment = state.isReverseMode ? 1 : 5;
    state.inputValue = (current + increment).toString();
    elements.input.value = state.inputValue;
    updateOutput();
});

// Unit toggle handlers
elements.toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        state.currentUnit = btn.dataset.unit;
        updateUnitToggle();
        savePreferences();
        updateOutput();
    });
});

// Country selector
elements.countrySelect.addEventListener('change', (e) => {
    state.country = e.target.value;
    savePreferences();
    updateOutput();
});

// Flip mode button
elements.flipBtn.addEventListener('click', () => {
    state.isReverseMode = !state.isReverseMode;

    // Update UI for mode
    if (state.isReverseMode) {
        elements.input.placeholder = `Enter ${state.currentUnit}`;
        document.querySelector('.subtitle').textContent = 'Because grams are confusing';
    } else {
        elements.input.placeholder = 'Enter grams';
        document.querySelector('.subtitle').textContent = "Because '20 grams' means nothing";
    }

    // Clear and refocus
    state.inputValue = '';
    elements.input.value = '';
    elements.output.classList.add('hidden');
    elements.input.focus();
});

// Initialize
loadPreferences();
updateUnitToggle();
elements.input.focus();
