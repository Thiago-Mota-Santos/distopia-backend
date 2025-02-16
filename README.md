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

---

### Obter Vídeos Recentes

**Rota:** `GET /recent-videos`

**Descrição:**  
Obtém a lista de vídeos recentes do sistema.

**Exemplo de Requisição:**  

```
GET /recent-videos
```

**Respostas:**  

- `200 OK` - Retorna a lista de vídeos recentes.  
- `500 Internal Server Error` - Erro inesperado no servidor.  

**Exemplo de Resposta:**  

```json
{
  "videos": [
    {
      "id": "klWSm-V9cMk",
      "title": "IG0Y EXPLICA O PODER GNÓSTICO DAS TATUAGENS...",
      "description": "#distopiapdc #distopiaclipes #fullmetalalchemist  \ncontato.distopiapdc@gmail.com\nTatuagens são um problema gnóstico?",
      "thumbnails": {
        "default": {
          "url": "https://i.ytimg.com/vi/klWSm-V9cMk/default.jpg",
          "width": 120,
          "height": 90
        },
        "medium": {
          "url": "https://i.ytimg.com/vi/klWSm-V9cMk/mqdefault.jpg",
          "width": 320,
          "height": 180
        },
        "high": {
          "url": "https://i.ytimg.com/vi/klWSm-V9cMk/hqdefault.jpg",
          "width": 480,
          "height": 360
        },
        "standard": {
          "url": "https://i.ytimg.com/vi/klWSm-V9cMk/sddefault.jpg",
          "width": 640,
          "height": 480
        },
        "maxres": {
          "url": "https://i.ytimg.com/vi/klWSm-V9cMk/maxresdefault.jpg",
          "width": 1280,
          "height": 720
        }
      },
      "publishedAt": "2025-02-16T00:32:13Z"
    }
  ]
}
```

---

### Criar Contato

**Rota:** `POST /contact`

**Descrição:**  
Cria um novo contato no sistema.

**Parâmetros:**  

- `name` (string, obrigatório): Nome do contato.  
- `email` (string, obrigatório): Endereço de email.  
- `message` (string, obrigatório): Mensagem enviada pelo contato.  

**Exemplo de Requisição:**  

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "message": "Gostaria de saber mais informações sobre os serviços."
}
```

**Respostas:**  

- `201 Created` - Contato criado com sucesso.  
- `400 Bad Request` - Erro na requisição (parâmetros inválidos).  
- `500 Internal Server Error` - Erro inesperado no servidor.  

