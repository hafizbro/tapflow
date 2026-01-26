// --- FIREBASE CONFIGURATION & INIT (Compat Mode) ---
const firebaseConfig = {
    apiKey: "AIzaSyBkqlmjRHStXlzpvPA8baMjw5qSCiGg3QQ",
    authDomain: "tapflow-solutions.firebaseapp.com",
    projectId: "tapflow-solutions",
    storageBucket: "tapflow-solutions.firebasestorage.app",
    messagingSenderId: "1676801204",
    appId: "1:1676801204:web:ecb4eb73c2a01c04f993e1",
    measurementId: "G-0BJLR6MYTX"
};

// Initialize Firebase safely
let db;
try {
    if (typeof firebase !== 'undefined') {
        const app = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log("Firebase Initialized Successfully");
    } else {
        console.error("Firebase SDK not found!");
    }
} catch (error) {
    if (error.code === 'app/duplicate-app') {
        // If app already exists, just get the db
        db = firebase.firestore();
    } else {
        console.error("Firebase Init Error:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
        });

        // Close menu when a link is clicked
        const links = document.querySelectorAll('.nav-link, .btn');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
            });
        });
    }

    // 2. Sticky Navbar Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    // 4. Interactive Demo Logic
    window.showScreen = function (screenId) {
        document.querySelectorAll('.demo-screen-content').forEach(el => {
            el.classList.remove('active');
            el.style.display = 'none';
        });

        const target = document.getElementById(screenId);
        if (target) {
            target.style.display = 'flex';
            setTimeout(() => target.classList.add('active'), 10);
        }
    };

    window.handleRating = function (type) {
        if (type === 'good') {
            const googleReviewLink = "https://search.google.com/local/writereview?placeid=ChIJk7Q_TbcEwhURhUcJjk_50VU";
            window.open(googleReviewLink, '_blank');
        } else {
            window.showScreen('demo-feedback');
        }
    };

    function showInputError(input) {
        input.classList.remove('input-error');
        void input.offsetWidth;
        input.classList.add('input-error');
        input.focus();
    }

    window.submitWifiForm = function () {
        const input = document.querySelector('#demo-wifi-form input');
        if (input.value.trim() === "") {
            showInputError(input);
            return;
        }
        const btn = document.querySelector('#demo-wifi-form button.demo-btn-primary');
        const originalText = [];
        btn.childNodes.forEach(node => originalText.push(node.cloneNode(true)));

        btn.innerText = "Connecting...";

        setTimeout(() => {
            btn.innerHTML = '';
            originalText.forEach(node => btn.appendChild(node));
            window.showScreen('demo-wifi-success');
        }, 800);
    };

    window.submitFeedback = function () {
        const feedback = document.querySelector('#demo-feedback textarea');
        if (feedback.value.trim() === "") {
            showInputError(feedback);
            return;
        }
        const btn = document.querySelector('#demo-feedback button.demo-btn-primary');
        const originalText = btn.innerText;
        btn.innerText = "Sending...";

        setTimeout(() => {
            btn.innerText = originalText;
            feedback.value = "";
            window.showScreen('demo-feedback-success');
        }, 800);
    };

    window.copyPassword = function () {
        const passText = document.getElementById('wifi-pass').innerText;
        navigator.clipboard.writeText(passText).then(() => {
            const btn = document.querySelector('#demo-wifi-success button[onclick="copyPassword()"]');
            const originalText = btn.innerText;
            btn.innerText = "Copied!";
            setTimeout(() => btn.innerText = originalText, 2000);
        });
    };

    // 5. Pricing Calculator
    let currentStands = 5;
    let selectedStandType = 'standard';

    const standConfig = {
        standard: { baseFee: 2000, extraPerStand: 200, name: "Standard Acrylic" },
        premium: { baseFee: 2500, extraPerStand: 300, name: "Premium Wooden" }
    };

    window.selectStandType = function (type, element) {
        selectedStandType = type;
        document.querySelectorAll('.radio-option').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        updatePricing(0);
    };

    window.updatePricing = function (change) {
        let newCount = currentStands + change;
        if (newCount < 5) return;

        currentStands = newCount;
        const config = standConfig[selectedStandType];

        const counterEl = document.getElementById('stand-counter');
        if (counterEl) counterEl.innerText = currentStands;

        const featureTextEl = document.getElementById('feature-stand-text');
        if (featureTextEl) featureTextEl.innerText = currentStands;

        const extras = currentStands - 5;
        const totalSetup = config.baseFee + (extras * config.extraPerStand);

        const priceEl = document.getElementById('price-display');
        if (priceEl) priceEl.innerText = totalSetup.toLocaleString();

        const additionCostEl = document.getElementById('additional-cost-text');
        if (additionCostEl) {
            additionCostEl.innerText = `Additional stands: ${config.extraPerStand} BDT each`;
        }

        window.currentOrderDetails = {
            stands: currentStands,
            type: config.name,
            totalPrice: totalSetup
        };
    };

    // --- PAYMENT MODAL LOGIC ---
    window.copyBkashNumber = function () {
        const number = '01325886050';
        navigator.clipboard.writeText(number).then(() => {
            const btn = document.querySelector('.copy-btn');
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<span style="font-size:12px">Copied!</span>';
            setTimeout(() => {
                btn.innerHTML = originalIcon;
                lucide.createIcons();
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    window.openPaymentModal = function () {
        const modal = document.getElementById('payment-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closePaymentModal = function () {
        const modal = document.getElementById('payment-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    window.addEventListener('click', function (event) {
        const modal = document.getElementById('payment-modal');
        if (event.target === modal) {
            closePaymentModal();
        }
    });

    // --- CONFIRM PAYMENT LOGIC ---
    window.confirmPayment = async function () {
        const restInput = document.getElementById('restaurant-name-input');
        const ownerInput = document.getElementById('owner-name-input');
        const trxInput = document.getElementById('input-trxid');
        const phoneInput = document.getElementById('input-phone');

        const btn = document.querySelector('.btn-whatsapp-confirm');
        const originalBtnText = btn.innerHTML;

        const restName = restInput.value.trim();
        const ownerName = ownerInput.value.trim();
        const trxId = trxInput.value.trim();
        const phone = phoneInput.value.trim();

        // Validation
        let isValid = true;

        if (!restName) { restInput.style.borderColor = "#EF4444"; isValid = false; }
        else { restInput.style.borderColor = "#E5E7EB"; }

        if (!ownerName) { ownerInput.style.borderColor = "#EF4444"; isValid = false; }
        else { ownerInput.style.borderColor = "#E5E7EB"; }

        if (!phone || phone.length < 11) { phoneInput.style.borderColor = "#EF4444"; isValid = false; }
        else { phoneInput.style.borderColor = "#E5E7EB"; }

        if (!trxId || trxId.length < 5) { trxInput.style.borderColor = "#EF4444"; isValid = false; }
        else { trxInput.style.borderColor = "#E5E7EB"; }

        if (!isValid) {
            alert("Please fill in ALL fields correctly!");
            return;
        }

        const details = window.currentOrderDetails || { stands: 5, type: "Unknown", totalPrice: 0 };

        try {
            btn.disabled = true;
            btn.innerText = "Processing...";
            btn.style.opacity = "0.7";

            // Save to Firestore (Compat Method)
            if (db) {
                // Timeout after 5s
                const timeout = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Timeout")), 5000)
                );

                const saveOperation = db.collection("orders").add({
                    restaurant_name: restName,
                    owner_name: ownerName,
                    trx_id: trxId,
                    phone_number: phone,
                    package_type: details.type,
                    stands_count: details.stands,
                    amount: details.totalPrice,
                    status: "pending",
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });

                await Promise.race([saveOperation, timeout]);
                console.log("Order saved!");
            } else {
                console.warn("Firebase DB not initialized (Offline or Config Error).");
                await new Promise(r => setTimeout(r, 1000));
            }

        } catch (error) {
            console.error("Save error (redirecting anyway):", error);
        } finally {
            // Construct WhatsApp Message
            const msg = `Hi TapFlow, I am ${ownerName} from *${restName}*. \nPayment Sent! \nPhone: ${phone} \nTrxID: ${trxId} \nPlan: ${details.stands} Stands (${details.type}) \nPlease confirm my order.`;
            const url = `https://wa.me/8801316985443?text=${encodeURIComponent(msg)}`;

            // Redirect
            window.location.href = url;

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalBtnText;
                btn.style.opacity = "1";
                closePaymentModal();
            }, 1000);
        }
    };

    updatePricing(0);
});
