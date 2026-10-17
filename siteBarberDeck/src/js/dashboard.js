// CONTROLADOR DA PÁGINA DE DASHBOARD (dashboard.js)
document.addEventListener('DOMContentLoaded', () => {
    const tituloNomeBarbearia = document.getElementById('titulo-nome-barbearia');
    const enderecoResumoDashboard = document.getElementById('endereco-resumo-dashboard');
    const botaoStatusBarbearia = document.getElementById('botao-status-barbearia');
    const textoStatusBarbearia = document.getElementById('texto-status-barbearia');

    const metricaFaturamento = document.getElementById('metrica-faturamento');
    const metricaAtendimentos = document.getElementById('metrica-atendimentos');
    const metricaTicketMedio = document.getElementById('metrica-ticket-medio');

    const formHorarios = document.getElementById('formulario-horarios');
    const botaoSalvarHorarios = document.getElementById('botao-salvar-horarios');

    const abaBarbeiros = document.getElementById('aba-barbeiros');
    const abaServicos = document.getElementById('aba-servicos');
    const secaoBarbeiros = document.getElementById('secao-lista-barbeiros');
    const secaoServicos = document.getElementById('secao-lista-servicos');
    const botaoAdicionarItem = document.getElementById('botao-adicionar-item');

    const listaBarbeirosEl = document.getElementById('lista-barbeiros-dashboard');
    const listaServicosEl = document.getElementById('lista-servicos-dashboard');

    // Modal Barbeiro
    const modalBarbeiro = document.getElementById('modal-dashboard-barbeiro');
    const tituloModalBarbeiro = document.getElementById('titulo-modal-barbeiro');
    const formModalBarbeiro = document.getElementById('formulario-modal-barbeiro');
    const previewFotoModalBarbeiro = document.getElementById('preview-foto-modal-barbeiro');
    const uploadFotoModalBarbeiro = document.getElementById('upload-foto-modal-barbeiro');
    const campoNomeBarbeiro = document.getElementById('campo-nome-barbeiro');
    const campoEspecialidadeBarbeiro = document.getElementById('campo-especialidade-barbeiro');
    const containerCheckboxesServicosBarbeiro = document.getElementById('checkboxes-servicos-barbeiro');

    // Modal Serviço
    const modalServico = document.getElementById('modal-dashboard-servico');
    const tituloModalServico = document.getElementById('titulo-modal-servico');
    const formModalServico = document.getElementById('formulario-modal-servico');
    const campoNomeServico = document.getElementById('campo-nome-servico');
    const campoDescricaoServico = document.getElementById('campo-descricao-servico');
    const campoCategoriaServico = document.getElementById('campo-categoria-servico');
    const campoDuracaoServico = document.getElementById('campo-duracao-servico');
    const campoPrecoServico = document.getElementById('campo-preco-servico');

    let abaAtiva = 'barbeiros';
    let idItemEmEdicao = null;
    let fotoBarbeiroTemporaria = '../images/imagem-topo-barber.jpg';

    // 1. Cabeçalho e Status da Barbearia (Aberta / Fechada)
    function renderizarTopoEMetricas() {
        if (!window.BarberDeckStore) return;
        const estado = window.BarberDeckStore.obterEstado();
        const barbearia = window.BarberDeckStore.obterBarbeariaPrincipal();

        if (tituloNomeBarbearia) tituloNomeBarbearia.textContent = barbearia.nome;
        if (enderecoResumoDashboard) {
            enderecoResumoDashboard.textContent = `${barbearia.logradouro} - ${barbearia.bairro}, ${barbearia.cidade}`;
        }

        if (botaoStatusBarbearia && textoStatusBarbearia) {
            const aberta = Boolean(barbearia.aberta);
            botaoStatusBarbearia.classList.toggle('aberta', aberta);
            botaoStatusBarbearia.classList.toggle('fechada', !aberta);
            botaoStatusBarbearia.setAttribute('aria-pressed', String(aberta));
            textoStatusBarbearia.textContent = aberta ? 'Barbearia aberta' : 'Barbearia fechada';
        }

        // Cálculo das métricas reais com base nos barbeiros e agendamentos concluídos
        const totalAtendimentos = (estado.barbeiros || []).reduce((acc, b) => acc + (Number(b.atendimentosBase) || 0), 0);
        const agendamentosConcluidos = (estado.agendamentos || []).filter(a => a.status === 'concluido');
        const somaExtrasConcluidos = agendamentosConcluidos.reduce((acc, a) => acc + (Number(a.valorTotal) || 0), 0);
        const faturamentoTotal = 18190 + somaExtrasConcluidos;
        const ticketMedio = totalAtendimentos > 0 ? (faturamentoTotal / totalAtendimentos) : 0;

        if (metricaFaturamento) metricaFaturamento.textContent = window.BarberDeckStore.formatarMoeda(faturamentoTotal);
        if (metricaAtendimentos) metricaAtendimentos.textContent = String(totalAtendimentos);
        if (metricaTicketMedio) metricaTicketMedio.textContent = window.BarberDeckStore.formatarMoeda(ticketMedio);
    }

    if (botaoStatusBarbearia) {
        botaoStatusBarbearia.addEventListener('click', () => {
            const estado = window.BarberDeckStore.obterEstado();
            const barb = estado.barbearias.find(b => b.id === (estado.sessao.barbeariaId || 1)) || estado.barbearias[0];
            barb.aberta = !barb.aberta;
            window.BarberDeckStore.salvarEstado(estado);
            renderizarTopoEMetricas();
        });
    }

    // 2. Horário de Funcionamento Semanal (Sincronizado com o Agendamento)
    function carregarHorariosFuncionamento() {
        if (!window.BarberDeckStore) return;
        const estado = window.BarberDeckStore.obterEstado();
        const horarios = estado.horariosFuncionamento || {};

        const linhasDias = document.querySelectorAll('.linha-dia-funcionamento[data-dia]');
        linhasDias.forEach((linha) => {
            const chaveDia = linha.getAttribute('data-dia');
            const config = horarios[chaveDia];
            if (!config) return;

            const chk = linha.querySelector('.checkbox-dia-funcionamento');
            const grupoHorario = linha.querySelector('.grupo-intervalo-horario');
            const inputInicio = linha.querySelector(`input[name="inicio_${chaveDia}"]`);
            const inputFim = linha.querySelector(`input[name="fim_${chaveDia}"]`);

            if (chk) chk.checked = Boolean(config.ativo);
            linha.classList.toggle('dia-fechado', !config.ativo);
            if (grupoHorario) grupoHorario.hidden = !config.ativo;
            if (inputInicio) inputInicio.value = config.inicio || '09:00';
            if (inputFim) inputFim.value = config.fim || '19:00';
        });
    }

    document.querySelectorAll('.checkbox-dia-funcionamento').forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            const linhaDia = checkbox.closest('.linha-dia-funcionamento');
            if (!linhaDia) return;
            const grupoIntervalo = linhaDia.querySelector('.grupo-intervalo-horario');
            const ativo = checkbox.checked;
            linhaDia.classList.toggle('dia-fechado', !ativo);
            if (grupoIntervalo) grupoIntervalo.hidden = !ativo;
        });
    });

    if (formHorarios && botaoSalvarHorarios) {
        formHorarios.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const estado = window.BarberDeckStore.obterEstado();
            const horarios = estado.horariosFuncionamento || {};

            document.querySelectorAll('.linha-dia-funcionamento[data-dia]').forEach((linha) => {
                const chaveDia = linha.getAttribute('data-dia');
                const chk = linha.querySelector('.checkbox-dia-funcionamento');
                const inputInicio = linha.querySelector(`input[name="inicio_${chaveDia}"]`);
                const inputFim = linha.querySelector(`input[name="fim_${chaveDia}"]`);

                if (horarios[chaveDia]) {
                    horarios[chaveDia].ativo = chk ? chk.checked : true;
                    horarios[chaveDia].inicio = inputInicio ? inputInicio.value : '09:00';
                    horarios[chaveDia].fim = inputFim ? inputFim.value : '19:00';
                }
            });

            window.BarberDeckStore.salvarEstado(estado);

            const textoOriginal = botaoSalvarHorarios.textContent;
            botaoSalvarHorarios.textContent = 'Horários Salvos!';
            setTimeout(() => {
                botaoSalvarHorarios.textContent = textoOriginal;
            }, 1800);
        });
    }

    // 3. Listagem Dinâmica de Barbeiros e Serviços
    function renderizarListaBarbeiros() {
        if (!listaBarbeirosEl || !window.BarberDeckStore) return;
        const estado = window.BarberDeckStore.obterEstado();
        const barbeiros = estado.barbeiros || [];

        listaBarbeirosEl.innerHTML = '';

        barbeiros.forEach((barb) => {
            const li = document.createElement('li');
            li.className = `item-lista-dashboard item-barbeiro ${barb.ativo ? '' : 'item-inativo'}`;
            li.setAttribute('data-id', barb.id);

            const qtdServicos = (barb.servicosIds || []).length;

            li.innerHTML = `
                <div class="bloco-esquerdo-barbeiro">
                    <figure class="foto-barbeiro-dashboard">
                        <img src="${barb.foto || '../images/imagem-topo-barber.jpg'}" alt="Foto de ${barb.nome}">
                    </figure>
                    <div class="dados-item-dashboard">
                        <h3 class="titulo-item-dashboard">${barb.nome}</h3>
                        <p class="subtitulo-item-dashboard">${barb.especialidade}</p>
                        <span class="meta-item-dashboard">${barb.atendimentosBase || 0} atendimentos • ${qtdServicos} serviço(s)</span>
                    </div>
                </div>

                <div class="controles-item-dashboard">
                    <label class="chave-seletora" aria-label="Ativar ou desativar ${barb.nome}">
                        <input type="checkbox" class="checkbox-status-item" data-tipo="barbeiro" data-id="${barb.id}" ${barb.ativo ? 'checked' : ''}>
                        <span class="trilho-chave"></span>
                    </label>
                    <div class="acoes-icone-dashboard">
                        <button type="button" class="botao-icone-dashboard acao-editar" data-acao="editar-barbeiro" data-id="${barb.id}" aria-label="Editar ${barb.nome}" title="Editar barbeiro">
                            <img src="../icons/icon-editar.svg" alt="" aria-hidden="true">
                        </button>
                        <button type="button" class="botao-icone-dashboard acao-excluir" data-acao="excluir-barbeiro" data-id="${barb.id}" aria-label="Excluir ${barb.nome}" title="Excluir barbeiro">
                            <img src="../icons/icon-excluir.svg" alt="" aria-hidden="true">
                        </button>
                    </div>
                </div>
            `;
            listaBarbeirosEl.appendChild(li);
        });
    }

    function renderizarListaServicos() {
        if (!listaServicosEl || !window.BarberDeckStore) return;
        const estado = window.BarberDeckStore.obterEstado();
        const servicos = estado.servicos || [];

        listaServicosEl.innerHTML = '';

        servicos.forEach((serv) => {
            const li = document.createElement('li');
            li.className = `item-lista-dashboard item-servico ${serv.ativo ? '' : 'item-inativo'}`;
            li.setAttribute('data-id', serv.id);

            li.innerHTML = `
                <div class="dados-item-dashboard">
                    <div class="linha-titulo-servico">
                        <h3 class="titulo-item-dashboard">${serv.nome}</h3>
                        <span class="etiqueta-categoria-servico">${serv.categoria}</span>
                        <span class="etiqueta-duracao-servico">${serv.duracao} min</span>
                    </div>
                    <p class="subtitulo-item-dashboard">${serv.descricao || ''}</p>
                    <strong class="preco-item-servico">${window.BarberDeckStore.formatarMoeda(serv.preco)}</strong>
                </div>

                <div class="controles-item-dashboard">
                    <label class="chave-seletora" aria-label="Ativar ou desativar ${serv.nome}">
                        <input type="checkbox" class="checkbox-status-item" data-tipo="servico" data-id="${serv.id}" ${serv.ativo ? 'checked' : ''}>
                        <span class="trilho-chave"></span>
                    </label>
                    <div class="acoes-icone-dashboard">
                        <button type="button" class="botao-icone-dashboard acao-editar" data-acao="editar-servico" data-id="${serv.id}" aria-label="Editar ${serv.nome}" title="Editar serviço">
                            <img src="../icons/icon-editar.svg" alt="" aria-hidden="true">
                        </button>
                        <button type="button" class="botao-icone-dashboard acao-excluir" data-acao="excluir-servico" data-id="${serv.id}" aria-label="Excluir ${serv.nome}" title="Excluir serviço">
                            <img src="../icons/icon-excluir.svg" alt="" aria-hidden="true">
                        </button>
                    </div>
                </div>
            `;
            listaServicosEl.appendChild(li);
        });
    }

    // 4. Alternador de Abas (Barbeiros | Serviços)
    function alternarAbaGestao(novaAba) {
        abaAtiva = novaAba;
        const ehBarbeiros = (novaAba === 'barbeiros');

        abaBarbeiros.classList.toggle('ativo', ehBarbeiros);
        abaBarbeiros.setAttribute('aria-selected', String(ehBarbeiros));

        abaServicos.classList.toggle('ativo', !ehBarbeiros);
        abaServicos.setAttribute('aria-selected', String(!ehBarbeiros));

        secaoBarbeiros.hidden = !ehBarbeiros;
        secaoServicos.hidden = ehBarbeiros;

        if (botaoAdicionarItem) {
            botaoAdicionarItem.textContent = ehBarbeiros ? '+ Adicionar Barbeiro' : '+ Adicionar Serviço';
        }
    }

    if (abaBarbeiros && abaServicos) {
        abaBarbeiros.addEventListener('click', () => alternarAbaGestao('barbeiros'));
        abaServicos.addEventListener('click', () => alternarAbaGestao('servicos'));
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('aba') === 'servicos') {
        alternarAbaGestao('servicos');
    }

    // 5. Toggles Ativo/Inativo, Edição e Exclusão
    document.addEventListener('change', (evento) => {
        if (!evento.target.matches('.checkbox-status-item')) return;
        const tipo = evento.target.getAttribute('data-tipo');
        const id = evento.target.getAttribute('data-id');
        const estado = window.BarberDeckStore.obterEstado();

        if (tipo === 'barbeiro') {
            const barb = estado.barbeiros.find(b => b.id === id);
            if (barb) barb.ativo = evento.target.checked;
            window.BarberDeckStore.salvarEstado(estado);
            renderizarListaBarbeiros();
        } else if (tipo === 'servico') {
            const serv = estado.servicos.find(s => s.id === id);
            if (serv) serv.ativo = evento.target.checked;
            window.BarberDeckStore.salvarEstado(estado);
            renderizarListaServicos();
        }
    });

    function popularCheckboxesServicosDoBarbeiro(servicosIdsMarcados = []) {
        if (!containerCheckboxesServicosBarbeiro) return;
        const estado = window.BarberDeckStore.obterEstado();
        const servicos = estado.servicos || [];

        containerCheckboxesServicosBarbeiro.innerHTML = '';
        servicos.forEach((s) => {
            const marcado = servicosIdsMarcados.includes(s.id);
            const label = document.createElement('label');
            label.className = 'item-chk-servico-barbeiro';
            label.innerHTML = `
                <input type="checkbox" name="servicos_barbeiro" value="${s.id}" ${marcado ? 'checked' : ''}>
                <span>${s.nome}</span>
            `;
            containerCheckboxesServicosBarbeiro.appendChild(label);
        });
    }

    // Upload de foto no modal do barbeiro
    if (uploadFotoModalBarbeiro) {
        uploadFotoModalBarbeiro.addEventListener('change', (evento) => {
            const arquivo = evento.target.files && evento.target.files[0];
            if (!arquivo) return;
            const leitor = new FileReader();
            leitor.onload = (e) => {
                if (e.target && typeof e.target.result === 'string') {
                    fotoBarbeiroTemporaria = e.target.result;
                    if (previewFotoModalBarbeiro) previewFotoModalBarbeiro.src = fotoBarbeiroTemporaria;
                }
            };
            leitor.readAsDataURL(arquivo);
        });
    }

    // Botão '+ Adicionar Barbeiro' / '+ Adicionar Serviço'
    if (botaoAdicionarItem) {
        botaoAdicionarItem.addEventListener('click', () => {
            idItemEmEdicao = null;
            const estado = window.BarberDeckStore.obterEstado();

            if (abaAtiva === 'barbeiros') {
                tituloModalBarbeiro.textContent = 'Adicionar Barbeiro';
                campoNomeBarbeiro.value = '';
                campoEspecialidadeBarbeiro.value = '';
                fotoBarbeiroTemporaria = '../images/imagem-topo-barber.jpg';
                if (previewFotoModalBarbeiro) previewFotoModalBarbeiro.src = fotoBarbeiroTemporaria;
                const todosIds = (estado.servicos || []).map(s => s.id);
                popularCheckboxesServicosDoBarbeiro(todosIds);
                modalBarbeiro.showModal();
                campoNomeBarbeiro.focus();
            } else {
                tituloModalServico.textContent = 'Adicionar Serviço';
                campoNomeServico.value = '';
                campoDescricaoServico.value = '';
                campoCategoriaServico.value = 'corte';
                campoDuracaoServico.value = '30';
                campoPrecoServico.value = '';
                modalServico.showModal();
                campoNomeServico.focus();
            }
        });
    }

    // Clique em Editar ou Excluir
    document.addEventListener('click', (evento) => {
        const botaoAcao = evento.target.closest('.botao-icone-dashboard');
        if (!botaoAcao) return;

        const acao = botaoAcao.getAttribute('data-acao');
        const id = botaoAcao.getAttribute('data-id');
        const estado = window.BarberDeckStore.obterEstado();

        if (acao === 'excluir-barbeiro') {
            const barb = estado.barbeiros.find(b => b.id === id);
            if (barb && confirm(`Deseja realmente remover o barbeiro "${barb.nome}" da equipe?`)) {
                estado.barbeiros = estado.barbeiros.filter(b => b.id !== id);
                window.BarberDeckStore.salvarEstado(estado);
                renderizarListaBarbeiros();
                renderizarTopoEMetricas();
            }
            return;
        }

        if (acao === 'excluir-servico') {
            const serv = estado.servicos.find(s => s.id === id);
            if (serv && confirm(`Deseja realmente remover o serviço "${serv.nome}" do catálogo?`)) {
                estado.servicos = estado.servicos.filter(s => s.id !== id);
                window.BarberDeckStore.salvarEstado(estado);
                renderizarListaServicos();
            }
            return;
        }

        if (acao === 'editar-barbeiro') {
            const barb = estado.barbeiros.find(b => b.id === id);
            if (!barb) return;
            idItemEmEdicao = id;
            tituloModalBarbeiro.textContent = 'Editar Barbeiro';
            campoNomeBarbeiro.value = barb.nome;
            campoEspecialidadeBarbeiro.value = barb.especialidade;
            fotoBarbeiroTemporaria = barb.foto || '../images/imagem-topo-barber.jpg';
            if (previewFotoModalBarbeiro) previewFotoModalBarbeiro.src = fotoBarbeiroTemporaria;
            popularCheckboxesServicosDoBarbeiro(barb.servicosIds || []);
            modalBarbeiro.showModal();
            campoNomeBarbeiro.focus();
            return;
        }

        if (acao === 'editar-servico') {
            const serv = estado.servicos.find(s => s.id === id);
            if (!serv) return;
            idItemEmEdicao = id;
            tituloModalServico.textContent = 'Editar Serviço';
            campoNomeServico.value = serv.nome;
            campoDescricaoServico.value = serv.descricao || '';
            campoCategoriaServico.value = serv.categoria || 'corte';
            campoDuracaoServico.value = String(serv.duracao || 30);
            campoPrecoServico.value = Number(serv.preco).toFixed(2).replace('.', ',');
            modalServico.showModal();
            campoNomeServico.focus();
        }
    });

    // Salvar Barbeiro
    if (formModalBarbeiro) {
        formModalBarbeiro.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const nome = campoNomeBarbeiro.value.trim();
            const especialidade = campoEspecialidadeBarbeiro.value.trim();
            if (!nome || !especialidade) return;

            const servicosIds = Array.from(
                containerCheckboxesServicosBarbeiro.querySelectorAll('input[type="checkbox"]:checked')
            ).map(chk => chk.value);

            const estado = window.BarberDeckStore.obterEstado();

            if (idItemEmEdicao) {
                const barb = estado.barbeiros.find(b => b.id === idItemEmEdicao);
                if (barb) {
                    barb.nome = nome;
                    barb.especialidade = especialidade;
                    barb.foto = fotoBarbeiroTemporaria;
                    barb.servicosIds = servicosIds;
                }
            } else {
                estado.barbeiros.push({
                    id: `barb-${Date.now()}`,
                    barbeariaId: 1,
                    nome,
                    especialidade,
                    foto: fotoBarbeiroTemporaria,
                    nota: 5.0,
                    totalAvaliacoes: 1,
                    atendimentosBase: 0,
                    ativo: true,
                    servicosIds
                });
            }

            window.BarberDeckStore.salvarEstado(estado);
            modalBarbeiro.close();
            renderizarListaBarbeiros();
            renderizarTopoEMetricas();
        });
    }

    // Salvar Serviço
    if (formModalServico) {
        formModalServico.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const nome = campoNomeServico.value.trim();
            const descricao = campoDescricaoServico.value.trim();
            const categoria = campoCategoriaServico.value;
            const duracao = Number(campoDuracaoServico.value) || 30;
            const precoNumerico = parseFloat(campoPrecoServico.value.replace('R$', '').replace(/\s/g, '').replace(',', '.')) || 0;

            if (!nome || precoNumerico <= 0) return;

            const estado = window.BarberDeckStore.obterEstado();

            if (idItemEmEdicao) {
                const serv = estado.servicos.find(s => s.id === idItemEmEdicao);
                if (serv) {
                    serv.nome = nome;
                    serv.descricao = descricao;
                    serv.categoria = categoria;
                    serv.duracao = duracao;
                    serv.preco = precoNumerico;
                }
            } else {
                const novoId = `serv-${Date.now()}`;
                estado.servicos.push({
                    id: novoId,
                    barbeariaId: 1,
                    nome,
                    descricao,
                    categoria,
                    duracao,
                    preco: precoNumerico,
                    ativo: true
                });
                // Vincula automaticamente o novo serviço aos barbeiros ativos
                estado.barbeiros.forEach((b) => {
                    if (Array.isArray(b.servicosIds)) b.servicosIds.push(novoId);
                });
            }

            window.BarberDeckStore.salvarEstado(estado);
            modalServico.close();
            renderizarListaServicos();
            renderizarListaBarbeiros();
        });
    }

    // Fechar modais
    function configurarFechamento(modal, idFechar, idCancelar) {
        if (!modal) return;
        const btnF = document.getElementById(idFechar);
        const btnC = document.getElementById(idCancelar);
        if (btnF) btnF.addEventListener('click', () => modal.close());
        if (btnC) btnC.addEventListener('click', () => modal.close());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.close();
        });
    }

    configurarFechamento(modalBarbeiro, 'fechar-modal-barbeiro', 'cancelar-modal-barbeiro');
    configurarFechamento(modalServico, 'fechar-modal-servico', 'cancelar-modal-servico');

    // Inicialização
    renderizarTopoEMetricas();
    carregarHorariosFuncionamento();
    renderizarListaBarbeiros();
    renderizarListaServicos();
});
