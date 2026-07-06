# Roadmap

Este projeto é dividido em 6 competências, que também organizam a apresentação do FlowDesk no portfólio (cada uma vira uma seção/modal explicando objetivo, tecnologias, decisões e aprendizados).

## 1. Arquitetura
- [x] Definição de escopo e MVP (`00-planning.md`)
- [x] Decisão monorepo vs polyrepo
- [x] Estrutura de pastas (frontend / backend / python-service)
- [ ] Diagrama de arquitetura geral (como os serviços se comunicam)

## 2. Banco de Dados
- [x] Modelagem de entidades e relacionamentos (`01-database.md`)
- [x] Schema Prisma
- [x] Migrations
- [ ] Seed de dados de teste

## 3. Infraestrutura
- [x] PostgreSQL via Docker Compose
- [ ] Backend containerizado
- [ ] Frontend containerizado
- [ ] Python service containerizado
- [ ] Docker Compose orquestrando os 4 serviços juntos

## 4. Backend
- [x] Setup do projeto Node.js + TypeScript
- [x] Conexão com Prisma/Postgres
- [x] Testes (Jest + Supertest) configurados, com 1º teste em Companies
- [x] Autenticação (JWT) e middleware de proteção de rotas
- [x] Multi-tenancy: Projetos (criar/listar) escopados pela empresa do usuário logado
- [x] CRUD de Tarefas (criar/listar), protegido contra IDOR (valida que o projeto pertence à empresa do usuário)
- [x] Vínculo Usuário↔Projeto (ProjectMember), com teste cobrindo bloqueio entre empresas diferentes
- [x] CRUD de Usuários (listar/buscar por id), senha nunca exposta na resposta
- [x] Autorização por papel (admin/membro): campo `role` no User, incluído no JWT, e middleware `requireRole` protegendo criação de projetos
- [x] Exclusão de Projetos (admin) e Tarefas, com cascade delete no banco (apagar projeto remove tarefas e vínculos de membro)
- [x] Validação de campos obrigatórios (nome de projeto, título de tarefa) com resposta 400
- [x] Atribuição de tarefa a um membro (`assigneeId`), com bloqueio de reatribuição enquanto a tarefa está `IN_PROGRESS`
- [x] Endpoint `GET /auth/me` (dados do usuário logado + empresa, para o menu lateral)
- [x] Onboarding simplificado de membros: usuário simples (`username`) sem e-mail/senha individual + senha geral da empresa (`Company.accessPassword`) + endpoint `POST /auth/login-member`

## 5. Frontend
- [x] Setup Next.js + TypeScript + Tailwind
- [x] Login conectado à API (fetch + JWT salvo no localStorage), com redirecionamento pro dashboard
- [x] Dashboard de Projetos: rota protegida no cliente (redireciona pra /login sem token), lista projetos via GET /projects
- [x] Registro (cria empresa + admin junto, via novo endpoint /auth/register-company)
- [x] Criar projeto pela interface (formulário no dashboard, com tratamento do 403 pra quem não é admin)
- [x] Página de detalhe do projeto (`/dashboard/[id]`), com lista/criação de Tarefas e mudança de status por clique
- [x] Dashboard com indicadores (total de projetos e tarefas por status), via `GET /dashboard/summary`
- [x] Exclusão de projetos e tarefas pela interface, com confirmação
- [x] Menu lateral (`layout.tsx` de `/dashboard`) com navegação (Projetos/Equipe/Configurações) e dados do usuário logado (via `GET /auth/me`)
- [x] Fluxo de atribuição de tarefa: seletor + botão "Submeter tarefa" → vira "Tarefa submetida, aguardando status de X" com "Editar" (bloqueado enquanto `IN_PROGRESS`)
- [x] Tela de Equipe simplificada: admin cria membro só com nome, sistema gera usuário automaticamente
- [x] Tela de Configurações: admin define a senha geral de acesso da equipe
- [x] Login com abas: "Login" (admin) e "Entrar como membro" (usuário + senha geral)

## 6. Python
- [ ] Setup do microserviço
- [ ] Geração de relatório em PDF
- [ ] Exportação em Excel
- [ ] Análise de dados com Pandas
- [ ] Comunicação com o backend principal

---

Legenda: `[x]` concluído, `[ ]` pendente. Este arquivo é atualizado conforme avançamos nas fases.
