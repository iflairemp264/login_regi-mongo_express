/* 
    created :- HITESH CHAVDA
*/

const express = require('express')
const cors = require('cors')
const bodyPraser = require('body-parser')
const config = require('./app/config/db.config')
const app = express();

const indexRoute = require('./app/routes/index');
const userRoutes = require('./app/routes/user');
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyPraser.urlencoded({ extended: true }))
app.use(bodyPraser.json())
app.use(cors());

//db connections
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

//connection through mongo cloud or local system mongo
// mongoose.connect(config.connection + config.dbName,
mongoose.connect(`mongodb+srv://*******************/express_test?retryWrites=true&w=majority`, // change url 
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
).then(() => {
    console.log('DB Connected successfully!!');
}).catch(() => {
    console.log('Error in DB Connections');
})


//routes
app.use('/api', indexRoute)
app.use('/api/user', userRoutes)


app.listen(8000, () => {
    console.log("Server running on port :- 8000");
})


