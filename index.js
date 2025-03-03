const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.json('Olá Mundo container!')
})

app.listen(port, () => {
  console.log(`App de exemplo esta rodando na porta ${port}`)
})