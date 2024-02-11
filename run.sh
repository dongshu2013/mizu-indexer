#!/bin/bash

echo "compiling..."
npx tsc
echo "compiled..."

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "starting indexer..."
pm2 start $SCRIPT_DIR/scripts/indexer.sh

echo "starting server..."
pm2 start $SCRIPT_DIR/scripts/server.sh
