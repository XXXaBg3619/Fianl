import express from 'express';
import cors from 'cors';
import searchRoute from './routes/search';

const app = express();

// init middleware
// app.use(cors());

// define routes
// app.use("/api/search", searchRoute);


if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(cors());
    app.use(express.static(path.join(__dirname, "../frontend", "build")));
    app.get("/*", function (req, res) {
      res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
      console.log(req.body);
    });
    app.use(express.json())
    app.use(bodyParser.json());
    app.use("/", routes);
}
if (process.env.NODE_ENV === "development") {
	app.use(cors());
}


// define server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

