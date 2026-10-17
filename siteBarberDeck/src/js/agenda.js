// CONTROLADOR DA PÁGINA DE AGENDA (agenda.js)
document.addEventListener('DOMContentLoaded', () => {
    const containerPagina = document.getElementById('container-pagina-agenda');
    const visaoCliente = document.getElementById('visao-agenda-cliente');
    const visaoBarbearia = document.getElementById('visao-agenda-barbearia');

    // [TEMPORÁRIO PARA TESTES] Botões para alternar entre Modo Cliente e Modo Barbearia
    const botaoModoCliente = document.getElementById('botao-modo-cliente');
    const botaoModoBarbearia = document.getElementById('botao-modo-barbearia');

    function definirModoAgenda(modo) {
        const ehCliente = (modo === 'cliente');
        containerPagina.setAttribute('data-modo-agenda', modo);

        visaoCliente.hidden = !ehCliente;
        visaoBarbearia.hidden = ehCliente;

        if (botaoModoCliente && botaoModoBarbearia) {
            botaoModoCliente.classList.toggle('ativo', ehCliente);
            botaoModoBarbearia.classList.toggle('ativo', !ehCliente);
        }
    }

    if (botaoModoCliente && botaoModoBarbearia) {
        botaoModoCliente.addEventListener('click', () => definirModoAgenda('cliente'));
        botaoModoBarbearia.addEventListener('click', () => definirModoAgenda('barbearia'));
    }

    // Permite abrir diretamente em ?modo=barbearia se passado na URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('modo') === 'barbearia') {
        definirModoAgenda('barbearia');
    }

    // =========================================================================
    // NAVEGAÇÃO DE DATA NO MODO BARBEARIA (< HOJE >)
    // =========================================================================
    const botaoDiaAnterior = document.getElementById('botao-dia-anterior');
    const botaoProximoDia = document.getElementById('botao-proximo-dia');
    const botaoHoje = document.getElementById('botao-hoje');
    const rotuloData = document.getElementById('rotulo-data-agenda');

    let deslocamentoDias = 0;

    function formatarDataDeslocada(dias) {
        if (dias === 0) return 'HOJE';
        const data = new Date();
        data.setDate(data.getDate() + dias);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    if (botaoDiaAnterior && botaoProximoDia && botaoHoje) {
        botaoDiaAnterior.addEventListener('click', () => {
            deslocamentoDias -= 1;
            rotuloData.textContent = formatarDataDeslocada(deslocamentoDias);
        });

        botaoProximoDia.addEventListener('click', () => {
            deslocamentoDias += 1;
            rotuloData.textContent = formatarDataDeslocada(deslocamentoDias);
        });

        botaoHoje.addEventListener('click', () => {
            deslocamentoDias = 0;
            rotuloData.textContent = 'HOJE';
        });
    }

    // =========================================================================
    // ABAS DE SELEÇÃO DE BARBEIROS (Barbeiro 1 a Barbeiro 5)
    // =========================================================================
    const abasBarbeiros = document.querySelectorAll('.botao-aba-barbeiro');
    const dadosExemploBarbeiros = {
        '1': ['João Pedro da Silva', 'Carlos Eduardo Almeida', 'Gabriel Henrique Costa', 'Matheus Ribeiro', 'Felipe Martins'],
        '2': ['Lucas Oliveira', 'André Santos', 'Rafael Pereira', 'Bruno Gomes', 'Thiago Rocha'],
        '3': ['Diego Cardoso', 'Leonardo Dias', 'Gustavo Nunes', 'Rodrigo Alves', 'Marcelo Pinto'],
        '4': ['Henrique Melo', 'Vitor Hugo Castro', 'Eduardo Barros', 'Caio Fernandes', 'Daniel Moura'],
        '5': ['Igor Teixeira', 'Otávio Freitas', 'Samuel Araújo', 'Fábio Correia', 'Alexandre Mendes']
    };

    abasBarbeiros.forEach((aba) => {
        aba.addEventListener('click', () => {
            abasBarbeiros.forEach((b) => {
                b.classList.remove('ativo');
                b.setAttribute('aria-selected', 'false');
            });
            aba.classList.add('ativo');
            aba.setAttribute('aria-selected', 'true');

            const idBarbeiro = aba.getAttribute('data-barbeiro-id');
            const nomes = dadosExemploBarbeiros[idBarbeiro] || dadosExemploBarbeiros['1'];
            const cartoesBarbearia = document.querySelectorAll('#lista-agendamentos-barbearia .cartao-barbearia');

            cartoesBarbearia.forEach((cartao, idx) => {
                const tituloCliente = cartao.querySelector('.nome-cliente-agenda');
                if (tituloCliente && nomes[idx]) {
                    tituloCliente.textContent = nomes[idx];
                    cartao.setAttribute('data-cliente', nomes[idx]);
                }
            });
        });
    });

    // =========================================================================
    // AÇÕES DOS CARTÕES EM ABERTO: CANCELAR, EDITAR E CONCLUIR (BARBEARIA)
    // =========================================================================
    const modalEdicao = document.getElementById('modal-edicao-agenda');
    const fecharModal = document.getElementById('fechar-modal-agenda');
    const cancelarModal = document.getElementById('cancelar-modal-agenda');
    const formModal = document.getElementById('formulario-modal-agenda');
    const inputData = document.getElementById('editar-data');
    const inputHorario = document.getElementById('editar-horario');
    const inputServicos = document.getElementById('editar-servicos');

    let cartaoEmEdicao = null;

    document.addEventListener('click', (evento) => {
        const botaoAcao = evento.target.closest('.botao-acao-item');
        if (!botaoAcao) return;

        const cartao = botaoAcao.closest('.cartao-agendamento');
        const acao = botaoAcao.getAttribute('data-acao');
        if (!cartao) return;

        // 1. Cancelar agendamento
        if (acao === 'cancelar') {
            const confirmar = confirm('Deseja realmente cancelar este agendamento em aberto?');
            if (confirmar) {
                cartao.remove();
            }
            return;
        }

        // 2. Marcar como concluído (Modo Barbearia)
        if (acao === 'concluir') {
            cartao.classList.remove('em-aberto');
            cartao.classList.add('concluido');

            const selo = cartao.querySelector('.selo-agendamento-aberto');
            if (selo) {
                selo.className = 'selo-agendamento-concluido';
                selo.textContent = 'Concluído';
            }

            const colunaAcoes = cartao.querySelector('.coluna-acoes-agendamento');
            if (colunaAcoes) {
                colunaAcoes.remove();
            }
            return;
        }

        // 3. Editar agendamento
        if (acao === 'editar') {
            cartaoEmEdicao = cartao;
            const etiquetas = Array.from(cartao.querySelectorAll('.etiqueta-servico')).map((el) => el.textContent.trim());
            const dataAtual = cartao.getAttribute('data-data') || '20/10/2026';
            const horaAtual = cartao.getAttribute('data-hora') || '14:30';

            inputData.value = dataAtual;
            inputHorario.value = horaAtual;
            inputServicos.value = etiquetas.join(', ');

            modalEdicao.showModal();
            inputServicos.focus();
        }
    });

    if (fecharModal) fecharModal.addEventListener('click', () => modalEdicao.close());
    if (cancelarModal) cancelarModal.addEventListener('click', () => modalEdicao.close());

    if (modalEdicao) {
        modalEdicao.addEventListener('click', (evento) => {
            if (evento.target === modalEdicao) modalEdicao.close();
        });
    }

    if (formModal) {
        formModal.addEventListener('submit', (evento) => {
            evento.preventDefault();
            if (!cartaoEmEdicao) return;

            const novaData = inputData.value.trim();
            const novoHorario = inputHorario.value.trim();
            const novosServicos = inputServicos.value.split(',').map((s) => s.trim()).filter(Boolean);

            cartaoEmEdicao.setAttribute('data-data', novaData);
            cartaoEmEdicao.setAttribute('data-hora', novoHorario);

            const spanDataCliente = cartaoEmEdicao.querySelector('.data-agendamento');
            if (spanDataCliente) {
                spanDataCliente.textContent = `${novaData} • ${novoHorario}`;
            }

            const timeBarbearia = cartaoEmEdicao.querySelector('.horario-atendimento');
            if (timeBarbearia) {
                timeBarbearia.textContent = novoHorario;
            }

            const listaServicos = cartaoEmEdicao.querySelector('.lista-etiquetas-servicos');
            if (listaServicos && novosServicos.length > 0) {
                listaServicos.innerHTML = '';
                novosServicos.forEach((servico) => {
                    const li = document.createElement('li');
                    li.className = 'etiqueta-servico';
                    li.textContent = servico;
                    listaServicos.appendChild(li);
                });
            }

            modalEdicao.close();
        });
    }
});
