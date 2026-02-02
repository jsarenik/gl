grep -v "^#" ~/csv-old.txt | while read a b c; do echo "$b" | grep -q Fulltext \
  && continue; echo '''<li><a href="/songs/'$b'">Lied '$a'</a></li>'''; done >> ../allmy

#  && continue; echo '''<a href="http://192.168.3.118:9999/songs/'$b'">Lied '$a'</a>'''; done > ../all.html
