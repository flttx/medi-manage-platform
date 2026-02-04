# -*- coding: utf-8 -*-
import os
import sys
import re

p = os.path.join(os.getcwd(), 'src', 'App.jsx')
with open(p, 'rb') as f:
    content = f.read().decode('utf-8')

# Find functions
functions = re.findall(r'const (\w+) = .*?=> {', content)

for func_name in functions:
    # Estimate function body (until next const or end of file)
    start_match = re.search(r'const ' + func_name + r' = .*?=> {', content)
    if not start_match: continue
    start_pos = start_match.start()
    
    # Very rough end finding: next top-level const or end
    end_match = re.search(r'\nconst |\nexport ', content[start_pos + 1:])
    if end_match:
        end_pos = start_pos + 1 + end_match.start()
    else:
        end_pos = len(content)
    
    body = content[start_pos:end_pos]
    
    opens = len(re.findall(r'<div[\s\n\r>]', body))
    closes = body.count('</div>')
    
    m_opens = len(re.findall(r'<motion\.div[\s\n\r>]', body))
    m_closes = body.count('</motion.div>')
    
    if opens != closes or m_opens != m_closes:
        print "Function " + func_name + " is unbalanced:"
        print "  Divs:  Open=" + str(opens) + ", Close=" + str(closes)
        print "  Motion: Open=" + str(m_opens) + ", Close=" + str(m_closes)
