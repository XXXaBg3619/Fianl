const { spawn } = require('child_process');

async function MOMO(name, page, callback) {
    // console.log(page)
    const pythonProcess = spawn('python', ['./WebCrawler/momo.py', name, page]);
    for await (const data of pythonProcess.stdout) {
        const productList = JSON.parse(data.toString());
        // try {
        //     console.log(productList[0].id)
        // }
        // catch {
        //     console.log("productList is empty")
        // }
        if (productList.length === 0) {
            console.log("productList is empty");
        }

        // if (productsList === undefined) {
        //     productsList = {};
        // }
        // else if (page === 1) {
        //     productsList[name] = { "nameList": [], "priceList": [], "urlList": [] }
        // }
        // productsList[name] = {
        //     "nameList": [...productList.nameList],
            // "priceList": [...productList.priceList],
            // "urlList": [...productList.urlList],
        // }
        callback(productList);
    };
}


export default MOMO;