#!/bin/sh

. ./conf
torify wget --continue \
  -nH -e robots=off -nc -rl inf --no-remove-listing \
  https://${D:-$1}
