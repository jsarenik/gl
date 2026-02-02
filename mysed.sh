#grep -o '"/[^"]\+/"'
#grep -o '"/[^"]\+"'
sed \
 -e 's/"\([^"]\+\)\/"/"\1"/g' \
 -e 's|img/favicons|/img/favicons|g' \
 -e 's|https://www.liederindex.de||g' \
 -e 's|/styl/\([0-9]\)|/styl/\1?v=1234|' \
 -e 's|https://www.sirenipismasvateho.cz/favicon.ico|/favicon.ico|' \
 -e '/og:image/s|https://www.sirenipismasvateho.cz||'
