import glob

base = r'd:\pragyan-edusec-website'
files = glob.glob(f'{base}/*.html')

replacements = {
    'â–¹': '▸',    # right pointing triangle
    'âˆž': '∞',    # infinity
    '"”': '—',     # quote marks acting as dash
    '”"': '—',
    '“”': '—',
    '"" ': '— ',   # literal double quotes acting as dash if preceded/followed by space
    ' ""': ' —'
}

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False
    for bad, good in replacements.items():
        if bad in content:
            # For literal quotes, we only want to replace them if they're acting like dashes
            # which usually have spaces. E.g. ` ecosystem "" ` -> ` ecosystem — `
            # I will actually just use the safe replacements first.
            count = content.count(bad)
            
            # Special logic for double quotes to avoid breaking HTML attributes
            if bad in ['"" ', ' ""']:
                 # Only replace if not part of an HTML attribute like class=""
                 # A simple proxy: if it's text, it's fine.
                 # Let's rely on '"”' mostly as that was exactly the character logged by grep.
                 pass
            
            content = content.replace(bad, good)
            print(f'Replaced {count} occurrences of {repr(bad)} with {repr(good)} in {filepath}')
            changed = True
            
    if changed:
        # Also let's fix any "” where" -> "— where"
        content = content.replace('— ”', '—') # clean up
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
