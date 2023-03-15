const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config();


const port = process.env.PORT || 5000;

const app = express();


// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://hotelFlow:${process.env.DB_PASS}@cluster0.ktw0gh0.mongodb.net/?retryWrites=true&w=majority`;

// lJnyytCZn0PaXcDK

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run(){
    try {
        // await client.connect();
        const hotelPlaceCollection = client.db('hotelBooking').collection('hotelPlace');
        const categoryCollection = client.db('hotelBooking').collection('category');

        app.get('/hotelPlace', async (req, res) => {
            const query = {};
            const result = await hotelPlaceCollection.find(query).toArray();
            res.send(result);
        });
        
        // app.get('/category', async (req, res) => {
        //     if (req.query.country) {
        //         const query = { country: req.query.country };
        //         const result = await categoryCollection.find(query).toArray();
        //         res.send(result);
        //     }
        //     else {
        //         const query = {};
        //         const result = await categoryCollection.find(query).toArray();
        //         res.send(result);
        //     }
        // });

         app.get("/category", async (req, res) => {
          let query = {};
          if (req.query.brfFilter === "true" && req.query.frIntFilter === "false") {
            query = {
              freeBreakFast: "Free breakfast",
            };
          }
          if (req.query.brfFilter === "false" && req.query.frIntFilter === "true") {
            query = {
              freeInternet: "Free internet",
            };
          
          }
          console.log(req.query.brfFilter, req.query.frIntFilter);
          if (req.query.country) {
             query = { country: req.query.country  };
            // const result = await categoryCollection.find(query).toArray();
            // res.send(result);
        }
        
            // const query = {};
            const result = await categoryCollection.find(query).toArray();
            res.send(result);
       
        });

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const booking = await categoryCollection.findOne(query);
            res.send(booking);
        });


        app.get('/category/search/getHotelBySearch', async (req, res) => {
          try {
            const city = req.query.city;
            const price = parseInt(req.query.price);
            const room = parseInt(req.query.room);
            const guests = parseInt(req.query.guests);
            // const freeBreakFast = req.query.freeBreakFast;
            // const freeParking = req.query.freeParking;
            // const freeInternet = req.query.freeInternet;
            // const freeAirportShuttle = req.query.freeAirportShuttle;
            // const freeCancellation = req.query.freeCancellation;
            // const frontDesk = req.query.frontDesk;
            // const airConditioned = req.query.airConditioned;
            // const fitness = req.query.fitness;
            // const pool = req.query.pool;
        
            const hotels = await categoryCollection.find({
              $and: [
                city ? { city } : {},
                price ? { price: { $gte: price } } : {},
                room ? { room: { $gte: room } } : {},
                guests ? { guests: { $gte: guests } } : {},
                // freeBreakFast ? { freeBreakFast } : {},
                // freeParking ? { freeParking } : {},
                // freeInternet ? { freeInternet } : {},
                // freeAirportShuttle ? { freeAirportShuttle } : {},
                // freeCancellation ? { freeCancellation } : {},
                // frontDesk ? { frontDesk } : {},
                // airConditioned ? { airConditioned } : {},
                // fitness ? { fitness } : {},
                // pool ? { pool } : {}
              ]
            }).toArray();
        
            res.status(200).json({
              success: true,
              message: 'Successful', 
              data: hotels
            });
          } catch (err) {
            res.status(404).json({
              success: false, 
              message: 'not found',
            });
          }
        });
        

        // ================

       

    } 
    finally {

    }
}
run().catch(console.log);



app.get('/', async (req, res) => {
    res.send('hotel-flow server is running');
})

app.listen(port, () => console.log(`hotel-flow  running on ${port}`))



