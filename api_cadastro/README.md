mongosh "mongodb://topicos:topicos@127.0.0.1:27017/topicos?authSource=topicos"

mutation {
  createUser(input: {
    name: "pedro"
    email: "email@email.com"
    password: "minhaSenhaSegura123"
  }) {
    id
    name
    email
    createdAt
    updatedAt
  }
}


query {
  users {
    id
    name
    email
    createdAt
    updatedAt
  }
}
