# 04 - Frontend

## Objetivo

Interface web do FlowDesk, consumindo a API do backend.

## Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Decisões técnicas

- **App Router com componentes de servidor por padrão**: páginas só viram Client Components (`"use client"`) quando realmente precisam de estado ou interatividade (ex: formulário de login) — o resto continua renderizado no servidor.
- **Roteamento por pastas**: cada pasta dentro de `app/` vira uma rota automaticamente (`app/login/page.tsx` → `/login`), sem configuração manual de rotas.
- **Comunicação direta via `fetch`** com o backend (`http://localhost:3001`), sem biblioteca de data-fetching por enquanto — simples o suficiente para o estágio atual do projeto.
- **Token JWT salvo no `localStorage`** após login bem-sucedido, pra ser reutilizado em requisições futuras autenticadas.
- **Proteção de rota no lado do cliente**: o Dashboard confere no `useEffect` se existe token no `localStorage`; se não existir, redireciona (`router.push`) pra `/login` antes de tentar buscar qualquer dado.
- **Redirecionamento pós-login**: em vez de um `alert`, o login usa `useRouter().push("/dashboard")` — fluxo mais próximo de um produto real.
- **Registro cria empresa + usuário admin juntos** (`/register`), consumindo o novo endpoint `POST /auth/register-company`; ao concluir, redireciona pra `/login` (sem login automático, por simplicidade).
- **Página de detalhe do projeto** (`app/dashboard/[id]/page.tsx`, rota dinâmica do App Router) lista e cria tarefas daquele projeto; o `id` da URL é lido com o hook `useParams` (Client Component).
- **Status de tarefa muda por clique**, ciclando `TODO → IN_PROGRESS → DONE → TODO`, via `PATCH /tasks/:id`.
- **Indicadores no dashboard**: cards com contagens vindas de `GET /dashboard/summary` — o frontend só exibe, toda a agregação acontece no backend.
- **CORS liberado no backend** especificamente para `http://localhost:3000` (origem do frontend em dev), usando o pacote `cors` do Express.

## Desafios e soluções

1. **`create-next-app` recusou rodar** porque já existia um `README.md` na pasta `frontend/` (criado na fase de estrutura inicial do monorepo). Resolvido renomeando o arquivo antes de rodar o comando.
2. **CORS bloqueando as requisições do frontend pro backend.** Causa: navegador bloqueia por padrão chamadas entre origens diferentes (`localhost:3000` → `localhost:3001`). Resolvido instalando o middleware `cors` no Express, liberando explicitamente a origem do frontend.
3. **Middleware de CORS não fazia efeito.** Causa: foi adicionado depois do `app.use` das rotas — no Express, um middleware só afeta rotas registradas depois dele. Resolvido movendo `app.use(cors(...))` para o topo, antes de qualquer rota.

## Aprendizados

- Em Next.js App Router, a divisão entre Server e Client Components é uma decisão ativa: só marcar como Client quando há necessidade real de estado/interatividade no navegador.
- CORS é resolvido no servidor (backend), não no cliente — e a ordem dos middlewares no Express determina quais rotas são afetadas por eles.
