const { spawn } = require('child_process');

async function PCHOME(name, page, searchType, callback) {
    // console.log(`PCHOME: ${name}, ${page}, ${searchType}`)
    const pythonProcess = spawn('python', ['./WebCrawler/PY/pchome.py', name, page, searchType]);
    for await (const data of pythonProcess.stdout) {
        let productList;
        let prdsList = data.toString();
        if (prdsList === "overflow") {
            // console.log("overflow")
            prdsList = require('./productsList.json');
            productList = prdsList['pchome'][name][page];
        }
        else
            productList = JSON.parse(prdsList)
        // if (productList.length === 0) {
        //     console.log("productList is empty");
        // }
        callback(productList);
    };
}


export default PCHOME;