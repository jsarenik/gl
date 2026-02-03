#!/bin/sh

. ./conf
URL=https://${D:-huntingsats.com}

trap exit INT QUIT

myget() {
  IN="$1"
  echo "$IN" | grep 'favicons' && return 1
  echo "$IN" | grep 'fonts' && return 1
#  echo "$IN" | grep -q 'render/imp' && return 1
#  echo "$IN" | grep -q '/styl' && return 1
  OUT="${1%/}"
  echo "### in:$IN out:$OUT"
  echo "$OUT" | grep -w file && test -s "$OUT" && return 1
  echo "### in:$IN out:$OUT"
  #echo "### $IN $OUT"
  echo $OUT | grep -q '/' && {
    #OUT=${OUT}index.html
    mkdir -p "${OUT%/*}"
  }
  echo $IN | grep -q 'songs/[0-9]\+$' && {
    mkdir -p "${OUT}"
  }

  #echo "$IN" | grep '/obrazek' && return 1
  
  if
    echo $IN | grep 'songs/[0-9]\+/$'
  then
    torify wget -c -O "-" "$URL/$OUT" | sh scripts/mysed.sh | safecat.sh "$OUT/index.html"
  else
    if
      echo $IN | grep 'blog/[0-9]\+$'
    then
      torify wget -c -O "-" "$URL/$OUT" | sh scripts/mysed.sh | safecat.sh "$OUT.html"
    else
      #torify wget -c -O "-" "$URL/$OUT" | sh scripts/mysed.sh | safecat.sh "$OUT"
      torify wget -c -O "$OUT" "$URL/$OUT"
    fi
  fi

}

while true
do
  echo Running again at $MYURL
timeout 45 ./run-site.sh 2>&1 | grep -B1 "response:404" | grep url: \
  | cut -d/ -f2- \
  | while read a; do myget "$a"; done
done
