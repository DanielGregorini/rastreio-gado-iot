# criar um docker com o banco de dados

docker volume create api_java_topicos_data

docker run -d \
  --name api_java_topicos_db \
  -p 5432:5432 \
  -e POSTGRES_DB=api_java_topicos \
  -e POSTGRES_USER=daniel1 \
  -e POSTGRES_PASSWORD=daniel \
  -v api_java_topicos_data:/var/lib/postgresql/data \
  postgres:14

psql -h localhost -p 5432 -U daniel1 -d api_java_topicos

senha=daniel

ver todas as tabelas

\dt

INSERT INTO users (username, password, role, created_at, updated_at)
VALUES (
  'user1',
  'senha',
  'ROLE_USER',
  now(),
  now()
);



```bash
    docker run -d \
    --name pg_api_java_topicos \
    --env POSTGRES_USER=daniel1 \
    --env POSTGRES_PASSWORD=daniel \
    --env POSTGRES_DB=api_java_topicos \
    --publish 5432:5432 \
    postgres:14
