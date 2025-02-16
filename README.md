# Distopia Server API

## Endpoints

### Criar Destaque

**Rota:** `POST /highlight`

**Descrição:**  
Adiciona um novo destaque ao sistema.

**Parâmetros:**  

- `name` (string, obrigatório): Nome do destaque.  
- `url` (string, obrigatório): URL associada ao destaque.  

**Exemplo de Requisição:**  

```json
{
  "name": "Destaque Importante",
  "url": "https://exemplo.com"
}
```

**Respostas:**  

- `201 Created` - Destaque criado com sucesso.  
- `400 Bad Request` - Erro na requisição (parâmetros inválidos).  
- `500 Internal Server Error` - Erro inesperado no servidor.  

---

### Obter Destaque por ID

**Rota:** `GET /highlight/:id`

**Descrição:**  
Busca um destaque específico pelo ID.

**Parâmetros:**  

- `id` (string, obrigatório, na URL): Identificador único do destaque.  

**Exemplo de Requisição:**  

```
GET /highlight/123e4567-e89b-12d3-a456-426614174000
```

**Respostas:**  

- `200 OK` - Retorna os detalhes do destaque.  
- `404 Not Found` - Destaque não encontrado.  
- `500 Internal Server Error` - Erro inesperado no servidor.  

---

### Obter Todos os Destaques  

**Rota:** `GET /highlight`

**Descrição:**  
Obtém a lista de todos os destaques cadastrados.

**Exemplo de Requisição:**  

```
GET /highlight
```

**Respostas:**  

- `200 OK` - Retorna a lista de destaques.  
- `500 Internal Server Error` - Erro inesperado no servidor.  

**Exemplo de Resposta:**  

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Destaque Importante",
    "url": "https://exemplo.com"
  },
  {
    "id": "987e6543-b21c-45f6-a789-123456789abc",
    "name": "Outro Destaque",
    "url": "https://outro-exemplo.com"
  }
]
```
