#wget -r -nd --delete-after http://192.168.3.118:9999
#cd /tmp

one() {
grep -o '/songbooks/cover/[0-9]\+' */index.html \
  | cut -d: -f2 \
  | sort -u \
  | while read u;
    do
      wget -O /dev/null http://192.168.3.118:9999$u;
    done
}

two() {
#grep -o '/songs/[0-9]\+/file/[0-9]\+' */index.html \
grep -o "$1" */index.html \
  | cut -d: -f2 \
  | sort -u \
  | while read u;
    do
      wget -O /dev/null http://192.168.3.118:9999$u;
    done
}
#two '/songs/[0-9]\+/file/[0-9]\+'
#two '/files/15525/page/1.png
two '/files/[0-9]\+/page/[0-9]\+.png'
#grep -o '/files/[0-9]\+/page/[0-9]\+.png' */index.html \
