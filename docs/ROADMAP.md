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
- [ ] CRUD de Tarefas
- [ ] Vínculo Usuário↔Projeto (ProjectMember)
- [ ] CRUD completo de Usuários (editar/listar/deletar)
- [ ] Autorização por papel (admin/membro)

## 5. Frontend
- [ ] Setup Next.js + TypeScript + Tailwind
- [ ] Autenticação (login/registro)
- [ ] Telas de Projetos e Tarefas
- [ ] Dashboard com indicadores

## 6. Python
- [ ] Setup do microserviço
- [ ] Geração de relatório em PDF
- [ ] Exportação em Excel
- [ ] Análise de dados com Pandas
- [ ] Comunicação com o backend principal

---

Legenda: `[x]` concluído, `[ ]` pendente. Este arquivo é atualizado conforme avançamos nas fases.
