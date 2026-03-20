import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Replace ₴{var.toFixed(2)} with {Math.round(var).toLocaleString('uk-UA')} ₴
    # Wait, in JSX it's usually ₴{var.toFixed(2)} -> {Math.round(var).toLocaleString('uk-UA')} ₴
    
    # 1. ₴{expr.toFixed(2)} -> {Math.round(expr).toLocaleString('uk-UA')} ₴
    # (Inside JSX text nodes)
    content = re.sub(
        r'₴\{([^}]+)\.toFixed\(2\)\}',
        r"{Math.round(\1).toLocaleString('uk-UA')} ₴",
        content
    )

    # 2. ₴{expr.toFixed(2)} (if it was just text but inside string templates)
    # Actually wait, `₴${expr.toFixed(2)}`
    content = re.sub(
        r'₴\$\{([^}]+)\.toFixed\(2\)\}',
        r"${Math.round(\1).toLocaleString('uk-UA')} ₴",
        content
    )
    
    # 3. ${expr.toFixed(2)} -> ${Math.round(expr).toLocaleString('uk-UA')} ₴
    content = re.sub(
        r'\$\{([^}]+)\.toFixed\(2\)\}',
        r"${Math.round(\1).toLocaleString('uk-UA')}",
        content
    )

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            process_file(os.path.join(root, file))
