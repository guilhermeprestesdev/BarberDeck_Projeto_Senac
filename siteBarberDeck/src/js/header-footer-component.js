// COMPONENTE: HEADER (<barber-header>) E CONTROLADOR DO POPUP DE LOGIN
class BarberHeader extends HTMLElement {
    connectedCallback() {
        fetch('../html/header.html')
            .then(res => res.text())
            .then(html => {
                this.innerHTML = html;
                this.inicializarModalLogin();
            })
            .catch(err => console.error('Erro ao carregar o cabeçalho:', err));
    }

    inicializarModalLogin() {
        const modal = this.querySelector('#modal-autenticacao');
        const botaoAbrir = this.querySelector('#botao-abrir-modal');
        const botaoFechar = this.querySelector('#botao-fechar-modal');

        if (!modal || !botaoAbrir) return;

        // Abre o popup de Login ao clicar em 'Entrar' no cabeçalho
        botaoAbrir.addEventListener('click', (evento) => {
            evento.preventDefault();
            modal.showModal();
        });

        // Fecha o popup no botão 'X'
        if (botaoFechar) {
            botaoFechar.addEventListener('click', () => modal.close());
        }

        // Fecha o popup ao clicar fora do cartão (no backdrop)
        modal.addEventListener('click', (evento) => {
            if (evento.target === modal) {
                modal.close();
            }
        });

        // Permite que qualquer botão com [data-abrir-login] na página (ex.: em cadastro.html) abra o popup de Login
        const gatilhosLogin = document.querySelectorAll('[data-abrir-login]');
        gatilhosLogin.forEach((gatilho) => {
            gatilho.addEventListener('click', (evento) => {
                evento.preventDefault();
                modal.showModal();
            });
        });

        // Botões dos planos na página inicial levam direto para cadastro.html com o perfil barbearia pré-selecionado
        const botoesPlanos = document.querySelectorAll('.botao-plano, .botao-plano-secundario');
        botoesPlanos.forEach((botao) => {
            botao.addEventListener('click', () => {
                window.location.href = 'cadastro.html?perfil=barbearia';
            });
        });
    }
}
customElements.define('barber-header', BarberHeader);


// COMPONENTE: FOOTER (<barber-footer>)
class BarberFooter extends HTMLElement {
    connectedCallback() {
        fetch('../html/footer.html')
            .then(res => res.text())
            .then(html => {
                this.innerHTML = html;
            })
            .catch(err => console.error('Erro ao carregar o rodapé:', err));
    }
}
customElements.define('barber-footer', BarberFooter);
