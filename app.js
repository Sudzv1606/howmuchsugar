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
    likeCount: document.getElementById('likeCount'),
    dailyTip: document.getElementById('dailyTip'),
    tipText: document.getElementById('tipText'),
    tipDismiss: document.getElementById('tipDismiss'),
    tipNext: document.getElementById('tipNext'),
    notifyBtn: document.getElementById('notifyBtn')
};

// ===== SUGAR TIPS =====
const sugarTips = [
    "A can of Coca-Cola has 39g of sugar = 9+ teaspoons!",
    "Your 'healthy' granola might have 8 teaspoons of sugar per serving.",
    "A Starbucks Frappuccino can have 50g+ sugar = 12 teaspoons!",
    "Fruit juice has as much sugar as soda. Eat the fruit instead!",
    "A 'sugar-free' label might mean artificial sweeteners, not healthy.",
    "WHO recommends max 6 teaspoons (25g) of added sugar per day.",
    "A single glazed donut has about 10g of sugar = 2+ teaspoons.",
    "Ketchup is 25% sugar. A tablespoon has 1 teaspoon of sugar!",
    'Yogurt, especially flavored, can have 15g+ sugar per serving.',
    "A mango smoothie might have 50g+ sugar from fruit alone.",
    "Barbecue sauce is often 50% sugar by weight.",
    "A serving of dried fruit has much more sugar than fresh fruit.",
    'Sports drinks are designed for athletes, not everyday hydration.',
    "A bowl of fruit-flavored cereal may have 10g+ sugar per serving.",
    "Apple juice has more sugar than a soda in many cases.",
    "Pasta sauce can hide 10g+ sugar per serving.",
    "Energy drinks often have 50g+ sugar = 12 teaspoons!",
    "Frozen yogurt has just as much sugar as regular ice cream.",
    "A slice of cake can have 30g+ sugar = 7+ teaspoons.",
    "Flavored oatmeal packets have 12g+ sugar = 3 teaspoons.",
    "A mocha latte has 20g+ sugar = 5 teaspoons.",
    "Protein bars can have 15g+ sugar - check the label!",
    "Sweet tea has 20g+ sugar per glass.",
    "A margarita has 30g+ sugar = 7+ teaspoons.",
    "Pancake syrup is almost pure sugar - 1/4 cup = 12 teaspoons!",
    "A chocolate chip muffin has 20g+ sugar = 5 teaspoons.",
    "Vitamin water is just sugar water with 30g+ per bottle.",
    "A breakfast pastry has 15g+ sugar = 3+ teaspoons.",
    "Honey is 82% sugar - healthier, but still sugar!",
    "Agave syrup has more fructose than high fructose corn syrup.",
    "Maple syrup is 67% sugar - use sparingly!",
    "A serving of teriyaki sauce has 10g+ sugar.",
    "Smoothie bowls can have 50g+ sugar from toppings alone.",
    "A chocolate croissant has 10g+ sugar.",
    "Sweetened almond milk has 15g+ sugar per cup.",
    "Frozen waffles have 5g+ sugar each.",
    "Cocktail mixers are often 90% sugar.",
    "A serving of cranberry juice has 30g+ sugar.",
    "Iced coffee drinks can have 25g+ sugar.",
    "Bubble tea bobs are cooked in sugar syrup - 30g+ per drink!",
    "A slice of pie has 30g+ sugar = 7+ teaspoons.",
    "Whipped cream has 3g sugar per 2 tablespoons.",
    "Canned fruit in syrup has double the sugar of fresh.",
    "A glass of orange juice has 20g+ sugar.",
    "Sweet chili sauce has 10g+ sugar per tablespoon.",
    "Hoisin sauce is 25% sugar.",
    "A fruit roll-up has 10g+ sugar.",
    "Chocolate milk has 25g+ sugar per cup.",
    "A cronut has 20g+ sugar.",
    "Gatorade has 34g sugar per bottle.",
    "A blizzard treat can have 80g+ sugar = 19 teaspoons!",
    "Red Bull has 27g sugar = 6+ teaspoons.",
    "A PSL has 50g+ sugar before whipped cream!",
    "Sweet pickle relish has 10g+ sugar per serving.",
    "Honey mustard dressing has 10g+ sugar per 2 tbsp."
];

// ===== DAILY TIP SYSTEM =====
let currentTipIndex = 0;
let tipDismissedThisSession = false;
const TIPS_STORAGE_KEY = 'sugarTips_data';
const NOTIFICATION_STORAGE_KEY = 'sugarTips_notification';

// Get today's date string
function getTodayKey() {
    return new Date().toDateString();
}

// Get or initialize tip data
function getTipData() {
    const stored = localStorage.getItem(TIPS_STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with random start index
    return {
        date: getTodayKey(),
        index: Math.floor(Math.random() * sugarTips.length)
    };
}

// Save tip data
function saveTipData(data) {
    localStorage.setItem(TIPS_STORAGE_KEY, JSON.stringify(data));
}

// Get today's tip (changes daily)
function getTodayTip() {
    const data = getTipData();

    // If it's a new day, pick a new tip
    if (data.date !== getTodayKey()) {
        data.date = getTodayKey();
        data.index = Math.floor(Math.random() * sugarTips.length);
        saveTipData(data);
    }

    currentTipIndex = data.index;
    return sugarTips[currentTipIndex];
}

// Show daily tip card
function showDailyTip() {
    const tip = getTodayTip();

    // Don't show if already dismissed this session (resets on refresh)
    if (tipDismissedThisSession) {
        elements.dailyTip.style.display = 'none';
        return;
    }

    elements.tipText.textContent = tip;
    elements.dailyTip.style.display = 'block';

    // Track tip view
    if (typeof gtag !== 'undefined') {
        gtag('event', 'daily_tip_viewed', {
            'event_category': 'Tips',
            'event_label': 'tip_shown'
        });
    }
}

// Dismiss tip (only for this session - resets on refresh)
function dismissTip() {
    tipDismissedThisSession = true;
    elements.dailyTip.style.display = 'none';

    // Track tip dismissed
    if (typeof gtag !== 'undefined') {
        gtag('event', 'daily_tip_dismissed', {
            'event_category': 'Tips',
            'event_label': 'tip_dismissed'
        });
    }
}

// Show next tip (immediately, doesn't change daily tip)
function showNextTip() {
    currentTipIndex = (currentTipIndex + 1) % sugarTips.length;
    elements.tipText.textContent = sugarTips[currentTipIndex];

    // Track next tip click
    if (typeof gtag !== 'undefined') {
        gtag('event', 'daily_tip_next', {
            'event_category': 'Tips',
            'event_label': 'next_tip_clicked'
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
let notificationPermission = 'default';

// Check notification permission status
function checkNotificationPermission() {
    if (!('Notification' in window)) {
        return 'unsupported';
    }
    return Notification.permission;
}

// Request notification permission
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        alert('Notifications are not supported in your browser.');
        return false;
    }

    const permission = await Notification.requestPermission();
    notificationPermission = permission;

    if (permission === 'granted') {
        updateNotifyButton(true);

        // Track notification granted
        if (typeof gtag !== 'undefined') {
            gtag('event', 'notification_granted', {
                'event_category': 'Notifications',
                'event_label': 'permission_granted'
            });
        }

        // Show first notification immediately
        showDailyNotification();

        return true;
    } else {
        // Track notification denied
        if (typeof gtag !== 'undefined') {
            gtag('event', 'notification_denied', {
                'event_category': 'Notifications',
                'event_label': 'permission_denied'
            });
        }
        return false;
    }
}

// Update notify button state
function updateNotifyButton(enabled) {
    if (enabled) {
        elements.notifyBtn.classList.add('notify-enabled');
        elements.notifyBtn.querySelector('.quick-text').textContent = 'Tips On 🔔';
    } else {
        elements.notifyBtn.classList.remove('notify-enabled');
        elements.notifyBtn.querySelector('.quick-text').textContent = 'Daily Tips';
    }
}

// Show daily notification (once per day)
function showDailyNotification() {
    if (notificationPermission !== 'granted') return;

    const notifData = JSON.parse(localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '{}');
    const today = getTodayKey();

    // Check if already shown today
    if (notifData.date === today) return;

    // Get today's tip
    const tip = getTodayTip();

    // Show notification
    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('🥄 Daily Sugar Tip', {
                body: tip,
                icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 192 192%22><rect width=%22192%22 height=%22192%22 fill=%22%23ff6b6b%22 rx=%2242%22/><text x=%2250%25%22 y=%2255%25%22 font-size=%2296%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22>🥄</text></svg>',
                badge: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 72 72%22><rect width=%2272%22 height=%2272%22 fill=%22%23ff6b6b%22 rx=%2216%22/><text x=%2250%25%22 y=%2255%25%22 font-size=%2236%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22>🥄</text></svg>',
                tag: 'daily-sugar-tip',
                requireInteraction: false,
                silent: false
            });
        });
    } else {
        // Fallback for no service worker
        new Notification('🥄 Daily Sugar Tip', {
            body: tip,
            icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 192 192%22><rect width=%22192%22 height=%22192%22 fill=%22%23ff6b6b%22 rx=%2242%22/><text x=%2250%25%22 y=%2255%25%22 font-size=%2296%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22>🥄</text></svg>'
        });
    }

    // Mark as shown for today
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify({ date: today }));

    // Track notification sent
    if (typeof gtag !== 'undefined') {
        gtag('event', 'daily_notification_sent', {
            'event_category': 'Notifications',
            'event_label': 'notification_delivered'
        });
    }
}

// Initialize notifications
function initNotifications() {
    // Check current permission
    notificationPermission = checkNotificationPermission();

    // Update button if already granted
    if (notificationPermission === 'granted') {
        updateNotifyButton(true);
        // Try to show today's notification
        showDailyNotification();
    }

    // Handle notification button click
    elements.notifyBtn.addEventListener('click', () => {
        if (notificationPermission === 'granted') {
            // Already enabled - maybe show a tip now
            showDailyTip();
            showDailyNotification();
        } else {
            requestNotificationPermission();
        }
    });

    // Handle notification click (open app)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data === 'notification-clicked') {
                showDailyTip();
            }
        });
    }
}

// Tip event listeners
elements.tipDismiss.addEventListener('click', dismissTip);
elements.tipNext.addEventListener('click', showNextTip);

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

    // Show daily tip when results are displayed
    showDailyTip();
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
initNotifications();
updateUnitToggle();
elements.input.focus();
