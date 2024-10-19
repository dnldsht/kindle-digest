#!/usr/bin/env bash
mkdir -p dist
cp package.json dist/
cd dist
yarn install --production
zip -r lambda-layer.zip node_modules package.json yarn.lock
echo "Lambda layer bundle created at dist/lambda-layer.zip"
cd -

