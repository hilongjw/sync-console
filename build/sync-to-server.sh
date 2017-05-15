#!/bin/bash

echo "start copy build file to server"

server_path="../../github/sync-console-server/static/client/"
client_path="public/client/"
file_path="sync-console*.js"

rm $server_path$file_path
cp $client_path$file_path $server_path

echo "copy success"