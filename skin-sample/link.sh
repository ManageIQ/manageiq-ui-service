#!/bin/bash

SOURCE=""
TARGET=""

cd "`dirname "$0"`"
SOURCE=`pwd`
cd -

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

if ! [ -d "$TARGET"/client ]; then
  echo "Target ($TARGET) is not the Service UI directory (missing client/)" 1>&2
  exit 1
fi

if [ -e "$TARGET"/client/skin ]; then
  echo "Target ($TARGET) is already skinned" 1>&2
  ls -ld "$TARGET"/client/skin
  exit 2
fi

ln -vsf "$SOURCE" "$TARGET"/client/skin
