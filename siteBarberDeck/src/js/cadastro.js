// CONTROLADOR DO FLUXO DE CADASTRO EM PASSOS (cadastro.js)
document.addEventListener('DOMContentLoaded', () => {
    const containerPagina = document.getElementById('container-pagina-cadastro');
    const botaoTipoCliente = document.getElementById('botao-tipo-cliente');
    const botaoTipoBarbearia = document.getElementById('botao-tipo-barbearia');

    const formCliente = document.getElementById('formulario-cadastro-cliente');
    const formBarbearia = document.getElementById('formulario-cadastro-barbearia');

    const clientePasso1 = document.getElementById('cliente-passo-1');
    const clientePasso2 = document.getElementById('cliente-passo-2');
    const botaoVoltarCliente = document.getElementById('botao-voltar-cliente');
    const botaoAvancarCliente = document.getElementById('botao-avancar-cliente');

    const barbeariaPasso1 = document.getElementById('barbearia-passo-1');
    const barbeariaPasso2 = document.getElementById('barbearia-passo-2');
    const barbeariaPasso3 = document.getElementById('barbearia-passo-3');
    const botaoVoltarBarbearia = document.getElementById('botao-voltar-barbearia');
    const botaoAvancarBarbearia = document.getElementById('botao-avancar-barbearia');

    const ind1 = document.getElementById('indicador-cadastro-1');
    const ind2 = document.getElementById('indicador-cadastro-2');
    const ind3 = document.getElementById('indicador-cadastro-3');
    const rotulo1 = document.getElementById('rotulo-passo-1');
    const rotulo2 = document.getElementById('rotulo-passo-2');
    const rotulo3 = document.getElementById('rotulo-passo-3');

    let perfilAtual = 'cliente';
    let passoCliente = 1;
    let passoBarbearia = 1;

    // Aplica máscaras de telefone, CNPJ e CEP nos inputs do cadastro
    const inputClienteWhatsapp = document.getElementById('cliente-whatsapp');
    const inputBarbCnpj = document.getElementById('barbearia-cnpj');
    const inputBarbWhatsapp = document.getElementById('barbearia-whatsapp');
    const inputBarbCep = document.getElementById('barbearia-cep');

    if (inputClienteWhatsapp && window.BarberDeckStore) {
        inputClienteWhatsapp.addEventListener('input', (e) => {
            e.target.value = window.BarberDeckStore.aplicarMascaraTelefone(e.target.value);
        });
    }
    if (inputBarbWhatsapp && window.BarberDeckStore) {
        inputBarbWhatsapp.addEventListener('input', (e) => {
            e.target.value = window.BarberDeckStore.aplicarMascaraTelefone(e.target.value);
        });
    }
    if (inputBarbCnpj && window.BarberDeckStore) {
        inputBarbCnpj.addEventListener('input', (e) => {
            e.target.value = window.BarberDeckStore.aplicarMascaraCNPJ(e.target.value);
        });
    }
    if (inputBarbCep && window.BarberDeckStore) {
        inputBarbCep.addEventListener('input', (e) => {
            e.target.value = window.BarberDeckStore.aplicarMascaraCEP(e.target.value);
        });
    }

    function atualizarInterface() {
        const ehCliente = (perfilAtual === 'cliente');
        const passoAtivo = ehCliente ? passoCliente : passoBarbearia;

        containerPagina.setAttribute('data-perfil', perfilAtual);
        containerPagina.setAttribute('data-passo', String(passoAtivo));

        // Atualiza cartões de perfil
        botaoTipoCliente.classList.toggle('ativo', ehCliente);
        botaoTipoCliente.setAttribute('aria-selected', String(ehCliente));
        botaoTipoBarbearia.classList.toggle('ativo', !ehCliente);
        botaoTipoBarbearia.setAttribute('aria-selected', String(!ehCliente));

        // Exibe o formulário correspondente
        formCliente.hidden = !ehCliente;
        formBarbearia.hidden = ehCliente;

        if (ehCliente) {
            // Cliente tem 2 passos: 1. Dados Pessoais -> 2. Acesso
            ind3.hidden = true;
            rotulo1.textContent = 'Dados Pessoais';
            rotulo2.textContent = 'Acesso';

            clientePasso1.hidden = (passoCliente !== 1);
            clientePasso2.hidden = (passoCliente !== 2);

            botaoVoltarCliente.hidden = (passoCliente === 1);
            botaoAvancarCliente.textContent = (passoCliente === 1) ? 'Próximo Passo' : 'Criar conta';

            ind1.classList.toggle('ativo', passoCliente === 1);
            ind1.classList.toggle('concluido', passoCliente > 1);
            ind2.classList.toggle('ativo', passoCliente === 2);
            ind2.classList.toggle('concluido', false);
        } else {
            // Barbearia tem 3 passos: 1. Empresa -> 2. Endereço -> 3. Acesso
            ind3.hidden = false;
            rotulo1.textContent = 'Empresa';
            rotulo2.textContent = 'Endereço';
            rotulo3.textContent = 'Acesso';

            barbeariaPasso1.hidden = (passoBarbearia !== 1);
            barbeariaPasso2.hidden = (passoBarbearia !== 2);
            barbeariaPasso3.hidden = (passoBarbearia !== 3);

            botaoVoltarBarbearia.hidden = (passoBarbearia === 1);
            botaoAvancarBarbearia.textContent = (passoBarbearia < 3) ? 'Próximo Passo' : 'Criar conta';

            ind1.classList.toggle('ativo', passoBarbearia === 1);
            ind1.classList.toggle('concluido', passoBarbearia > 1);
            ind2.classList.toggle('ativo', passoBarbearia === 2);
            ind2.classList.toggle('concluido', passoBarbearia > 2);
            ind3.classList.toggle('ativo', passoBarbearia === 3);
            ind3.classList.toggle('concluido', false);
        }
    }

    function validarEtapa(fieldset) {
        const campos = fieldset.querySelectorAll('input[required]');
        for (const campo of campos) {
            campo.setCustomValidity('');
            if (!campo.checkValidity()) {
                campo.reportValidity();
                return false;
            }
        }
        return true;
    }

    function validarSenhasIguais(inputSenha, inputConfirmar) {
        if (!inputSenha || !inputConfirmar) return true;
        inputSenha.setCustomValidity('');
        inputConfirmar.setCustomValidity('');

        if (inputSenha.value.length < 8) {
            inputSenha.setCustomValidity('A senha deve ter no mínimo 8 caracteres.');
            inputSenha.reportValidity();
            return false;
        }
        if (inputSenha.value !== inputConfirmar.value) {
            inputConfirmar.setCustomValidity('As senhas digitadas não conferem.');
            inputConfirmar.reportValidity();
            return false;
        }
        return true;
    }

    // Troca de Perfil (Cliente vs Barbearia)
    botaoTipoCliente.addEventListener('click', () => {
        perfilAtual = 'cliente';
        atualizarInterface();
    });

    botaoTipoBarbearia.addEventListener('click', () => {
        perfilAtual = 'barbearia';
        atualizarInterface();
    });

    // Navegação e Criação de Conta: Cliente
    botaoAvancarCliente.addEventListener('click', () => {
        if (passoCliente === 1) {
            if (validarEtapa(clientePasso1)) {
                passoCliente = 2;
                atualizarInterface();
            }
        } else {
            if (!validarEtapa(clientePasso2)) return;
            const senhaEl = document.getElementById('cliente-senha');
            const confEl = document.getElementById('cliente-confirmar-senha');
            if (!validarSenhasIguais(senhaEl, confEl)) return;

            if (window.BarberDeckStore) {
                const estado = window.BarberDeckStore.obterEstado();
                estado.cliente.nome = document.getElementById('cliente-nome').value.trim();
                estado.cliente.whatsapp = document.getElementById('cliente-whatsapp').value.trim();
                estado.cliente.cidade = document.getElementById('cliente-cidade').value.trim();
                estado.cliente.email = document.getElementById('cliente-email').value.trim();
                estado.cliente.senha = senhaEl.value;
                estado.sessao.tipo = 'cliente';
                window.BarberDeckStore.salvarEstado(estado);
            }
            window.location.href = 'index.html';
        }
    });

    botaoVoltarCliente.addEventListener('click', () => {
        if (passoCliente > 1) {
            passoCliente -= 1;
            atualizarInterface();
        }
    });

    // Navegação e Criação de Conta: Barbearia
    botaoAvancarBarbearia.addEventListener('click', () => {
        const etapaAtualEl = (passoBarbearia === 1) ? barbeariaPasso1 : ((passoBarbearia === 2) ? barbeariaPasso2 : barbeariaPasso3);
        if (!validarEtapa(etapaAtualEl)) return;

        if (passoBarbearia < 3) {
            passoBarbearia += 1;
            atualizarInterface();
        } else {
            const senhaEl = document.getElementById('barbearia-senha');
            const confEl = document.getElementById('barbearia-confirmar-senha');
            if (!validarSenhasIguais(senhaEl, confEl)) return;

            const params = new URLSearchParams(window.location.search);
            const planoEscolhido = params.get('plano') || 'pro';

            if (window.BarberDeckStore) {
                const estado = window.BarberDeckStore.obterEstado();
                const barbPrincipal = estado.barbearias.find(b => b.id === 1) || estado.barbearias[0];
                barbPrincipal.nome = document.getElementById('barbearia-nome').value.trim();
                barbPrincipal.cnpj = document.getElementById('barbearia-cnpj').value.trim();
                barbPrincipal.whatsapp = document.getElementById('barbearia-whatsapp').value.trim();
                barbPrincipal.cep = document.getElementById('barbearia-cep').value.trim();
                barbPrincipal.cidade = document.getElementById('barbearia-cidade').value.trim();
                barbPrincipal.bairro = document.getElementById('barbearia-bairro').value.trim();
                barbPrincipal.logradouro = document.getElementById('barbearia-logradouro').value.trim();
                barbPrincipal.email = document.getElementById('barbearia-email').value.trim();
                barbPrincipal.senha = senhaEl.value;
                barbPrincipal.plano = planoEscolhido;
                estado.sessao.tipo = 'barbearia';
                estado.sessao.barbeariaId = barbPrincipal.id;
                window.BarberDeckStore.salvarEstado(estado);
            }
            window.location.href = 'dashboard.html';
        }
    });

    botaoVoltarBarbearia.addEventListener('click', () => {
        if (passoBarbearia > 1) {
            passoBarbearia -= 1;
            atualizarInterface();
        }
    });

    // Verifica se a URL pediu perfil=barbearia (ex.: vindo dos botões de planos)
    const params = new URLSearchParams(window.location.search);
    if (params.get('perfil') === 'barbearia') {
        perfilAtual = 'barbearia';
    }

    atualizarInterface();
});
