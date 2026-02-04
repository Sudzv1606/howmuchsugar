// ===== FIREBASE SETUP =====
const firebaseConfig = {
  apiKey: "AIzaSyCTdGGTziQSS6vrlt_yC9t-eTtObHP_x0w",
  authDomain: "sugarspoon-likes.firebaseapp.com",
  databaseURL: "https://sugarspoon-likes-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sugarspoon-likes",
  storageBucket: "sugarspoon-likes.firebasestorage.app",
  messagingSenderId: "59391121800",
  appId: "1:59391121800:web:06cbde187eda17a8cf423d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const likesRef = db.ref('likes');

// ===== STATE =====
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
    subtitle: document.getElementById('subtitle'),
    output: document.getElementById('outputSection'),
    emptyState: document.getElementById('emptyState'),
    resultContent: document.getElementById('resultContent'),
    spoonCount: document.getElementById('spoonCount'),
    spoonEmojis: document.getElementById('spoonEmojis'),
    oneLiner: document.getElementById('oneLiner'),
    toggleBtns: document.querySelectorAll('.toggle-btn'),
    flipBtn: document.getElementById('flipBtn'),
    countrySelect: document.getElementById('countrySelect'),
    shareBtn: document.getElementById('shareBtn'),
    likeBtn: document.getElementById('likeBtn'),
    likeCount: document.getElementById('likeCount')
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

// Generate animated spoon emoji string
function generateSpoonEmojis(count) {
    const maxVisible = 12;
    const displayCount = Math.min(Math.floor(count), maxVisible);

    let html = '';
    for (let i = 0; i < displayCount; i++) {
        html += `<span class="spoon" style="animation-delay: ${i * 0.05}s">🥄</span>`;
    }
    if (count > maxVisible) {
        html += `<span style="animation-delay: ${displayCount * 0.05}s" class="spoon"> (+${Math.floor(count - maxVisible)} more)</span>`;
    }
    return html;
}

// Trigger confetti explosion
function triggerConfetti() {
    if (typeof confetti === 'undefined') return;

    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 1000
    };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Create two bursts from opposite sides
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
    }, 250);
}

// Generate share message
function generateShareMessage(grams, spoons) {
    const messages = [
        `I just entered ${grams}g of sugar. That's ${spoons} spoons of chaos.`,
        `Just discovered that ${grams}g of sugar = ${spoons} spoons. What have I been doing with my life?`,
        `${grams}g of sugar later... that's ${spoons} spoons. No regrets.`,
        `Me: enters ${grams}g\nAlso me: sees it's ${spoons} spoons\nPancreas: 👋`,
        `That's ${grams}g for you. ${spoons} spoons for me. We're not the same.`
    ];

    // Special messages for certain amounts
    if (grams === 69) {
        return `I just entered 69g of sugar. That's ${spoons} spoons. Nice. 😏`;
    }
    if (grams === 42) {
        return `I just entered 42g of sugar. That's ${spoons} spoons. The answer to everything.`;
    }
    if (grams >= 100) {
        return `I just entered ${grams}g of sugar. That's ${spoons} spoons. I have achieved god mode. 🔥`;
    }

    return messages[Math.floor(Math.random() * messages.length)];
}

// Share result
async function shareResult() {
    const grams = parseFloat(state.inputValue);
    if (isNaN(grams)) return;

    const spoons = gramsToSpoons(grams, state.currentUnit, state.country);
    const message = generateShareMessage(grams, spoons);

    const shareData = {
        title: 'How Much Sugar?',
        text: message,
        url: 'https://howmuchsugar.fun'
    };

    // Try Web Share API first (mobile)
    if (navigator.share) {
        try {
            await navigator.share(shareData);
            return;
        } catch (err) {
            // Fall through to clipboard
        }
    }

    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(message + '\n\nCheck it yourself: ' + shareData.url).then(() => {
        elements.shareBtn.textContent = '✓ Copied!';
        elements.shareBtn.classList.add('copied');
        setTimeout(() => {
            elements.shareBtn.textContent = '📤 Share this chaos';
            elements.shareBtn.classList.remove('copied');
        }, 2000);
    });
}

// Track last confetti amount (to avoid triggering multiple times)
let lastConfettiAmount = 0;

// Update output display
function updateOutput() {
    const value = parseFloat(state.inputValue);

    if (isNaN(value) || state.inputValue === '') {
        // Show empty state
        elements.emptyState.style.display = 'block';
        elements.resultContent.classList.remove('active');
        lastConfettiAmount = 0;
        return;
    }

    // Hide empty state, show results
    elements.emptyState.style.display = 'none';
    elements.resultContent.classList.add('active');

    // Special cases
    if (value < 0) {
        elements.spoonCount.textContent = '🤨';
        elements.spoonEmojis.innerHTML = '<span class="spoon">🚫</span>';
        elements.oneLiner.textContent = getOneLiner(-1);
        return;
    }

    if (value === 0) {
        elements.spoonCount.textContent = '0';
        elements.spoonEmojis.innerHTML = '<span class="spoon">✨</span>';
        elements.oneLiner.textContent = getOneLiner(0);
        return;
    }

    let outputValue, tspEquivalent;

    if (state.isReverseMode) {
        // Reverse mode: input spoons → output grams
        outputValue = spoonsToGrams(value, state.currentUnit, state.country);
        elements.spoonCount.textContent = `${outputValue}g`;
        elements.spoonEmojis.innerHTML = '';
        tspEquivalent = getTeaspoonEquivalent(value);
    } else {
        // Normal mode: input grams → output spoons
        outputValue = gramsToSpoons(value, state.currentUnit, state.country);
        elements.spoonCount.textContent = outputValue;
        elements.spoonEmojis.innerHTML = generateSpoonEmojis(outputValue);
        tspEquivalent = getTeaspoonEquivalent(value);

        // Trigger confetti for 50g+ (only once per new high amount)
        if (value >= 50 && Math.floor(value) !== lastConfettiAmount) {
            lastConfettiAmount = Math.floor(value);
            setTimeout(() => triggerConfetti(), 300);
        }
    }

    elements.oneLiner.textContent = getOneLiner(tspEquivalent);
}

// Update unit toggle visual state
function updateUnitToggle() {
    elements.toggleBtns.forEach(btn => {
        if (btn.dataset.unit === state.currentUnit) {
            btn.classList.add('active');
            btn.setAttribute('aria-checked', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-checked', 'false');
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

// Share button
elements.shareBtn.addEventListener('click', shareResult);

// Like button - with Firebase
let hasLiked = localStorage.getItem('sugarLiked') === 'true';
let currentLikeCount = 0;

// Load initial like count and set up real-time listener
likesRef.on('value', (snapshot) => {
    const count = snapshot.val();
    currentLikeCount = count === null ? 0 : count;
    updateLikeDisplay();
});

function updateLikeDisplay() {
    elements.likeCount.textContent = currentLikeCount;

    if (hasLiked) {
        elements.likeBtn.classList.add('liked');
    } else {
        elements.likeBtn.classList.remove('liked');
    }
}

async function handleLike() {
    // Optimistic UI update
    if (!hasLiked) {
        // Like: increment
        hasLiked = true;
        localStorage.setItem('sugarLiked', 'true');
        likesRef.transaction((count) => (count || 0) + 1);
    } else {
        // Unlike: decrement
        hasLiked = false;
        localStorage.setItem('sugarLiked', 'false');
        likesRef.transaction((count) => Math.max(0, (count || 0) - 1));
    }
    updateLikeDisplay();
}

elements.likeBtn.addEventListener('click', handleLike);

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}

// ===== PWA INSTALL TRACKING =====
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';

    // Track install prompt shown
    if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install_prompt_shown', {
            'event_category': 'PWA',
            'event_label': 'install_prompt_shown'
        });
    }
});

installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
        // Track install accepted
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_installed', {
                'event_category': 'PWA',
                'event_label': 'installed'
            });
        }
    } else {
        // Track install dismissed
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_install_dismissed', {
                'event_category': 'PWA',
                'event_label': 'install_dismissed'
            });
        }
    }

    deferredPrompt = null;
    installBtn.style.display = 'none';
});

window.addEventListener('appinstalled', () => {
    // Track app installed event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_appinstalled', {
            'event_category': 'PWA',
            'event_label': 'app_installed_success'
        });
    }
    installBtn.style.display = 'none';
});

// Flip mode button
elements.flipBtn.addEventListener('click', () => {
    state.isReverseMode = !state.isReverseMode;

    // Update UI for mode
    if (state.isReverseMode) {
        elements.input.placeholder = `Enter ${state.currentUnit}`;
        elements.subtitle.textContent = 'Because grams are confusing';
        elements.stepper.textContent = '+ Add 1';
    } else {
        elements.input.placeholder = 'Enter grams';
        elements.subtitle.textContent = "Because '20 grams' means nothing";
        elements.stepper.textContent = '+ Add 5';
    }

    // Clear and refocus
    state.inputValue = '';
    elements.input.value = '';
    updateOutput();
    elements.input.focus();
});

// Initialize
loadPreferences();
updateUnitToggle();
elements.input.focus();
