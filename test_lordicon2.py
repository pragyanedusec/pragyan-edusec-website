import urllib.request

ids = [
    'sbiheqdt', 'trecyqyx', 'cgzlioyf', 'dxjqncyo', 'ljvjsnvh', 'welhwfjt',
    'bgebyfad', 'qwwuykwi', 'phtqpxts', 'xfftupfv', 'fpipqsww', 'hsqqhgof',
    'huitehud', 'gqjpawvq', 'kbtmbyzy', 'nqtddedc', 'zqxcrgvh'
]

valid = []
for i in ids:
    url = f'https://cdn.lordicon.com/{i}.json'
    try:
        req = urllib.request.Request(url, method='HEAD')
        res = urllib.request.urlopen(req)
        valid.append(url)
        print(f'OK: {url}')
    except:
        pass
        
print("Valid subset:", valid)
