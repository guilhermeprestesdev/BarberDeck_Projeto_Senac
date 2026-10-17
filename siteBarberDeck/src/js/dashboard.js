// CONTROLADOR DA PÁGINA DE DASHBOARD (dashboard.js)
document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. ALTERNADOR DE STATUS DA BARBEARIA (Barbearia aberta / fechada)
    // =========================================================================
    const botaoStatusBarbearia = document.getElementById('botao-status-barbearia');
    const textoStatusBarbearia = document.getElementById('texto-status-barbearia');

    if (botaoStatusBarbearia && textoStatusBarbearia) {
        botaoStatusBarbearia.addEventListener('click', () => {
            const estaAberta = botaoStatusBarbearia.classList.contains('aberta');
            botaoStatusBarbearia.classList.toggle('aberta', !estaAberta);
            botaoStatusBarbearia.classList.toggle('fechada', estaAberta);
            botaoStatusBarbearia.setAttribute('aria-pressed', String(!estaAberta));
            textoStatusBarbearia.textContent = estaAberta ? 'Barbearia fechada' : 'Barbearia aberta';
        });
    }

    // =========================================================================
    // 2. HORÁRIO DE FUNCIONAMENTO (Toggles por dia + Salvar Horários)
    // =========================================================================
    const checkboxesDias = document.querySelectorAll('.checkbox-dia-funcionamento');
    const formHorarios = document.getElementById('formulario-horarios');
    const botaoSalvarHorarios = document.getElementById('botao-salvar-horarios');

    checkboxesDias.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            const linhaDia = checkbox.closest('.linha-dia-funcionamento');
            if (!linhaDia) return;

            const grupoIntervalo = linhaDia.querySelector('.grupo-intervalo-horario');
            const ativo = checkbox.checked;

            linhaDia.classList.toggle('dia-fechado', !ativo);
            if (grupoIntervalo) {
                grupoIntervalo.hidden = !ativo;
            }
        });
    });

    if (formHorarios && botaoSalvarHorarios) {
        formHorarios.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const textoOriginal = botaoSalvarHorarios.textContent;
            botaoSalvarHorarios.textContent = 'Horários Salvos!';
            setTimeout(() => {
                botaoSalvarHorarios.textContent = textoOriginal;
            }, 1800);
        });
    }

    // =========================================================================
    // 3. ALTERNADOR DE ABAS DO PAINEL DIREITO (Barbeiros | Serviços)
    // =========================================================================
    const abaBarbeiros = document.getElementById('aba-barbeiros');
    const abaServicos = document.getElementById('aba-servicos');
    const secaoBarbeiros = document.getElementById('secao-lista-barbeiros');
    const secaoServicos = document.getElementById('secao-lista-servicos');
    const botaoAdicionarItem = document.getElementById('botao-adicionar-item');

    let abaAtiva = 'barbeiros';

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

    // Permite abrir diretamente na aba de serviços se ?aba=servicos estiver na URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('aba') === 'servicos') {
        alternarAbaGestao('servicos');
    }

    // =========================================================================
    // 4. INTERAÇÕES NAS LISTAS DE BARBEIROS E SERVIÇOS (Toggle, Editar, Excluir)
    // =========================================================================
    const listaBarbeiros = document.getElementById('lista-barbeiros-dashboard');
    const listaServicos = document.getElementById('lista-servicos-dashboard');

    // Modal Barbeiro
    const modalBarbeiro = document.getElementById('modal-dashboard-barbeiro');
    const tituloModalBarbeiro = document.getElementById('titulo-modal-barbeiro');
    const formModalBarbeiro = document.getElementById('formulario-modal-barbeiro');
    const campoNomeBarbeiro = document.getElementById('campo-nome-barbeiro');
    const campoEspecialidadeBarbeiro = document.getElementById('campo-especialidade-barbeiro');
    const campoAtendimentosBarbeiro = document.getElementById('campo-atendimentos-barbeiro');
    const fecharModalBarbeiro = document.getElementById('fechar-modal-barbeiro');
    const cancelarModalBarbeiro = document.getElementById('cancelar-modal-barbeiro');

    // Modal Serviço
    const modalServico = document.getElementById('modal-dashboard-servico');
    const tituloModalServico = document.getElementById('titulo-modal-servico');
    const formModalServico = document.getElementById('formulario-modal-servico');
    const campoNomeServico = document.getElementById('campo-nome-servico');
    const campoCategoriaServico = document.getElementById('campo-categoria-servico');
    const campoPrecoServico = document.getElementById('campo-preco-servico');
    const fecharModalServico = document.getElementById('fechar-modal-servico');
    const cancelarModalServico = document.getElementById('cancelar-modal-servico');

    let itemEmEdicao = null;

    // Alternar estado ativo/inativo ao mudar o switch de um barbeiro ou serviço
    document.addEventListener('change', (evento) => {
        if (evento.target.matches('.checkbox-status-item')) {
            const item = evento.target.closest('.item-lista-dashboard');
            if (item) {
                item.classList.toggle('item-inativo', !evento.target.checked);
            }
        }
    });

    // Botão '+ Adicionar Barbeiro' / '+ Adicionar Serviço'
    if (botaoAdicionarItem) {
        botaoAdicionarItem.addEventListener('click', () => {
            itemEmEdicao = null;
            if (abaAtiva === 'barbeiros') {
                tituloModalBarbeiro.textContent = 'Adicionar Barbeiro';
                campoNomeBarbeiro.value = '';
                campoEspecialidadeBarbeiro.value = '';
                campoAtendimentosBarbeiro.value = '0';
                modalBarbeiro.showModal();
                campoNomeBarbeiro.focus();
            } else {
                tituloModalServico.textContent = 'Adicionar Serviço';
                campoNomeServico.value = '';
                campoCategoriaServico.value = '';
                campoPrecoServico.value = '';
                modalServico.showModal();
                campoNomeServico.focus();
            }
        });
    }

    // Delegação de clique para botões Editar (lápis) e Excluir (lixeira)
    document.addEventListener('click', (evento) => {
        const botaoAcao = evento.target.closest('.botao-icone-dashboard');
        if (!botaoAcao) return;

        const item = botaoAcao.closest('.item-lista-dashboard');
        const acao = botaoAcao.getAttribute('data-acao');
        if (!item) return;

        // Excluir Barbeiro ou Serviço
        if (acao === 'excluir-item') {
            const nomeItem = item.getAttribute('data-nome') || 'este item';
            if (confirm(`Deseja realmente remover "${nomeItem}"?`)) {
                item.remove();
            }
            return;
        }

        // Editar Barbeiro
        if (acao === 'editar-barbeiro') {
            itemEmEdicao = item;
            tituloModalBarbeiro.textContent = 'Editar Barbeiro';
            campoNomeBarbeiro.value = item.getAttribute('data-nome') || '';
            campoEspecialidadeBarbeiro.value = item.getAttribute('data-especialidade') || '';
            campoAtendimentosBarbeiro.value = item.getAttribute('data-atendimentos') || '0';
            modalBarbeiro.showModal();
            campoNomeBarbeiro.focus();
            return;
        }

        // Editar Serviço
        if (acao === 'editar-servico') {
            itemEmEdicao = item;
            tituloModalServico.textContent = 'Editar Serviço';
            campoNomeServico.value = item.getAttribute('data-nome') || '';
            campoCategoriaServico.value = item.getAttribute('data-categoria') || '';
            campoPrecoServico.value = item.getAttribute('data-preco') || '';
            modalServico.showModal();
            campoNomeServico.focus();
        }
    });

    // Salvar Barbeiro (Edição ou Novo)
    if (formModalBarbeiro) {
        formModalBarbeiro.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const nome = campoNomeBarbeiro.value.trim();
            const especialidade = campoEspecialidadeBarbeiro.value.trim();
            const atendimentos = campoAtendimentosBarbeiro.value.trim() || '0';
            if (!nome || !especialidade) return;

            if (itemEmEdicao) {
                itemEmEdicao.setAttribute('data-nome', nome);
                itemEmEdicao.setAttribute('data-especialidade', especialidade);
                itemEmEdicao.setAttribute('data-atendimentos', atendimentos);

                const elTitulo = itemEmEdicao.querySelector('.titulo-item-dashboard');
                const elSub = itemEmEdicao.querySelector('.subtitulo-item-dashboard');
                const elMeta = itemEmEdicao.querySelector('.meta-item-dashboard');
                if (elTitulo) elTitulo.textContent = nome;
                if (elSub) elSub.textContent = especialidade;
                if (elMeta) elMeta.textContent = `${atendimentos} atendimentos`;
            } else if (listaBarbeiros) {
                const novoLi = document.createElement('li');
                novoLi.className = 'item-lista-dashboard item-barbeiro';
                novoLi.setAttribute('data-nome', nome);
                novoLi.setAttribute('data-especialidade', especialidade);
                novoLi.setAttribute('data-atendimentos', atendimentos);
                novoLi.innerHTML = `
                    <div class="bloco-esquerdo-barbeiro">
                        <figure class="foto-barbeiro-dashboard">
                            <img src="../images/imagem-topo-barber.jpg" alt="Foto de ${nome}">
                        </figure>
                        <div class="dados-item-dashboard">
                            <h3 class="titulo-item-dashboard">${nome}</h3>
                            <p class="subtitulo-item-dashboard">${especialidade}</p>
                            <span class="meta-item-dashboard">${atendimentos} atendimentos</span>
                        </div>
                    </div>
                    <div class="controles-item-dashboard">
                        <label class="chave-seletora" aria-label="Ativar ou desativar ${nome}">
                            <input type="checkbox" class="checkbox-status-item" checked>
                            <span class="trilho-chave"></span>
                        </label>
                        <div class="acoes-icone-dashboard">
                            <button type="button" class="botao-icone-dashboard acao-editar" data-acao="editar-barbeiro" aria-label="Editar ${nome}" title="Editar barbeiro">
                                <img src="../icons/icon-editar.svg" alt="" aria-hidden="true">
                            </button>
                            <button type="button" class="botao-icone-dashboard acao-excluir" data-acao="excluir-item" aria-label="Excluir ${nome}" title="Excluir barbeiro">
                                <img src="../icons/icon-excluir.svg" alt="" aria-hidden="true">
                            </button>
                        </div>
                    </div>
                `;
                listaBarbeiros.appendChild(novoLi);
            }

            modalBarbeiro.close();
        });
    }

    // Salvar Serviço (Edição ou Novo)
    if (formModalServico) {
        formModalServico.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const nome = campoNomeServico.value.trim();
            const categoria = campoCategoriaServico.value.trim().toLowerCase();
            const precoLimpo = campoPrecoServico.value.trim().replace(/^R\$\s*/, '');
            if (!nome || !categoria || !precoLimpo) return;

            if (itemEmEdicao) {
                itemEmEdicao.setAttribute('data-nome', nome);
                itemEmEdicao.setAttribute('data-categoria', categoria);
                itemEmEdicao.setAttribute('data-preco', precoLimpo);

                const elTitulo = itemEmEdicao.querySelector('.titulo-item-dashboard');
                const elCat = itemEmEdicao.querySelector('.etiqueta-categoria-servico');
                const elPreco = itemEmEdicao.querySelector('.preco-item-servico');
                if (elTitulo) elTitulo.textContent = nome;
                if (elCat) elCat.textContent = categoria;
                if (elPreco) elPreco.textContent = `R$ ${precoLimpo}`;
            } else if (listaServicos) {
                const novoLi = document.createElement('li');
                novoLi.className = 'item-lista-dashboard item-servico';
                novoLi.setAttribute('data-nome', nome);
                novoLi.setAttribute('data-categoria', categoria);
                novoLi.setAttribute('data-preco', precoLimpo);
                novoLi.innerHTML = `
                    <div class="dados-item-dashboard">
                        <div class="linha-titulo-servico">
                            <h3 class="titulo-item-dashboard">${nome}</h3>
                            <span class="etiqueta-categoria-servico">${categoria}</span>
                        </div>
                        <strong class="preco-item-servico">R$ ${precoLimpo}</strong>
                    </div>
                    <div class="controles-item-dashboard">
                        <label class="chave-seletora" aria-label="Ativar ou desativar ${nome}">
                            <input type="checkbox" class="checkbox-status-item" checked>
                            <span class="trilho-chave"></span>
                        </label>
                        <div class="acoes-icone-dashboard">
                            <button type="button" class="botao-icone-dashboard acao-editar" data-acao="editar-servico" aria-label="Editar ${nome}" title="Editar serviço">
                                <img src="../icons/icon-editar.svg" alt="" aria-hidden="true">
                            </button>
                            <button type="button" class="botao-icone-dashboard acao-excluir" data-acao="excluir-item" aria-label="Excluir ${nome}" title="Excluir serviço">
                                <img src="../icons/icon-excluir.svg" alt="" aria-hidden="true">
                            </button>
                        </div>
                    </div>
                `;
                listaServicos.appendChild(novoLi);
            }

            modalServico.close();
        });
    }

    // Fechamento dos modais
    if (fecharModalBarbeiro) fecharModalBarbeiro.addEventListener('click', () => modalBarbeiro.close());
    if (cancelarModalBarbeiro) cancelarModalBarbeiro.addEventListener('click', () => modalBarbeiro.close());
    if (modalBarbeiro) {
        modalBarbeiro.addEventListener('click', (e) => {
            if (e.target === modalBarbeiro) modalBarbeiro.close();
        });
    }

    if (fecharModalServico) fecharModalServico.addEventListener('click', () => modalServico.close());
    if (cancelarModalServico) cancelarModalServico.addEventListener('click', () => modalServico.close());
    if (modalServico) {
        modalServico.addEventListener('click', (e) => {
            if (e.target === modalServico) modalServico.close();
        });
    }
});
