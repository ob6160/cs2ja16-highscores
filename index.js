const express = require('express')
const helmet = require('helmet')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const db = low(adapter)
const app = express()

const adapter = new FileSync('db.json')

// Set the database defaults for leaderboard
db.defaults({ leaderboard: [] })
  .write()

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
  const data = db.get('leaderboard')
    .sortBy('score')
    .take(10)
    .value();

  res.json(data)
})

// Allow for users to POST new scores
app.post('leaderboard/:name/:score', (req, res) => {
  const name = req.params.name;
  const score = req.params.score;
  if(name && (score > -1)) {
    db.get('leaderboard')
      .push({ name: name, score: score })
      .write();
  }
})

module.exports = app
