const btn = document.getElementById('userMenuBtn');
const menu = document.getElementById('userMenu');

btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.add('hidden');
    }
});