document.addEventListener('DOMContentLoaded', () => {
    // 1. Injektáljuk a CSS-t, ami elrejti a gyári kurzort és formázza a miénket
    const style = document.createElement('style');
    style.innerHTML = `
        /* Elrejtjük az alapértelmezett egeret mindenhol */
        * {
            cursor: none !important;
        }

        /* A custom terminál kurzor stílusai */
        #custom-terminal-cursor {
            position: fixed;
            top: 0;
            left: 0;
            width: 12px;       /* Terminál kurzor szélessége */
            height: 24px;      /* Terminál kurzor magassága */
            background-color: #4edea3; /* A primary zöld színünk */
            pointer-events: none; /* Ne blokkolja a kattintásokat */
            z-index: 999999;   /* Legyen mindig legfelül */
            animation: blink-cursor 1s step-end infinite; /* Szempillantó (villogó) effekt */
            mix-blend-mode: difference; /* Jól néz ki világos és sötét felületen is, invertálja a színeket alatta */
            transform-origin: top left;
        }

        /* Villogó animáció */
        @keyframes blink-cursor {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }

        /* Ha valami kattintható dolog fölé visszük, picit megváltozhat (pl. alacsonyabb lesz, mint az _ karakter) */
        #custom-terminal-cursor.hover-active {
            height: 4px;
            transform: translateY(20px); /* Lekerül alulra, mint egy aláhúzás */
        }
    `;
    document.head.appendChild(style);

    // 2. Létrehozzuk magát a kurzor HTML elemet (egy div-et)
    const cursor = document.createElement('div');
    cursor.id = 'custom-terminal-cursor';
    document.body.appendChild(cursor);

    // 3. Követjük az egér mozgását és mozgatjuk a div-et
    document.addEventListener('mousemove', (e) => {
        // Translate3D-t használunk a hardveres gyorsítás (jobb teljesítmény) érdekében
        // Az x és y koordináták pontosan az egér hegyéhez igazítják a doboz bal felső sarkát
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // +1 Interakció a kattintható elemekkel (gombok, linkek)
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [onclick], .cursor-pointer, .project-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover-active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover-active');
        });
    });
});
