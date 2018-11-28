const express = require('express')
const request = require('request')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const worker = require('./worker')

app.use(express.static('public'))

app.post("/changeMode", (req, res) => {
  worker.changeMode(JSON.parse(req.body.data))
  res.end()
})

app.post("/changeState", (req, res) => {
  console.log('being requested to turn it off')
  worker.changeState(JSON.parse(req.body.data))
  res.end()
})

app.head("/keepalive", (req, res) => {
  console.log('Keepalive received')
  res.end()
})

worker.work('start') 

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})