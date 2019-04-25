const express = require('express')
const helmet = require('helmet')
const app = express()

if (process.env.NODE_ENV !== 'production') {
  require('now-env')
}

const MongoClient = require('mongodb').MongoClient;
const mongoUser = process.env.MONGO_USER;
const mongoPass = process.env.MONGO_PASS;
const uri = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0-nrdwp.gcp.mongodb.net/test?retryWrites=true`;

const client = new MongoClient(uri, { useNewUrlParser: true });

// add some security-related headers to the response
app.use(helmet())

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
app.post('leaderboard/:name/:score', async (req, res) => {
  const name = req.params.name
  const score = req.params.score
  if(name && score > -1) {
    const entry = {name: name, score: score}
    await client.connect()
    const highscores = client.db("leaderboard").collection("highscores")
    highscores.save(entry)
  }
})


module.exports = app
