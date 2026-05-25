class SiteHeader extends HTMLElement {
    connectedCallback() {
        // A custom element alapból inline, így a sticky pozíció nem működik rajta. 
        // Blokk szintűvé kell tenni, és magát az elemet sticky-vé tenni.
        this.style.display = 'block';
        this.style.position = 'sticky';
        this.style.top = '0';
        this.style.zIndex = '50';

        this.innerHTML = `
<nav style="background-color: rgba(12, 19, 36, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);" class="border-b border-outline-variant w-full">
<div class="flex justify-between items-center w-full px-margin md:px-gutter max-w-screen-xl mx-auto h-20">
<div class="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
                Tóth Domonkos
            </div>
<ul class="hidden md:flex items-center gap-margin">
<li><a class="nav-link font-code-md text-code-md" data-page="index.html" href="index.html">Home</a></li>
<li><a class="nav-link font-code-md text-code-md" data-page="portfolio.html" href="portfolio.html">Portfolio</a></li>
<li><a class="nav-link font-code-md text-code-md" data-page="aboutme.html" href="aboutme.html">About</a></li>
<li>
<a class="nav-link font-code-md text-code-md" data-page="contact.html" href="contact.html">Contact</a>
</li>
</ul>
<div class="flex items-center gap-gutter">
<a href="https://www.linkedin.com/in/domonkos-t%C3%B3th/" target="_blank" rel="noopener noreferrer" class="hidden md:inline-block bg-primary text-background font-label-sm text-label-sm px-sm py-xs rounded hover:bg-primary-container transition-all hover:scale-105 active:scale-95">
                    Hire Me
                </a>
<button id="mobile-menu-btn" class="md:hidden text-on-surface hover:text-primary transition-colors">
<span class="material-symbols-outlined">menu</span>
</button>
</div>
</div>
<!-- Mobile Menu Dropdown -->
<div id="mobile-menu" class="hidden md:hidden absolute top-20 left-0 w-full bg-surface-container-low border-b border-outline-variant shadow-lg flex-col py-md z-40 gap-xs">
    <a href="index.html" class="mobile-nav-link px-gutter py-sm font-code-md text-code-md" data-page="index.html">Home</a>
    <a href="portfolio.html" class="mobile-nav-link px-gutter py-sm font-code-md text-code-md" data-page="portfolio.html">Portfolio</a>
    <a href="aboutme.html" class="mobile-nav-link px-gutter py-sm font-code-md text-code-md" data-page="aboutme.html">About</a>
    <a href="contact.html" class="mobile-nav-link px-gutter py-sm font-code-md text-code-md" data-page="contact.html">Contact</a>
    <a href="https://www.linkedin.com/in/domonkos-tóth/" target="_blank" rel="noopener noreferrer" class="mx-gutter mt-sm bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase px-sm py-xs rounded text-center">Hire Me</a>
</div>
</nav>
        `;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        const desktopLinks = this.querySelectorAll('.nav-link');
        desktopLinks.forEach(link => {
            if (link.getAttribute('data-page') === currentPage || (currentPage === '' && link.getAttribute('data-page') === 'index.html')) {
                link.className += " text-primary border-b-2 border-primary pb-1 scale-95 transition-transform duration-200";
            } else {
                link.className += " text-on-surface-variant hover:text-primary transition-colors duration-200";
            }
        });

        const mobileLinks = this.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            if (link.getAttribute('data-page') === currentPage || (currentPage === '' && link.getAttribute('data-page') === 'index.html')) {
                link.className += " text-primary border-l-4 border-primary bg-primary/10";
            } else {
                link.className += " text-on-surface-variant hover:bg-surface-container-highest border-l-4 border-transparent";
            }
        });

        const btn = this.querySelector('#mobile-menu-btn');
        const menu = this.querySelector('#mobile-menu');
        if (btn && menu) {
            btn.addEventListener('click', () => {
                menu.classList.toggle('hidden');
                menu.classList.toggle('flex');
            });
        }
    }
}

customElements.define('site-header', SiteHeader);

class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
<footer class="bg-surface-container-low border-t border-outline-variant w-full mt-auto">
<div class="flex flex-col md:flex-row justify-between items-center w-full py-xl px-margin md:px-gutter max-w-screen-xl mx-auto gap-base">
<div class="font-headline-md text-headline-md font-bold text-on-surface">
                Tóth Domonkos
            </div>
<div class="font-body-md text-body-md text-on-surface-variant">
                © 2026 Tóth Domonkos. Engineered for Performance.
            </div>
<ul class="flex items-center gap-gutter">
<li><a class="font-code-md text-code-md text-on-surface-variant hover:text-primary underline decoration-1 underline-offset-4 transition-all hover:-translate-y-0.5 duration-200" href="https://www.linkedin.com/in/domonkos-tóth/" target="_blank">LinkedIn</a></li>
<li><a class="font-code-md text-code-md text-on-surface-variant hover:text-primary underline decoration-1 underline-offset-4 transition-all hover:-translate-y-0.5 duration-200" href="https://github.com/tothdomonkos06" target="_blank">GitHub</a></li>
<li><a class="font-code-md text-code-md text-on-surface-variant hover:text-primary underline decoration-1 underline-offset-4 transition-all hover:-translate-y-0.5 duration-200" href="mailto:tothdomonkos06@gmail.com">Email</a></li>
</ul>
</div>
</footer>
        `;
    }
}

customElements.define('site-footer', SiteFooter);
