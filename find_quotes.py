with open(r'd:\pragyan-edusec-website\about.html', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if 'ecosystem ""' in line or 'innovation ""' in line or 'technology ""' in line:
            print(f'L{i+1}: {line.strip()[:100]}')
        if 'â–¹' in line:
            print(f'L{i+1}: contains bullet-like char')
        if 'âˆž' in line:
            print(f'L{i+1}: contains infinity-like char')
