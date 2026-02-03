git grep 'href=""' | cut -d: -f1 | sort -u \
  | grep -w -v scripts | while read file
do
  sed 's|href=""|href="/"|g' $file | safecat.sh $file
done
