sed \
 -e 's|https://www.liederindex.de/|/|g' \
 -e 's|https://www.liederindex.de||g' \
 -e 's|href=""|href="/"|' \
 -e 's|data-base-url=""|data-base-url="/"|' \
 -e 's|"img/favicons|"/img/favicons|'
