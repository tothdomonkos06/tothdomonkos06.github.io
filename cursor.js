// Eltávolítottuk a DOMContentLoaded wrappert, hogy biztosan lefusson, mivel a body legvégén van meghívva
(function() {
    // 1. Injektáljuk a CSS-t
    const style = document.createElement('style');
    style.innerHTML = `
        /* Elrejtjük az egeret csak azokon az eszközökön, ahol van valódi egér */
        @media (pointer: fine) {
            * {
                cursor: none !important;
            }
        }

        #custom-terminal-cursor {
            position: fixed;
            top: 0;
            left: 0;
            width: 12px;
            height: 24px;
            background-color: #4edea3; /* Primary zöld */
            pointer-events: none;
            z-index: 999999;
            animation: blink-cursor 1s step-end infinite;
            /* Eltávolítottuk a mix-blend-mode-ot a kompatibilitás és jobb láthatóság miatt */
            box-shadow: 0 0 10px rgba(78, 222, 163, 0.5); /* Kis neon fényháló */
            transition: height 0.2s, margin-top 0.2s, background-color 0.2s;
            margin-top: 0px;
        }

        @keyframes blink-cursor {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }

        /* Hover effektus: átalakul egy aláhúzássá */
        #custom-terminal-cursor.hover-active {
            height: 4px;
            margin-top: 20px; /* Lekerül alulra */
            background-color: #10b981;
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.8);
            animation: none; /* Nem villog ha elemen vagyunk */
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // 2. Létrehozzuk a kurzor HTML elemet
    const cursor = document.createElement('div');
    cursor.id = 'custom-terminal-cursor';
    
    // Csak akkor adjuk hozzá, ha asztali gépről van szó (ahol van egér)
    if (window.matchMedia('(pointer: fine)').matches) {
        document.body.appendChild(cursor);
    }

    // 3. Követjük az egér mozgását
    // A position: fixed miatt a clientX/Y tökéletesen megfelel, mert nem számít a scroll
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // +1 Interakció a kattintható elemekkel
    // Egy MutationObserver-rel vagy sima timeout-tal érdemes várni kicsit, ha dinamikus az oldal, de így is jó
    setTimeout(() => {
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [onclick], .cursor-pointer, .project-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover-active');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover-active');
            });
        });
    }, 500); // Kicsit várunk, hogy minden DOM elem renderelődjön
})();
