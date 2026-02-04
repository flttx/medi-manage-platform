# -*- coding: utf-8 -*-
import os
import sys
import re

p = os.path.join(os.getcwd(), 'src', 'App.jsx')
with open(p, 'rb') as f:
    content = f.read().decode('utf-8')

lines = content.splitlines()
stack = [] # stores (line_number, tag_type)

for i, line in enumerate(lines):
    line_num = i + 1
    
    # Simple regex to find tags in line
    # Catching <div, <motion.div, <aside, <nav, <footer, <main, <RegionContext.Provider, etc.
    # Also catching closing tags
    
    # This is hard because of strings and comments, but let's try.
    clean_line = re.sub(r'//.*', '', line) # remove comments
    
    # Find all tags in order
    tags = re.findall(r'<\/?(?:div|motion\.div|aside|nav|main|footer|RegionContext\.Provider|ToastContext\.Provider|RegionToggle|CaseListView|PatientListView|AppointmentView|PatientDetailView|MiniCalendar|DentalChart|FinanceView|DashboardView|DataPlaceholder|span|h\d|button|table|thead|tbody|tr|th|td|select|option)\b(?:\s+[^>]*?)?\/?>', clean_line)
    
    for tag in tags:
        if tag.startswith('</'):
            tag_name = re.search(r'<\/([\w\.]+)', tag).group(1)
            if stack and stack[-1][1] == tag_name:
                stack.pop()
            else:
                print "Error: Unexpected closing tag </" + tag_name + "> at line " + str(line_num)
                # continue searching
        elif tag.endswith('/>'):
            # self-closing, ignore
            pass
        else:
            tag_name = re.search(r'<([\w\.]+)', tag).group(1)
            # ignore some standard elements if they are usually small but track divs/blocks
            if tag_name in ['div', 'motion.div', 'aside', 'nav', 'main', 'footer', 'thead', 'tbody', 'tr', 'table']:
                stack.append((line_num, tag_name))

if stack:
    print "Still open tags at end of file:"
    for line_num, tag_name in stack:
        print "  <" + tag_name + "> opened at line " + str(line_num)
else:
    print "All tracked tags seem balanced (simple check)."
