# -*- coding: utf-8 -*-
import os
import re
from collections import Counter

p = os.path.join(os.getcwd(), 'src', 'App.jsx')
with open(p, 'rb') as f:
    content = f.read().decode('utf-8')

all_tags = re.findall(r'<.*?>', content, re.DOTALL)

cnt = Counter()

for tag in all_tags:
    if tag.startswith('<!--'): continue
    
    if tag.startswith('</'):
        # Closing
        if tag == '</>':
            cnt['__fragment__'] -= 1
        else:
            match = re.match(r'<\/([\w\.]+)', tag)
            if match:
                cnt[match.group(1)] -= 1
    elif tag.endswith('/>'):
        # Self-closing
        pass
    else:
        # Opening
        if tag == '<>':
            cnt['__fragment__'] += 1
        else:
            match = re.match(r'<([\w\.]+)', tag)
            if match:
                cnt[match.group(1)] += 1

print "Tag imbalance:"
for tag, diff in cnt.items():
    if diff != 0:
        print "  " + tag + ": " + str(diff)
