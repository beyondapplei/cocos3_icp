#!/bin/bash
set -e


echo "Building Cocos Creator project..."
/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator --path "$(pwd)/cocos_frontend" --build "platform=web-mobile;debug=false"

dfx deploy 

echo "Deployment Done!"
