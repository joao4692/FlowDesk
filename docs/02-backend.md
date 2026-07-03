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
- **Testes de integração, não unitários**: como a lógica de negócio ainda é simples, o valor está em testar a rota completa (request → banco → response), não funções isoladas.
- **Filosofia de teste por risco**: nem toda rota precisa de teste. Priorizamos o que tem lógica/validação real, não CRUDs triviais só por cobertura.

## Como testamos
- Arquivo de teste ao lado do arquivo testado, sufixo `.test.ts` (ex: `app.test.ts` ao lado de `app.ts`).
- Supertest simula requisições HTTP direto contra o `app` Express, sem precisar de servidor rodando.
- Conexão do Prisma fechada explicitamente no fim dos testes (`afterAll`), evitando processos pendurados.

```ts
describe("Companies", () => {
  it("cria uma empresa e retorna ela", async () => {
    const response = await request(app).post("/companies").send({ name: "Empresa Teste" });
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

## Aprendizados
- Separar definição do app de inicialização do servidor é o que viabiliza testes de API sem infraestrutura extra.
- Lidar com *breaking changes* de uma biblioteca recém-lançada (Prisma 7) é parte normal do trabalho real, não um sinal de erro do desenvolvedor.
