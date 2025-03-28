document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-in-out-quad'
    });

    // Smooth scroll
    $('a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top
        }, 800, 'easeInOutExpo');
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.backdropFilter = 'none';
        }
    });

    // Language Toggle
	const languageToggle = document.getElementById('languageToggle');
	const languageDropdown = document.getElementById('languageDropdown');

	languageToggle.addEventListener('click', function(e) {
		e.stopPropagation();
		languageDropdown.style.display = 
			languageDropdown.style.display === 'block' ? 'none' : 'block';
	});

	document.addEventListener('click', function(e) {
		if (!e.target.closest('.language-wrapper')) {
			languageDropdown.style.display = 'none';
		}
	});

    function changeLanguage(lang) {
        // This is a basic implementation. For a full multilingual site, 
        // you'd want a more comprehensive translation system
        document.documentElement.lang = lang;
        const elements = {
            'tr': {
                '.navbar-brand': 'AppleFavour',
                '.btn-community': 'Destek Topluluğu',
                '.btn-ipa': 'Modifiye IPA Dosyaları',
                '.section-title': 'Apple Cihaz Sertifikası',
                '.btn-purchase': 'Sertifikanı Şimdi Al'
            },
            'en': {
                '.navbar-brand': 'AppleFavour',
                '.btn-community': 'Support Community',
                '.btn-ipa': 'Modded IPA Files',
                '.section-title': 'Apple Device Certificate',
                '.btn-purchase': 'Get Your Certificate Now'
            }
        };

        Object.keys(elements[lang]).forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = elements[lang][selector];
            }
        });
    }

    // Theme Toggle
    const themeToggleMoon = document.getElementById('themeToggle');
    const themeToggleSun = document.getElementById('themeToggleLight');
    const body = document.body;

    // Default to dark theme
    body.classList.add('dark-theme');

    themeToggleMoon.addEventListener('click', function() {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeToggleMoon.style.display = 'none';
        themeToggleSun.style.display = 'block';
    });

    themeToggleSun.addEventListener('click', function() {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeToggleSun.style.display = 'none';
        themeToggleMoon.style.display = 'block';
    });

    // Purchase button animation
    document.querySelectorAll('.btn-purchase').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Typing Effect
const phrases = [
    "bir Apple Topluluğuyuz.", 
    "bir aileyiz.",
];
let index = 0;
let isDeleting = false;
let text = '';

function type() {
    const currentPhrase = phrases[index];
    const typingElement = document.getElementById('typing');
    
    if (isDeleting) {
        text = currentPhrase.substring(0, text.length - 1);
    } else {
        text = currentPhrase.substring(0, text.length + 1);
    }

    typingElement.textContent = text;

    let typeSpeed = 100;
    if (isDeleting) typeSpeed /= 2;

    if (!isDeleting && text === currentPhrase) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && text === '') {
        isDeleting = false;
        index = (index + 1) % phrases.length;
    }

    setTimeout(type, typeSpeed);
}

// Start the typing effect
type();

document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        const isActive = button.classList.toggle('active');
        
        content.classList.toggle('active');
        
        if(isActive) {
            content.style.maxHeight = content.scrollHeight + 'px';
        } else {
            content.style.maxHeight = null;
        }
    });
});

// Footer  
$(document).ready(function() {
    // Smooth social icon hover animations
    $('.social-icon').hover(
        function() {
            $(this).css('transform', 'scale(1.1)');
        },
        function() {
            $(this).css('transform', 'scale(1)');
        }
    );

    // Add subtle fade-in animation to footer
    $('.site-footer').css('opacity', 0).animate({ opacity: 1 }, 1000);
});