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
        
        app.get('/category', async (req, res) => {
            if (req.query.country) {
                const query = { country: req.query.country };
                const result = await categoryCollection.find(query).toArray();
                res.send(result);
            }
            else {
                const query = {};
                const result = await categoryCollection.find(query).toArray();
                res.send(result);
            }
        });

// ===============================

          app.get('/category/filter/v2', async (req, res) => {
            const param = req.query
            if(!param.brfFilter && !param.frIntFilter && !param.freeAirFilter && !param.airConFilter && !param.fitness && !param.pool ){
              const data = await categoryCollection.find({}).toArray();
              return res.send(data)
            }else{
              let filterQueries = []
              if(param.brfFilter){
                filterQueries = [...filterQueries, {
                  freeBreakFast: "Free breakfast"
                }]
              }

              if(param.frIntFilter){
                filterQueries = [...filterQueries, {
                  freeInternet: "Free internet"
                }]
              }
              if(param.freeAirFilter){
                filterQueries = [...filterQueries, {
                  freeAirportShuttle: "Free airport shuttle"
                }]
              }

              if(param.airConFilter){
                filterQueries = [...filterQueries, {
                  airConditioned: "Air conditioned"
                }]
              }

              if(param.fitness){
                filterQueries = [...filterQueries, {
                  fitness: "Fitness"
                }]
              }

              if(param.pool){
                filterQueries = [...filterQueries, {
                  pool: "Pool"
                }]
              }

              const filterData = await categoryCollection.find({$or: filterQueries}).toArray();
              return res.send(filterData)

            }
          });

// ==========================================

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
        
            const hotels = await categoryCollection.find({
              $and: [
                city ? { city } : {},
                price ? { price: { $lte: price } } : {},
                room ? { room: { $gte: room } } : {},
                guests ? { guests: { $gte: guests } } : {}
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



