
import sys

with open(r'd:\Projects\医患管理平台\src\App.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Search for the start of the messages tab block
target_index = -1
for i, line in enumerate(lines):
    if "{activeTab === 'messages' && (" in line and i > 1650:
        target_index = i
        break

if target_index != -1:
    # Now find where it should end. It ends after the Send button div and its parent.
    end_count = 0
    for j in range(target_index, len(lines)):
        if "Send clinical directions..." in lines[j]:
            # We found the chat input area.
            # 1702 is usually the closing tag for the input area
            # 1703 is usually the closing tag for the flex flex-col h-[400px]
            
            # Let's rewrite from here to the end of the component.
            # We want to replace lines j+2 to the end of the function.
            
            new_closing = [
                "                )}\n",
                "             </div>\n",
                "          </div>\n",
                "        </div>\n",
                "      </div>\n",
                "    </div>\n",
                "  </motion.div>\n",
                ");\n",
                "};\n"
            ]
            
            # Find the line that starts "const DentalChart" to know where to stop
            stop_index = -1
            for k in range(j, len(lines)):
                if "const DentalChart" in lines[k]:
                    stop_index = k
                    break
            
            if stop_index != -1:
                # Replace everything between the chat parent close and DentalChart
                # Assuming lines[j+3] is the first of the extra </div>s
                # Let's find exactly the sequence of </div>s
                
                # Based on previous view_file:
                # 1702: </div> (input area)
                # 1703: </div> (chat container)
                # Then we need )} and the others.
                
                # Search for the consecutive </div>s after 1702
                final_replace_start = -1
                for k in range(j, stop_index):
                    if "</div>" in lines[k] and "</div>" in lines[k+1]:
                        final_replace_start = k + 1
                        break
                
                if final_replace_start != -1:
                    lines[final_replace_start:stop_index] = new_closing
                    
                    with open(r'd:\Projects\医患管理平台\src\App.jsx', 'w', encoding='utf-8') as f:
                        f.writelines(lines)
                    print("Fixed PatientDetailView syntax successfully.")
                    sys.exit(0)

print("Could not find the target code to fix.")
sys.exit(1)
