import { createServer } from 'http'
import { config } from './config';
import app from './handler'

;(async () => {
  const server = createServer(app.callback())

  server.listen(Number(config.PORT), '0.0.0.0', () => {
    console.log(`Servidor rodando em http://0.0.0.0:${config.PORT}`)
  })
})()
