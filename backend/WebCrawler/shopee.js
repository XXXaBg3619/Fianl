const { spawn } = require('child_process');

async function SHOPEE(name, page, callback) {
    // console.log(page)
    const pythonProcess = spawn('python', ['./WebCrawler/shopee.py', name, page]);
    for await (const data of pythonProcess.stdout) {
        const productList = JSON.parse(data.toString());
        if (productList.length === 0) {
            console.log("productList is empty");
        }
        // else
            // console.log(productList)
        callback(productList);
    };
}



export default SHOPEE;