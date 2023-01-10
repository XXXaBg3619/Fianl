import MOMO from './momo';
import PCHOME from './pchome';
import SHOPEE from './shopee';
// import { getPrdsList, savePrdsList, cleanPrdsList } from './db';

const HIGHLOW = async (name, page, type, searchType, callback) => {
    const count = type.length;
    let pageFix = Math.floor((parseInt(page)-1) / count) + 1;
    console.log(`LOWHIGH: ${name}, ${pageFix}, , ${type}, ${searchType}`)
    let prdsList = [];
    try {
        if (type.includes('momo')) 
            await MOMO(name, pageFix, searchType, (products) => {
                prdsList = [...prdsList, ...products];
            });
        if (type.includes('pchome')) 
            await PCHOME(name, pageFix, searchType, (products) => {
                prdsList = [...prdsList, ...products];
            });
        if (type.includes('shopee')) 
            await SHOPEE(name, pageFix, searchType, (products) => {
                prdsList = [...prdsList, ...products];
            });
        // console.log(prdsList)
        prdsList.sort((a, b) => getPrice(b.price) - getPrice(a.price));
        const pageFix2 = (parseInt(page)-1) % count ;
        // console.log(`count: ${count}, page:, ${page}, pageFix: ${pageFix}, pageFix2: ${pageFix2}, len: ${prdsList.length}`)
        callback(prdsList.slice(20*pageFix2, 20*(pageFix2+1)));
    } 
    catch (err) {
        callback([]);
    }
}

const getPrice = (price) => {
    const $1 = price.indexOf('$');
    const $2 = price.lastIndexOf('$');
    const $_ = price.indexOf('-');
    if ($1 === $2) {;
        // console.log(price.slice($1+1, price.length))
        return parseInt(price.slice($1+1, price.length).replace(',', ''), 10);
    }
    else {
        if ($_ !== -1) {
            // console.log(price.slice($1+1, $_-$1));
            // console.log(price.slice($2+1, price.length+1));
            return (parseInt(price.slice($1+1, $_-$1).replace(',', ''), 10) + parseInt(price.slice($2+1, price.length+1).replace(',', ''), 10)) / 2;
        }
        else {
            // console.log(price.slice($1+1, $2-$1));
            // console.log(price.slice($2+1, price.length+1));
            return (parseInt(price.slice($1+1, $2-$1).replace(',', ''), 10) + parseInt(price.slice($2+1, price.length+1).replace(',', ''), 10)) / 2;
        }
    }
}

export default HIGHLOW;