const express = require('express')
const app = express()
const port = 3000
const db = require('./models')
const itemRouter = require('./routes/item.routes')

db.sequelize.authenticate()
.then(()=>console.log('sequalize orm model sudah di dapat di gunakan'))
.catch((error) => console.error(error.message))

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/items', itemRouter);

app.get('/', (req, res) => {
    res.send('dANI!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})