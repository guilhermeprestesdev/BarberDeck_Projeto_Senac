// COMPONENTE: HEADER (<barber-header>)
class BarberHeader extends HTMLElement {
    connectedCallback() {
        fetch('../html/header.html')
            .then(res => res.text())
            .then(html => {
                this.innerHTML = html;
            })
            .catch(err => console.error('Erro ao carregar o header:', err));
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
            .catch(err => console.error('Erro ao carregar o footer:', err));
    }
}
customElements.define('barber-footer', BarberFooter);