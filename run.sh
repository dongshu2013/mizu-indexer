#!/bin/bash

npx tsc

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

pm2 start $SCRIPT_DIR/indexer.sh

pm2 start $SCRIPT_DIR/server.sh
