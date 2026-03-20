import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    new_content = new_content.replace('en-US', 'uk-UA')
    # Be careful not to replace USD unconditionally if it means something else, but here it's likely currency
    new_content = new_content.replace('USD', 'UAH')
    
    # Replacing $ with ₴ in common UI patterns
    new_content = new_content.replace('>$', '>₴')
    new_content = new_content.replace('"$', '"₴')
    new_content = new_content.replace("'$'", "'₴'")
    new_content = new_content.replace('`$', '`₴')
    new_content = new_content.replace('($)', '(₴)')
    new_content = new_content.replace('Цена ($)', 'Цена (₴)')

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
