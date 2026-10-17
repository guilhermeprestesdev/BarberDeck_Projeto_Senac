// CONTROLADOR DA PÁGINA DE EDIÇÃO DE CONTA / PERFIL (perfil.js)
document.addEventListener('DOMContentLoaded', () => {
    const containerPagina = document.getElementById('container-pagina-perfil');
    const visaoCliente = document.getElementById('visao-perfil-cliente');
    const visaoBarbearia = document.getElementById('visao-perfil-barbearia');

    const btnModoCliente = document.getElementById('botao-perfil-modo-cliente');
    const btnModoBarbearia = document.getElementById('botao-perfil-modo-barbearia');
    const btnModoVisitante = document.getElementById('botao-perfil-modo-visitante');

    // Elementos do Cliente
    const previewFotoCliente = document.getElementById('preview-foto-cliente');
    const uploadFotoCliente = document.getElementById('upload-foto-cliente');
    const resumoNomeCliente = document.getElementById('resumo-nome-cliente');
    const resumoCidadeCliente = document.getElementById('resumo-cidade-cliente');
    const statClienteAbertos = document.getElementById('estatistica-cliente-abertos');
    const statClienteConcluidos = document.getElementById('estatistica-cliente-concluidos');

    const formDadosCliente = document.getElementById('form-dados-cliente');
    const inputClienteNome = document.getElementById('perfil-cliente-nome');
    const inputClienteWhatsapp = document.getElementById('perfil-cliente-whatsapp');
    const inputClienteCidade = document.getElementById('perfil-cliente-cidade');
    const inputClienteEmail = document.getElementById('perfil-cliente-email');
    const feedbackDadosCliente = document.getElementById('feedback-dados-cliente');

    const formSenhaCliente = document.getElementById('form-senha-cliente');
    const feedbackSenhaCliente = document.getElementById('feedback-senha-cliente');

    // Elementos da Barbearia
    const previewCapaBarbearia = document.getElementById('preview-capa-barbearia');
    const uploadCapaBarbearia = document.getElementById('upload-capa-barbearia');
    const previewFotoBarbearia = document.getElementById('preview-foto-barbearia');
    const uploadFotoBarbearia = document.getElementById('upload-foto-barbearia');
    const resumoNomeBarbearia = document.getElementById('resumo-nome-barbearia-perfil');
    const resumoEnderecoBarbearia = document.getElementById('resumo-endereco-barbearia-perfil');

    const seloNomePlano = document.getElementById('selo-nome-plano-ativo');
    const textoPrecoPlano = document.getElementById('texto-preco-plano-ativo');
    const seletorPlano = document.getElementById('seletor-plano-barbearia');

    const formDadosBarbearia = document.getElementById('form-dados-barbearia');
    const inputBarbNome = document.getElementById('perfil-barbearia-nome');
    const inputBarbCnpj = document.getElementById('perfil-barbearia-cnpj');
    const inputBarbWhatsapp = document.getElementById('perfil-barbearia-whatsapp');
    const inputBarbEmail = document.getElementById('perfil-barbearia-email');
    const inputBarbDescricao = document.getElementById('perfil-barbearia-descricao');
    const inputBarbCep = document.getElementById('perfil-barbearia-cep');
    const inputBarbCidade = document.getElementById('perfil-barbearia-cidade');
    const inputBarbBairro = document.getElementById('perfil-barbearia-bairro');
    const inputBarbLogradouro = document.getElementById('perfil-barbearia-logradouro');
    const feedbackDadosBarbearia = document.getElementById('feedback-dados-barbearia');

    const formSenhaBarbearia = document.getElementById('form-senha-barbearia');
    const feedbackSenhaBarbearia = document.getElementById('feedback-senha-barbearia');

    const INFO_PLANOS = {
        inicial: { nome: 'Plano Inicial', preco: 'R$ 0 / 15 dias de teste' },
        pro: { nome: 'Gestão Pro', preco: 'R$ 69,90 / mês' },
        elite: { nome: 'Elite e Destaque', preco: 'R$ 169,90 / mês' }
    };

    function exibirFeedback(elemento, mensagem, tipo = 'sucesso') {
        if (!elemento) return;
        elemento.textContent = mensagem;
        elemento.className = `aviso-feedback-perfil ${tipo}`;
        elemento.hidden = false;
        setTimeout(() => {
            elemento.hidden = true;
        }, 3500);
    }

    function carregarDadosNosFormularios() {
        const estado = window.BarberDeckStore.obterEstado();
        const cliente = estado.cliente;
        const barbearia = window.BarberDeckStore.obterBarbeariaPrincipal();

        // Preenche Cliente
        if (previewFotoCliente) previewFotoCliente.src = cliente.foto || '../images/imagem-topo-client.jpg';
        if (resumoNomeCliente) resumoNomeCliente.textContent = cliente.nome;
        if (resumoCidadeCliente) resumoCidadeCliente.textContent = cliente.cidade;
        if (inputClienteNome) inputClienteNome.value = cliente.nome || '';
        if (inputClienteWhatsapp) inputClienteWhatsapp.value = cliente.whatsapp || '';
        if (inputClienteCidade) inputClienteCidade.value = cliente.cidade || '';
        if (inputClienteEmail) inputClienteEmail.value = cliente.email || '';

        const agCliente = estado.agendamentos.filter(a => a.clienteId === 1);
        const abertos = agCliente.filter(a => a.status === 'em-aberto').length;
        const concluidos = agCliente.filter(a => a.status === 'concluido').length;
        if (statClienteAbertos) statClienteAbertos.textContent = String(abertos);
        if (statClienteConcluidos) statClienteConcluidos.textContent = String(concluidos);

        // Preenche Barbearia
        if (previewCapaBarbearia) previewCapaBarbearia.src = barbearia.fotoCapa || '../images/imagem-topo-barber.jpg';
        if (previewFotoBarbearia) previewFotoBarbearia.src = barbearia.fotoPerfil || barbearia.fotoCapa || '../images/imagem-topo-barber.jpg';
        if (resumoNomeBarbearia) resumoNomeBarbearia.textContent = barbearia.nome;
        if (resumoEnderecoBarbearia) resumoEnderecoBarbearia.textContent = `${barbearia.bairro} • ${barbearia.cidade}`;

        if (inputBarbNome) inputBarbNome.value = barbearia.nome || '';
        if (inputBarbCnpj) inputBarbCnpj.value = barbearia.cnpj || '';
        if (inputBarbWhatsapp) inputBarbWhatsapp.value = barbearia.whatsapp || '';
        if (inputBarbEmail) inputBarbEmail.value = barbearia.email || '';
        if (inputBarbDescricao) inputBarbDescricao.value = barbearia.descricao || '';
        if (inputBarbCep) inputBarbCep.value = barbearia.cep || '';
        if (inputBarbCidade) inputBarbCidade.value = barbearia.cidade || '';
        if (inputBarbBairro) inputBarbBairro.value = barbearia.bairro || '';
        if (inputBarbLogradouro) inputBarbLogradouro.value = barbearia.logradouro || '';

        const chavePlano = barbearia.plano || 'pro';
        const infoPlano = INFO_PLANOS[chavePlano] || INFO_PLANOS.pro;
        if (seletorPlano) seletorPlano.value = chavePlano;
        if (seloNomePlano) seloNomePlano.textContent = infoPlano.nome;
        if (textoPrecoPlano) textoPrecoPlano.textContent = infoPlano.preco;
    }

    function definirModoVisualizacao(modo) {
        if (modo === 'visitante') {
            window.BarberDeckStore.definirTipoSessao('visitante');
            btnModoCliente.classList.remove('ativo');
            btnModoBarbearia.classList.remove('ativo');
            btnModoVisitante.classList.add('ativo');
            return;
        }

        const ehCliente = (modo === 'cliente');
        containerPagina.setAttribute('data-modo-perfil', modo);
        visaoCliente.hidden = !ehCliente;
        visaoBarbearia.hidden = ehCliente;

        btnModoCliente.classList.toggle('ativo', ehCliente);
        btnModoBarbearia.classList.toggle('ativo', !ehCliente);
        btnModoVisitante.classList.remove('ativo');

        window.BarberDeckStore.definirTipoSessao(modo);
        carregarDadosNosFormularios();
    }

    const params = new URLSearchParams(window.location.search);
    const modoUrl = params.get('modo');
    const sessaoAtual = window.BarberDeckStore.obterSessao();
    if (modoUrl === 'barbearia' || modoUrl === 'cliente') {
        definirModoVisualizacao(modoUrl);
    } else if (sessaoAtual.tipo === 'barbearia') {
        definirModoVisualizacao('barbearia');
    } else {
        definirModoVisualizacao('cliente');
    }

    if (btnModoCliente) btnModoCliente.addEventListener('click', () => definirModoVisualizacao('cliente'));
    if (btnModoBarbearia) btnModoBarbearia.addEventListener('click', () => definirModoVisualizacao('barbearia'));
    if (btnModoVisitante) btnModoVisitante.addEventListener('click', () => definirModoVisualizacao('visitante'));

    if (inputClienteWhatsapp) {
        inputClienteWhatsapp.addEventListener('input', (e) => {
            e.target.value = window.BarberDeckStore.aplicarMascaraTelefone(e.target.value);
        });
    }
    if (inputBarbWhatsapp) {
        inputBarbWhatsapp.addEventListener('input', (e) => {
            e.target.value = window.BarberDeckStore.aplicarMascaraTelefone(e.target.value);
        });
    }
    if (inputBarbCnpj) {
        inputBarbCnpj.addEventListener('input', (e) => {
            e.target.value = window.BarberDeckStore.aplicarMascaraCNPJ(e.target.value);
        });
    }
    if (inputBarbCep) {
        inputBarbCep.addEventListener('input', (e) => {
            e.target.value = window.BarberDeckStore.aplicarMascaraCEP(e.target.value);
        });
    }

    function configurarUploadImagem(inputFile, callbackDataUrl) {
        if (!inputFile) return;
        inputFile.addEventListener('change', (evento) => {
            const arquivo = evento.target.files && evento.target.files[0];
            if (!arquivo) return;
            const leitor = new FileReader();
            leitor.onload = (e) => {
                if (e.target && typeof e.target.result === 'string') {
                    callbackDataUrl(e.target.result);
                }
            };
            leitor.readAsDataURL(arquivo);
        });
    }

    configurarUploadImagem(uploadFotoCliente, (dataUrl) => {
        const estado = window.BarberDeckStore.obterEstado();
        estado.cliente.foto = dataUrl;
        window.BarberDeckStore.salvarEstado(estado);
        carregarDadosNosFormularios();
        exibirFeedback(feedbackDadosCliente, 'Foto de perfil atualizada com sucesso!');
    });

    configurarUploadImagem(uploadFotoBarbearia, (dataUrl) => {
        const estado = window.BarberDeckStore.obterEstado();
        const barb = estado.barbearias.find(b => b.id === (estado.sessao.barbeariaId || 1)) || estado.barbearias[0];
        barb.fotoPerfil = dataUrl;
        window.BarberDeckStore.salvarEstado(estado);
        carregarDadosNosFormularios();
        exibirFeedback(feedbackDadosBarbearia, 'Logo da barbearia atualizada com sucesso!');
    });

    configurarUploadImagem(uploadCapaBarbearia, (dataUrl) => {
        const estado = window.BarberDeckStore.obterEstado();
        const barb = estado.barbearias.find(b => b.id === (estado.sessao.barbeariaId || 1)) || estado.barbearias[0];
        barb.fotoCapa = dataUrl;
        window.BarberDeckStore.salvarEstado(estado);
        carregarDadosNosFormularios();
        exibirFeedback(feedbackDadosBarbearia, 'Foto de capa da vitrine atualizada com sucesso!');
    });

    if (seletorPlano) {
        seletorPlano.addEventListener('change', () => {
            const estado = window.BarberDeckStore.obterEstado();
            const barb = estado.barbearias.find(b => b.id === (estado.sessao.barbeariaId || 1)) || estado.barbearias[0];
            barb.plano = seletorPlano.value;
            barb.destaque = (seletorPlano.value === 'elite' || seletorPlano.value === 'pro');
            window.BarberDeckStore.salvarEstado(estado);
            carregarDadosNosFormularios();
            exibirFeedback(feedbackDadosBarbearia, `Plano alterado para ${INFO_PLANOS[seletorPlano.value].nome}!`);
        });
    }

    if (formDadosCliente) {
        formDadosCliente.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const nome = inputClienteNome.value.trim();
            const whatsapp = inputClienteWhatsapp.value.trim();
            const cidade = inputClienteCidade.value.trim();
            const email = inputClienteEmail.value.trim();

            if (!nome || !whatsapp || !cidade || !email) {
                exibirFeedback(feedbackDadosCliente, 'Preencha todos os campos obrigatórios.', 'erro');
                return;
            }

            const estado = window.BarberDeckStore.obterEstado();
            estado.cliente.nome = nome;
            estado.cliente.whatsapp = whatsapp;
            estado.cliente.cidade = cidade;
            estado.cliente.email = email;

            estado.agendamentos.forEach((ag) => {
                if (ag.clienteId === 1) {
                    ag.clienteNome = nome;
                    ag.clienteTelefone = whatsapp;
                }
            });

            window.BarberDeckStore.salvarEstado(estado);
            carregarDadosNosFormularios();
            exibirFeedback(feedbackDadosCliente, 'Seus dados pessoais foram atualizados com sucesso!');
        });
    }

    if (formSenhaCliente) {
        formSenhaCliente.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const senhaAtual = document.getElementById('cliente-senha-atual').value;
            const novaSenha = document.getElementById('cliente-nova-senha').value;
            const confirmar = document.getElementById('cliente-confirmar-nova-senha').value;

            if (!senhaAtual || !novaSenha || !confirmar) {
                exibirFeedback(feedbackSenhaCliente, 'Preencha todos os campos de senha.', 'erro');
                return;
            }
            if (novaSenha.length < 8) {
                exibirFeedback(feedbackSenhaCliente, 'A nova senha deve ter no mínimo 8 caracteres.', 'erro');
                return;
            }
            if (novaSenha !== confirmar) {
                exibirFeedback(feedbackSenhaCliente, 'A confirmação de senha não confere.', 'erro');
                return;
            }

            const estado = window.BarberDeckStore.obterEstado();
            estado.cliente.senha = novaSenha;
            window.BarberDeckStore.salvarEstado(estado);
            formSenhaCliente.reset();
            exibirFeedback(feedbackSenhaCliente, 'Senha atualizada com sucesso!');
        });
    }

    if (formDadosBarbearia) {
        formDadosBarbearia.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const nome = inputBarbNome.value.trim();
            const cnpj = inputBarbCnpj.value.trim();
            const whatsapp = inputBarbWhatsapp.value.trim();
            const email = inputBarbEmail.value.trim();
            const descricao = inputBarbDescricao.value.trim();
            const cep = inputBarbCep.value.trim();
            const cidade = inputBarbCidade.value.trim();
            const bairro = inputBarbBairro.value.trim();
            const logradouro = inputBarbLogradouro.value.trim();

            if (!nome || !cnpj || !whatsapp || !email || !cep || !cidade || !bairro || !logradouro) {
                exibirFeedback(feedbackDadosBarbearia, 'Preencha todos os campos obrigatórios da barbearia.', 'erro');
                return;
            }

            const estado = window.BarberDeckStore.obterEstado();
            const barb = estado.barbearias.find(b => b.id === (estado.sessao.barbeariaId || 1)) || estado.barbearias[0];
            barb.nome = nome;
            barb.cnpj = cnpj;
            barb.whatsapp = whatsapp;
            barb.email = email;
            barb.descricao = descricao;
            barb.cep = cep;
            barb.cidade = cidade;
            barb.bairro = bairro;
            barb.logradouro = logradouro;

            const novoEnderecoCompleto = `${logradouro} - ${bairro}, ${cidade}`;
            estado.agendamentos.forEach((ag) => {
                if (ag.barbeariaId === barb.id) {
                    ag.barbeariaNome = nome;
                    ag.enderecoBarbearia = novoEnderecoCompleto;
                }
            });

            window.BarberDeckStore.salvarEstado(estado);
            carregarDadosNosFormularios();
            exibirFeedback(feedbackDadosBarbearia, 'Dados da barbearia atualizados em todo o site!');
        });
    }

    if (formSenhaBarbearia) {
        formSenhaBarbearia.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const senhaAtual = document.getElementById('barbearia-senha-atual').value;
            const novaSenha = document.getElementById('barbearia-nova-senha').value;
            const confirmar = document.getElementById('barbearia-confirmar-nova-senha').value;

            if (!senhaAtual || !novaSenha || !confirmar) {
                exibirFeedback(feedbackSenhaBarbearia, 'Preencha todos os campos de senha.', 'erro');
                return;
            }
            if (novaSenha.length < 8) {
                exibirFeedback(feedbackSenhaBarbearia, 'A nova senha deve ter no mínimo 8 caracteres.', 'erro');
                return;
            }
            if (novaSenha !== confirmar) {
                exibirFeedback(feedbackSenhaBarbearia, 'A confirmação de senha não confere.', 'erro');
                return;
            }

            const estado = window.BarberDeckStore.obterEstado();
            const barb = estado.barbearias.find(b => b.id === (estado.sessao.barbeariaId || 1)) || estado.barbearias[0];
            barb.senha = novaSenha;
            window.BarberDeckStore.salvarEstado(estado);
            formSenhaBarbearia.reset();
            exibirFeedback(feedbackSenhaBarbearia, 'Senha administrativa atualizada com sucesso!');
        });
    }

    const btnSairCliente = document.getElementById('botao-sair-cliente');
    const btnSairBarbearia = document.getElementById('botao-sair-barbearia');

    const executarLogout = () => {
        window.BarberDeckStore.definirTipoSessao('visitante');
        window.location.href = 'index.html';
    };

    if (btnSairCliente) btnSairCliente.addEventListener('click', executarLogout);
    if (btnSairBarbearia) btnSairBarbearia.addEventListener('click', executarLogout);
});
