const express = require('express')
const errorHandler = require('./middleware/errorHandler')
const dotenv = require('dotenv').config()
const connectDb = require('./config/dbConnection')
connectDb()

const app = express()

const PORT = 3000

app.use(express.json())
app.use('/api/contacts', require('./routes/contactRoute') )
app.use('/api/users', require('./routes/userRoute') )
app.use(errorHandler)



app.get('/',(req, res)=> {
        res.status(200).send('This is working!')
})

app.listen(PORT, ()=>{
        console.log(`listening on ${PORT}`)
})

 