import sys, json

JSONFile = "productsList.json"
defaultPrdsList = { "momo": {}, "pchome": {}, "shopee": {} }

def clean(platform):
    if platform == "all":
        with open(JSONFile, "w") as file:
            json.dump(defaultPrdsList, file)
        return "clean all"
    else:
        with open(JSONFile) as file:
            prdsList = json.load(file)
            prdsList[platform] = {}
        with open(JSONFile, "w") as file:
            json.dump(prdsList, file)
        return f"clean {platform}"

sys.stdout.write(clean(sys.argv[1]))
sys.stdout.flush()