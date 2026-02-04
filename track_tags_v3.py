# -*- coding: utf-8 -*-
import os
import re

p = os.path.join(os.getcwd(), 'src', 'App.jsx')
with open(p, 'rb') as f:
    content = f.read().decode('utf-8')

# Regex to find tags - includes ones with complex props
# This regex is better at handling {...} inside tags
tags = re.findall(r'<\/?[\w\.]+(?:\s+[\w\.\-]+(?:=(?:".*?"|\'.*?\'|\{.*?\}|[\w\.\-]+))?)*?\s*?\/?>', content, re.DOTALL)

stack = []
for tag in tags:
    if tag.startswith('<!--'): continue
    
    if tag.startswith('</'):
        tag_name = re.match(r'<\/([\w\.]+)', tag).group(1)
        if stack and stack[-1][0] == tag_name:
            stack.pop()
        else:
            print "Unexpected closing tag " + tag + " at index " + str(content.find(tag))
    elif tag.endswith('/>'):
        pass
    else:
        match = re.match(r'<([\w\.]+)', tag)
        if match:
            tag_name = match.group(1)
            stack.append((tag_name, tag))

print "Open tags at end: " + str(len(stack))
for t in stack:
    print "  <" + t[0] + ">"
