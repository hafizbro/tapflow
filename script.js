document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');

            // Optional: Animate icon
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('mobile-active')) {
                // simple switch to X is handled by lucide if we re-render, 
                // but for simplicity we'll just toggle the menu
            }
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

    // 3. Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    // 4. Interactive Demo Logic
    // 4. Interactive Demo Logic

    // Global function to switch screens
    window.showScreen = function (screenId) {
        // Hide all screens
        document.querySelectorAll('.demo-screen-content').forEach(el => {
            el.classList.remove('active');
            el.style.display = 'none'; // Ensure display none is applied
        });

        // Show target screen
        const target = document.getElementById(screenId);
        if (target) {
            target.style.display = 'flex'; // Force flex display
            // Small delay to allow display:flex to apply before adding opacity class if we wanted fade
            setTimeout(() => target.classList.add('active'), 10);
        }
    };

    window.handleRating = function (type) {
        if (type === 'good') {
            // Redirect to Google Review Logic
            // In a real app, this would be a real link. using the user provided link
            const googleReviewLink = "https://search.google.com/local/writereview?placeid=ChIJk7Q_TbcEwhURhUcJjk_50VU";
            window.open(googleReviewLink, '_blank');
        } else {
            // Show Feedback Form
            window.showScreen('demo-feedback');
        }
    };

    // Helper for validation error
    function showInputError(input) {
        input.classList.remove('input-error');
        // Trigger reflow to restart animation
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
        // Simulate API loading
        // Updated selector to match the new class name
        const btn = document.querySelector('#demo-wifi-form button.demo-btn-primary');
        const originalText = [];
        // Store original content including icon
        btn.childNodes.forEach(node => originalText.push(node.cloneNode(true)));

        btn.innerText = "Connecting...";

        setTimeout(() => {
            btn.innerHTML = ''; // Clear text
            originalText.forEach(node => btn.appendChild(node)); // Restore original content
            window.showScreen('demo-wifi-success');
        }, 800);
    };

    window.submitFeedback = function () {
        const feedback = document.querySelector('#demo-feedback textarea');
        if (feedback.value.trim() === "") {
            showInputError(feedback);
            return;
        }

        // Simulate API loading
        const btn = document.querySelector('#demo-feedback button.demo-btn-primary');
        const originalText = btn.innerText;
        btn.innerText = "Sending...";

        setTimeout(() => {
            btn.innerText = originalText;
            feedback.value = ""; // Reset form
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

    // 5. Pricing Calculator Logic (Growth Partner Plan)
    // 5. Pricing Calculator Logic (Growth Partner Plan)
    let currentStands = 5;
    let selectedStandType = 'standard'; // 'standard' or 'premium'

    const standConfig = {
        standard: {
            baseFee: 2000,
            extraPerStand: 200,
            name: "Standard Acrylic"
        },
        premium: {
            baseFee: 2500,
            extraPerStand: 300,
            name: "Premium Wooden"
        }
    };

    // Handle Stand Selection
    window.selectStandType = function (type, element) {
        selectedStandType = type;

        // UI Selection Logic
        document.querySelectorAll('.radio-option').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');

        // Trigger recalc
        updatePricing(0);
    };

    window.updatePricing = function (change) {
        let newCount = currentStands + change;
        if (newCount < 5) return; // Minimum limit

        currentStands = newCount;
        const config = standConfig[selectedStandType];

        // 1. Update Counter Display
        const counterEl = document.getElementById('stand-counter');
        if (counterEl) counterEl.innerText = currentStands;

        // 2. Update Feature List Text
        const featureTextEl = document.getElementById('feature-stand-text');
        if (featureTextEl) featureTextEl.innerText = currentStands;

        // 3. Calculate & Update Price (Setup Fee)
        // Formula: BaseFee + (extras * PerUnit)
        const extras = currentStands - 5;
        const totalSetup = config.baseFee + (extras * config.extraPerStand);

        const priceEl = document.getElementById('price-display');
        if (priceEl) priceEl.innerText = totalSetup.toLocaleString();

        // 4. Update additional cost text
        const additionCostEl = document.getElementById('additional-cost-text');
        if (additionCostEl) {
            additionCostEl.innerText = `Additional stands: ${config.extraPerStand} BDT each`;
        }

        // 5. Update WhatsApp Link
        const btn = document.getElementById('whatsapp-link');
        if (btn) {
            const msg = `Hi TapFlow, I want the Growth Partner Plan with ${currentStands} ${config.name} stands. One-time fee: ${totalSetup} BDT.`;
            btn.href = `https://wa.me/8801316985443?text=${encodeURIComponent(msg)}`;
        }
    };

    // Initialize on Load
    // We call it with 0 change just to ensure link is set correctly on load
    updatePricing(0);

    window.openWhatsApp = function () {
        // Fallback or specific analytics tracking if needed
    };
});
