import sys,json

severity = {
    "notice" : "info",
    "warning": "warning",
    "error"  : "error"
}

output   = json.loads(sys.stdin.readline())
messages = output["errors"] + output["notices"] + output["warnings"]

for e in messages:
    m = '"' + e["message"].replace('"', "'") + ": " + e["description"].replace('"', "'") + '"'
    l = e["line"]   if "line"   in e else 1
    c = e["column"] if "column" in e else 1
    t = e["_type"]
    f = e["file"]
    i = e["code"]

    print("\t".join([severity[t], f, str(l), str(c), i, m.replace("\t", " " * 4)]))