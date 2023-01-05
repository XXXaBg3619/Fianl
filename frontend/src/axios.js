import axios from 'axios';

const API_ROOT =
  process.env.NODE_ENV === "production"
    ? "/api/search"
    : "http://localhost:4000/api/search";

const instance = axios.create ({ baseURL: API_ROOT });

const noResponse = "Server not responding or not connected";

// let gameType = 0;
// function setType(type) {
//     gameType = type;
// };

const Post = async (loc) => {
    try {
        const { data: {msg} } = await instance.post(loc);
        return msg;
    }
    catch(error) {
        console.log("error:", error);
        try {
            const { data: {msg} } = error.response;
            return msg;
        }
        catch(err) {
            console.log(err);
            return noResponse;
        }
    }
};

const Get = async (loc, prdName, page) => {
    try {
      const query = `prdName=${prdName}&page=${page}`;
      const { data: { msg } } = await instance.get(`${loc}?${query}`);
      const products = JSON.parse(msg)
    //   console.log(products);
      return products;
    } catch (error) {
        console.log("error:", error);
        try {
            const { data: { msg } } = error.response;
            return msg;
        } catch (err) {
            console.log(err);
            return noResponse;
        }
    }
};
  

// const startGame = () => {
//     if (gameType === 1) {
//         Post("/start");
//     }
//     else if (gameType === 2) {
//         Post("/startAB");
//     }
//     else {
//         return noResponse;
//     }
// };

const search = (prdName, page, type) => {
    // console.log(prdsList, prdName, page);
    try {
        return Get(`/${type}`, prdName, page);
    }
    catch {
        return noResponse;
    }
};

const cleanData = () => {
    try {
        return Post(`/clean`);
    }
    catch {
        return noResponse;
    }
}

// const restart = () => {
//     if (gameType === 1) {
//         Post("/restart");
//     }
//     else if (gameType === 2) {
//         Post("/restartAB");
//     }
//     else {
//         return noResponse;
//     }
// };


export { search, cleanData }