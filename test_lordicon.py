import urllib.request

urls = [
    ('Students', 'user, book, graduation: https://cdn.lordicon.com/bgebyfad.json'),
    ('Labs', 'wrench, tools, computer: https://cdn.lordicon.com/qwwuykwi.json'),
    ('Labs2', 'https://cdn.lordicon.com/wzwygmng.json'),
    ('Research', 'lightbulb, search: https://cdn.lordicon.com/nocovwne.json'),
    ('Products', 'rocket, gear: https://cdn.lordicon.com/phtqpxts.json'),
    ('Impact', 'globe, check: https://cdn.lordicon.com/xhebrhsj.json')
]

for name, url_str in urls:
    try:
        url = url_str.split('https')[1]
        url = 'https' + url
        req = urllib.request.Request(url, method='HEAD')
        res = urllib.request.urlopen(req)
        print(f'{name}: OK {url}')
    except Exception as e:
        print(f'{name}: Failed - {e}')
