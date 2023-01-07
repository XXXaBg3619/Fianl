const { spawn } = require('child_process');

async function MOMO(name, page, searchType, callback) {
    // console.log(`MOMO: ${name}, ${page}, ${searchType}`)
    const pythonProcess = spawn('python', ['../PY/momo.py', name, page, searchType]);
    for await (const data of pythonProcess.stdout) {
        let productList;
        let prdsList = data.toString();
        if (prdsList === "overflow") {
            // console.log("overflow")
            prdsList = require('../productsList.json');
            productList = prdsList['momo'][name][page];
        }
        else
            productList = JSON.parse(prdsList)
        // if (productList.length === 0) {
        //     console.log("productList is empty");
        // }
        callback(productList);
    };
}


export default MOMO;