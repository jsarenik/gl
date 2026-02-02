#while read l; do wget -r -nd -O /dev/null "$l"; done < inall
while read l; do wget -O /dev/null "$l"; done < inall
