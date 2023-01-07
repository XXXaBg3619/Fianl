import express from 'express';
import cors from 'cors';
import searchRoute from './routes/search';
import path from "path";

const app = express();

// init middleware
app.use(cors());

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../frontend", "build")));
app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
    console.log(req.body);
});

// define routes
app.use("/api/search", searchRoute);

// define server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

