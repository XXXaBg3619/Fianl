import express from 'express';
import MOMO from '../WebCrawler/momo';
import PCHOME from '../WebCrawler/pchome';
import SHOPEE from '../WebCrawler/shopee';
import { getPrdsList, savePrdsList, cleanPrdsList } from '../WebCrawler/db';

const router = express.Router();

// router.post("/start", (_, res) => {
//     genNumber();
//     res.json({ msg: "The game has started." });
// });

router.get("/momo", (req, res) => {
    const { prdName, page } = req.query;
    const prds = getPrdsList(prdName, "momo");
    const idName = `${prdName}-${20*(page-1)+1}`;
    const exist = prds.findIndex((obj) => obj["id"] === idName);
    console.log(`${page}, ${exist}`)
    if (exist !== -1) {
        console.log("Data has been stored")
        savePrdsList(prdName, "momo", prds);
        res.status(200).send({ msg: `${JSON.stringify(prds.slice(exist, exist+20))}` });
    }
    else {
        try {
            MOMO(prdName, page, (products) => {
                // console.log(products)
                // console.log(`ProductsList save: ${[products]}`)
                savePrdsList(prdName, "momo", [...prds, ...products]);
                res.status(200).send({ msg: `${JSON.stringify(products)}` });
            });
        }   
        catch (err) {
            res.status(200).send({ msg: "====error====" });
        }
    }
});

router.get("/pchome", (req, res) => {
    const { prdName, page } = req.query;
    const prds = getPrdsList(prdName, "pchome");
    const idName = `${prdName}-${20*(page-1)+1}`;
    const exist = prds.findIndex((obj) => obj["id"] === idName);
    if (exist !== -1) {
        savePrdsList(prdName, "momo", prds);
        res.status(200).send({ msg: `${JSON.stringify(prds.slice(exist, exist+20))}` });
    }
    else {
        try {
            PCHOME(prdName, page, (products) => {
                // console.log(products)
                savePrdsList(prdName, "pchome", [...prds, ...products]);
                res.status(200).send({ msg: `${JSON.stringify(products)}` });
            });
        } 
        catch (err) {
            res.status(200).send({ msg: "====error====" });
        }
    }
});

router.get("/shopee", (req, res) => {
    const { prdName, page } = req.query;
    const prds = getPrdsList(prdName, "shopee");
    const idName = `${prdName}-${10*(page-1)+1}`;
    const exist = prds.findIndex((obj) => obj["id"] === idName);
    if (exist !== -1) {
        savePrdsList(prdName, "momo", prds);
        console.log("data has been stored")
        res.status(200).send({ msg: `${JSON.stringify(prds.slice(exist, exist+10))}` });
    }
    else {
        try {
            SHOPEE(prdName, page, (products) => {
                // console.log(products)
                savePrdsList(prdName, "shopee", [...prds, ...products]);
                res.status(200).send({ msg: `${JSON.stringify(products)}` });
            });
        } 
        catch (err) {
            res.status(200).send({ msg: "====error====" });
        }
    }
});

router.post("/clean", (_, res) => {
    cleanPrdsList("all");
    res.status(200).send({ msg: "Data is clean" })
});
  

// router.post("/restart", (_, res) => {
//     genNumber();
//     res.json({ msg: "The game has restarted." });
// });


// router.post("/startAB", (_, res) => {
//     genNumberAB();
//     res.json({ msg: "The game has started." });
// });

// router.get("/guessAB", (req, res) => {
//     let numDB = getNumberAB();
//     if (numDB === "") {
//         genNumberAB();
//         numDB = getNumberAB();
//     }
//     const numREQ = req.query.number;
//     let a = 0;
//     let b = 0;
//     // console.log("numREQ:", numREQ)
//     if (Number.isInteger(parseFloat(numREQ)) && numREQ >= 1000 && numREQ <= 9999) {
//         for (let i = 0; i < 4; i++) {
//             if (numREQ.indexOf(numREQ[i]) !== i) {
//                 res.status(406).send({ msg: `Error: "${numREQ}" is not a valid number (all digits are different)` })
//                 return;
//             }
//             let idx = numREQ.indexOf(numDB[i]);
//             if (idx !== -1) {
//                 if (idx === i) {a++}
//                 else {b++}
//             }
//         }
//         res.status(200).send({ msg: `${a}A${b}B` })
//     }
//     else {
//         res.status(406).send({ msg: `Error: "${numREQ}" is not a valid number (1000 - 9999)` })
//     }
// });

// router.post("/restartAB", (_, res) => {
//     genNumberAB();
//     res.json({ msg: "The game has restarted." });
// });


export default router