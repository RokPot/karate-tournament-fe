#!/usr/bin/env bash
set -euo pipefail

# this script is just for testing!

if [ $# -lt 1 ]; then
  echo "Usage: $0 <imgname> <version=latest> <port=3000>"
  exit 1
fi

imgname=$1
version=${2:-latest}
port=${3:-3000}

docker run --rm -p $port:80 $imgname:$version
