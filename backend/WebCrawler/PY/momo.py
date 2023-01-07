import requests, urllib, sys, json
from bs4 import BeautifulSoup

JSONFile = "../productsList.json"
defaultPrdsList = { "momo": {}, "pchome": {}, "shopee": {} }


def readFile():
    try:
        with open(JSONFile) as file:
            return json.load(file)
    except:
        return defaultPrdsList


def writeFile(data):
    with open(JSONFile, "w") as file:
        json.dump(data, file)


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
            "id": f"momo_{name}-{20*(page-1)+count}",
            'name': item_name,
            'price': "$" + str(item_price),
            'link': item_url,
            'pic': img_url
        })
        count += 1
    return products


def momo(name, page, type):
    prdsList = readFile()
    if name == "":
        return []
    if name in prdsList["momo"]:
        if page in prdsList["momo"][name].keys():
            if len(prdsList["momo"][name][page]) == 0:
                prdsList["momo"][name][page] = momo_search(name, int(page), type)
            else:
                return prdsList['momo'][name][page]
                # return "done"
        else:
            prdsList['momo'][name][page] = momo_search(name, int(page), type)
    else:
        prdsList["momo"][name] = {page: momo_search(name, int(page), type)}
    writeFile(prdsList)
    return prdsList['momo'][name][page]
    # return "done"


prods = json.dumps(momo(sys.argv[1], str(sys.argv[2]), str(sys.argv[3])))
if len(prods) > 8192:
    sys.stdout.write("overflow")
else:
    sys.stdout.write(prods)
sys.stdout.flush()

# sys.stdout.write(momo(sys.argv[1], str(sys.argv[2]), str(sys.argv[3])))
# sys.stdout.flush()


# print(momo(sys.argv[1], str(sys.argv[2]), str(sys.argv[3])))