const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const nodemailer = require('nodemailer')
require('dotenv').config()
const app = express()
const cookieParser = require('cookie-parser')

const evaluationRoutes = require('./routes/evaluationRoutes')
const questionRoutes = require('./routes/questionRoutes')
const userRoutes = require('./routes/userRoutes')
const answerRoutes = require('./routes/answerRoutes')
const emailRoutes = require('./routes/emailRoutes')
const participantRoutes = require('./routes/participantRoutes')
const productRoutes = require('./routes/productRoutes')

app.use(cookieParser())
app.use(cors({ credentials: true, origin: process.env.DIRECTION }))
app.use(express.json())
app.options('*', cors())
app.use('/api', evaluationRoutes);
app.use('/api', questionRoutes)
app.use('/api', userRoutes)
app.use('/api', answerRoutes)
app.use('/api', emailRoutes)
app.use('/api', participantRoutes)
app.use('/api', productRoutes)

app.listen(process.env.PORT, () => console.log('Server connected'))

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.DB, (err) => {
    if (err) {
        return console.log('Error al conectarse a la base de datos')
    }
    return console.log('Conectado a la base de datos')
})