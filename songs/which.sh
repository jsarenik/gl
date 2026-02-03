# use:
# seq 1 180 | while read a; do sh which.sh $a; done

n=$(grep "^$1 " ../934346-a628.5.txt | awk '{print $2}')
echo $n
sed -i "s/<h1>$/<h1>GL $1/" $n/index.html
