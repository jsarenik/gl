git grep '/lib/jquery-3.3.1.min.js?v=7525b86a20' | cut -d: -f1 | sort -u \
  | grep -v "scripts\|Binary" \
  | while read file
do
  sed 's|^<body class="enable|<body onload="readyFn()" class="enable|' $file | safecat.sh $file
  sed '/^<script src="\/lib\/jquery-3.3.1.min.js?v=7/,$d' $file \
    | cat - scripts/darkmode-add.txt \
    | safecat.sh $file
done
