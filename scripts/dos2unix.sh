find . -name .git -prune -o -type f -print | xargs file | grep -w text | cut -d: -f1 | xargs -n1 dos2unix
