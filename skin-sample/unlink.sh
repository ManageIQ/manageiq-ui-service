#!/bin/bash

TARGET=""

if [ -n "$1" ]; then
  TARGET="$1"
  if ! [ -d "$1" ]; then
    echo "Target ($1) is not a directory" 1>&2
    exit 1
  fi
else
  cd "`dirname "$0"`"/..
  TARGET=`pwd`
  cd -
fi

if ! [ -e "$TARGET"/client/skin ]; then
  echo "Target ($TARGET) is not skinned" 1>&2
  exit 2
fi

rm -v "$TARGET"/client/skin
