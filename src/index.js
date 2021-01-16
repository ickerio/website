const canvas = document.getElementById('canvas')
const navbar = document.getElementById('navbar')
const menu =  document.getElementById('mobile-menu');
const menuToggle = document.getElementById('mobile-menu-toggle');
const menuOpen = document.getElementById('mobile-menu-open');
const menuClose =  document.getElementById('mobile-menu-closed');

menuToggle.addEventListener('click', async () => {
    [menu, menuOpen, menuClose].forEach(el => 
        el.classList.toggle('hidden')
    );
    navbar.classList.toggle('shadow-2xl');
});