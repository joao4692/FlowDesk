# 01 - Banco de Dados

## Entidades e relacionamentos

| Relação | Tipo | Observação |
|---|---|---|
| Empresa → Usuários | 1:N | Cada usuário pertence a uma empresa |
| Empresa → Projetos | 1:N | Cada projeto pertence a uma empresa |
| Usuário ↔ Projeto | N:N | Um usuário pode participar de vários projetos; feito via tabela de junção `ProjectMembers` |
| Projeto → Tarefas | 1:N | Cada tarefa pertence a um projeto |
| Usuário → Tarefas | 1:N | Cada tarefa tem um único responsável (por enquanto) |

## Por que N:N entre Usuário e Projeto
Reflete a realidade de startups pequenas: uma pessoa costuma atuar em mais de um projeto ao mesmo tempo. Relacionamentos N:N em bancos relacionais são resolvidos com uma tabela intermediária (aqui, `ProjectMembers`), que guarda o vínculo entre `User` e `Project`.

## Tecnologia
- PostgreSQL como banco relacional
- Prisma como ORM (schema, migrations, type-safety com TypeScript)

## Evolução do schema
- `role` (enum `ADMIN`/`MEMBER`) adicionado ao `User` para autorização por papel.
- `onDelete: Cascade` configurado em `Task.project` e `ProjectMember.project`, permitindo apagar um projeto sem deixar tarefas/vínculos órfãos.
- `email`/`password` do `User` viraram opcionais, e novos campos `username` (no `User`) e `accessPassword` (no `Company`) foram adicionados — suportam um segundo modelo de login (usuário simples + senha compartilhada da empresa) ao lado do login tradicional.

## Seed de dados de teste
`prisma/seed.ts` cria uma empresa de exemplo ("Empresa Seed") com um admin, um membro, um projeto e 3 tarefas (uma em cada status) — útil para demonstração sem mexer em dados reais. É idempotente: roda `npx prisma db seed` quantas vezes quiser, só cria na primeira vez (verifica se "Empresa Seed" já existe antes de criar).
