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
- **Layout compartilhado com menu lateral** (`app/dashboard/layout.tsx`): busca o usuário logado uma vez (`GET /auth/me`) e envolve todas as páginas de `/dashboard/*` com navegação (Projetos/Equipe/Configurações) e botão Sair — elimina duplicação de cabeçalho em cada página.
- **Exclusão com confirmação nativa** (`confirm(...)` do navegador) antes de chamar `DELETE`, tanto pra projeto quanto tarefa.
- **Fluxo de atribuição em duas etapas**: escolher responsável não salva sozinho — precisa clicar em "Submeter tarefa". Depois de submetida, vira texto "Tarefa submetida, aguardando status de X" com um "Editar" que só aparece se a tarefa não estiver `IN_PROGRESS` (espelhando a regra do backend).
- **Cadastro de membro simplificado**: formulário pede só o nome; o "usuário" de login vem pronto na resposta da API, sem o admin precisar inventar e-mail/senha.
- **Login com abas** (`admin` / `member`) no mesmo componente, alternando os campos exibidos e qual endpoint é chamado (`/auth/login` vs `/auth/login-member`).

## Desafios e soluções

1. **`create-next-app` recusou rodar** porque já existia um `README.md` na pasta `frontend/` (criado na fase de estrutura inicial do monorepo). Resolvido renomeando o arquivo antes de rodar o comando.
2. **CORS bloqueando as requisições do frontend pro backend.** Causa: navegador bloqueia por padrão chamadas entre origens diferentes (`localhost:3000` → `localhost:3001`). Resolvido instalando o middleware `cors` no Express, liberando explicitamente a origem do frontend.
3. **Middleware de CORS não fazia efeito.** Causa: foi adicionado depois do `app.use` das rotas — no Express, um middleware só afeta rotas registradas depois dele. Resolvido movendo `app.use(cors(...))` para o topo, antes de qualquer rota.
4. **Erro `require is not defined` no bundler (Turbopack) do Next 16**, ao navegar pra uma rota dinâmica após hot reload. Não era erro de código — resolvido limpando o cache de build (`rm -rf .next`) e reiniciando o servidor de dev.

## Aprendizados

- Em Next.js App Router, a divisão entre Server e Client Components é uma decisão ativa: só marcar como Client quando há necessidade real de estado/interatividade no navegador.
- CORS é resolvido no servidor (backend), não no cliente — e a ordem dos middlewares no Express determina quais rotas são afetadas por eles.
- Um `layout.tsx` por segmento de rota (App Router) é a forma correta de compartilhar UI (menu, dados do usuário) entre várias páginas sem duplicar código nem lógica de fetch.
- Regras de negócio sensíveis (como "não reatribuir tarefa em andamento") precisam existir **nos dois lados**: no frontend, pra UX (esconder o botão); no backend, pra segurança de verdade (rejeitar a requisição mesmo que alguém burle a interface).
