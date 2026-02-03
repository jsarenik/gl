mkdir GL
grep -v "^#\|Fulltext" 934346-a628.5.txt \
  | while read a b c
do
  ln -s songs/$b GL/$a
done
