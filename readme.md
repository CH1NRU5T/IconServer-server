# IconServer Server

Client Repository: [IconServer-client](https://github.com/CH1NRU5T/IconServer)

## Installation

- Clone the repository

```bash
https://github.com/CH1NRU5T/IconServer-server
```

- Run

```bash
npm install
```

- Run

```bash
npm run dev
```

## Features

- The server will accept a query string.
- It will call a chat-gpt api to get 2 things:
  - A FontAwesome icon related to the query string
  - A list of 2 project ideas related to the query string
- It will make sure the icon provided by chat-gpt is available in the fontawesome library, and is free (by making a call to the GraphQL API of FontAwesome).
- It will return the icon and the project ideas to the client.

## Limitations

- The server is deployed on render, and the free-tier will delay the requrests the first time it is made. `Your free instance will spin down with inactivity, which can delay requests by 50 seconds or more.`
