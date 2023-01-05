let productsList = {"momo": {}, "pchome": {}, "shopee": {}};
let prdsName = {"momo": [], "pchome": [], "shopee": []};
let totalData = {"momo": 0, "pchome": 0, "shopee": 0};

const getPrdsList = (name, type) => {
    if (name in productsList[type]) {
        // if (productsList[type][name].length !== 0)
        //     console.log(`get ${type}: ${productsList[type][name][0].id} ~ ${productsList[type][name][productsList[type][name].length-1].id}`)
        return productsList[type][name];
    }
    else
        return [];
}

const savePrdsList = (name, type, list) => {
    if (prdsName[type].indexOf(name) === -1 && name !== "") {
        // console.log("new")
        prdsName[type].push(name);
        totalData[type] += list.length;
    }
    else if (name !== "") {
        // console.log("old")
        totalData[type] = totalData[type] + list.length;
        if (name in productsList[type])
            totalData[type] -= productsList[type][name].length;
    }
    productsList[type][name] = list;
    if (totalData[type] > 1000) {
        totalData[type] -= productsList[type][prdsName[0]].length;
        delete productsList[type][prdsName[0]];
        prdsName[type].shift();
    }
    // if (productsList[type][name].length !== 0) {
    //     console.log(prdsName[type]);
    //     console.log(`save ${type}: ${productsList[type][name][0].id} ~ ${productsList[type][name][productsList[type][name].length-1].id}, ${totalData[type]} vs ${productsList[type][name].length}\n`)
    // }
}

const cleanPrdsList = (type) => {
    if (type === "all") {
        productsList = {"momo": {}, "pchome": {}, "shopee": {}};
        prdsName = {"momo": [], "pchome": [], "shopee": []};
        totalData = {"momo": 0, "pchome": 0, "shopee": 0};
    }
    else {
        productsList[type] = {};
        prdsName[type] = [];
        totalData[type] = 0;
    }
    console.log(`clean ${type}`)
}


export { getPrdsList, savePrdsList, cleanPrdsList }