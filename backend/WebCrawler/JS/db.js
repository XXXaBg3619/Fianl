let productsList = {};
// {
//     "momo": {
//         "name1": {
//             "1": [ // page
//                 {
//                     "id": "ps5-1", 
//                     "name": "\u3010SONY \u7d22\u5c3c\u3011PS5 \u4e3b\u6a5f \u6230\u795e\uff1a\u8af8\u795e\u9ec3\u660f \u540c\u6346\u7d44(CFI-1218A01)", 
//                     "price": "$19380", 
//                     "link": "http://m.momoshop.com.tw/goods.momo?i_code=10720099&mdiv=searchEngine&oid=1_1&kw=ps5", 
//                     "pic": "https://i2.momoshop.com.tw/1667377267/goodsimg/0010/720/099/10720099_L_m.webp"
//                 },
//                 {
//                     "id": "ps5-2", 
//                     "name": "\u3010SONY \u7d22\u5c3c\u3011PS5 \u5149\u789f\u7248\u4e3b\u6a5f(CFI-1218A01)", 
//                     "price": "$17580", 
//                     "link": "http://m.momoshop.com.tw/goods.momo?i_code=10732547&mdiv=searchEngine&oid=1_2&kw=ps5", 
//                     "pic": "https://i3.momoshop.com.tw/1667447806/goodsimg/0010/732/547/10732547_L_m.webp"
//                 } 
//             ],
//         }
//     }, 
//     "pchome": {}, 
//     "shopee": {}
// };
let prdsName = {};
let totalData = {};

const getPrdsList = (name, type) => {
    if (type in productsList) {
        if (name in productsList[type])
            return productsList[type][name];
        else
            return []
    }
    else {
        productsList[type] = {};
        prdsName[type] = [];
        totalData[type] = 0;
        return []
    }
}

const savePrdsList = (name, type, list) => {
    if (prdsName[type].indexOf(name) === -1 && name !== "") {
        prdsName[type].push(name);
        totalData[type] += list.length;
    }
    else if (name !== "") {
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
}

const cleanPrdsList = (type) => {
    if (type === "all") {
        productsList = {};
        prdsName = {};
        totalData = {};
    }
    else if (type in productsList) {
        productsList[type] = {};
        prdsName[type] = [];
        totalData[type] = 0;
    }
    console.log(`clean ${type}`)
}


export { getPrdsList, savePrdsList, cleanPrdsList }