// CONTROLADOR DA PÁGINA INICIAL E BUSCA DE BARBEARIAS (index.js)
document.addEventListener('DOMContentLoaded', () => {
    const formBusca = document.getElementById('form-busca-barbearias');
    const inputNome = document.getElementById('nome-barbearia');
    const inputCidade = document.getElementById('cidade-barbearia');
    const avisoFiltro = document.getElementById('aviso-filtro-busca');
    const textoResultado = document.getElementById('texto-resultado-busca');
    const botaoLimpar = document.getElementById('botao-limpar-busca');

    const gradeDestaque = document.getElementById('grade-barbearias-destaque');
    const secaoNovas = document.getElementById('barbearias-novas');
    const divisorNovas = document.getElementById('divisor-barbearias-novas');
    const gradeNovas = document.getElementById('grade-barbearias-novas');

    function criarCartaoBarbeariaHTML(barb) {
        const classeStatus = barb.aberta ? 'aberto' : 'fechado';
        const textoStatus = barb.aberta ? 'aberto' : 'fechado';
        const notaFormatada = Number(barb.nota || 5.0).toFixed(1);
        const qtdAval = barb.totalAvaliacoes || 0;
        const imagem = barb.fotoCapa || '../images/imagem-topo-barber.jpg';

        return `
            <article class="cartao-barbearia" data-barbearia-id="${barb.id}">
                <div class="container-imagem-cartao">
                    <span class="selo-status ${classeStatus}">${textoStatus}</span>
                    <img src="${imagem}" alt="Ambiente da ${barb.nome}">
                </div>
                <div class="informacoes-cartao">
                    <h3>${barb.nome}</h3>
                    <p class="localizacao">${barb.bairro}, ${barb.cidade}</p>
                    <div class="rodape-cartao">
                        <span class="avaliacao">⭐ ${notaFormatada} <small class="qtd-avaliacoes-cartao">(${qtdAval})</small></span>
                        <a href="agendamento.html?barbearia=${barb.id}" class="botao-agendar">Agendar</a>
                    </div>
                </div>
            </article>
        `;
    }

    function renderizarVitrine(filtroNome = '', filtroCidade = '') {
        if (!window.BarberDeckStore || !gradeDestaque || !gradeNovas) return;

        const estado = window.BarberDeckStore.obterEstado();
        const todas = estado.barbearias || [];

        const termoNome = filtroNome.trim().toLowerCase();
        const termoCidade = filtroCidade.trim().toLowerCase();
        const temFiltro = Boolean(termoNome || termoCidade);

        if (!temFiltro) {
            if (avisoFiltro) avisoFiltro.hidden = true;
            if (secaoNovas) secaoNovas.hidden = false;
            if (divisorNovas) divisorNovas.hidden = false;

            const destaques = todas.filter(b => b.destaque || !b.nova).slice(0, 3);
            const novas = todas.filter(b => b.nova).slice(0, 3);

            gradeDestaque.innerHTML = destaques.map(criarCartaoBarbeariaHTML).join('');
            gradeNovas.innerHTML = novas.map(criarCartaoBarbeariaHTML).join('');
            return;
        }

        const filtradas = todas.filter((barb) => {
            const matchNome = !termoNome || barb.nome.toLowerCase().includes(termoNome) || (barb.descricao || '').toLowerCase().includes(termoNome);
            const matchLocal = !termoCidade || barb.cidade.toLowerCase().includes(termoCidade) || barb.bairro.toLowerCase().includes(termoCidade);
            return matchNome && matchLocal;
        });

        if (avisoFiltro && textoResultado) {
            avisoFiltro.hidden = false;
            textoResultado.textContent = filtradas.length > 0
                ? `Encontrada(s) ${filtradas.length} barbearia(s) para sua pesquisa:`
                : 'Nenhuma barbearia encontrada com esses termos.';
        }

        if (secaoNovas) secaoNovas.hidden = true;
        if (divisorNovas) divisorNovas.hidden = true;

        if (filtradas.length > 0) {
            gradeDestaque.innerHTML = filtradas.map(criarCartaoBarbeariaHTML).join('');
        } else {
            gradeDestaque.innerHTML = `
                <div class="estado-vazio-busca">
                    <p>Não encontramos barbearias para os termos pesquisados.</p>
                    <button type="button" class="botao-agendar" id="botao-ver-todas-vazio">Ver todas as barbearias</button>
                </div>
            `;
            const btnVazio = document.getElementById('botao-ver-todas-vazio');
            if (btnVazio) {
                btnVazio.addEventListener('click', limparBusca);
            }
        }
    }

    function limparBusca() {
        if (inputNome) inputNome.value = '';
        if (inputCidade) inputCidade.value = '';
        renderizarVitrine('', '');
    }

    if (formBusca) {
        formBusca.addEventListener('submit', (evento) => {
            evento.preventDefault();
            renderizarVitrine(inputNome ? inputNome.value : '', inputCidade ? inputCidade.value : '');
            const secaoDestaque = document.getElementById('barbearias-destaque');
            if (secaoDestaque) {
                secaoDestaque.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    if (inputNome) {
        inputNome.addEventListener('input', () => {
            renderizarVitrine(inputNome.value, inputCidade ? inputCidade.value : '');
        });
    }

    if (inputCidade) {
        inputCidade.addEventListener('input', () => {
            renderizarVitrine(inputNome ? inputNome.value : '', inputCidade.value);
        });
    }

    if (botaoLimpar) {
        botaoLimpar.addEventListener('click', limparBusca);
    }

    window.addEventListener('barberdeck:estado-atualizado', () => {
        renderizarVitrine(inputNome ? inputNome.value : '', inputCidade ? inputCidade.value : '');
    });

    renderizarVitrine();
});
