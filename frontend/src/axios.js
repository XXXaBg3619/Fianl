import axios from 'axios';

const instance = axios.create ({ baseURL: "/api/search" });

const noResponse = "Server not responding or not connected";

const SearchType = {'default': '1', 'low-high': '2', 'high-low': '3'};

const Post = async (loc, platform) => {
    try {
        const query = `platform=${platform}`;
        const { data: {msg} } = await instance.post(`${loc}?${query}`);
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

const Get = async (loc, prdName, page, searchType) => {
    console.log(`Get: ${loc}, ${prdName}, ${page}, ${searchType}`)
    try {
      const query = `prdName=${prdName}&page=${page}&searchType=${searchType}`;
      const { data: { msg } } = await instance.get(`${loc}?${query}`);
      const products = JSON.parse(msg)
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

const Gets = async (loc, prdName, page, type, searchType) => {
    console.log(`Gets: ${loc}, ${prdName}, ${page}, ${type}, ${searchType}`)
    try {
      const query = `prdName=${prdName}&page=${page}&type=${type}&searchType=${searchType}`;
      const { data: { msg } } = await instance.get(`${loc}?${query}`);
      const products = JSON.parse(msg)
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



const search = (prdName, page, type, searchType) => {
    console.log(`SEARCH: ${prdName}, ${page}, ${type}, ${searchType}`)
    try {
        if (type.length === 1)
            return Get(`/${type[0]}`, prdName, page, SearchType[searchType]);
        else
            return Gets(`/${searchType}`, prdName, page, type, SearchType[searchType]);
    }
    catch {
        return noResponse;
    }
};

const cleanData = (platform) => {
    try {
        return Post(`/clean`, platform);
    }
    catch {
        return noResponse;
    }
}



export { search, cleanData }