const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
const evaluationRoutes = require('./routes/evaluationRoutes')
const questionRoutes = require('./routes/questionRoutes')
const userRoutes = require('./routes/userRoutes')

app.use(cors())
app.use(express.json())
app.options('*', cors())
app.use('/api', evaluationRoutes);
app.use('/api', questionRoutes)
app.use('/api', userRoutes)

app.listen(process.env.PORT, () => console.log('Server connected'))

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.DB, (err) => {
    if(err){
        return console.log('Error al conectarse a la base de datos')
    }
    return console.log('Conectado a la base de datos')
})