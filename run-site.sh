#!/bin/sh

. ./conf
a="/$0"; a=${a%/*}; a=${a:-.}; a=${a#/}/; HERE=$(cd $a; pwd)
cd $HERE
PORT=${PORT:-"8890"}
echo Running at $URL
/busybox/httpd -c $HERE/httpd.conf \
  -fvv -p $MYIP:$PORT \
  -h $HERE

#  -u nobody
