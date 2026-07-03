# 03 - Infraestrutura

## Objetivo
Rodar o PostgreSQL em ambiente isolado e reprodutível via Docker, sem depender de instalação nativa no sistema operacional.

## Stack
- Docker
- Docker Compose

## Decisões técnicas
- PostgreSQL roda em container, definido em `docker-compose.yml`, em vez de instalado direto na máquina.
- Credenciais do banco ficam em `.env` (nunca commitado); `.env.example` é versionado como modelo, sem valores reais.
- Volume nomeado (`postgres_data`) garante que os dados persistem entre reinícios do container.

## Desafios e soluções
1. **`docker` não vinha com o plugin `docker compose` (v2).** O pacote `docker.io` do apt do Ubuntu/Mint não inclui o plugin necessário. Resolvido instalando pelo repositório oficial do Docker (`docker-ce`, `docker-ce-cli`, `containerd.io`, `docker-compose-plugin`).
2. **Repositório oficial do Docker não reconhecia o codinome do Linux Mint (`zena`).** O Docker só publica pacotes para codinomes Ubuntu. Resolvido trocando `zena` por `noble` (codinome Ubuntu equivalente à base do Mint 22.3) no arquivo de fontes do apt.
3. **Containers não resolviam DNS** (falha ao baixar imagens, ex: `registry-1.docker.io`). Causa: `/etc/resolv.conf` do host apontava para `127.0.0.53` (stub local do `systemd-resolved`), endereço que não é alcançável de dentro dos containers. Resolvido configurando DNS público (`8.8.8.8`, `1.1.1.1`) em `/etc/docker/daemon.json` e reiniciando o serviço do Docker.
4. **Porta 5432 já estava em uso.** Havia um PostgreSQL nativo instalado e rodando na máquina, ocupando a porta padrão. Resolvido parando e desabilitando o serviço nativo (`systemctl stop/disable postgresql`), já que o projeto usa exclusivamente o Postgres do Docker.
5. **Container subia sem publicar a porta configurada.** Resultado de uma tentativa anterior que falhou por conflito de porta, deixando o container criado num estado inconsistente. Resolvido recriando do zero (`docker compose down` seguido de `docker compose up -d`).

## Aprendizados
- Distros baseadas em Ubuntu (como Linux Mint) nem sempre são reconhecidas por nome em repositórios de terceiros — é preciso mapear para o codinome Ubuntu correspondente.
- DNS dentro de containers Docker não herda automaticamente a configuração de resolução do host quando esta usa `systemd-resolved`.
- Debug sistemático (isolar se o problema é permissão, rede ou porta) evita tentativa e erro às cegas.
