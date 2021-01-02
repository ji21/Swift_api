const express = require('express');
const apiRouter = require('./routes');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

const port = process.env.PORT || 5000

app.listen(port, ()=>console.log(`listening on port ${port}...`))