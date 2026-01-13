(function() {
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
            } else {
                nav.style.backdropFilter = 'none';
                nav.style.webkitBackdropFilter = 'none';
                nav.style.background = 'linear-gradient(to bottom, var(--black) 0%, transparent 100%)';
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    };

    const init = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initScrollReveal();
                initSnapScroll();
                initEncryptEffect();
                initParallaxFooter();
                initNavGlassEffect();
            });
        } else {
            initScrollReveal();
            initSnapScroll();
            initEncryptEffect();
            initParallaxFooter();
            initNavGlassEffect();
        }
    };

    init();
})();

