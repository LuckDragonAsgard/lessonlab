import os, sys, json, base64, urllib.request, urllib.error, time

BASE = os.path.dirname(os.path.abspath(__file__))
GH_TOKEN = open('/tmp/ghtok').read().strip()
HDR = {
    "Authorization": "Bearer " + GH_TOKEN,
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "asgard-cowork-claude",
    "Content-Type": "application/json",
}
REPO = "LuckDragonAsgard/lessonlab"


def _retry(fn, tries=4, base_sleep=1.5):
    last = None
    for i in range(tries):
        try:
            return fn()
        except urllib.error.HTTPError as e:
            if e.code in (404, 422):
                raise
            last = e
            time.sleep(base_sleep * (2 ** i))
        except (urllib.error.URLError, ConnectionError) as e:
            last = e
            time.sleep(base_sleep * (2 ** i))
    raise last


def push(path, local, msg, binary=False):
    with open(local, 'rb' if binary else 'r') as f:
        data = f.read() if binary else f.read().encode('utf-8')
    url = "https://api.github.com/repos/" + REPO + "/contents/" + path
    sha = None
    def _get():
        req = urllib.request.Request(url, headers=HDR)
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read())["sha"]
    try:
        sha = _retry(_get)
    except urllib.error.HTTPError as e:
        if e.code != 404:
            print("   GET err " + str(e.code))
    body = {"message": msg, "content": base64.b64encode(data).decode(), "branch": "main"}
    if sha:
        body["sha"] = sha
    def _put():
        req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=HDR, method="PUT")
        with urllib.request.urlopen(req, timeout=40) as r:
            return json.loads(r.read())["commit"]["sha"][:7]
    try:
        return _retry(_put)
    except urllib.error.HTTPError as e:
        return "ERR-" + str(e.code) + ": " + e.read().decode()[:200]
    except Exception as e:
        return "ERR-" + type(e).__name__ + ": " + str(e)


with open(os.path.join(BASE, 'orchestrate_results.json')) as f:
    results = json.load(f)

SKIP = set(s for s in os.environ.get('SKIP', '').split(',') if s)
ONLY = set(s for s in os.environ.get('ONLY', '').split(',') if s)

pushed = []
for key, v in results.items():
    if not v.get('ok'):
        continue
    if ONLY and key not in ONLY:
        continue
    if key in SKIP:
        print("\n=== " + key + " (skipped) ===")
        continue
    js_name = "build_" + key.lower() + "_v11_example.js"
    js_local = os.path.join(BASE, js_name)
    docx_local = os.path.join(BASE, v['docx'])
    js_path = "templates/" + js_name
    docx_path = "templates/" + v['docx']
    print("\n=== " + key + " ===")
    s1 = push(js_path, js_local, "feat(" + key.lower() + "): v11 build script", binary=False)
    print("  " + js_path + " -> " + str(s1))
    s2 = push(docx_path, docx_local, "feat(" + key.lower() + "): v11 docx", binary=True)
    print("  " + docx_path + " -> " + str(s2))
    pushed.append({'subject': key, 'js_sha': s1, 'docx_sha': s2})
    time.sleep(0.4)

print("\n=== PUSHED " + str(len(pushed)) + " subjects ===")
for p in pushed:
    print("  " + p['subject'] + ": js=" + str(p['js_sha']) + " docx=" + str(p['docx_sha']))

with open(os.path.join(BASE, 'push_results.json'), 'w') as f:
    json.dump(pushed, f, indent=2)
