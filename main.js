(function () {
    'use strict';

    const initScrollReveal = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.8s ease-out';
            observer.observe(section);
        });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.opacity = '1';
            heroSection.style.transform = 'translateY(0)';
        }
    };

    const initSnapScroll = () => {
        let lastScrollTop = 0;
        let isScrolling = false;

        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (!isScrolling) {
                isScrolling = true;

                if (scrollTop > lastScrollTop) {
                    document.documentElement.classList.remove('no-snap-up');
                } else {
                    document.documentElement.classList.add('no-snap-up');
                }

                lastScrollTop = scrollTop;

                setTimeout(() => {
                    isScrolling = false;
                }, 100);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    const initEncryptEffect = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];

        const encryptText = (element, originalText, duration = 2000) => {
            const iterations = 20;
            let iteration = 0;
            const interval = duration / iterations;

            const animate = () => {
                if (iteration >= iterations) {
                    element.textContent = originalText;
                    return;
                }

                const progress = iteration / iterations;
                const revealedLength = Math.floor(originalText.length * progress);
                const encryptedLength = originalText.length - revealedLength;

                let newText = '';
                for (let i = 0; i < originalText.length; i++) {
                    if (i < revealedLength) {
                        newText += originalText[i];
                    } else if (originalText[i] === ' ') {
                        newText += ' ';
                    } else {
                        newText += getRandomChar();
                    }
                }

                element.textContent = newText;
                iteration++;
                setTimeout(animate, interval);
            };

            animate();
        };

        const getDataButtons = document.querySelectorAll('.btn-primary');
        getDataButtons.forEach(getDataButton => {
            const originalText = getDataButton.textContent;
            let isAnimating = false;

            getDataButton.addEventListener('mouseenter', () => {
                if (!isAnimating) {
                    isAnimating = true;
                    encryptText(getDataButton, originalText, 800);
                    setTimeout(() => {
                        isAnimating = false;
                    }, 800);
                }
            });
        });

        const showCopyToast = () => {
            const contactEmailButton = document.querySelector('.contact-email');
            if (!contactEmailButton) return;

            let toast = contactEmailButton.querySelector('.copy-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.className = 'copy-toast';
                toast.textContent = 'EMAIL COPIED';
                contactEmailButton.appendChild(toast);
            }

            toast.classList.remove('show');
            void toast.offsetWidth;
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 1200);
        };

        const contactEmailButton = document.querySelector('.contact-email');
        if (contactEmailButton) {
            contactEmailButton.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const email = 'hello@kinotekina.com';

                try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(email);
                        showCopyToast();
                    } else {
                        const textArea = document.createElement('textarea');
                        textArea.value = email;
                        textArea.style.position = 'fixed';
                        textArea.style.left = '-999999px';
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        showCopyToast();
                    }
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            });
        }
    };

    const initParallaxFooter = () => {
        const footerLogo = document.querySelector('.contact-footer-logo');
        if (!footerLogo) return;

        const handleScroll = () => {
            const contactSection = document.querySelector('.contact-section');
            if (!contactSection) return;

            const rect = contactSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;

            if (sectionTop < windowHeight && sectionBottom > 0) {
                const scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight * 0.8)));
                const parallaxOffset = (1 - scrollProgress) * 300;
                const opacity = Math.min(0.12, scrollProgress * 0.15);

                footerLogo.style.transform = `translateY(${parallaxOffset}px)`;
                footerLogo.style.opacity = opacity;

                if (scrollProgress > 0.2) {
                    footerLogo.classList.add('visible');
                } else {
                    footerLogo.classList.remove('visible');
                }
            } else if (sectionTop >= windowHeight) {
                footerLogo.style.transform = 'translateY(200px)';
                footerLogo.style.opacity = '0';
                footerLogo.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    };

    const initNavGlassEffect = () => {
        const nav = document.querySelector('nav');
        const headerSection = document.querySelector('.header-section');
        if (!nav || !headerSection) return;

        const handleScroll = () => {
            const headerRect = headerSection.getBoundingClientRect();
            const headerBottom = headerRect.bottom;
            const windowHeight = window.innerHeight;

            if (headerBottom <= 0) {
                const scrollPast = Math.abs(headerBottom);
                const maxScroll = windowHeight * 0.5;
                const progress = Math.min(1, scrollPast / maxScroll);

                const blur = progress * 12;
                const opacity = 0.3 + (progress * 0.5);
                const bgAlpha = Math.min(0.85, opacity);

                nav.style.backdropFilter = `blur(${blur}px)`;
                nav.style.webkitBackdropFilter = `blur(${blur}px)`;
                nav.style.background = `rgba(10, 10, 10, ${bgAlpha})`;
                nav.classList.add('scrolled');
            } else {
                nav.style.backdropFilter = 'none';
                nav.style.webkitBackdropFilter = 'none';
                nav.style.background = 'linear-gradient(to bottom, var(--black) 0%, transparent 100%)';
                nav.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    };

    const initProblemSectionBgTransition = () => {
        const problemSection = document.querySelector('.red-section');
        const servicesSection = document.querySelector('#services');
        if (!problemSection || !servicesSection) return;

        // Create a style element to control the ::before pseudo-element
        let styleElement = document.getElementById('problem-bg-transition-style');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'problem-bg-transition-style';
            document.head.appendChild(styleElement);
        }

        const handleScroll = () => {
            const problemRect = problemSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const windowTop = window.scrollY || window.pageYOffset;

            const problemTop = problemRect.top;
            const problemBottom = problemRect.bottom;
            const problemHeight = problemRect.height;

            let progress = 0;

            // Calculate when section is entering, in view, or leaving
            if (problemTop < windowHeight && problemBottom > 0) {
                // Section is in or entering viewport
                if (problemTop >= 0) {
                    // Entering from bottom - fade in
                    // Start fading when top enters viewport, complete when top reaches 0
                    const fadeInStart = windowHeight;
                    const fadeInEnd = 0;
                    const fadeInDistance = fadeInStart - fadeInEnd;
                    const currentDistance = problemTop - fadeInEnd;
                    progress = Math.max(0, Math.min(1, 1 - (currentDistance / fadeInDistance)));
                } else if (problemBottom <= windowHeight) {
                    // Leaving from top - fade out
                    // Start fading when bottom reaches viewport height, complete when bottom reaches 0
                    const fadeOutStart = windowHeight;
                    const fadeOutEnd = 0;
                    const fadeOutDistance = fadeOutStart - fadeOutEnd;
                    const currentDistance = problemBottom - fadeOutEnd;
                    progress = Math.max(0, Math.min(1, currentDistance / fadeOutDistance));
                } else {
                    // Fully in viewport - fully visible
                    progress = 1;
                }
            } else {
                // Section is out of viewport
                progress = 0;
            }

            // Update the style element to control ::before opacity
            styleElement.textContent = `
                .red-section::before {
                    opacity: ${progress} !important;
                }
            `;

            if (progress > 0) {
                problemSection.classList.add('bg-transitioning');
            } else {
                problemSection.classList.remove('bg-transitioning');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    };

    const initServiceCardsAnimation = () => {
        const servicesSection = document.querySelector('#services');
        const serviceCards = document.querySelectorAll('.service-card');

        if (!servicesSection || serviceCards.length === 0) return;

        let cardsAnimated = false;

        const animateCards = () => {
            if (cardsAnimated) return;
            cardsAnimated = true;

            serviceCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 150); // 150ms delay between each card (faster)
            });
        };

        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCards();
                }
            });
        }, observerOptions);

        observer.observe(servicesSection);
    };

    const initProblemSectionLinesAnimation = () => {
        const problemSection = document.querySelector('.red-section');
        const approaches = document.querySelectorAll('.approach');

        if (!problemSection || approaches.length === 0) return;

        let linesAnimated = false;

        const animateLines = () => {
            if (linesAnimated) return;
            linesAnimated = true;

            // First animate vertical line
            problemSection.classList.add('animate-vertical-line');

            // Then animate horizontal lines sequentially after vertical line completes
            setTimeout(() => {
                approaches.forEach((approach, index) => {
                    setTimeout(() => {
                        approach.classList.add('animate-line');
                    }, index * 200); // 200ms delay between each horizontal line
                });
            }, 800); // Wait for vertical line animation to complete (0.8s)
        };

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateLines();
                }
            });
        }, observerOptions);

        observer.observe(problemSection);
    };

    const init = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initScrollReveal();
                initSnapScroll();
                initEncryptEffect();
                initParallaxFooter();
                initNavGlassEffect();
                initProblemSectionBgTransition();
                initServiceCardsAnimation();
                initProblemSectionLinesAnimation();
            });
        } else {
            initScrollReveal();
            initSnapScroll();
            initEncryptEffect();
            initParallaxFooter();
            initNavGlassEffect();
            initProblemSectionBgTransition();
            initServiceCardsAnimation();
            initProblemSectionLinesAnimation();
        }
    };

    init();
})();

