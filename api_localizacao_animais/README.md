# criar um docker com o banco de dados

```bash
    docker run -d \
    --name pg_api_java_topicos \
    --env POSTGRES_USER=daniel1 \
    --env POSTGRES_PASSWORD=daniel \
    --env POSTGRES_DB=api_java_topicos \
    --publish 5432:5432 \
    postgres:14
