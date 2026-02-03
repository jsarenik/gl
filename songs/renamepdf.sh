find . -name '[0-9]*' | grep file \
  | while read file
do file "$file" \
  | grep -iq pdf && { echo ${file#./}; };
done \
  | while read fp
do
  song=$(echo $fp | cut -d/ -f1)
  nf=$(echo $fp | cut -d/ -f3)
  echo $nf | grep -q '\.pdf$' && continue
  echo $song $nf
  sed -i "s|/songs/$song/file/$nf|/songs/$song/file/${nf}.pdf|" "$song/index.html"
  git mv "$song/file/$nf" "$song/file/${nf}.pdf"
done
