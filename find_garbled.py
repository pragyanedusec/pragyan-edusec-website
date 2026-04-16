import glob

base = r'd:\pragyan-edusec-website'
files = glob.glob(f'{base}/*.html')

for filepath in files:
    with open(filepath, 'rb') as f:
        lines = f.readlines()
    for i, line in enumerate(lines):
        line_decoded = line.decode('utf-8', errors='replace')
        if 'â' in line_decoded or '””' in line_decoded:
             print(f'{filepath} L{i+1}: {line_decoded.strip()}')
