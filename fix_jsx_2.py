
import os

p = r'd:\Projects\医患管理平台\src\App.jsx'
with open(p, 'rb') as f:
    content = f.read().decode('utf-8')

# Using a very specific search that avoids issues with hidden characters or line endings
search_pattern = 'tabular-nums tracking-tight ml-2">{currentRange()}</h3>'
replacement_block = '                  </div>\n               )}\n            </div>'

lines = content.splitlines()
for i, line in enumerate(lines):
    if search_pattern in line and i + 2 < len(lines):
        if '</div>' in lines[i+1] and '</div>' in lines[i+2]:
            # This is the target!
            print(f"Found target at line {i+1}")
            # Insert the closing )}
            lines.insert(i+2, '               )}')
            
            # Write back
            with open(p, 'wb') as f:
                f.write('\n'.join(lines).encode('utf-8'))
            print("Successfully updated App.jsx")
            exit(0)

print("Target not found")
exit(1)
