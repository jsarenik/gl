git grep Matomo | cut -d: -f1 | sort -u | while read file
do
  sed '/Matomo/,/End Matomo/d' $file | safecat.sh $file
done
