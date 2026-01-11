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

        const getDataButton = document.querySelector('.btn-primary');
        if (getDataButton) {
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
        }
    };

    const init = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initScrollReveal();
                initSnapScroll();
                initEncryptEffect();
            });
        } else {
            initScrollReveal();
            initSnapScroll();
            initEncryptEffect();
        }
    };

    init();
})();

