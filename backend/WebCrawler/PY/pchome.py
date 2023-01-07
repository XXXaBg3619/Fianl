import requests, urllib, sys, json


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


def pchome_search(keyword, page, sort='1'):
    # all_sort = {'有貨優先': 'sale/dc', '價錢由高至低': 'prc/dc', '價錢由低至高': 'prc/ac'}
    all_sort = {'1': 'sale/dc', '3': 'prc/dc', '2': 'prc/ac'}
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
        prdsList.append({
            "id": f"pchome_{keyword}-{20*(int(page)-1)+count}",
            "name": i["name"], 
            "price": "$" + str(i["price_avg"]),
            "link": i["link"],
            "pic": i["pic"]
        })
        count += 1
    return prdsList


def pchome(name, page, type):
    prdsList = readFile()
    if name == "":
        return []
    if name in prdsList["pchome"]:
        if page in prdsList["pchome"][name].keys():
            if len(prdsList["pchome"][name][page]) == 0:
                prdsList["pchome"][name][page] = pchome_search(name, page, type)
            else:
                return prdsList['pchome'][name][page]
                # return "done"
        else:
            prdsList['pchome'][name][page] = pchome_search(name, page, type)
    else:
        prdsList["pchome"][name] = {page: pchome_search(name, page, type)}
    writeFile(prdsList)
    return prdsList['pchome'][name][page]
    # return "done"




prods = json.dumps(pchome(sys.argv[1], str(sys.argv[2]), str(sys.argv[3])))
if len(prods) > 8192:
    sys.stdout.write("overflow")
    # print("overflow")
else:
    sys.stdout.write(prods)
    # print("done")
sys.stdout.flush()