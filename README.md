# 💈 BarberDeck — Smart Booking for Modern Barbershops

O **BarberDeck** é um sistema web completo desenvolvido para simplificar o agendamento de serviços em barbearias, oferecendo um controle eficiente tanto para o cliente quanto para a equipe do estabelecimento.

---

## 🚀 Funcionalidades Principal

### 👤 Cliente
- **Busca de Barbearias:** Encontre barbearia por nome ou localização.
- **Fluxo Guiado de Agendamento:** Escolha de data, barbeiro, serviço e horário disponível em tempo real.
- **Painel de Agendamentos:** Visualização do histórico e cancelamento de reservas.

### ✂️ Funcionário (Barbeiro)
- **Agenda em Tempo Real:** Visualização cronológica dos atendimentos do dia/semana.
- **Gestão de Agendamentos:** Permite incluir atendimentos presenciais/telefônicos, alterar horários ou cancelar.

### 🏢 Barbearia / Dono
- **Configuração da Empresa:** Horários de funcionamento, fotos e localização.
- **Gestão da Equipe & Serviços:** Cadastro de barbeiros e vínculo com o catálogo de serviços.

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** PHP (PDO)
- **Banco de Dados:** MySQL
- **Frontend:** HTML5, CSS3, Tailwind CSS
- **Arquitetura:** MVC / Modulada

---

## 🗄️ Estrutura do Banco de Dados

O banco de dados é composto por 7 tabelas com relacionamentos dinâmicos e cálculo de horários por tempo de serviço:
- `usuarios`, `barbearias`, `horarios_barbearia`, `funcionarios`, `servicos`, `funcionario_servicos`, `agendamentos`.

---

## 🔧 Como Executar o Projeto Localmente

1. Clone o repositório:
   ```bash
   git clone [https://github.com/seu-usuario/barberdeck.git](https://github.com/seu-usuario/barberdeck.git)
