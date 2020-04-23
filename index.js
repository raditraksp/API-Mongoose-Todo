// CONFIG ENV
const dotenv = require('dotenv')
dotenv.config()


// CONFIG EXPRESS
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT //menggunakan port yang di sediakan heroku

// IMPORT ROUTER
const userRoute = require('./src/route/userRoute')
const todoRoute = require('./src/route/todoRoute')

app.use(cors())
app.use(express.json())
app.use(userRoute)
app.use(todoRoute)

// CONFIG MONGOOSE
// mongodb+srv://raditraksp:<password>@jcwm-bekasi-5n11p.mongodb.net/test?retryWrites=true&w=majority
// local host => mongodb://127.0.0.1:27017/Mongoose-Test
const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://raditraksp:${process.env.MONGO_PASSWORD}@jcwm-bekasi-5n11p.mongodb.net/todo-api?retryWrites=true&w=majority`, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex :  true,
   useFindAndModify : false
}, () => {console.log("Connected to db")})

// HOME
app.get('/', (req, res) => {
   res.send(
      '<h1> API is running </h1>'
   )
})

app.listen(port, () => { console.log('API is Running') })