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
- **Multi-tenancy por empresa**: toda consulta de dados de uma empresa (ex: Projetos) usa `req.user.companyId` — o valor vem do token validado, nunca do corpo da requisição, evitando que um usuário manipule a requisição para acessar dados de outra empresa.
- **Testes de integração, não unitários**: como a lógica de negócio ainda é simples, o valor está em testar a rota completa (request → banco → response), não funções isoladas.
- **Filosofia de teste por risco**: nem toda rota precisa de teste. Priorizamos o que tem lógica/validação real, não CRUDs triviais só por cobertura.

## Como testamos

- Arquivo de teste ao lado do arquivo testado, sufixo `.test.ts` (ex: `app.test.ts` ao lado de `app.ts`).
- Supertest simula requisições HTTP direto contra o `app` Express, sem precisar de servidor rodando.
- Conexão do Prisma fechada explicitamente no fim dos testes (`afterAll`), evitando processos pendurados.

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

## Aprendizados

- Separar definição do app de inicialização do servidor é o que viabiliza testes de API sem infraestrutura extra.
- Lidar com _breaking changes_ de uma biblioteca recém-lançada (Prisma 7) é parte normal do trabalho real, não um sinal de erro do desenvolvedor.
- `tsc` e `ts-node` não resolvem arquivos exatamente da mesma forma — vale checar com `npx tsc --noEmit` quando um erro de tipo parece "não fazer sentido" no dev server, pra isolar se é erro de código ou de configuração da ferramenta.
- Nunca confiar em dado sensível (como `companyId`) vindo do cliente; sempre derivar de algo validado no servidor (o token).
