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

const mongoclient = new MongoClient(uri, { useNewUrlParser: true });

// add some security-related headers to the response
app.use(helmet())

// Allow for users to POST new scores
app.post('*', (req, res) => {
  const name = req.query.name
  const score = req.query.score
  console.log(req.param, req.query)
  mongoclient.connect((err, client) => {
    const db = client.db("leaderboard")
    const highscores = db.collection("highscores")
    console.log(name, score)
    if(name && score) {
      const entry = {name: name, score: score}
      highscores.insertOne(entry, (err, r) => {
        client.close()
        res.json(r)
      })
    }
  })
})

app.get('*', (req, res) => {
  mongoclient.connect((err, client) => {
    const db = client.db("leaderboard")
    // return the highest score
    db.collection("highscores").find().sort({score:-1}).limit(1).toArray((err, result) => {
      if(err) throw err
      res.json(result)
    })
  })
})

module.exports = app
