const express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    cors = require('cors'),
    app = express(),
    port = process.argv[2] || 8080,
    views = {root: './views'},
    url = 'mongodb://localhost:27017'

app.get('/', (req, res) => {
    res.sendFile('index.html', views)
})

app.get('/google', (req, res) => {
    res.sendFile('referrer.html', views)
})

app.use(cors())
app.use(express.static('public'))

MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    if(err) return console.error(err)
    var db = client.db('dni')

    app.get('/user', (req, res, next) => {
        db.collection('users').findOne({_id: parseInt(req.query.id)}, (err, doc) => {
            if(err) return next(err)
            res.send(doc)
        })
    })

    app.get('/map', (req, res, next) => {
        db.collection('dni-maps').findOne({_id: ObjectId(req.query.id)}, (err, doc) => {
            if(err) return next(err)
            res.send(doc)
        })
    })

    app.get('/numbers', (req, res, next) => {
        db.collection('numbers').findOne({_id: ObjectId(req.query.id)}, (err, doc) => {
            if(err) return next(err)
            res.send(doc)
        })
    })
})


app.listen(port, () => {
    console.log('Listening on:', port)
})
