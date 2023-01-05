import requests, urllib, sys, json
import contextlib
from urllib.parse import urlencode
from urllib.request import urlopen
from emoji import UNICODE_EMOJI
from bs4 import BeautifulSoup

def make_tiny(url):
    request_url = "http://tinyurl.com/api-create.php?" + \
        urlencode({"url": url})
    with contextlib.closing(urlopen(request_url)) as response:
        return response.read().decode("utf-8")


def isEmoji(content):
    for emoji in UNICODE_EMOJI['en']:
        if content.count(emoji) > 0:
            return True
    return False

def shopee_search(name, page, order="desc", by="relevancy"):
    # headers = {
    #     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36 Edg/88.0.705.68',
    #     'x-api-source': 'pc',
    #     'referer': f'https://shopee.tw/search?keyword={urllib.parse.quote(name)}'
    # }
    headers = {
      'User-Agent': 'Googlebot',
      'From': ''
    }
    # url = f'https://shopee.tw/api/v2/search_items/?by={by}&keyword={name}&limit=20&newest={20*(page-1)}&order={order}&page_type=search&version=2'
    url = f'https://shopee.tw/search?sortBy={by}&keyword={name}&page={(page-1)//3}&order={order}&page_type=search'
    resq = requests.Session().get(url, headers=headers)
    if resq.status_code == requests.codes.ok:
        data = BeautifulSoup(resq.text, 'html.parser').select('[data-sqe="item"]')
    products = []
    page = (page-1) % 6 + 1
    if len(data) < 10 * page:
        l, r = 10 * (page-1), len(data)
    else:
        l, r = 10 * (page-1), 10 * page
    count = 1
    for i in range(l, r):
        item = data[i]
        title = item.select('[data-sqe="name"] > div')[0].text
        # shopid, itemid = item["shopid"], item["itemid"]
        # title_fix = title.replace(" ", "-")
        link = 'https://shopee.tw' + item.select('a')[0]['href']
        if isEmoji(title) == True:
            # link = make_tiny(
            #     f"https://shopee.tw/{title_fix}-i.{shopid}.{itemid}")
            link = make_tiny(link)
        else:
            for j in ("[", "<", ":", "：", "【"):
                if j in title:
                    link = make_tiny(link)
                    break
        price = item.select('[data-sqe="name"]')[0].next_sibling.text
        pic = item.select('[style="pointer-events:none"] > div > img')[0]['src']
        products.append({
            "id": f"{name}-{10*(page-1)+count}",
            "name": title, 
            "price": price,
            "link": link, 
            "pic": pic
        })
        count += 1
    return products


def shopee(name, page):
    try:
        with open("products_info_shopee.json") as file:
            products = json.load(file)
    except:
        products = []
    #     products_info = {id: {"name": name, "products": products}}
    # if products_info[id]["name"] != name:
    #     products = []
    #     products_info = {id: {"name": name, "products": products}}
    # pages = (page - 1) // 3 + 1
    products += shopee_search(name, page)
    with open("products_info_shopee.json", "w") as file:
        json.dump(products, file)
    return
    # for i in range(limit*(page-1), limit*page):
    #     nameList.append(products[i]["name"])
    #     priceList.append(products[i]["price"])
    #     urlList.append(products[i]["link"])



nameList = priceList = urlList = []
name, page = sys.argv[1], int(sys.argv[2])
limit = 10

# productsList = {
#     "nameList": nameList,
    # "priceList": priceList,
    # "urlList": urlList
# }
# shopee(name, page)
# for i in range(3):
#     if len(prdsList) < 10 * (i+1):
#         r = len(prdsList)
#         sys.stdout.write(json.dumps(prdsList[20*i:r]))
#         break
#     if i == 2:
#         sys.stdout.write(json.dumps(prdsList[20*i:20*(i+1)]))
#     else:
#         sys.stdout.write(json.dumps(prdsList[20*i:20*(i+1)]))
# sys.stdout.write(json.dumps(prdsList[0:10]))
# with open("products_info_shopee.json", "w") as file:
#     json.dump(prdsList, file)
# with open("products_info_shopee.json") as file:
#     products = json.load(file)
sys.stdout.write(json.dumps(shopee_search(name, page)))
sys.stdout.flush()

# print(shopee_search("PS5", 1))