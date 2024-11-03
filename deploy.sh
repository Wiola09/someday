#!/bin/bash

set -e
/app/build.sh
clasp push
output=$(clasp deploy)
echo $output
#clasp output:
#Created version 9.
#- AKfycby0dTQ_c7lVHw4SMpHxszw4Z6s_aHtjE3Qn9yseCt4XDYQqYii6duJKm19LbxLNVWce @9

#get id from output: - .+? 
id=$(echo $output |  grep -oE '\-.+? ' | sed 's/^-//' | tr -d ' ' )
# ... existing code ...
echo "id: $id"
url=https://script.google.com/macros/s/$id/exec
echo "url: $url"