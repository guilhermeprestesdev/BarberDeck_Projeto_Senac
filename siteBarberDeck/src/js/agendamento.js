// CONTROLADOR DO FLUXO DE AGENDAMENTO EM 4 ETAPAS (agendamento.js)
document.addEventListener('DOMContentLoaded', () => {
    const containerAgendamento = document.getElementById('container-agendamento');
    const secaoPasso1 = document.getElementById('passo-1');
    const secaoPasso2 = document.getElementById('passo-2');
    const secaoPasso3 = document.getElementById('passo-3');

    const divisorBarbeiro = document.getElementById('divisor-barbeiro');
    const resumoSecaoBarbeiro = document.getElementById('resumo-secao-barbeiro');
    const divisorDataHora = document.getElementById('divisor-data-hora');
    const resumoSecaoDataHora = document.getElementById('resumo-secao-data-hora');

    const botaoPrincipal = document.getElementById('botao-acao-principal');
    const botaoSecundario = document.getElementById('botao-acao-secundaria');

    const indicadores = [
        document.getElementById('indicador-passo-1'),
        document.getElementById('indicador-passo-2'),
        document.getElementById('indicador-passo-3'),
        document.getElementById('indicador-passo-4')
    ];

    let passoAtual = 1;

    function atualizarEtapa(novoPasso) {
        passoAtual = Math.max(1, Math.min(4, novoPasso));
        containerAgendamento.setAttribute('data-passo-atual', String(passoAtual));

        // 1. Oculta todas as etapas e revela apenas a etapa ativa (nos passos 1 a 3)
        secaoPasso1.hidden = (passoAtual !== 1);
        secaoPasso2.hidden = (passoAtual !== 2);
        secaoPasso3.hidden = (passoAtual !== 3);

        // 2. Revela progressivamente os blocos do resumo conforme o usuário avança
        const exibirBarbeiro = (passoAtual >= 2);
        divisorBarbeiro.hidden = !exibirBarbeiro;
        resumoSecaoBarbeiro.hidden = !exibirBarbeiro;

        const exibirDataHora = (passoAtual >= 3);
        divisorDataHora.hidden = !exibirDataHora;
        resumoSecaoDataHora.hidden = !exibirDataHora;

        // 3. Atualiza os círculos numerados do indicador de progresso (1 a 4)
        indicadores.forEach((item, indice) => {
            const numeroEtapa = indice + 1;
            item.classList.toggle('ativo', numeroEtapa === passoAtual);
            item.classList.toggle('concluido', numeroEtapa < passoAtual);
        });

        // 4. Atualiza os textos dos botões conforme as 4 imagens de referência
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

    // Avançar etapa ao clicar no botão principal
    botaoPrincipal.addEventListener('click', () => {
        if (passoAtual < 4) {
            atualizarEtapa(passoAtual + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            alert('Agendamento confirmado com sucesso!');
        }
    });

    // Voltar etapa ou cancelar ao clicar no botão secundário
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

    // Seleção de dia no calendário
    const botoesDia = document.querySelectorAll('.botao-dia-calendario');
    botoesDia.forEach((botao) => {
        botao.addEventListener('click', () => {
            botoesDia.forEach((b) => b.classList.remove('selecionado'));
            botao.classList.add('selecionado');
            atualizarTextoDataHora();
        });
    });

    // Atualização do texto de data e horário no resumo
    const inputsHorario = document.querySelectorAll('input[name="horario"]');
    inputsHorario.forEach((input) => {
        input.addEventListener('change', atualizarTextoDataHora);
    });

    function atualizarTextoDataHora() {
        const diaSelecionado = document.querySelector('.botao-dia-calendario.selecionado');
        const horarioSelecionado = document.querySelector('input[name="horario"]:checked');
        const textoDataHora = document.getElementById('resumo-data-hora-texto');
        if (diaSelecionado && horarioSelecionado && textoDataHora) {
            const dia = diaSelecionado.textContent.trim();
            textoDataHora.textContent = `${dia}/09/2026 às ${horarioSelecionado.value}`;
        }
    }

    // Inicializa no Passo 1
    atualizarEtapa(1);
});
