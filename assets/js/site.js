// VittaSys - site institucional
(function () {
    'use strict';

    // --- Navbar mobile toggle ---
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', function () {
            links.classList.toggle('open');
        });

        // Fechar menu ao clicar em um link (mobile)
        links.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                links.classList.remove('open');
            });
        });
    }

    // --- Contact form (100% estático, via Formspree) ---
    // Endpoint do Formspree. Crie um form gratuito em https://formspree.io
    // e cole o endpoint (ex: https://formspree.io/f/abcXYZ12) abaixo.
    var FORMSPREE_ENDPOINT = 'SEU_ENDPOINT_FORMPREE_AQUI';

    var form = document.getElementById('site-contato');
    if (form) {
        var feedback = document.getElementById('feedback');

        function showFeedback(type) {
            var iconSvg = type === 'success'
                ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>'
                : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';

            feedback.className = 'form-feedback ' + type + ' show';
            feedback.querySelector('.feedback-icon').innerHTML = iconSvg;

            if (type === 'success') {
                feedback.querySelector('b').textContent = 'Recebemos o seu contato';
                feedback.querySelector('p').textContent = 'Obrigado pelo interesse. Aguarde o nosso retorno em breve.';
            } else {
                feedback.querySelector('b').textContent = 'Não foi possível enviar';
                feedback.querySelector('p').textContent = 'Ocorreu um erro ao enviar. Tente novamente em instantes.';
            }
        }

        function hideFeedback() {
            feedback.className = 'form-feedback';
            feedback.querySelector('b').textContent = '';
            feedback.querySelector('p').textContent = '';
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (FORMSPREE_ENDPOINT === 'SEU_ENDPOINT_FORMPREE_AQUI') {
                if (feedback) {
                    showFeedback('error');
                    feedback.querySelector('p').textContent = 'Formulário ainda não configurado no Formspree.';
                }
                return;
            }

            if (feedback) hideFeedback();

            var submitBtn = form.querySelector('button[type="submit"]');
            var submitHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<svg class="spinner" viewBox="0 0 24 24" width="18" height="18" style="margin-right:8px;vertical-align:middle"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="30 60" stroke-linecap="round"/></svg> Enviando...';

            var body = new URLSearchParams(new FormData(form));

            fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: body.toString(),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            })
            .then(function (res) {
                // Formspree responde 200 com { ok: true } ou 4xx/5xx com detalhes.
                return res.json().then(function (data) {
                    if (!res.ok) {
                        var msg = data && data.errors && data.errors.length
                            ? data.errors[0].message
                            : null;
                        throw new Error(msg || 'O serviço de envio falhou.');
                    }
                    return data;
                });
            })
            .then(function () {
                if (feedback) showFeedback('success');
                form.reset();
            })
            .catch(function (err) {
                if (feedback) showFeedback('error');
            })
            .finally(function () {
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitHTML;
            });
        });
    }
})();