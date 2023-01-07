import requests, urllib, sys, json
import contextlib
from urllib.parse import urlencode
from urllib.request import urlopen
from emoji import UNICODE_EMOJI
from bs4 import BeautifulSoup


JSONFile = "WebCrawler/productsList.json"
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

def shopee_search(name, page, order="1"):
    Order = {"2": "asc", "3": "desc"}
    if order == "1":
        url = f'https://shopee.tw/search?sortBy=relevancy&keyword={name}&page={page-1}&page_type=search'
    else:
        url = f'https://shopee.tw/search?sortBy=price&keyword={name}&page={page-1}&order={Order[order]}&page_type=search'
    headers = {
      'User-Agent': 'Googlebot',
      'From': ''
    }
    # url = f'https://shopee.tw/search?sortBy={by}&keyword={name}&page={page}&order={order}&page_type=search'
    resq = requests.Session().get(url, headers=headers)
    if resq.status_code == requests.codes.ok:
        data = BeautifulSoup(resq.text, 'html.parser').select('[data-sqe="item"]')
    products = []
    page = (page-1) % 12 + 1
    if len(data) < 5 * page:
        l, r = 5 * (page-1), len(data)
    else:
        l, r = 5 * (page-1), 5 * page
    count = 1
    for i in range(l, r):
        item = data[i]
        title = item.select('[data-sqe="name"] > div')[0].text
        link = 'https://shopee.tw' + item.select('a')[0]['href']
        # if isEmoji(title) == True:
        #     link = make_tiny(link)
        # else:
        #     for j in ("[", "<", ":", "：", "【"):
        #         if j in title:
        #             link = make_tiny(link)
        #             break
        price = item.select('[data-sqe="name"]')[0].next_sibling.text
        pic = item.select('[style="pointer-events:none"] > div > img')[0]['src']
        products.append({
            "id": f"shopee_{name}-{5*(page-1)+count}",
            "name": title, 
            "price": price,
            "link": link, 
            "pic": pic
        })
        count += 1
    return products


def shopee(name, page, type):
    prdsList = readFile()
    if name == "":
        return []
    pageFix = f"{(page-1)//12}-{(page-1)%12+1}"
    if name in prdsList["shopee"]:
        if pageFix in prdsList["shopee"][name].keys():
            if len(prdsList["shopee"][name][pageFix]) == 0:
                prdsList["shopee"][name][pageFix] = shopee_search(name, page, type)
            else:
                return prdsList['shopee'][name][pageFix]
                # return "done"
        else:
            prdsList['shopee'][name][pageFix] = shopee_search(name, page, type)
    else:
        prdsList["shopee"][name] = {pageFix: shopee_search(name, page, type)}
    writeFile(prdsList)
    return prdsList['shopee'][name][pageFix]
    # return "done"



prods = json.dumps(shopee(sys.argv[1], int(sys.argv[2]), str(sys.argv[3])))
if len(prods) > 8192:
    sys.stdout.write("overflow")
else:
    sys.stdout.write(prods)
sys.stdout.flush()

# sys.stdout.write(shopee(sys.argv[1], str(sys.argv[2]), str(sys.argv[3])))
# sys.stdout.flush()

# print(shopee(sys.argv[1], int(sys.argv[2]), str(sys.argv[3])))