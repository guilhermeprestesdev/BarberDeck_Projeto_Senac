// =============================================================================
// CAMADA DE DADOS E ESTADO GLOBAL DO FRONTEND (window.BarberDeckStore)
// Prepara toda a lógica de estado em localStorage espelhando o futuro banco PHP/MySQL
// =============================================================================
const CHAVE_STORAGE_BARBERDECK = 'barberdeck_estado_v1';

const DADOS_INICIAIS_BARBERDECK = {
    sessao: {
        tipo: 'cliente', // 'visitante' | 'cliente' | 'barbearia'
        usuarioId: 1,
        barbeariaId: 1
    },
    cliente: {
        id: 1,
        nome: 'João Pedro da Silva',
        email: 'joao.silva@email.com',
        senha: '12345678',
        whatsapp: '(54) 99985-3855',
        cidade: 'Erechim - RS',
        foto: '../images/imagem-topo-client.jpg'
    },
    barbearias: [
        {
            id: 1,
            nome: 'Barbearia Navalha de Ouro',
            cnpj: '12.345.678/0001-90',
            whatsapp: '(54) 99985-3855',
            email: 'contato@navalhadeouro.com.br',
            senha: '12345678',
            cep: '99700-000',
            cidade: 'Erechim - RS',
            bairro: 'Centro',
            logradouro: 'Av. Maurício Cardoso, 500',
            descricao: 'Tradição em cortes clássicos, degradê na navalha e barboterapia com toalha quente no coração de Erechim.',
            fotoCapa: '../images/imagem-topo-barber.jpg',
            fotoPerfil: '../images/imagem-topo-barber.jpg',
            aberta: true,
            nota: 4.9,
            totalAvaliacoes: 128,
            plano: 'pro',
            destaque: true,
            nova: false
        },
        {
            id: 2,
            nome: 'Barbearia Clássica',
            cnpj: '23.456.789/0001-11',
            whatsapp: '(54) 99912-4400',
            email: 'contato@barbeariaclassica.com.br',
            senha: '12345678',
            cep: '99700-120',
            cidade: 'Erechim - RS',
            bairro: 'Centro',
            logradouro: 'Rua Itália, 210',
            descricao: 'Ambiente clássico, atendimento pontual e especialistas em corte tradicional na tesoura e barba modelada.',
            fotoCapa: '../images/imagem-topo-client.jpg',
            fotoPerfil: '../images/imagem-topo-client.jpg',
            aberta: false,
            nota: 4.8,
            totalAvaliacoes: 94,
            plano: 'pro',
            destaque: true,
            nova: false
        },
        {
            id: 3,
            nome: 'Barbearia Dom Bigode',
            cnpj: '34.567.890/0001-22',
            whatsapp: '(54) 99876-5432',
            email: 'contato@dombigode.com.br',
            senha: '12345678',
            cep: '99701-300',
            cidade: 'Erechim - RS',
            bairro: 'Fátima',
            logradouro: 'Av. Sete de Setembro, 1120',
            descricao: 'Referência em visagismo masculino, cuidados com a barba e produtos de linha premium.',
            fotoCapa: '../images/imagem-topo-barber.jpg',
            fotoPerfil: '../images/imagem-topo-barber.jpg',
            aberta: true,
            nota: 5.0,
            totalAvaliacoes: 67,
            plano: 'elite',
            destaque: true,
            nova: false
        },
        {
            id: 4,
            nome: 'Deck Studio Barber',
            cnpj: '45.678.901/0001-33',
            whatsapp: '(54) 99654-3210',
            email: 'contato@deckstudio.com.br',
            senha: '12345678',
            cep: '99704-050',
            cidade: 'Erechim - RS',
            bairro: 'Três Vendas',
            logradouro: 'Rua Alemanha, 840',
            descricao: 'Estúdio moderno especializado em cortes urbanos, degradê americano, freestyle e pigmentação.',
            fotoCapa: '../images/imagem-topo-client.jpg',
            fotoPerfil: '../images/imagem-topo-client.jpg',
            aberta: true,
            nota: 4.7,
            totalAvaliacoes: 31,
            plano: 'inicial',
            destaque: false,
            nova: true
        },
        {
            id: 5,
            nome: 'Confraria da Barba',
            cnpj: '56.789.012/0001-44',
            whatsapp: '(54) 99111-2233',
            email: 'contato@confrariadabarba.com.br',
            senha: '12345678',
            cep: '99010-000',
            cidade: 'Passo Fundo - RS',
            bairro: 'Centro',
            logradouro: 'Av. Brasil, 1450',
            descricao: 'Experiência completa em barboterapia com ozônio, corte executivo e hidratação capilar.',
            fotoCapa: '../images/imagem-topo-barber.jpg',
            fotoPerfil: '../images/imagem-topo-barber.jpg',
            aberta: false,
            nota: 4.9,
            totalAvaliacoes: 42,
            plano: 'pro',
            destaque: false,
            nova: true
        },
        {
            id: 6,
            nome: 'Viking Barber Club',
            cnpj: '67.890.123/0001-55',
            whatsapp: '(54) 99222-3344',
            email: 'contato@vikingbarber.com.br',
            senha: '12345678',
            cep: '99700-400',
            cidade: 'Erechim - RS',
            bairro: 'Bela Vista',
            logradouro: 'Rua Espírito Santo, 310',
            descricao: 'Estilo rústico, atendimento sem fila e especialistas em barbas longas e degradê navalhado.',
            fotoCapa: '../images/imagem-topo-client.jpg',
            fotoPerfil: '../images/imagem-topo-client.jpg',
            aberta: true,
            nota: 4.6,
            totalAvaliacoes: 19,
            plano: 'inicial',
            destaque: false,
            nova: true
        }
    ],
    horariosFuncionamento: {
        segunda: { diaSemana: 1, rotulo: 'Segunda Feira', ativo: true, inicio: '09:00', fim: '19:00' },
        terca: { diaSemana: 2, rotulo: 'Terça Feira', ativo: true, inicio: '09:00', fim: '19:00' },
        quarta: { diaSemana: 3, rotulo: 'Quarta Feira', ativo: true, inicio: '09:00', fim: '19:00' },
        quinta: { diaSemana: 4, rotulo: 'Quinta Feira', ativo: true, inicio: '09:00', fim: '20:00' },
        sexta: { diaSemana: 5, rotulo: 'Sexta Feira', ativo: true, inicio: '09:00', fim: '20:00' },
        sabado: { diaSemana: 6, rotulo: 'Sábado', ativo: true, inicio: '08:30', fim: '18:00' },
        domingo: { diaSemana: 0, rotulo: 'Domingo', ativo: false, inicio: '09:00', fim: '13:00' }
    },
    servicos: [
        {
            id: 'serv-1',
            barbeariaId: 1,
            nome: 'Corte Degradê',
            descricao: 'Acabamento na navalha com transição suave',
            categoria: 'corte',
            duracao: 45,
            preco: 45.00,
            ativo: true
        },
        {
            id: 'serv-2',
            barbeariaId: 1,
            nome: 'Corte Tradicional',
            descricao: 'Corte social clássico na tesoura e máquina',
            categoria: 'corte',
            duracao: 30,
            preco: 40.00,
            ativo: true
        },
        {
            id: 'serv-3',
            barbeariaId: 1,
            nome: 'Barba Completa',
            descricao: 'Barboterapia com toalha quente e navalha',
            categoria: 'barba',
            duracao: 30,
            preco: 35.00,
            ativo: true
        },
        {
            id: 'serv-4',
            barbeariaId: 1,
            nome: 'Hidratação Capilar',
            descricao: 'Tratamento nutritivo profundo para os fios',
            categoria: 'tratamento',
            duracao: 30,
            preco: 50.00,
            ativo: true
        },
        {
            id: 'serv-5',
            barbeariaId: 1,
            nome: 'Cabelo + Barba',
            descricao: 'Combo completo de corte e barboterapia',
            categoria: 'combo',
            duracao: 75,
            preco: 75.00,
            ativo: true
        },
        {
            id: 'serv-6',
            barbeariaId: 1,
            nome: 'Sobrancelha',
            descricao: 'Alinhamento e limpeza na navalha ou pinça',
            categoria: 'outros',
            duracao: 15,
            preco: 15.00,
            ativo: true
        },
        {
            id: 'serv-7',
            barbeariaId: 1,
            nome: 'Pezinho e Contorno',
            descricao: 'Acabamento rápido do contorno e nuca',
            categoria: 'corte',
            duracao: 15,
            preco: 20.00,
            ativo: false
        }
    ],
    barbeiros: [
        {
            id: 'barb-1',
            barbeariaId: 1,
            nome: 'Lucas Ferreira',
            especialidade: 'Degradê e Barboterapia',
            foto: '../images/imagem-topo-barber.jpg',
            nota: 4.9,
            totalAvaliacoes: 54,
            atendimentosBase: 95,
            ativo: true,
            servicosIds: ['serv-1', 'serv-2', 'serv-3', 'serv-4', 'serv-5', 'serv-6', 'serv-7']
        },
        {
            id: 'barb-2',
            barbeariaId: 1,
            nome: 'Rafael Souza',
            especialidade: 'Corte Clássico e Tesoura',
            foto: '../images/imagem-topo-client.jpg',
            nota: 4.8,
            totalAvaliacoes: 41,
            atendimentosBase: 75,
            ativo: true,
            servicosIds: ['serv-1', 'serv-2', 'serv-3', 'serv-5', 'serv-6']
        },
        {
            id: 'barb-3',
            barbeariaId: 1,
            nome: 'Mateus Lima',
            especialidade: 'Freestyle e Pigmentação',
            foto: '../images/imagem-topo-barber.jpg',
            nota: 5.0,
            totalAvaliacoes: 38,
            atendimentosBase: 63,
            ativo: true,
            servicosIds: ['serv-1', 'serv-3', 'serv-4', 'serv-5', 'serv-6']
        },
        {
            id: 'barb-4',
            barbeariaId: 1,
            nome: 'Diego Almeida',
            especialidade: 'Barba Modelada e Toalha Quente',
            foto: '../images/imagem-topo-client.jpg',
            nota: 4.7,
            totalAvaliacoes: 29,
            atendimentosBase: 52,
            ativo: true,
            servicosIds: ['serv-2', 'serv-3', 'serv-5', 'serv-6']
        },
        {
            id: 'barb-5',
            barbeariaId: 1,
            nome: 'Henrique Rocha',
            especialidade: 'Cortes Infantis e Hidratação',
            foto: '../images/imagem-topo-barber.jpg',
            nota: 4.8,
            totalAvaliacoes: 16,
            atendimentosBase: 22,
            ativo: false,
            servicosIds: ['serv-1', 'serv-2', 'serv-4', 'serv-6']
        }
    ],
    agendamentos: [
        // Agendamentos do cliente logado (João Pedro) + da agenda do dia da Barbearia
        {
            id: 'ag-1',
            barbeariaId: 1,
            barbeariaNome: 'Barbearia Navalha de Ouro',
            enderecoBarbearia: 'Av. Maurício Cardoso, 500 - Centro, Erechim - RS',
            clienteId: 1,
            clienteNome: 'João Pedro da Silva',
            clienteTelefone: '(54) 99985-3855',
            barbeiroId: 'barb-1',
            barbeiroNome: 'Lucas Ferreira',
            servicos: ['Corte Degradê', 'Barba Completa', 'Sobrancelha'],
            duracaoTotal: 90,
            valorTotal: 95.00,
            data: '20/10/2026',
            hora: '14:30',
            ehHojeBarbearia: true,
            status: 'em-aberto',
            avaliacao: null
        },
        {
            id: 'ag-2',
            barbeariaId: 1,
            barbeariaNome: 'Barbearia Navalha de Ouro',
            enderecoBarbearia: 'Av. Maurício Cardoso, 500 - Centro, Erechim - RS',
            clienteId: null,
            clienteNome: 'Carlos Eduardo Almeida',
            clienteTelefone: '(54) 99911-2030',
            barbeiroId: 'barb-1',
            barbeiroNome: 'Lucas Ferreira',
            servicos: ['Corte Tradicional', 'Sobrancelha'],
            duracaoTotal: 45,
            valorTotal: 55.00,
            data: '17/10/2026',
            hora: '10:30',
            ehHojeBarbearia: true,
            status: 'em-aberto',
            avaliacao: null
        },
        {
            id: 'ag-3',
            barbeariaId: 1,
            barbeariaNome: 'Barbearia Navalha de Ouro',
            enderecoBarbearia: 'Av. Maurício Cardoso, 500 - Centro, Erechim - RS',
            clienteId: null,
            clienteNome: 'Gabriel Henrique Costa',
            clienteTelefone: '(54) 99822-3344',
            barbeiroId: 'barb-1',
            barbeiroNome: 'Lucas Ferreira',
            servicos: ['Cabelo + Barba', 'Hidratação Capilar', 'Sobrancelha'],
            duracaoTotal: 120,
            valorTotal: 140.00,
            data: '17/10/2026',
            hora: '14:00',
            ehHojeBarbearia: true,
            status: 'em-aberto',
            avaliacao: null
        },
        {
            id: 'ag-4',
            barbeariaId: 1,
            barbeariaNome: 'Barbearia Navalha de Ouro',
            enderecoBarbearia: 'Av. Maurício Cardoso, 500 - Centro, Erechim - RS',
            clienteId: null,
            clienteNome: 'Matheus Ribeiro',
            clienteTelefone: '(54) 99744-5566',
            barbeiroId: 'barb-1',
            barbeiroNome: 'Lucas Ferreira',
            servicos: ['Barba Completa'],
            duracaoTotal: 30,
            valorTotal: 35.00,
            data: '17/10/2026',
            hora: '16:30',
            ehHojeBarbearia: true,
            status: 'em-aberto',
            avaliacao: null
        },
        {
            id: 'ag-5',
            barbeariaId: 1,
            barbeariaNome: 'Barbearia Navalha de Ouro',
            enderecoBarbearia: 'Av. Maurício Cardoso, 500 - Centro, Erechim - RS',
            clienteId: null,
            clienteNome: 'André Santos',
            clienteTelefone: '(54) 99633-7788',
            barbeiroId: 'barb-2',
            barbeiroNome: 'Rafael Souza',
            servicos: ['Corte Tradicional', 'Barba Completa'],
            duracaoTotal: 60,
            valorTotal: 75.00,
            data: '17/10/2026',
            hora: '09:30',
            ehHojeBarbearia: true,
            status: 'em-aberto',
            avaliacao: null
        },
        {
            id: 'ag-6',
            barbeariaId: 1,
            barbeariaNome: 'Barbearia Navalha de Ouro',
            enderecoBarbearia: 'Av. Maurício Cardoso, 500 - Centro, Erechim - RS',
            clienteId: null,
            clienteNome: 'Leonardo Dias',
            clienteTelefone: '(54) 99511-9900',
            barbeiroId: 'barb-3',
            barbeiroNome: 'Mateus Lima',
            servicos: ['Corte Degradê', 'Sobrancelha'],
            duracaoTotal: 60,
            valorTotal: 60.00,
            data: '17/10/2026',
            hora: '11:00',
            ehHojeBarbearia: true,
            status: 'em-aberto',
            avaliacao: null
        },
        // Histórico Concluído do Cliente (João Pedro)
        {
            id: 'ag-hist-1',
            barbeariaId: 1,
            barbeariaNome: 'Barbearia Navalha de Ouro',
            enderecoBarbearia: 'Av. Maurício Cardoso, 500 - Centro, Erechim - RS',
            clienteId: 1,
            clienteNome: 'João Pedro da Silva',
            clienteTelefone: '(54) 99985-3855',
            barbeiroId: 'barb-1',
            barbeiroNome: 'Lucas Ferreira',
            servicos: ['Corte Tradicional', 'Barba Completa'],
            duracaoTotal: 60,
            valorTotal: 75.00,
            data: '05/10/2026',
            hora: '15:00',
            ehHojeBarbearia: false,
            status: 'concluido',
            avaliacao: null
        },
        {
            id: 'ag-hist-2',
            barbeariaId: 2,
            barbeariaNome: 'Barbearia Clássica',
            enderecoBarbearia: 'Rua Itália, 210 - Centro, Erechim - RS',
            clienteId: 1,
            clienteNome: 'João Pedro da Silva',
            clienteTelefone: '(54) 99985-3855',
            barbeiroId: 'barb-2',
            barbeiroNome: 'Rafael Souza',
            servicos: ['Corte Degradê', 'Hidratação Capilar'],
            duracaoTotal: 75,
            valorTotal: 95.00,
            data: '18/09/2026',
            hora: '16:00',
            ehHojeBarbearia: false,
            status: 'concluido',
            avaliacao: { nota: 5, comentario: 'Excelente atendimento e corte impecável!' }
        },
        {
            id: 'ag-hist-3',
            barbeariaId: 3,
            barbeariaNome: 'Barbearia Dom Bigode',
            enderecoBarbearia: 'Av. Sete de Setembro, 1120 - Fátima, Erechim - RS',
            clienteId: 1,
            clienteNome: 'João Pedro da Silva',
            clienteTelefone: '(54) 99985-3855',
            barbeiroId: 'barb-3',
            barbeiroNome: 'Mateus Lima',
            servicos: ['Cabelo + Barba', 'Sobrancelha'],
            duracaoTotal: 90,
            valorTotal: 90.00,
            data: '02/09/2026',
            hora: '10:00',
            ehHojeBarbearia: false,
            status: 'concluido',
            avaliacao: { nota: 5, comentario: 'Muito atencioso, recomendo.' }
        }
    ],
    bloqueiosAgenda: [
        {
            id: 'bloq-1',
            barbeiroId: 'barb-1',
            data: '17/10/2026',
            inicio: '12:00',
            fim: '13:00',
            motivo: 'Horário de Almoço'
        }
    ]
};

window.BarberDeckStore = {
    obterEstado() {
        try {
            const salvo = localStorage.getItem(CHAVE_STORAGE_BARBERDECK);
            if (!salvo) {
                const copia = JSON.parse(JSON.stringify(DADOS_INICIAIS_BARBERDECK));
                localStorage.setItem(CHAVE_STORAGE_BARBERDECK, JSON.stringify(copia));
                return copia;
            }
            const parsed = JSON.parse(salvo);
            return { ...DADOS_INICIAIS_BARBERDECK, ...parsed };
        } catch (e) {
            return JSON.parse(JSON.stringify(DADOS_INICIAIS_BARBERDECK));
        }
    },

    salvarEstado(novoEstado) {
        try {
            localStorage.setItem(CHAVE_STORAGE_BARBERDECK, JSON.stringify(novoEstado));
            window.dispatchEvent(new CustomEvent('barberdeck:estado-atualizado', { detail: novoEstado }));
        } catch (e) {
            console.error('Erro ao salvar estado no localStorage:', e);
        }
    },

    obterSessao() {
        return this.obterEstado().sessao;
    },

    definirTipoSessao(tipo) {
        const estado = this.obterEstado();
        estado.sessao.tipo = tipo; // 'visitante' | 'cliente' | 'barbearia'
        this.salvarEstado(estado);
        window.dispatchEvent(new CustomEvent('barberdeck:sessao-alterada', { detail: estado.sessao }));
    },

    obterBarbeariaPrincipal() {
        const estado = this.obterEstado();
        return estado.barbearias.find(b => b.id === (estado.sessao.barbeariaId || 1)) || estado.barbearias[0];
    },

    obterBarbeariaPorId(id) {
        const estado = this.obterEstado();
        return estado.barbearias.find(b => String(b.id) === String(id)) || estado.barbearias[0];
    },

    formatarMoeda(valor) {
        const num = Number(valor) || 0;
        return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    aplicarMascaraTelefone(valor) {
        const digitos = String(valor || '').replace(/\D/g, '').slice(0, 11);
        if (digitos.length <= 2) return digitos;
        if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
        if (digitos.length <= 10) return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
        return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
    },

    aplicarMascaraCNPJ(valor) {
        const d = String(valor || '').replace(/\D/g, '').slice(0, 14);
        if (d.length <= 2) return d;
        if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
        if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
        if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
        return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
    },

    aplicarMascaraCEP(valor) {
        const d = String(valor || '').replace(/\D/g, '').slice(0, 8);
        if (d.length <= 5) return d;
        return `${d.slice(0, 5)}-${d.slice(5)}`;
    }
};


// =============================================================================
// COMPONENTE: HEADER (<barber-header>) E CONTROLADOR DE SESSÃO E LOGIN
// =============================================================================
class BarberHeader extends HTMLElement {
    connectedCallback() {
        fetch('../html/header.html')
            .then(res => res.text())
            .then(html => {
                this.innerHTML = html;
                this.sincronizarEstadoComPaginaAtual();
                this.renderizarCabecalhoPorSessao();
                this.inicializarModalLogin();

                window.addEventListener('barberdeck:sessao-alterada', () => {
                    this.renderizarCabecalhoPorSessao();
                });
                window.addEventListener('barberdeck:estado-atualizado', () => {
                    this.renderizarCabecalhoPorSessao();
                });
            })
            .catch(err => console.error('Erro ao carregar o cabeçalho:', err));
    }

    sincronizarEstadoComPaginaAtual() {
        const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
        const params = new URLSearchParams(window.location.search);

        // Se abrir diretamente o dashboard.html ou ?modo=barbearia, ativa visão de barbearia
        if (paginaAtual === 'dashboard.html' || params.get('modo') === 'barbearia') {
            const sessao = window.BarberDeckStore.obterSessao();
            if (sessao.tipo !== 'barbearia') {
                window.BarberDeckStore.definirTipoSessao('barbearia');
            }
        }
    }

    renderizarCabecalhoPorSessao() {
        const estado = window.BarberDeckStore.obterEstado();
        const tipoSessao = estado.sessao.tipo || 'visitante'; // 'visitante' | 'cliente' | 'barbearia'

        const itensMenu = this.querySelectorAll('#lista-navegacao-cabecalho li[data-visivel-para]');
        itensMenu.forEach((li) => {
            const perfisPermitidos = (li.getAttribute('data-visivel-para') || '').split(/\s+/);
            li.hidden = !perfisPermitidos.includes(tipoSessao);
        });

        const botaoEntrar = this.querySelector('#botao-abrir-modal');
        const linkPerfil = this.querySelector('#link-perfil-cabecalho');
        const spanNome = this.querySelector('#nome-usuario-cabecalho');
        const imgAvatar = this.querySelector('#img-usuario-cabecalho');

        if (!botaoEntrar || !linkPerfil) return;

        if (tipoSessao === 'visitante') {
            botaoEntrar.hidden = false;
            linkPerfil.hidden = true;
        } else if (tipoSessao === 'cliente') {
            botaoEntrar.hidden = true;
            linkPerfil.hidden = false;
            linkPerfil.href = 'perfil.html?modo=cliente';
            if (spanNome) spanNome.textContent = estado.cliente.nome;
            if (imgAvatar) {
                imgAvatar.src = estado.cliente.foto || '../images/imagem-topo-client.jpg';
                imgAvatar.alt = `Foto de perfil de ${estado.cliente.nome}`;
            }
        } else if (tipoSessao === 'barbearia') {
            const barbearia = window.BarberDeckStore.obterBarbeariaPrincipal();
            botaoEntrar.hidden = true;
            linkPerfil.hidden = false;
            linkPerfil.href = 'perfil.html?modo=barbearia';
            if (spanNome) spanNome.textContent = barbearia.nome;
            if (imgAvatar) {
                imgAvatar.src = barbearia.fotoPerfil || barbearia.fotoCapa || '../images/imagem-topo-barber.jpg';
                imgAvatar.alt = `Logo de ${barbearia.nome}`;
            }
        }

        // Destaca o link da página ativa no menu
        const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
        const linksMenu = this.querySelectorAll('#lista-navegacao-cabecalho a');
        linksMenu.forEach((a) => {
            const hrefLimpo = (a.getAttribute('href') || '').split('?')[0].split('#')[0];
            a.classList.toggle('ativo', hrefLimpo === paginaAtual && !a.getAttribute('href').includes('#'));
        });
        linkPerfil.classList.toggle('ativo', paginaAtual === 'perfil.html');
    }

    inicializarModalLogin() {
        const modal = this.querySelector('#modal-autenticacao');
        const botaoAbrir = this.querySelector('#botao-abrir-modal');
        const botaoFechar = this.querySelector('#botao-fechar-modal');
        const formEntrar = this.querySelector('#formulario-entrar');
        const formRecuperar = this.querySelector('#formulario-recuperar-senha');
        const botaoEsqueci = this.querySelector('#botao-esqueci-senha');
        const botaoVoltarLogin = this.querySelector('#botao-voltar-login');
        const feedbackLogin = this.querySelector('#feedback-login');
        const feedbackRecuperacao = this.querySelector('#feedback-recuperacao');

        if (!modal) return;

        const abrirModalEmModoLogin = () => {
            if (formEntrar && formRecuperar) {
                formEntrar.hidden = false;
                formRecuperar.hidden = true;
            }
            if (feedbackLogin) feedbackLogin.hidden = true;
            if (feedbackRecuperacao) feedbackRecuperacao.hidden = true;
            modal.showModal();
        };

        if (botaoAbrir) {
            botaoAbrir.addEventListener('click', (evento) => {
                evento.preventDefault();
                abrirModalEmModoLogin();
            });
        }

        if (botaoFechar) {
            botaoFechar.addEventListener('click', () => modal.close());
        }

        modal.addEventListener('click', (evento) => {
            if (evento.target === modal) {
                modal.close();
            }
        });

        // Permite que qualquer botão com [data-abrir-login] na página (ex.: em cadastro.html) abra o popup
        const gatilhosLogin = document.querySelectorAll('[data-abrir-login]');
        gatilhosLogin.forEach((gatilho) => {
            gatilho.addEventListener('click', (evento) => {
                evento.preventDefault();
                abrirModalEmModoLogin();
            });
        });

        // Alternar para Recuperação de Senha
        if (botaoEsqueci && formEntrar && formRecuperar) {
            botaoEsqueci.addEventListener('click', () => {
                formEntrar.hidden = true;
                formRecuperar.hidden = false;
                const inputRec = this.querySelector('#recuperar-email');
                if (inputRec) inputRec.focus();
            });
        }

        if (botaoVoltarLogin && formEntrar && formRecuperar) {
            botaoVoltarLogin.addEventListener('click', () => {
                formRecuperar.hidden = true;
                formEntrar.hidden = false;
            });
        }

        // Submissão do formulário de Recuperação de Senha
        if (formRecuperar) {
            formRecuperar.addEventListener('submit', (evento) => {
                evento.preventDefault();
                const inputRec = this.querySelector('#recuperar-email');
                const email = inputRec ? inputRec.value.trim() : '';
                if (!email || !email.includes('@')) {
                    if (feedbackRecuperacao) {
                        feedbackRecuperacao.textContent = 'Informe um endereço de e-mail válido.';
                        feedbackRecuperacao.className = 'mensagem-feedback-modal erro';
                        feedbackRecuperacao.hidden = false;
                    }
                    return;
                }
                if (feedbackRecuperacao) {
                    feedbackRecuperacao.textContent = `Enviamos as instruções de redefinição para ${email}!`;
                    feedbackRecuperacao.className = 'mensagem-feedback-modal sucesso';
                    feedbackRecuperacao.hidden = false;
                }
                formRecuperar.reset();
            });
        }

        // Submissão do formulário de Login
        if (formEntrar) {
            formEntrar.addEventListener('submit', (evento) => {
                evento.preventDefault();
                const emailInput = this.querySelector('#entrar-email');
                const senhaInput = this.querySelector('#entrar-senha');
                const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
                const senha = senhaInput ? senhaInput.value.trim() : '';

                if (!email || !senha) {
                    if (feedbackLogin) {
                        feedbackLogin.textContent = 'Preencha seu e-mail e sua senha para entrar.';
                        feedbackLogin.className = 'mensagem-feedback-modal erro';
                        feedbackLogin.hidden = false;
                    }
                    return;
                }

                const estado = window.BarberDeckStore.obterEstado();
                const barbeariaPrincipal = window.BarberDeckStore.obterBarbeariaPrincipal();

                // Se o e-mail corresponder à barbearia ou contiver termos empresariais, entra como Barbearia
                const ehLoginBarbearia =
                    email === (barbeariaPrincipal.email || '').toLowerCase() ||
                    email.includes('barbearia') ||
                    email.includes('navalha') ||
                    email.includes('contato@');

                if (ehLoginBarbearia) {
                    window.BarberDeckStore.definirTipoSessao('barbearia');
                    modal.close();
                    window.location.href = 'dashboard.html';
                } else {
                    if (email !== estado.cliente.email.toLowerCase()) {
                        estado.cliente.email = email;
                        window.BarberDeckStore.salvarEstado(estado);
                    }
                    window.BarberDeckStore.definirTipoSessao('cliente');
                    modal.close();
                }
            });
        }

        // Botões de Acesso Rápido (Demonstração: Cliente vs Barbearia)
        const botoesDemo = this.querySelectorAll('[data-login-rapido]');
        botoesDemo.forEach((botao) => {
            botao.addEventListener('click', () => {
                const perfil = botao.getAttribute('data-login-rapido');
                window.BarberDeckStore.definirTipoSessao(perfil);
                modal.close();
                if (perfil === 'barbearia') {
                    window.location.href = 'dashboard.html';
                } else {
                    const paginaAtual = window.location.pathname.split('/').pop();
                    if (paginaAtual === 'dashboard.html' || paginaAtual === 'cadastro.html') {
                        window.location.href = 'index.html';
                    }
                }
            });
        });

        // Botões dos planos na página inicial levam direto para cadastro.html com o perfil barbearia e o plano pré-selecionado
        const botoesPlanos = document.querySelectorAll('.botao-plano, .botao-plano-secundario');
        botoesPlanos.forEach((botao, idx) => {
            botao.addEventListener('click', () => {
                const slugs = ['inicial', 'pro', 'elite'];
                const planoSlug = slugs[idx] || 'pro';
                window.location.href = `cadastro.html?perfil=barbearia&plano=${planoSlug}`;
            });
        });
    }
}
customElements.define('barber-header', BarberHeader);


// =============================================================================
// COMPONENTE: FOOTER (<barber-footer>)
// =============================================================================
class BarberFooter extends HTMLElement {
    connectedCallback() {
        fetch('../html/footer.html')
            .then(res => res.text())
            .then(html => {
                this.innerHTML = html;
            })
            .catch(err => console.error('Erro ao carregar o rodapé:', err));
    }
}
customElements.define('barber-footer', BarberFooter);
