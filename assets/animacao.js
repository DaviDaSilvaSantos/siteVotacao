/* Abertura: a logo aparece grande no centro, espera 2s e volta ao lugar;
   o texto sobe de baixo e a área de voto entra (pela direita no desktop, por baixo no celular). */
(function () {
    var raiz = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ESPERA = 2000;   // tempo da logo parada no centro (ms)
    var DURACAO = 1000;  // duração da transição de volta (ms) - mesmo valor do CSS
    var x = 0, y = 0, escala = 1;

    raiz.classList.add('intro', 'animando');

    function encerrar() {
        clearTimeout(seguranca);
        raiz.classList.remove('intro', 'intro-pronta', 'saindo', 'animando');
    }
    // Segurança: se algo falhar, a página nunca fica escondida
    var seguranca = setTimeout(encerrar, 8000);

    // Calcula quanto mover e ampliar a logo para ela ficar grande no centro da tela
    function posicionar(logo) {
        var r = logo.getBoundingClientRect();
        var largura = r.width / escala, altura = r.height / escala;
        var cx = r.left + r.width / 2 - x, cy = r.top + r.height / 2 - y;
        var vw = raiz.clientWidth, vh = window.innerHeight;
        var grande = Math.min(vw * 0.8, 736, vh * 0.6 * (largura / altura));
        escala = grande / largura;
        x = vw / 2 - cx;
        y = vh / 2 - cy;
        raiz.style.setProperty('--logo-escala', escala);
        raiz.style.setProperty('--logo-x', x + 'px');
        raiz.style.setProperty('--logo-y', y + 'px');
    }

    function iniciar() {
        var logo = document.querySelector('.logo');
        if (!logo) { encerrar(); return; }
        var fontes = document.fonts ? document.fonts.ready : Promise.resolve();
        var imagem = logo.decode ? logo.decode().catch(function () {}) : Promise.resolve();
        var limite = new Promise(function (ok) { setTimeout(ok, 1500); });

        Promise.race([Promise.all([fontes, imagem]), limite]).then(function () {
            posicionar(logo);
            raiz.classList.add('intro-pronta');
            setTimeout(function () {
                posicionar(logo); // reconfere, caso a fonte tenha mudado o layout
                raiz.classList.add('saindo');
                raiz.classList.remove('intro', 'intro-pronta');
                setTimeout(encerrar, DURACAO + 300);
            }, ESPERA);
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
    else iniciar();
})();
