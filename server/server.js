const express = require('express');
const apiRouter = require('./routes');

const app = express();

app.use(express.json());
app.use('/api', apiRouter);

const port = process.env.PORT || 5000

app.listen(port, ()=>console.log(`listening on port ${port}...`))