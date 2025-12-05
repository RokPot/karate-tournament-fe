#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: $0 <imgname> <stage> <version=latest>"
  exit 1
fi

imgname=$1
stage=$2
version=${3:-latest}

script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
root_path=$script_dir/../../

dockerfile_path=$root_path/Dockerfile

if [ -f $root_path/.env.local ]; then
  cp $root_path/.env.local $root_path/.env.local.bak
fi

function cleanup {
  rm -f $root_path/.env.local

  if [ -f $root_path/.env.local.bak ]; then
    mv $root_path/.env.local.bak $root_path/.env.local
  fi
}

trap cleanup EXIT

yarn spa-deploy bootstrap --stage $stage
docker build -t $imgname:$version -f $dockerfile_path $root_path

echo "Built $imgname:$version successfully!"

