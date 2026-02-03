git grep '=""' | cut -d: -f1 | sort -u | grep -v "scripts\|Binary" \
  | while read myf rest
do
  cat "$myf" | sh scripts/mysed.sh | safecat.sh "$myf"
done
