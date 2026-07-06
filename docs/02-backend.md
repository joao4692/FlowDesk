# 02 - Backend

## Objetivo

API principal do FlowDesk, responsável pelas regras de negócio e acesso ao banco de dados.

## Stack

- Node.js + TypeScript
- Express
- Prisma (ORM)
- Jest + Supertest (testes)

## Decisões técnicas

- **Separação `app.ts` / `index.ts`**: `app.ts` define o Express app e as rotas; `index.ts` só importa o app e chama `.listen()`. Necessário para testar com Supertest sem precisar subir um servidor numa porta real.

- **Prisma Client como instância única** (`src/prisma.ts`), compartilhada por toda a aplicação, evitando múltiplas conexões desnecessárias com o banco.
- **Arquitetura em camadas** (`routes/` → `controllers/` → `services/`): rotas só apontam pra um controller; controllers lidam com request/response; services concentram a lógica de negócio e o acesso ao Prisma, sem saber nada de HTTP. Permite testar regra de negócio isoladamente e trocar a camada HTTP sem tocar nas regras.
- **Autenticação via JWT**: login gera um token assinado contendo `userId` e `companyId`; rotas protegidas usam um middleware (`authMiddleware`) que valida o token e popula `req.user` antes de liberar a requisição.
- **Senhas nunca em texto puro**: hash com `bcrypt` no registro, comparação de hash no login.
- **Multi-tenancy por empresa**: toda consulta de dados de uma empresa (ex: Projetos, Tarefas) usa `req.user.companyId` — o valor vem do token validado, nunca do corpo da requisição, evitando que um usuário manipule a requisição para acessar dados de outra empresa.
- **Proteção contra IDOR nas Tarefas**: antes de criar/listar tarefas de um `projectId`, o service confere se aquele projeto pertence à empresa do usuário logado (`findFirst({ where: { id, companyId } })`). Se não pertencer, devolve **404** (não 403) — assim não revelamos nem que o recurso existe para quem não tem acesso.
- **Autorização por papel (RBAC simples)**: campo `role` (`ADMIN` | `MEMBER`) no `User`, incluído no token JWT no login. Um middleware "factory" (`requireRole(role)`, que retorna outro middleware) bloqueia ações sensíveis — hoje, só ADMIN pode criar projetos. Aqui usamos **403** (não 404), já que faz sentido revelar que a rota existe mas o usuário não tem permissão.
- **Papel nunca é escolhido pelo cliente**: o `role` não vem do corpo da requisição de registro. O primeiro usuário de uma empresa (`prisma.user.count({ where: { companyId } }) === 0`) vira `ADMIN` automaticamente; qualquer registro seguinte vira `MEMBER`, sempre — evita escalonamento de privilégio via auto-registro.
- **Onboarding via `POST /auth/register-company`**: como não existia forma pública de criar uma empresa (criar empresa exigia login, login exigia usuário, usuário exigia empresa — um ciclo impossível de quebrar de fora), essa rota cria a empresa e o primeiro usuário (já `ADMIN`) juntos, numa `prisma.$transaction` — se falhar em qualquer parte, nada é criado.
- **Testes de integração, não unitários**: como a lógica de negócio ainda é simples, o valor está em testar a rota completa (request → banco → response), não funções isoladas.
- **Filosofia de teste por risco**: nem toda rota precisa de teste. Priorizamos o que tem lógica/validação real, não CRUDs triviais só por cobertura.

## Como testamos

- Arquivo de teste ao lado do arquivo testado, sufixo `.test.ts` (ex: `app.test.ts` ao lado de `app.ts`).
- Supertest simula requisições HTTP direto contra o `app` Express, sem precisar de servidor rodando.
- Testes de regra de negócio (ex: `projectMember.service.test.ts`) chamam o `service` diretamente, sem passar por HTTP — mais rápido e testa só o que importa.
- Conexão do Prisma fechada explicitamente no fim dos testes (`afterAll`), evitando processos pendurados.
- Token JWT de teste gerado direto com `jwt.sign(...)` no próprio arquivo de teste, sem precisar de um login real, quando a rota testada não depende do conteúdo do token.

```ts
describe("Companies", () => {
  it("cria uma empresa e retorna ela", async () => {
    const response = await request(app)
      .post("/companies")
      .send({ name: "Empresa Teste" });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Empresa Teste");
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

## Desafios e soluções

1. **Prisma 7 exige um "adapter" de conexão explícito.** `new PrismaClient()` sem argumento passou a dar erro de tipo nessa versão. Resolvido instalando `@prisma/adapter-pg` + `pg` e passando `new PrismaPg({ connectionString })` como adapter.
2. **Tipos globais do Jest (`describe`, `it`, `expect`) não eram reconhecidos.** Causa: `tsconfig.json` restringia `"types"` só a `["node"]`, escondendo os tipos do Jest. Resolvido adicionando `"jest"` ao array.
3. **Jest não encerrava o processo após os testes.** Causa: conexão do Prisma com o Postgres ficava aberta. Resolvido fechando a conexão em `afterAll(() => prisma.$disconnect())`.
4. **TypeScript não reconhecia `req.user` no middleware de autenticação**, mesmo depois de "estender" o tipo `Request` via _module augmentation_ (`declare global { namespace Express { interface Request {...} } }`). Causa raiz: o `tsc` lê o `include` do `tsconfig.json` e por isso enxergava o arquivo de extensão de tipo, mas o `ts-node` (usado pelo `ts-node-dev`) só carrega arquivos alcançáveis por import a partir do ponto de entrada — e esse arquivo nunca é importado por ninguém, só existe para o efeito colateral de estender o tipo. Resolvido adicionando a flag `--files` no script `dev` (`ts-node-dev --files src/index.ts`), que instrui o ts-node a também carregar os arquivos listados no `include`.
5. **`req.params.id` tipado como `string | string[]`** no Express 5, incompatível com funções que esperam só `string`. Resolvido com um type assertion explícito (`req.params.id as string`) no controller.
6. **Teste de Companies passou a falhar (401) depois de proteger a rota com `authMiddleware`.** O teste foi escrito antes da autenticação existir, e não mandava nenhum token. Resolvido gerando um token de teste com `jwt.sign` direto no arquivo de teste e enviando no header `Authorization`.
7. **Após adicionar o campo `role` no schema, o TypeScript reclamava que a propriedade não existia no tipo do `User`.** Causa: alterar o `schema.prisma` não regenera o client automaticamente em todos os casos — foi preciso rodar `npx prisma generate` de novo manualmente. O `ts-node-dev` também voltou a mostrar esse mesmo padrão de erro de cache já visto antes; `npx tsc --noEmit` novamente serviu para confirmar que o código estava correto e isolar o problema como sendo do dev server, não do schema/tipo em si.
8. **Falha de segurança: registro aceitava `role` livre no corpo da requisição**, permitindo qualquer usuário se autodeclarar `ADMIN`. Resolvido derivando o papel no servidor: primeiro usuário da empresa vira `ADMIN`, os demais sempre `MEMBER` — removido de vez a possibilidade do cliente escolher o próprio papel.

## Aprendizados

- Separar definição do app de inicialização do servidor é o que viabiliza testes de API sem infraestrutura extra.
- Lidar com _breaking changes_ de uma biblioteca recém-lançada (Prisma 7) é parte normal do trabalho real, não um sinal de erro do desenvolvedor.
- `tsc` e `ts-node` não resolvem arquivos exatamente da mesma forma — vale checar com `npx tsc --noEmit` quando um erro de tipo parece "não fazer sentido" no dev server, pra isolar se é erro de código ou de configuração da ferramenta.
- Nunca confiar em dado sensível (como `companyId`) vindo do cliente; sempre derivar de algo validado no servidor (o token).
