import express from 'express';
// Create a new express app instance
const app = express();
app.get('/', function (req, res) {
res.send('Hello World!');
});

app.listen(8081, ()  => console.log('Inspector is listening on port 8081!'));
