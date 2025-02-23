require('dotenv').config()   //env config
const express = require('express')  //express backage
const mongoose = require('mongoose') //mongoose backge 
const routes = require('./router/Register')  //its is routs connect to api
const adminrouter = require('./router/Admin')
const jobrouter = require('./router/Jobprovider')
const ticktrouter = require('./router/Tickets')
const cors = require('cors')
const session = require('express-session')
const sessionConnect = require('connect-mongodb-session')(session)


const app = express()

const corsOptions = {  // orgin setup to front end 
    origin: ['http://localhost:7002', 'http://192.168.0.114:7002',"https://3zn7kpnd-7002.inc1.devtunnels.ms"], 
    credentials: true,
};

// Use CORS middleware
app.use(cors(corsOptions));
app.set("trust proxy",1)
app.use(express.json())
app.use(express.urlencoded({extended: true}))




const Store = new sessionConnect({
    uri: process.env.DB_CONNECTION_STRING ,
    collection: 'Sessions',
});

app.use(session({
    secret: process.env.SECUREKEY,
    resave: false,
    saveUninitialized: false,
    store: Store,
    cookie:{
        secure: true,
        httpOnly: true,
        sameSite: 'none'
    }
    
}));

mongoose.connect(process.env.DB_CONNECTION_STRING)  // mongoose connection and env db password links
.then(()=>console.log('Mongodb Connected successfully!'))
.catch((err)=>console.log('Error found on mongodb connection: ',err))


app.listen(7000,()=>{   //which port
    console.log("Server stared on localhost:7000")
})

app.use('/api', routes)
app.use('/api',adminrouter)
app.use('/api',jobrouter)
app.use('/api',ticktrouter)







