// CONTROLADOR DO FLUXO DE AGENDAMENTO EM 4 ETAPAS (agendamento.js)
document.addEventListener('DOMContentLoaded', () => {
    const containerAgendamento = document.getElementById('container-agendamento');
    const secaoPasso1 = document.getElementById('passo-1');
    const secaoPasso2 = document.getElementById('passo-2');
    const secaoPasso3 = document.getElementById('passo-3');

    const listaServicosEl = document.getElementById('lista-servicos');
    const listaBarbeirosEl = document.getElementById('lista-barbeiros');
    const avisoErroServicos = document.getElementById('aviso-erro-servicos');

    const divisorBarbeiro = document.getElementById('divisor-barbeiro');
    const resumoSecaoBarbeiro = document.getElementById('resumo-secao-barbeiro');
    const divisorDataHora = document.getElementById('divisor-data-hora');
    const resumoSecaoDataHora = document.getElementById('resumo-secao-data-hora');

    const resumoListaServicos = document.getElementById('resumo-lista-servicos');
    const resumoDuracaoTotal = document.getElementById('resumo-duracao-total');
    const resumoValorTotal = document.getElementById('resumo-valor-total');
    const resumoFotoBarbeiro = document.getElementById('resumo-foto-barbeiro');
    const resumoNomeBarbeiro = document.getElementById('resumo-nome-barbeiro');
    const resumoEspecialidadeBarbeiro = document.getElementById('resumo-especialidade-barbeiro');
    const resumoDataHoraTexto = document.getElementById('resumo-data-hora-texto');

    const botaoPrincipal = document.getElementById('botao-acao-principal');
    const botaoSecundario = document.getElementById('botao-acao-secundaria');

    const btnMesAnterior = document.getElementById('botao-mes-anterior');
    const btnProximoMes = document.getElementById('botao-proximo-mes');
    const mesAnoAtualEl = document.getElementById('mes-ano-atual');
    const containerDiasMes = document.getElementById('container-dias-mes');
    const listaHorariosEl = document.getElementById('lista-horarios-disponiveis');
    const subtituloJanela = document.getElementById('subtitulo-janela-funcionamento');

    const indicadores = [
        document.getElementById('indicador-passo-1'),
        document.getElementById('indicador-passo-2'),
        document.getElementById('indicador-passo-3'),
        document.getElementById('indicador-passo-4')
    ];

    const NOMES_MESES = [
        'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
        'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
    ];
    const CHAVES_DIAS_SEMANA = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

    let passoAtual = 1;
    let anoCalendario = 2026;
    let mesCalendario = 9; // 9 = Outubro (0-indexed)
    let diaSelecionadoNumero = 20;
    let horarioSelecionadoValor = '14:30';

    // Identifica a barbearia pela URL (?barbearia=ID) ou usa a principal
    const params = new URLSearchParams(window.location.search);
    const barbeariaIdParam = params.get('barbearia') || 1;
    const barbeariaAtual = window.BarberDeckStore
        ? window.BarberDeckStore.obterBarbeariaPorId(barbeariaIdParam)
        : { id: 1, nome: 'Barbearia Navalha de Ouro', bairro: 'Centro', cidade: 'Erechim - RS', logradouro: 'Av. Maurício Cardoso, 500', whatsapp: '(54) 99985-3855', aberta: true, nota: 4.9, totalAvaliacoes: 128 };

    // 1. Preenche o Cabeçalho da Barbearia e Breadcrumb
    function preencherCabecalhoBarbearia() {
        const breadcrumbNome = document.getElementById('nome-barbearia');
        const resumoNomeBarb = document.getElementById('resumo-nome-barbearia');
        const vitrineFoto = document.getElementById('vitrine-foto-barbearia');
        const vitrineTitulo = document.getElementById('vitrine-titulo-barbearia');
        const vitrineStatus = document.getElementById('vitrine-selo-status');
        const vitrineAval = document.getElementById('vitrine-avaliacao');
        const vitrineDesc = document.getElementById('vitrine-descricao-barbearia');
        const vitrineEnd = document.getElementById('vitrine-endereco-barbearia');
        const vitrineWhats = document.getElementById('vitrine-whatsapp-barbearia');

        if (breadcrumbNome) breadcrumbNome.textContent = barbeariaAtual.nome;
        if (resumoNomeBarb) resumoNomeBarb.textContent = barbeariaAtual.nome;
        if (vitrineFoto) vitrineFoto.src = barbeariaAtual.fotoCapa || '../images/imagem-topo-barber.jpg';
        if (vitrineTitulo) vitrineTitulo.textContent = barbeariaAtual.nome;
        if (vitrineStatus) {
            vitrineStatus.className = `selo-status-vitrine ${barbeariaAtual.aberta ? 'aberto' : 'fechado'}`;
            vitrineStatus.textContent = barbeariaAtual.aberta ? 'Aberta agora' : 'Fechada no momento';
        }
        if (vitrineAval) {
            vitrineAval.textContent = `⭐ ${Number(barbeariaAtual.nota || 4.9).toFixed(1)} (${barbeariaAtual.totalAvaliacoes || 0} avaliações)`;
        }
        if (vitrineDesc) vitrineDesc.textContent = barbeariaAtual.descricao || '';
        if (vitrineEnd) {
            vitrineEnd.innerHTML = `<img src="../icons/icon-local.svg" alt="" aria-hidden="true"> ${barbeariaAtual.logradouro} - ${barbeariaAtual.bairro}, ${barbeariaAtual.cidade}`;
        }
        if (vitrineWhats) {
            vitrineWhats.innerHTML = `<img src="../icons/icon-whatsapp.svg" alt="" aria-hidden="true"> ${barbeariaAtual.whatsapp}`;
        }
    }

    // 2. Renderiza os Cartões de Serviços (Passo 1) a partir do BarberDeckStore
    function renderizarServicos() {
        const estado = window.BarberDeckStore.obterEstado();
        const servicosAtivos = (estado.servicos || []).filter(s => s.ativo);

        listaServicosEl.innerHTML = '<legend>Selecione um ou mais serviços</legend>';

        servicosAtivos.forEach((servico, idx) => {
            const marcadoInicial = (idx === 0 || idx === 2); // Marca Corte Degradê e Barba Completa inicialmente
            const precoFormatado = window.BarberDeckStore.formatarMoeda(servico.preco);

            const article = document.createElement('article');
            article.className = 'cartao-servico';
            article.innerHTML = `
                <label class="rotulo-servico" for="chk-${servico.id}">
                    <span class="cabecalho-servico">
                        <span class="nome-servico">${servico.nome}</span>
                        <span class="descricao-servico">${servico.descricao || 'Atendimento especializado'}</span>
                    </span>
                    <input type="checkbox" id="chk-${servico.id}" name="servicos" value="${servico.id}"
                        data-nome="${servico.nome}" data-duracao="${servico.duracao}" data-preco="${servico.preco}"
                        ${marcadoInicial ? 'checked' : ''}>
                </label>
                <div class="detalhes-servico">
                    <span class="duracao">
                        <span class="rotulo-duracao">
                            <img src="../icons/icon-calendar.svg" alt="" aria-hidden="true" width="14" height="14">
                            Duração
                        </span>
                        <span class="tempo-duracao">${servico.duracao} min</span>
                    </span>
                    <span class="valor-servico">${precoFormatado}</span>
                </div>
            `;
            listaServicosEl.appendChild(article);
        });

        listaServicosEl.addEventListener('change', () => {
            if (avisoErroServicos) avisoErroServicos.hidden = true;
            atualizarResumoServicos();
            renderizarBarbeiros();
            renderizarHorariosDisponiveis();
        });
    }

    function obterServicosSelecionados() {
        const checkboxes = Array.from(listaServicosEl.querySelectorAll('input[name="servicos"]:checked'));
        return checkboxes.map(chk => ({
            id: chk.value,
            nome: chk.getAttribute('data-nome'),
            duracao: Number(chk.getAttribute('data-duracao')) || 30,
            preco: Number(chk.getAttribute('data-preco')) || 0
        }));
    }

    function atualizarResumoServicos() {
        const selecionados = obterServicosSelecionados();
        resumoListaServicos.innerHTML = '';

        if (selecionados.length === 0) {
            resumoListaServicos.innerHTML = '<li><span class="item-servico">Nenhum serviço selecionado</span><span class="item-valor">R$ 0,00</span></li>';
            resumoDuracaoTotal.textContent = '0 min';
            resumoValorTotal.textContent = 'R$ 0,00';
            return;
        }

        let somaDuracao = 0;
        let somaValor = 0;

        selecionados.forEach((s) => {
            somaDuracao += s.duracao;
            somaValor += s.preco;
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="item-servico">${s.nome}</span>
                <span class="item-valor">${window.BarberDeckStore.formatarMoeda(s.preco)}</span>
            `;
            resumoListaServicos.appendChild(li);
        });

        resumoDuracaoTotal.textContent = `${somaDuracao} min`;
        resumoValorTotal.textContent = window.BarberDeckStore.formatarMoeda(somaValor);
    }

    // 3. Renderiza os Barbeiros (Passo 2)
    function renderizarBarbeiros() {
        const estado = window.BarberDeckStore.obterEstado();
        const barbeirosAtivos = (estado.barbeiros || []).filter(b => b.ativo);
        const radioAtual = listaBarbeirosEl.querySelector('input[name="barbeiro"]:checked');
        const idSelecionadoAntes = radioAtual ? radioAtual.value : null;

        listaBarbeirosEl.innerHTML = '<legend>Selecione um profissional</legend>';

        barbeirosAtivos.forEach((barb, idx) => {
            const deveMarcar = idSelecionadoAntes ? (barb.id === idSelecionadoAntes) : (idx === 0);
            const notaFormatada = Number(barb.nota || 4.9).toFixed(1);

            const article = document.createElement('article');
            article.className = 'cartao-barbeiro';
            article.innerHTML = `
                <label class="rotulo-barbeiro" for="radio-${barb.id}">
                    <input type="radio" id="radio-${barb.id}" name="barbeiro" value="${barb.id}"
                        data-nome="${barb.nome}" data-especialidade="${barb.especialidade}" data-foto="${barb.foto}"
                        ${deveMarcar ? 'checked' : ''}>
                    <span class="foto-perfil">
                        <img src="${barb.foto}" alt="Foto de ${barb.nome}" width="84" height="84">
                    </span>
                    <span class="info-barbeiro">
                        <span class="nome-profissional">${barb.nome}</span>
                        <span class="especialidade">${barb.especialidade}</span>
                        <span class="avaliacao">
                            <img src="../icons/icon-star.svg" alt="" aria-hidden="true" width="15" height="15">
                            <span class="nota">${notaFormatada} (${barb.totalAvaliacoes || 0} avaliações)</span>
                        </span>
                    </span>
                </label>
            `;
            listaBarbeirosEl.appendChild(article);
        });

        atualizarResumoBarbeiro();
    }

    listaBarbeirosEl.addEventListener('change', () => {
        atualizarResumoBarbeiro();
        renderizarHorariosDisponiveis();
    });

    function obterBarbeiroSelecionado() {
        const radio = listaBarbeirosEl.querySelector('input[name="barbeiro"]:checked');
        if (!radio) return { id: 'barb-1', nome: 'Lucas Ferreira', especialidade: 'Degradê e Barboterapia', foto: '../images/imagem-topo-barber.jpg' };
        return {
            id: radio.value,
            nome: radio.getAttribute('data-nome'),
            especialidade: radio.getAttribute('data-especialidade'),
            foto: radio.getAttribute('data-foto')
        };
    }

    function atualizarResumoBarbeiro() {
        const barb = obterBarbeiroSelecionado();
        if (resumoFotoBarbeiro) resumoFotoBarbeiro.src = barb.foto;
        if (resumoNomeBarbeiro) resumoNomeBarbeiro.textContent = barb.nome;
        if (resumoEspecialidadeBarbeiro) resumoEspecialidadeBarbeiro.textContent = barb.especialidade;
    }

    // 4. Renderiza o Calendário Mensal e os Horários Disponíveis (Passo 3)
    function obterDataFormatadaSelecionada() {
        const diaStr = String(diaSelecionadoNumero).padStart(2, '0');
        const mesStr = String(mesCalendario + 1).padStart(2, '0');
        return `${diaStr}/${mesStr}/${anoCalendario}`;
    }

    function renderizarCalendario() {
        if (!containerDiasMes || !mesAnoAtualEl) return;
        const estado = window.BarberDeckStore.obterEstado();
        const horariosFunc = estado.horariosFuncionamento || {};

        mesAnoAtualEl.textContent = `${NOMES_MESES[mesCalendario]} ${anoCalendario}`;
        containerDiasMes.innerHTML = '';

        const primeiroDiaSemana = new Date(anoCalendario, mesCalendario, 1).getDay();
        const totalDiasMes = new Date(anoCalendario, mesCalendario + 1, 0).getDate();
        const diasMesAnterior = new Date(anoCalendario, mesCalendario, 0).getDate();

        // Dias finais do mês anterior (desabilitados)
        for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'botao-dia-calendario';
            btn.disabled = true;
            btn.textContent = String(diasMesAnterior - i).padStart(2, '0');
            containerDiasMes.appendChild(btn);
        }

        let encontrouDiaValido = false;

        for (let dia = 1; dia <= totalDiasMes; dia++) {
            const dataObj = new Date(anoCalendario, mesCalendario, dia);
            const chaveDia = CHAVES_DIAS_SEMANA[dataObj.getDay()];
            const configDia = horariosFunc[chaveDia];
            const diaAberto = configDia ? Boolean(configDia.ativo) : (dataObj.getDay() !== 0);

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'botao-dia-calendario';
            btn.textContent = String(dia).padStart(2, '0');

            if (!diaAberto) {
                btn.disabled = true;
                btn.title = 'Barbearia fechada neste dia da semana';
            } else {
                if (dia === diaSelecionadoNumero) {
                    btn.classList.add('selecionado');
                    encontrouDiaValido = true;
                }
                btn.addEventListener('click', () => {
                    diaSelecionadoNumero = dia;
                    containerDiasMes.querySelectorAll('.botao-dia-calendario').forEach(b => b.classList.remove('selecionado'));
                    btn.classList.add('selecionado');
                    renderizarHorariosDisponiveis();
                });
            }

            containerDiasMes.appendChild(btn);
        }

        // Se o dia selecionado caiu num domingo/dia fechado, seleciona o primeiro dia aberto
        if (!encontrouDiaValido) {
            const primeiroAberto = containerDiasMes.querySelector('.botao-dia-calendario:not(:disabled)');
            if (primeiroAberto) {
                primeiroAberto.classList.add('selecionado');
                diaSelecionadoNumero = Number(primeiroAberto.textContent);
            }
        }

        renderizarHorariosDisponiveis();
    }

    function converterHoraParaMinutos(horaStr) {
        const [h, m] = (horaStr || '09:00').split(':').map(Number);
        return (h * 60) + (m || 0);
    }

    function converterMinutosParaHora(totalMin) {
        const h = String(Math.floor(totalMin / 60)).padStart(2, '0');
        const m = String(totalMin % 60).padStart(2, '0');
        return `${h}:${m}`;
    }

    function renderizarHorariosDisponiveis() {
        if (!listaHorariosEl) return;
        const estado = window.BarberDeckStore.obterEstado();
        const horariosFunc = estado.horariosFuncionamento || {};

        const dataObj = new Date(anoCalendario, mesCalendario, diaSelecionadoNumero);
        const chaveDia = CHAVES_DIAS_SEMANA[dataObj.getDay()];
        const configDia = horariosFunc[chaveDia] || { ativo: true, inicio: '09:00', fim: '19:00', rotulo: 'Dia útil' };

        if (!configDia.ativo) {
            listaHorariosEl.innerHTML = '<div class="aviso-sem-horarios">O estabelecimento não abre neste dia da semana. Selecione outra data no calendário.</div>';
            return;
        }

        const servicosSel = obterServicosSelecionados();
        const duracaoTotal = servicosSel.reduce((acc, s) => acc + s.duracao, 0) || 30;
        const barbeiroSel = obterBarbeiroSelecionado();
        const dataFormatada = obterDataFormatadaSelecionada();

        if (subtituloJanela) {
            subtituloJanela.textContent = `Expediente (${configDia.rotulo}): ${configDia.inicio} às ${configDia.fim} • Duração estimada: ${duracaoTotal} min`;
        }

        const minAbertura = converterHoraParaMinutos(configDia.inicio);
        const minFechamento = converterHoraParaMinutos(configDia.fim);

        // Busca agendamentos ativos e bloqueios do barbeiro na data selecionada
        const agendamentosOcupados = (estado.agendamentos || []).filter(
            ag => ag.barbeiroId === barbeiroSel.id && ag.data === dataFormatada && ag.status === 'em-aberto'
        );
        const bloqueiosDia = (estado.bloqueiosAgenda || []).filter(
            bl => bl.barbeiroId === barbeiroSel.id && bl.data === dataFormatada
        );

        listaHorariosEl.innerHTML = '';
        let primeiroHorarioLivre = null;
        let manteveHorarioAnterior = false;

        for (let min = minAbertura; min + duracaoTotal <= minFechamento; min += 30) {
            const horaCandidata = converterMinutosParaHora(min);
            const fimCandidato = min + duracaoTotal;

            // Verifica colisão com agendamentos existentes
            const conflitaAgendamento = agendamentosOcupados.some((ag) => {
                const agInicio = converterHoraParaMinutos(ag.hora);
                const agFim = agInicio + (Number(ag.duracaoTotal) || 45);
                return min < agFim && fimCandidato > agInicio;
            });

            // Verifica colisão com bloqueios de agenda (almoço/folga)
            const conflitaBloqueio = bloqueiosDia.some((bl) => {
                const blInicio = converterHoraParaMinutos(bl.inicio);
                const blFim = converterHoraParaMinutos(bl.fim);
                return min < blFim && fimCandidato > blInicio;
            });

            const estaOcupado = conflitaAgendamento || conflitaBloqueio;

            if (!estaOcupado && !primeiroHorarioLivre) {
                primeiroHorarioLivre = horaCandidata;
            }
            if (!estaOcupado && horaCandidata === horarioSelecionadoValor) {
                manteveHorarioAnterior = true;
            }

            const label = document.createElement('label');
            label.className = `cartao-horario ${estaOcupado ? 'ocupado' : ''}`;
            label.innerHTML = `
                <input type="radio" name="horario" value="${horaCandidata}" ${estaOcupado ? 'disabled' : ''}>
                <span>${horaCandidata}</span>
            `;
            listaHorariosEl.appendChild(label);
        }

        if (!manteveHorarioAnterior && primeiroHorarioLivre) {
            horarioSelecionadoValor = primeiroHorarioLivre;
        }

        const radioParaMarcar = listaHorariosEl.querySelector(`input[name="horario"][value="${horarioSelecionadoValor}"]:not(:disabled)`);
        if (radioParaMarcar) {
            radioParaMarcar.checked = true;
        }

        atualizarTextoDataHora();
    }

    listaHorariosEl.addEventListener('change', (evento) => {
        if (evento.target.matches('input[name="horario"]')) {
            horarioSelecionadoValor = evento.target.value;
            atualizarTextoDataHora();
        }
    });

    if (btnMesAnterior) {
        btnMesAnterior.addEventListener('click', () => {
            mesCalendario -= 1;
            if (mesCalendario < 0) {
                mesCalendario = 11;
                anoCalendario -= 1;
            }
            renderizarCalendario();
        });
    }

    if (btnProximoMes) {
        btnProximoMes.addEventListener('click', () => {
            mesCalendario += 1;
            if (mesCalendario > 11) {
                mesCalendario = 0;
                anoCalendario += 1;
            }
            renderizarCalendario();
        });
    }

    function atualizarTextoDataHora() {
        const dataStr = obterDataFormatadaSelecionada();
        if (resumoDataHoraTexto) {
            resumoDataHoraTexto.textContent = `${dataStr} às ${horarioSelecionadoValor}`;
        }
    }

    // 5. Controle de Navegação entre as 4 Etapas e Confirmação Final
    function atualizarEtapa(novoPasso) {
        passoAtual = Math.max(1, Math.min(4, novoPasso));
        containerAgendamento.setAttribute('data-passo-atual', String(passoAtual));

        secaoPasso1.hidden = (passoAtual !== 1);
        secaoPasso2.hidden = (passoAtual !== 2);
        secaoPasso3.hidden = (passoAtual !== 3);

        const exibirBarbeiro = (passoAtual >= 2);
        divisorBarbeiro.hidden = !exibirBarbeiro;
        resumoSecaoBarbeiro.hidden = !exibirBarbeiro;

        const exibirDataHora = (passoAtual >= 3);
        divisorDataHora.hidden = !exibirDataHora;
        resumoSecaoDataHora.hidden = !exibirDataHora;

        indicadores.forEach((item, indice) => {
            const numeroEtapa = indice + 1;
            item.classList.toggle('ativo', numeroEtapa === passoAtual);
            item.classList.toggle('concluido', numeroEtapa < passoAtual);
        });

        if (passoAtual === 1) {
            botaoPrincipal.textContent = 'PRÓXIMO PASSO';
            botaoSecundario.textContent = 'CANCELAR';
        } else if (passoAtual === 2 || passoAtual === 3) {
            botaoPrincipal.textContent = 'PRÓXIMO PASSO';
            botaoSecundario.textContent = 'PASSO ANTERIOR';
        } else if (passoAtual === 4) {
            botaoPrincipal.textContent = 'CONFIRMAR AGENDAMENTO';
            botaoSecundario.textContent = 'EDITAR AGENDAMENTO';
        }
    }

    botaoPrincipal.addEventListener('click', () => {
        const servicosEscolhidos = obterServicosSelecionados();
        if (servicosEscolhidos.length === 0) {
            if (avisoErroServicos) avisoErroServicos.hidden = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (passoAtual < 4) {
            atualizarEtapa(passoAtual + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Passo 4: Salva o novo agendamento no BarberDeckStore e redireciona para a Agenda
        const estado = window.BarberDeckStore.obterEstado();
        const barbeiroEscolhido = obterBarbeiroSelecionado();
        const duracaoTotal = servicosEscolhidos.reduce((acc, s) => acc + s.duracao, 0);
        const valorTotal = servicosEscolhidos.reduce((acc, s) => acc + s.preco, 0);
        const dataFormatada = obterDataFormatadaSelecionada();

        const novoAgendamento = {
            id: `ag-${Date.now()}`,
            barbeariaId: barbeariaAtual.id,
            barbeariaNome: barbeariaAtual.nome,
            enderecoBarbearia: `${barbeariaAtual.logradouro} - ${barbeariaAtual.bairro}, ${barbeariaAtual.cidade}`,
            clienteId: 1,
            clienteNome: estado.cliente.nome,
            clienteTelefone: estado.cliente.whatsapp,
            barbeiroId: barbeiroEscolhido.id,
            barbeiroNome: barbeiroEscolhido.nome,
            servicos: servicosEscolhidos.map(s => s.nome),
            duracaoTotal,
            valorTotal,
            data: dataFormatada,
            hora: horarioSelecionadoValor,
            ehHojeBarbearia: true,
            status: 'em-aberto',
            avaliacao: null
        };

        estado.agendamentos.unshift(novoAgendamento);
        window.BarberDeckStore.salvarEstado(estado);

        window.location.href = 'agenda.html';
    });

    botaoSecundario.addEventListener('click', () => {
        if (passoAtual === 1) {
            window.location.href = 'index.html';
        } else if (passoAtual === 4) {
            atualizarEtapa(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            atualizarEtapa(passoAtual - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Inicialização
    preencherCabecalhoBarbearia();
    renderizarServicos();
    atualizarResumoServicos();
    renderizarBarbeiros();
    renderizarCalendario();
    atualizarEtapa(1);
});
