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

