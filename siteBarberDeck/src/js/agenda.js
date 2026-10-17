// CONTROLADOR DA PÁGINA DE AGENDA (agenda.js)
document.addEventListener('DOMContentLoaded', () => {
    const containerPagina = document.getElementById('container-pagina-agenda');
    const visaoCliente = document.getElementById('visao-agenda-cliente');
    const visaoBarbearia = document.getElementById('visao-agenda-barbearia');

    const botaoModoCliente = document.getElementById('botao-modo-cliente');
    const botaoModoBarbearia = document.getElementById('botao-modo-barbearia');

    const listaClienteEl = document.getElementById('lista-agendamentos-cliente');
    const listaBarbeariaEl = document.getElementById('lista-agendamentos-barbearia');
    const abasBarbeirosEl = document.getElementById('abas-barbeiros-agenda');

    const botaoDiaAnterior = document.getElementById('botao-dia-anterior');
    const botaoProximoDia = document.getElementById('botao-proximo-dia');
    const botaoHoje = document.getElementById('botao-hoje');
    const rotuloData = document.getElementById('rotulo-data-agenda');

    // Modais
    const modalEdicao = document.getElementById('modal-edicao-agenda');
    const formModalEdicao = document.getElementById('formulario-modal-agenda');
    const inputEditarData = document.getElementById('editar-data');
    const inputEditarHorario = document.getElementById('editar-horario');
    const containerCheckboxesEditar = document.getElementById('checkboxes-editar-servicos');

    const modalBalcao = document.getElementById('modal-agendamento-manual');
    const formBalcao = document.getElementById('formulario-agendamento-manual');
    const selectBalcaoBarbeiro = document.getElementById('balcao-barbeiro');
    const containerCheckboxesBalcao = document.getElementById('checkboxes-balcao-servicos');
    const inputBalcaoTelefone = document.getElementById('balcao-telefone-cliente');
    const inputBalcaoData = document.getElementById('balcao-data');

    const modalBloqueio = document.getElementById('modal-bloqueio-agenda');
    const formBloqueio = document.getElementById('formulario-bloqueio-agenda');
    const selectBloqueioBarbeiro = document.getElementById('bloqueio-barbeiro');

    const modalAvaliacao = document.getElementById('modal-avaliacao-agenda');
    const formAvaliacao = document.getElementById('formulario-avaliacao-agenda');
    const botoesEstrela = document.querySelectorAll('#seletor-estrelas .botao-estrela');
    const inputComentarioAvaliacao = document.getElementById('avaliacao-comentario');

    let deslocamentoDias = 0;
    let barbeiroIdAtivo = 'barb-1';
    let idAgendamentoEmEdicao = null;
    let idAgendamentoEmAvaliacao = null;
    let notaSelecionadaAvaliacao = 5;

    function obterDataReferenciaBarbearia(diasOffset) {
        const base = new Date(2026, 9, 17); // 17/10/2026
        base.setDate(base.getDate() + diasOffset);
        const dia = String(base.getDate()).padStart(2, '0');
        const mes = String(base.getMonth() + 1).padStart(2, '0');
        const ano = base.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    function atualizarRotuloDataBarbearia() {
        const dataFormatada = obterDataReferenciaBarbearia(deslocamentoDias);
        if (rotuloData) {
            rotuloData.textContent = (deslocamentoDias === 0) ? `HOJE (${dataFormatada})` : dataFormatada;
        }
    }

    // 1. Alternância entre Modo Cliente e Modo Barbearia (sincronizado com o Header)
    function definirModoAgenda(modo) {
        const ehCliente = (modo === 'cliente');
        containerPagina.setAttribute('data-modo-agenda', modo);

        visaoCliente.hidden = !ehCliente;
        visaoBarbearia.hidden = ehCliente;

        if (botaoModoCliente && botaoModoBarbearia) {
            botaoModoCliente.classList.toggle('ativo', ehCliente);
            botaoModoBarbearia.classList.toggle('ativo', !ehCliente);
        }

        if (window.BarberDeckStore) {
            window.BarberDeckStore.definirTipoSessao(ehCliente ? 'cliente' : 'barbearia');
        }

        renderizarAgendaCompleta();
    }

    if (botaoModoCliente && botaoModoBarbearia) {
        botaoModoCliente.addEventListener('click', () => definirModoAgenda('cliente'));
        botaoModoBarbearia.addEventListener('click', () => definirModoAgenda('barbearia'));
    }

    // 2. Renderizar Visão do Cliente
    function renderizarAgendaCliente() {
        if (!listaClienteEl || !window.BarberDeckStore) return;
        const estado = window.BarberDeckStore.obterEstado();
        const meusAgendamentos = (estado.agendamentos || []).filter(a => a.clienteId === 1);

        if (meusAgendamentos.length === 0) {
            listaClienteEl.innerHTML = '<div class="estado-vazio-agenda">Você ainda não possui agendamentos registrados.</div>';
            return;
        }

        // Ordena colocando 'em-aberto' primeiro
        const ordenados = [...meusAgendamentos].sort((a, b) => {
            if (a.status === 'em-aberto' && b.status !== 'em-aberto') return -1;
            if (a.status !== 'em-aberto' && b.status === 'em-aberto') return 1;
            return 0;
        });

        listaClienteEl.innerHTML = '';

        ordenados.forEach((ag) => {
            const ehAberto = (ag.status === 'em-aberto');
            const article = document.createElement('article');
            article.className = `cartao-agendamento cartao-cliente ${ehAberto ? 'em-aberto' : 'concluido'}`;
            article.setAttribute('data-id', ag.id);

            const etiquetasHTML = (ag.servicos || [])
                .map(s => `<li class="etiqueta-servico">${s}</li>`)
                .join('');

            const comentarioHTML = ag.avaliacao && ag.avaliacao.comentario
                ? `<p class="comentario-avaliacao-cliente">"${ag.avaliacao.comentario}"</p>`
                : '';

            let colunaAcoesHTML = '';
            if (ehAberto) {
                colunaAcoesHTML = `
                    <div class="coluna-acoes-agendamento">
                        <button type="button" class="botao-acao-item acao-cancelar" data-acao="cancelar" data-id="${ag.id}">
                            <img src="../icons/icon-excluir.svg" alt="" aria-hidden="true">
                            <span>cancelar</span>
                        </button>
                        <button type="button" class="botao-acao-item acao-editar" data-acao="editar" data-id="${ag.id}">
                            <img src="../icons/icon-editar.svg" alt="" aria-hidden="true">
                            <span>editar</span>
                        </button>
                    </div>
                `;
            } else {
                const blocoAvaliacao = ag.avaliacao
                    ? `<span class="selo-ja-avaliado">⭐ ${Number(ag.avaliacao.nota).toFixed(1)} • Avaliado</span>`
                    : `<button type="button" class="botao-acao-item acao-avaliar" data-acao="avaliar" data-id="${ag.id}">★ Avaliar</button>`;

                colunaAcoesHTML = `
                    <div class="coluna-acoes-agendamento">
                        ${blocoAvaliacao}
                    </div>
                `;
            }

            article.innerHTML = `
                <div class="coluna-principal-agendamento">
                    <div class="linha-titulo-agendamento">
                        <h2 class="nome-estabelecimento">${ag.barbeariaNome}</h2>
                        <span class="separador-barra" aria-hidden="true">|</span>
                        <span class="nome-barbeiro-atendimento">${ag.barbeiroNome}</span>
                        <span class="${ehAberto ? 'selo-agendamento-aberto' : 'selo-agendamento-concluido'}">
                            ${ehAberto ? 'Em aberto' : 'Concluído'}
                        </span>
                    </div>

                    <ul class="lista-etiquetas-servicos" aria-label="Serviços agendados">
                        ${etiquetasHTML}
                    </ul>

                    <p class="endereco-barbearia">${ag.enderecoBarbearia || ''}</p>
                    ${comentarioHTML}
                </div>

                <div class="coluna-data-valor">
                    <span class="data-agendamento">${ag.data}${ag.hora ? ` • ${ag.hora}` : ''}</span>
                    <strong class="valor-agendamento">${window.BarberDeckStore.formatarMoeda(ag.valorTotal)}</strong>
                </div>

                ${colunaAcoesHTML}
            `;

            listaClienteEl.appendChild(article);
        });
    }

    // 3. Renderizar Abas de Barbeiros e Visão da Barbearia
    function renderizarAbasBarbeiros() {
        if (!abasBarbeirosEl || !window.BarberDeckStore) return;
        const estado = window.BarberDeckStore.obterEstado();
        const barbeiros = estado.barbeiros || [];

        if (!barbeiros.some(b => b.id === barbeiroIdAtivo) && barbeiros.length > 0) {
            barbeiroIdAtivo = barbeiros[0].id;
        }

        abasBarbeirosEl.innerHTML = '';
        barbeiros.forEach((barb) => {
            const ativo = (barb.id === barbeiroIdAtivo);
            const li = document.createElement('li');
            li.setAttribute('role', 'presentation');
            li.innerHTML = `
                <button type="button" class="botao-aba-barbeiro ${ativo ? 'ativo' : ''}" role="tab"
                    aria-selected="${ativo}" data-barbeiro-id="${barb.id}">
                    ${barb.nome}
                </button>
            `;
            li.querySelector('button').addEventListener('click', () => {
                barbeiroIdAtivo = barb.id;
                renderizarAbasBarbeiros();
                renderizarAgendaBarbearia();
            });
            abasBarbeirosEl.appendChild(li);
        });
    }

    function renderizarAgendaBarbearia() {
        if (!listaBarbeariaEl || !window.BarberDeckStore) return;
        const estado = window.BarberDeckStore.obterEstado();
        const dataRef = obterDataReferenciaBarbearia(deslocamentoDias);

        // Agendamentos do barbeiro ativo
        const agendamentosBarbeiro = (estado.agendamentos || []).filter((ag) => {
            if (ag.barbeiroId !== barbeiroIdAtivo) return false;
            if (deslocamentoDias === 0) {
                return ag.data === dataRef || ag.ehHojeBarbearia;
            }
            return ag.data === dataRef;
        });

        // Bloqueios do barbeiro ativo na data
        const bloqueiosBarbeiro = (estado.bloqueiosAgenda || []).filter(
            bl => bl.barbeiroId === barbeiroIdAtivo && (bl.data === dataRef || deslocamentoDias === 0)
        );

        const itensLinhaTempo = [
            ...agendamentosBarbeiro.map(a => ({ tipo: 'agendamento', horaOrdenacao: a.hora || '09:00', dados: a })),
            ...bloqueiosBarbeiro.map(b => ({ tipo: 'bloqueio', horaOrdenacao: b.inicio || '12:00', dados: b }))
        ].sort((x, y) => x.horaOrdenacao.localeCompare(y.horaOrdenacao));

        if (itensLinhaTempo.length === 0) {
            listaBarbeariaEl.innerHTML = '<div class="estado-vazio-agenda">Nenhum atendimento ou bloqueio registrado para este barbeiro nesta data.</div>';
            return;
        }

        listaBarbeariaEl.innerHTML = '';

        itensLinhaTempo.forEach((item) => {
            if (item.tipo === 'bloqueio') {
                const bl = item.dados;
                const article = document.createElement('article');
                article.className = 'cartao-agendamento cartao-bloqueio';
                article.innerHTML = `
                    <div class="coluna-horario-barbearia">
                        <time class="horario-atendimento">${bl.inicio}</time>
                        <span class="duracao-slot-barbearia">até ${bl.fim}</span>
                    </div>
                    <div class="coluna-cliente-servicos">
                        <div class="linha-titulo-agendamento">
                            <h2 class="nome-cliente-agenda">${bl.motivo}</h2>
                            <span class="selo-bloqueio-agenda">Horário Bloqueado</span>
                        </div>
                        <p class="endereco-barbearia">Indisponível para agendamentos online neste intervalo</p>
                    </div>
                    <div class="coluna-acoes-agendamento">
                        <button type="button" class="botao-acao-item acao-cancelar" data-acao="remover-bloqueio" data-id="${bl.id}">
                            <img src="../icons/icon-excluir.svg" alt="" aria-hidden="true">
                            <span>liberar horário</span>
                        </button>
                    </div>
                `;
                listaBarbeariaEl.appendChild(article);
                return;
            }

            const ag = item.dados;
            const ehAberto = (ag.status === 'em-aberto');
            const article = document.createElement('article');
            article.className = `cartao-agendamento cartao-barbearia ${ehAberto ? 'em-aberto' : 'concluido'}`;
            article.setAttribute('data-id', ag.id);

            const etiquetasHTML = (ag.servicos || [])
                .map(s => `<li class="etiqueta-servico">${s}</li>`)
                .join('');

            const acoesHTML = ehAberto ? `
                <div class="coluna-acoes-agendamento">
                    <button type="button" class="botao-acao-item acao-cancelar" data-acao="cancelar" data-id="${ag.id}">
                        <img src="../icons/icon-excluir.svg" alt="" aria-hidden="true">
                        <span>cancelar</span>
                    </button>
                    <button type="button" class="botao-acao-item acao-editar" data-acao="editar" data-id="${ag.id}">
                        <img src="../icons/icon-editar.svg" alt="" aria-hidden="true">
                        <span>editar</span>
                    </button>
                    <button type="button" class="botao-acao-item acao-concluir" data-acao="concluir" data-id="${ag.id}">
                        <img src="../icons/icon-check.svg" alt="" aria-hidden="true">
                        <span>concluir</span>
                    </button>
                </div>
            ` : '';

            article.innerHTML = `
                <div class="coluna-horario-barbearia">
                    <time class="horario-atendimento">${ag.hora || '09:00'}</time>
                    <span class="duracao-slot-barbearia">${ag.duracaoTotal || 45} min • ${window.BarberDeckStore.formatarMoeda(ag.valorTotal)}</span>
                </div>

                <div class="coluna-cliente-servicos">
                    <div class="linha-titulo-agendamento">
                        <h2 class="nome-cliente-agenda">${ag.clienteNome}</h2>
                        <span class="${ehAberto ? 'selo-agendamento-aberto' : 'selo-agendamento-concluido'}">
                            ${ehAberto ? 'Em aberto' : 'Concluído'}
                        </span>
                    </div>
                    <ul class="lista-etiquetas-servicos" aria-label="Serviços contratados">
                        ${etiquetasHTML}
                    </ul>
                    <p class="endereco-barbearia">WhatsApp: ${ag.clienteTelefone || '(54) 99985-3855'}</p>
                </div>

                ${acoesHTML}
            `;

            listaBarbeariaEl.appendChild(article);
        });
    }

    function renderizarAgendaCompleta() {
        atualizarRotuloDataBarbearia();
        renderizarAgendaCliente();
        renderizarAbasBarbeiros();
        renderizarAgendaBarbearia();
    }

    // 4. Navegação de Datas (< HOJE >)
    if (botaoDiaAnterior && botaoProximoDia && botaoHoje) {
        botaoDiaAnterior.addEventListener('click', () => {
            deslocamentoDias -= 1;
            renderizarAgendaCompleta();
        });

        botaoProximoDia.addEventListener('click', () => {
            deslocamentoDias += 1;
            renderizarAgendaCompleta();
        });

        botaoHoje.addEventListener('click', () => {
            deslocamentoDias = 0;
            renderizarAgendaCompleta();
        });
    }

    // Helper para popular checkboxes de serviços nos modais
    function popularCheckboxesServicos(container, servicosMarcadosNomes = []) {
        if (!container || !window.BarberDeckStore) return;
        const estado = window.BarberDeckStore.obterEstado();
        const servicosAtivos = (estado.servicos || []).filter(s => s.ativo);

        container.innerHTML = '';
        servicosAtivos.forEach((s, idx) => {
            const marcado = servicosMarcadosNomes.length > 0
                ? servicosMarcadosNomes.includes(s.nome)
                : (idx === 0);

            const label = document.createElement('label');
            label.className = 'opcao-checkbox-modal';
            label.innerHTML = `
                <input type="checkbox" name="servicos_modal" value="${s.nome}"
                    data-preco="${s.preco}" data-duracao="${s.duracao}" ${marcado ? 'checked' : ''}>
                <span>${s.nome} (${window.BarberDeckStore.formatarMoeda(s.preco)})</span>
            `;
            container.appendChild(label);
        });
    }

    function popularSelectBarbeiros(selectEl) {
        if (!selectEl || !window.BarberDeckStore) return;
        const estado = window.BarberDeckStore.obterEstado();
        const barbeiros = (estado.barbeiros || []).filter(b => b.ativo);

        selectEl.innerHTML = '';
        barbeiros.forEach((b) => {
            const opt = document.createElement('option');
            opt.value = b.id;
            opt.textContent = b.nome;
            if (b.id === barbeiroIdAtivo) opt.selected = true;
            selectEl.appendChild(opt);
        });
    }

    // 5. Delegação de Ações nos Cartões (Cancelar, Concluir, Editar, Avaliar, Liberar Bloqueio)
    document.addEventListener('click', (evento) => {
        const botaoAcao = evento.target.closest('.botao-acao-item');
        if (!botaoAcao) return;

        const acao = botaoAcao.getAttribute('data-acao');
        const id = botaoAcao.getAttribute('data-id');
        if (!acao || !id || !window.BarberDeckStore) return;

        const estado = window.BarberDeckStore.obterEstado();

        // Remover bloqueio de horário
        if (acao === 'remover-bloqueio') {
            estado.bloqueiosAgenda = (estado.bloqueiosAgenda || []).filter(b => b.id !== id);
            window.BarberDeckStore.salvarEstado(estado);
            renderizarAgendaCompleta();
            return;
        }

        const agendamento = (estado.agendamentos || []).find(a => a.id === id);
        if (!agendamento) return;

        // Cancelar agendamento
        if (acao === 'cancelar') {
            if (confirm('Deseja realmente cancelar este agendamento em aberto?')) {
                estado.agendamentos = estado.agendamentos.filter(a => a.id !== id);
                window.BarberDeckStore.salvarEstado(estado);
                renderizarAgendaCompleta();
            }
            return;
        }

        // Concluir agendamento (Modo Barbearia)
        if (acao === 'concluir') {
            agendamento.status = 'concluido';
            const barbeiro = (estado.barbeiros || []).find(b => b.id === agendamento.barbeiroId);
            if (barbeiro) {
                barbeiro.atendimentosBase = (Number(barbeiro.atendimentosBase) || 0) + 1;
            }
            window.BarberDeckStore.salvarEstado(estado);
            renderizarAgendaCompleta();
            return;
        }

        // Abrir Modal de Edição
        if (acao === 'editar') {
            idAgendamentoEmEdicao = id;
            inputEditarData.value = agendamento.data || '20/10/2026';
            inputEditarHorario.value = agendamento.hora || '14:30';
            popularCheckboxesServicos(containerCheckboxesEditar, agendamento.servicos || []);
            modalEdicao.showModal();
            return;
        }

        // Abrir Modal de Avaliação (Modo Cliente)
        if (acao === 'avaliar') {
            idAgendamentoEmAvaliacao = id;
            notaSelecionadaAvaliacao = 5;
            atualizarEstrelasModal(5);
            if (inputComentarioAvaliacao) inputComentarioAvaliacao.value = '';
            const subAval = document.getElementById('subtitulo-modal-avaliacao');
            if (subAval) {
                subAval.textContent = `Avalie seu atendimento com ${agendamento.barbeiroNome} em ${agendamento.barbeariaNome}`;
            }
            modalAvaliacao.showModal();
        }
    });

    // Submissão do Modal de Edição de Agendamento
    if (formModalEdicao) {
        formModalEdicao.addEventListener('submit', (evento) => {
            evento.preventDefault();
            if (!idAgendamentoEmEdicao) return;

            const chks = Array.from(containerCheckboxesEditar.querySelectorAll('input[type="checkbox"]:checked'));
            if (chks.length === 0) {
                alert('Selecione pelo menos 1 serviço para o agendamento.');
                return;
            }

            const estado = window.BarberDeckStore.obterEstado();
            const ag = estado.agendamentos.find(a => a.id === idAgendamentoEmEdicao);
            if (ag) {
                ag.data = inputEditarData.value.trim();
                ag.hora = inputEditarHorario.value.trim();
                ag.servicos = chks.map(c => c.value);
                ag.valorTotal = chks.reduce((acc, c) => acc + (Number(c.getAttribute('data-preco')) || 0), 0);
                ag.duracaoTotal = chks.reduce((acc, c) => acc + (Number(c.getAttribute('data-duracao')) || 30), 0);
                window.BarberDeckStore.salvarEstado(estado);
            }

            modalEdicao.close();
            renderizarAgendaCompleta();
        });
    }

    // 6. Modal de Novo Agendamento Manual (Balcão)
    const btnAbrirBalcao = document.getElementById('botao-abrir-modal-balcao');
    if (inputBalcaoTelefone && window.BarberDeckStore) {
        inputBalcaoTelefone.addEventListener('input', (e) => {
            e.target.value = window.BarberDeckStore.aplicarMascaraTelefone(e.target.value);
        });
    }

    if (btnAbrirBalcao && modalBalcao) {
        btnAbrirBalcao.addEventListener('click', () => {
            popularSelectBarbeiros(selectBalcaoBarbeiro);
            popularCheckboxesServicos(containerCheckboxesBalcao, []);
            if (inputBalcaoData) inputBalcaoData.value = obterDataReferenciaBarbearia(deslocamentoDias);
            modalBalcao.showModal();
        });
    }

    if (formBalcao) {
        formBalcao.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const chks = Array.from(containerCheckboxesBalcao.querySelectorAll('input[type="checkbox"]:checked'));
            if (chks.length === 0) {
                alert('Selecione pelo menos 1 serviço.');
                return;
            }

            const estado = window.BarberDeckStore.obterEstado();
            const barbPrincipal = window.BarberDeckStore.obterBarbeariaPrincipal();
            const barbeiroId = selectBalcaoBarbeiro.value;
            const barbeiroObj = estado.barbeiros.find(b => b.id === barbeiroId) || estado.barbeiros[0];

            const novoAg = {
                id: `ag-balcao-${Date.now()}`,
                barbeariaId: barbPrincipal.id,
                barbeariaNome: barbPrincipal.nome,
                enderecoBarbearia: `${barbPrincipal.logradouro} - ${barbPrincipal.bairro}, ${barbPrincipal.cidade}`,
                clienteId: null,
                clienteNome: document.getElementById('balcao-nome-cliente').value.trim(),
                clienteTelefone: inputBalcaoTelefone.value.trim(),
                barbeiroId: barbeiroObj.id,
                barbeiroNome: barbeiroObj.nome,
                servicos: chks.map(c => c.value),
                duracaoTotal: chks.reduce((acc, c) => acc + (Number(c.getAttribute('data-duracao')) || 30), 0),
                valorTotal: chks.reduce((acc, c) => acc + (Number(c.getAttribute('data-preco')) || 0), 0),
                data: inputBalcaoData.value.trim(),
                hora: document.getElementById('balcao-horario').value,
                ehHojeBarbearia: (deslocamentoDias === 0),
                status: 'em-aberto',
                avaliacao: null
            };

            estado.agendamentos.push(novoAg);
            barbeiroIdAtivo = barbeiroObj.id;
            window.BarberDeckStore.salvarEstado(estado);

            formBalcao.reset();
            modalBalcao.close();
            renderizarAgendaCompleta();
        });
    }

    // 7. Modal de Bloqueio de Horário
    const btnAbrirBloqueio = document.getElementById('botao-abrir-modal-bloqueio');
    if (btnAbrirBloqueio && modalBloqueio) {
        btnAbrirBloqueio.addEventListener('click', () => {
            popularSelectBarbeiros(selectBloqueioBarbeiro);
            modalBloqueio.showModal();
        });
    }

    if (formBloqueio) {
        formBloqueio.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const estado = window.BarberDeckStore.obterEstado();
            const barbeiroId = selectBloqueioBarbeiro.value;
            const inicio = document.getElementById('bloqueio-inicio').value;
            const fim = document.getElementById('bloqueio-fim').value;
            const motivo = document.getElementById('bloqueio-motivo').value.trim();

            if (!inicio || !fim || !motivo) return;

            estado.bloqueiosAgenda.push({
                id: `bloq-${Date.now()}`,
                barbeiroId,
                data: obterDataReferenciaBarbearia(deslocamentoDias),
                inicio,
                fim,
                motivo
            });

            barbeiroIdAtivo = barbeiroId;
            window.BarberDeckStore.salvarEstado(estado);
            formBloqueio.reset();
            modalBloqueio.close();
            renderizarAgendaCompleta();
        });
    }

    // 8. Modal de Avaliação de Atendimento (Estrelas 1 a 5)
    function atualizarEstrelasModal(nota) {
        botoesEstrela.forEach((btn) => {
            const n = Number(btn.getAttribute('data-nota'));
            btn.classList.toggle('ativo', n <= nota);
        });
    }

    botoesEstrela.forEach((btn) => {
        btn.addEventListener('click', () => {
            notaSelecionadaAvaliacao = Number(btn.getAttribute('data-nota')) || 5;
            atualizarEstrelasModal(notaSelecionadaAvaliacao);
        });
    });

    if (formAvaliacao) {
        formAvaliacao.addEventListener('submit', (evento) => {
            evento.preventDefault();
            if (!idAgendamentoEmAvaliacao) return;

            const estado = window.BarberDeckStore.obterEstado();
            const ag = estado.agendamentos.find(a => a.id === idAgendamentoEmAvaliacao);
            if (ag) {
                ag.avaliacao = {
                    nota: notaSelecionadaAvaliacao,
                    comentario: inputComentarioAvaliacao ? inputComentarioAvaliacao.value.trim() : ''
                };

                // Atualiza média de avaliação do barbeiro e da barbearia
                const barb = estado.barbeiros.find(b => b.id === ag.barbeiroId);
                if (barb) {
                    const totalAntigo = Number(barb.totalAvaliacoes) || 10;
                    const mediaAntiga = Number(barb.nota) || 4.9;
                    barb.totalAvaliacoes = totalAntigo + 1;
                    barb.nota = Number(((mediaAntiga * totalAntigo + notaSelecionadaAvaliacao) / barb.totalAvaliacoes).toFixed(1));
                }

                const estab = estado.barbearias.find(b => b.id === ag.barbeariaId);
                if (estab) {
                    const totalAntigo = Number(estab.totalAvaliacoes) || 50;
                    const mediaAntiga = Number(estab.nota) || 4.9;
                    estab.totalAvaliacoes = totalAntigo + 1;
                    estab.nota = Number(((mediaAntiga * totalAntigo + notaSelecionadaAvaliacao) / estab.totalAvaliacoes).toFixed(1));
                }

                window.BarberDeckStore.salvarEstado(estado);
            }

            modalAvaliacao.close();
            renderizarAgendaCompleta();
        });
    }

    // Fechamento de todos os modais no botão X, botão Cancelar ou clique no backdrop
    function configurarFechamentoModal(modal, idBtnFechar, idBtnCancelar) {
        if (!modal) return;
        const btnF = document.getElementById(idBtnFechar);
        const btnC = document.getElementById(idBtnCancelar);
        if (btnF) btnF.addEventListener('click', () => modal.close());
        if (btnC) btnC.addEventListener('click', () => modal.close());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.close();
        });
    }

    configurarFechamentoModal(modalEdicao, 'fechar-modal-agenda', 'cancelar-modal-agenda');
    configurarFechamentoModal(modalBalcao, 'fechar-modal-balcao', 'cancelar-modal-balcao');
    configurarFechamentoModal(modalBloqueio, 'fechar-modal-bloqueio', 'cancelar-modal-bloqueio');
    configurarFechamentoModal(modalAvaliacao, 'fechar-modal-avaliacao', 'cancelar-modal-avaliacao');

    // Inicialização conforme URL (?modo=barbearia) ou estado da sessão
    const params = new URLSearchParams(window.location.search);
    const sessao = window.BarberDeckStore ? window.BarberDeckStore.obterSessao() : { tipo: 'cliente' };
    if (params.get('modo') === 'barbearia' || sessao.tipo === 'barbearia') {
        definirModoAgenda('barbearia');
    } else {
        definirModoAgenda('cliente');
    }
});
