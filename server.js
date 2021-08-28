const express = require("express");
const app = express();
const { MongoClient } = require("mongodb")//.MongoClient;
const port = process.env.PORT || 3000;
let bodyParser = require('body-parser');
app.use(bodyParser.json());

let db;
let collection;

MongoClient.connect('mongodb://localhost/CrudMENP', { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) return console.error(err, "No se conecto");
    console.log('Conectado a la base Mongo')
    db = client.db('CrudMENP')
    collection = db.collection('usuario')
})

app.listen(port, function () {
    console.log("Puerto " + port + " listo para funcionar");
});

app.get('/', (req, res) => {
    res.send("Hola mundo");
})

app.get('/usuario', (req, res) => {
    db.collection('usuario').find().toArray()
        .then(result => {
            res.json(result);
        }).catch(error => console.error(error));
})

app.post('/usuario', (req, res) => {
    collection.insertOne(req.body)
        .then(result => {
            res.json('success');
        })
        .catch(error => console.error(error))
})

app.put('/usuario/:id', (req, res) => {
    collection.findOneAndUpdate(
        { nombre: req.params.id },
        {
            $set: {
                nombre: req.body.nombre,
                apellido: req.body.apellido
            }
        },
        {
            upsert: true
        }
    ).then(result => { res.json('Modificado') })
        .catch(error => console.error(error))
});

app.delete('/usuario/:id', (req, res) => {
    collection.deleteOne(
        { nombre: req.params.id }
    )
        .then(result => {
            res.json('Eliminado')
        })
        .catch(error => console.error(error))
})