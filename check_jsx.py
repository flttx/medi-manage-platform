# -*- coding: utf-8 -*-
import os
import sys
import re

p = os.path.join(os.getcwd(), 'src', 'App.jsx')
with open(p, 'rb') as f:
    content = f.read().decode('utf-8')

# Find all div tags that do NOT end with />
open_divs = len(re.findall(r'<div[\s\n\r>][^>]*?([^\/]>|[^]\n\r]>|[\n\r]\s*>|[^/]>|>(?!\n))', content))
# wait, regex for non-self-closing: <div (any chars) >  but no / before >

# Let's try this: find all <div ... > and check if there's a / before >
all_divs = re.findall(r'<div(.*?)\/?>', content)
non_self_closing_opens = 0
for d in all_divs:
    clean_d = d.strip()
    if not clean_d.endswith('/'):
        # also need to check the match if it included the /
        # Actually re.findall r'<div(.*?)\/?>' will match <div ... /> and capture ( ... )
        pass

# Simpler:
all_open_divs_matches = re.findall(r'<div[\s\n\r>].*?>', content)
real_opens = 0
for m in all_open_divs_matches:
    if '/>' not in m:
        real_opens += 1

close_divs = content.count('</div>')
print "Divs: Open=" + str(real_opens) + ", Close=" + str(close_divs)

all_motion_matches = re.findall(r'<motion\.div[\s\n\r>].*?>', content)
m_opens = 0
for m in all_motion_matches:
    if '/>' not in m:
        m_opens += 1

m_closes = content.count('</motion.div>')
print "Motion Divs: Open=" + str(m_opens) + ", Close=" + str(m_closes)
