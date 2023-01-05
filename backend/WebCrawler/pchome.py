import requests, urllib, sys, json
from bs4 import BeautifulSoup

def pchome_search(keyword, page, sort='有貨優先'):
    all_sort = {'有貨優先': 'sale/dc', '價錢由高至低': 'prc/dc', '價錢由低至高': 'prc/ac'}
    name_enc = urllib.parse.quote(keyword)
    url = f"https://ecshweb.pchome.com.tw/search/v3.3/all/results?q={name_enc}&page={page}&sort={all_sort[sort]}"
    data = json.loads(requests.get(url).text)
    products = data['prods']
    prdsList = []
    count = 1
    for i in products:
        i["link"] = "https://24h.pchome.com.tw/prod/" + i["Id"]
        i["pic"] = "https://cs-a.ecimg.tw" + i["picS"]
        i["price_avg"] = int(i["price"])
        # i = {i["name"], i["link"], i["pic"], i["price_avg"]}
        prdsList.append({
            "id": f"{name}-{20*(page-1)+count}",
            "name": i["name"], 
            "price": "$" + str(i["price_avg"]),
            "link": i["link"],
            "pic": i["pic"]
        })
        count += 1
    return prdsList


def pchome(nameList, priceList, urlList, id, name, page):
    limit = 10
    try:
        with open("products_info_pchome.json") as file:
            products_info = json.load(file)
            try:
                products = products_info[id]
            except:
                products = []
                products_info[id] = products
    except:
        products = []
        products_info = {id: {"name": name, "products": products}}
    if products_info[id]["name"] != name:
        products = []
        products_info = {id: {"name": name, "products": products}}
    pages = ((page - 1) * limit) // 20 + 1
    if (page == 1 and products == []) or len(products) < page * limit:
        products += pchome_search(name, pages)
    with open("products_info_pchome.json", "w") as file:
        json.dump(products_info, file)
    for i in range(limit*(page-1), limit*page):
        nameList.append(products[i]["name"])
        priceList.append(products[i]["price"])
        urlList.append(products[i]["link"])



nameList = priceList = urlList = []
name, page = sys.argv[1], int(sys.argv[2])
limit = 10

# productsList = {
#     "nameList": nameList,
    # "priceList": priceList,
    # "urlList": urlList
# }
sys.stdout.write(json.dumps(pchome_search(name, page)))
sys.stdout.flush()
