const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
require('dotenv').config()
const port = process.env.PORT || 5000


//* DATABASE 
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ensig.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const everCleanerCollection = client.db("everCleaner").collection("services");
    const messageCollection = client.db("everCleaner").collection("message");
    const reviewCollection = client.db("everCleaner").collection("review");
    const bookingCollection = client.db("everCleaner").collection("booking");
    const adminEmailCollection = client.db("everCleaner").collection("adminEmail");
    const orderCollection = client.db("everCleaner").collection("order");
    //* ROOT 
    app.get('/', (req, res) => {
        res.send('Hello DataBase!')
    })


    //* SENT MESSAGE WITH FORM API
    app.post('/sentMessageWithForm', (req, res) => {
      const messageBody = req.body
      messageCollection.insertOne(messageBody)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })


    //* POST SERVICES API
    app.post('/addService', (req, res) => {
        const data = req.body
        everCleanerCollection.insertOne(data)
        .then(result => {
            console.log(result);
            res.send(result.insertedCount > 0)
        }) 
    }) 
    //* GET SERVICES API 
    app.get('/getServices', (req, res) => {
      everCleanerCollection.find({})
      .toArray((err, items) => {
        res.send(items)
      })
    })
    //* GET SINGLE SERVICES API
    app.get('/getSingleService/:id', (req, res) => {
      everCleanerCollection.find({_id : ObjectID(req.params.id)})
      .toArray((err , item) => {
        res.send(item)
      })
    })


    //* POST REVIEW API
    app.post('/addReview', (req, res) => {
      const reviewData = req.body
      reviewCollection.insertOne(reviewData)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })
    //* GET REVIEW API
    app.get('/getReview', (req, res) => {
    reviewCollection.find({})
    .toArray((err, items) => {
      res.send(items)
      })
    })


    //* POST BOOKING API
    app.post('/addBook', (req,res) => {
      const bookData = req.body
      bookingCollection.insertOne(bookData)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })
    

    //* ADMIN MANAGE SERVICE API
    app.get('/getManageService', (req, res) => {
      everCleanerCollection.find({})
      .toArray( (err, items) =>{
        res.send(items)
      })
    })
    //* ADMIN DELETE SERVICE MANAGEMENT
    app.delete('/deleteService/:id', (req,res) => {
      everCleanerCollection.deleteOne({_id : ObjectID(req.params.id)})
      .then(result => {
        res.send(result.deletedCount > 0)
      })
    })
    //* ADMIN ADD EMAIL
    app.post('/makeAdmin', (req, res) => {
      const adminEmail = req.body
      adminEmailCollection.insertOne(adminEmail)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    }) 
    //* GET ADMIN EMAIL
    app.get('/getAdmin', (req,res) => {
      const queryEmail = req.query.email
      console.log(queryEmail);
      adminEmailCollection.find({Email : queryEmail})
      .toArray( (err, documents) => {
        res.send(documents.length > 0)
      })
    })


    //* USER ORDER API
    app.post('/addOrder', (req, res) => {
      const orderData = req.body
      orderCollection.insertOne(orderData)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    }) 
    //* GET USER ORDER LIST
    app.get('/getOrder', (req, res) => {
      orderCollection.find({})
      .toArray((err, items) => {
        res.send(items)
      })
    })
    //* GET SPECIFIC USER BOOKING LIST
    app.get('/getBooking', (req, res) => {
      console.log(req.query.email);
      orderCollection.find({email : req.query.email})
      .toArray((err, items) => {
        res.send(items)
      })
    })

  //client.close();
});


app.listen(port, () => {
  console.log(`Database app listening at http://localhost:${port}`)
})
