const { spawn } = require('child_process');


async function SHOPEE_5(name, page, searchType, callback) {
    console.log(`SHOPEE: ${name}, ${page}, ${searchType}`)
    const Page = parseInt(page);
    const pythonProcess = spawn('python', ['./WebCrawler/PY/shopee.py', name, page, searchType]);
    for await (const data of pythonProcess.stdout) {
        let productList;
        let prdsList = data.toString();
        if (prdsList === "overflow") {
            // console.log("overflow")
            prdsList = require('./productsList.json');
            const pageFix = `${Math.floor((Page-1)/12)}-${(Page-1)%12+1}`
            productList = prdsList['momo'][name][pageFix];
        }
        else {
            productList = JSON.parse(prdsList)
        }
        if (productList.length === 0) {
            // console.log("productList is empty");
        }
        callback(productList);
    };
}

const SHOPEE = async(name, page, searchType, callback) => {
    let prdsList = [];
    try {
        for (let i = 0; i < 4; i++) {
            await SHOPEE_5(name, parseInt(4*(page-1)+1)+i, searchType, (products) => {
                prdsList = [...prdsList, ...products];
                // console.log(prdsList.length);
            });
        }
        callback(prdsList);
    } 
    catch (err) {
        callback([]);
    }
}



export default SHOPEE;