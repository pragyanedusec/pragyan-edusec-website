import os

base = r'd:\pragyan-edusec-website'
pages = ['index.html', 'about.html', 'ecosystem.html', 'blogs.html', 'contact.html']

for page in pages:
    path = os.path.join(base, page)
    with open(path, 'rb') as f:
        raw = f.read()
    
    # ✦ U+2726 in UTF-8 = bytes E2 9C A6
    target = bytes([0xe2, 0x9c, 0xa6])
    count = raw.count(target)
    
    if count > 0:
        idx = raw.find(target)
        print(f'{page}: Found {count}x ✦ - ALREADY PROPERLY ENCODED as UTF-8 E2 9C A6')
        # Decode with utf-8 should show the char correctly
        ctx = raw[max(0,idx-30):idx+30].decode('utf-8', errors='replace')
        print(f'  Ctx utf8: {ctx}')
    else:
        # Check if it's stored as HTML entity or something else
        content_utf8 = raw.decode('utf-8', errors='replace')
        for i, line in enumerate(content_utf8.splitlines()):
            if 'prog-feat' in line.lower() and ('icon' in line.lower() or 'feat' in line.lower()):
                print(f'{page} L{i+1}: {repr(line.strip()[:100])}')
                break
        else:
            print(f'{page}: no prog-feat-icon found')
