#!/usr/bin/env bash
rm -f lambda.zip
(cd src && zip -r ../lambda.zip .) && zip -r lambda.zip res
echo "Lambda bundle created at lambda.zip"
