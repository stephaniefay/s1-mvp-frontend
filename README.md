## Spring 1 - MVP - Frontend

### Descrição
Essa é a contra-parte do projeto [backend](https://github.com/stephaniefay/s1-mvp-backend), feito para demonstrar as
rotas contidas dentro da API desenvolvida.

O projeto é uma SPA onde são listadas todas as coleções de cartas disponíveis, com imagens, detalhes e afins e o Usuário
poderá navegar entre as coleções - e cartas - e adicioná-las à uma lista de desejos (ou `Wish` como é chamado na SPA) para
uma consulta rápida depois.

### Instalação
Esse projeto não requer nenhuma instalação prévia de nenhum componente. Para a execução, basta rodar o arquivo `index.html`
contido dentro do projeto para a exibição da aplicação.

Para que seja obtido resultados, será necessário que a API backend esteja em execução e alcançável.

### Rotas
A tela utiliza as seguintes rotas (disponíveis na API contida no projeto backend) para renderizar a informação para o usuário:

#### Coleções

 - `/sets` **GET**

Busca todas as coleções disponíveis que estão cadastradas na API. Pode ser usado um query parameter `name` contendo parte do nome da coleção para a filtragem.

 - `/sets/{id}/cards` **GET**

Busca todas as cartas contidas em uma coleção utilizando seu ID. Pode ser usado um query parameter `search` contendo parte do nome da carta para a filtragem.

#### Listas de Desejo

  - `/wishes` **GET** 
 
 Busca todas as listas de desejo disponíveis que estão cadastradas na API. Possui um query parameter `card_id` que deve ser usado para filtrar todas as listas que não possuem uma carta específica.
 
  - `/wishes/{ìd}/cards` **GET**
 
 Busca todas as cartas contidas em uma lista de desejo utilizando seu ID. Pode ser usado um query parameter `search` contendo parte do nome da carta para a filtragem.
 
  - `/wishes` **POST**
 
 Endpoint para criação de uma lista de desejos. Deve obrigatoriamente ser passado um body contendo os campos

```
{
  "name": "nome da lista de desejos",
  "description": "descrição da lista de desejos (opcional)",
  "color": "cor em código hexadecimal para definir a cor da coleção (opcional)"
}
```
  
  - `/wishes/{id}` **PUT** 
 
 Endpoint para associação de uma carta a uma lista de desejos. Deve ser passado o ID da lista no próprio path e, no body, uma lista com os `ids` das cartas a serem associadas.

 ```
{
  "ids": ["aqui deve ser inserido os ids de todas as cartas a serem adicionadas"]
}
```
 
   - `/wishes/{id}/card` **DELETE**
 
 Endpoint para a remoção de uma carta de uma lista de desejos. Deve ser passado o ID da lista no próprio path e, no body, uma lista com os `ids` das cartas a serem removidas.

  ```
{
  "ids": ["aqui deve ser inserido os ids de todas as cartas a serem removidas"]
}
```
