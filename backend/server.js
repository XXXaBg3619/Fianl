import express from 'express';
import cors from 'cors';
import searchRoute from './routes/search';

const app = express();

// init middleware
app.use(cors());

// define routes
app.use("/api/search", searchRoute);

// define server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

