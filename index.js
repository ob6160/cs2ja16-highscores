const express = require('express')
const helmet = require('helmet')
const dotenv = require('dotenv')

const app = express()

// add some security-related headers to the response
app.use(helmet())
// parse JSON strings received in req body as JS object
app.use(express.json())

app.get('*', (req, res) => {
    res.set('Content-Type', 'text/html')
    res.status(200).send(`
      Pac-Man?
    `)
})

// Get top ten leaderboard entries in descending order of score
app.get('leaderboard', (req, res) => {
  res.json({})
})

// Allow for users to POST new scores
app.post('leaderboard/:name/:score', (req, res) => {
  const name = req.params.name;
  const score = req.params.score;
  res.json({name: name, score: score})
})

module.exports = app
