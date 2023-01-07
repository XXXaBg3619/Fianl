import express from 'express';
import MOMO from '../WebCrawler/JS/momo';
import PCHOME from '../WebCrawler/JS/pchome';
import SHOPEE from '../WebCrawler/JS/shopee';
import LOWHIGH from '../WebCrawler/JS/lowhigh';
import HIGHLOW from '../WebCrawler/JS/highlow';


const { spawn } = require('child_process');

const router = express.Router();

router.get("/momo", (req, res) => {
    const { prdName, page, searchType } = req.query;
    try {
        MOMO(prdName, page, searchType, (products) => {
            res.status(200).send({ msg: `${JSON.stringify(products)}` });
        });
    }   
    catch (err) {
        res.status(200).send({ msg: "====error====" });
    }
});

router.get("/pchome", (req, res) => {
    const { prdName, page, searchType } = req.query;
    try {
        PCHOME(prdName, page, searchType, (products) => {
            res.status(200).send({ msg: `${JSON.stringify(products)}` });
        });
    } 
    catch (err) {
        res.status(200).send({ msg: "====error====" });
    }
});

router.get("/shopee", (req, res) => {
    const { prdName, page, searchType } = req.query;
    try {
        SHOPEE(prdName, page, searchType, (products) => {
            console.log(products)
            res.status(200).send({ msg: `${JSON.stringify(products)}` });
        });
    } 
    catch (err) {
        res.status(200).send({ msg: "====error====" });
    }
});

router.get("/low-high", (req, res) => {
    let { prdName, page, type, searchType } = req.query;
    type = type.split(",");
    // console.log(`GET LOWHIGH Type: ${type[0]}, ${type[1]}`)
    // console.log(`GET low-high; ${prdName}, ${page}, ${type}, ${searchType}`)
    try {
        LOWHIGH(prdName, page, type, searchType, (products) => {
            // console.log(products)
            res.status(200).send({ msg: `${JSON.stringify(products)}` });
        });
    } 
    catch (err) {
        res.status(200).send({ msg: "====error====" });
    }
})

router.get("/high-low", (req, res) => {
    let { prdName, page, type, searchType } = req.query;
    type = type.split(",");
    // console.log(`GET LOWHIGH Type: ${type[0]}, ${type[1]}`)
    // console.log(`GET low-high; ${prdName}, ${page}, ${type}, ${searchType}`)
    try {
        HIGHLOW(prdName, page, type, searchType, (products) => {
            // console.log(products)
            res.status(200).send({ msg: `${JSON.stringify(products)}` });
        });
    } 
    catch (err) {
        res.status(200).send({ msg: "====error====" });
    }
})


router.post("/clean", async(req, res) => {
    let { platform } = req.query;
    // console.log(`POST clean: ${platform}`)
    const pythonProcess = spawn('python', ['./WebCrawler/clean.py', platform]);
    for await (const data of pythonProcess.stdout) {
        res.status(200).send({ msg: data })
    };
});



export default router