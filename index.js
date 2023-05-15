const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())
app.options('*', cors())

app.listen(3000, () => console.log('Server connected'))

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