import requests, urllib, sys, json
from bs4 import BeautifulSoup

def momo_search(name, page, Type=1):
    name_enc = urllib.parse.quote(name)
    url = f"https://m.momoshop.com.tw/search.momo?searchKeyword={name_enc}&searchType={Type}&cateLevel=-1&curPage={page}&maxPage=16.html"
    headers = {'User-Agent': 'mozilla/5.0 (Linux; Android 6.0.1; '
                             'Nexus 5x build/mtc19t applewebkit/537.36 (KHTML, like Gecko) '
                             'Chrome/51.0.2702.81 Mobile Safari/537.36'}
    resp = requests.get(url, headers=headers)
    resp.encoding = 'utf-8'
    soup = BeautifulSoup(resp.text, 'html.parser')
    products = []
    count = 1
    for elem in soup.find_all("li", "goodsItemLi"):
        item_url = 'http://m.momoshop.com.tw' + elem.find('a')['href']
        item_name = elem.find("h3", "prdName").text.strip()
        item_price = elem.find("b", {"class": "price"}).text.strip()
        img_element = elem.find('img', class_='goodsImg')
        img_url = img_element['src']
        products.append({
            "id": f"{name}-{20*(page-1)+count}",
            'name': item_name,
            'price': "$" + str(item_price),
            'link': item_url,
            'pic': img_url
        })
        count += 1
    return products


def momo(nameList, priceList, urlList, name, page):
    limit = 10
    try:
        with open("products_info_momo.json") as file:
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
        products += momo_search(name, pages)
    for i in range(limit*(page-1), limit*page):
        nameList.append(products[i]["name"])
        priceList.append(products[i]["price"])
        urlList.append(products[i]["link"])


nameList = priceList = urlList = []
name, page = sys.argv[1], int(sys.argv[2])
limit = 10

# momo(nameList, priceList, urlList, name, page)

# productsList = {
#     "nameList": nameList,
    # "priceList": priceList,
    # "urlList": urlList
# }
sys.stdout.write(json.dumps(momo_search(name, page)))
sys.stdout.flush()
# momo_search(name, page)
