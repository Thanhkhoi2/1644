// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const connectionString = 'mongodb+srv://1644:123456K@cluster0.ygqlrd8.mongodb.net//';

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');

        const db = client.db('star-wars-quotes');
        const quotesCollection = db.collection('quotes');

        app.set('view engine', 'ejs');
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(express.static('public'));

        app.get('/', (req, res) => {
            quotesCollection.find().toArray()
                .then(results => {
                    res.render('index', { quotes: results });
                })
                .catch(error => console.error(error));
        });

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    console.log('Quote added');
                    res.redirect('/');
                })
                .catch(error => console.error(error));
        });

        app.listen(3000, function() {
            console.log('Listening on port 3000');
        });
    });
