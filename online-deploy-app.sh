#!/bin/bash
set -e



echo "Building Cocos Creator project..."
/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator --project "$(pwd)/cocos_frontend" --build "configPath=$(pwd)/cocos_frontend/buildConfig_web-mobile.json"

dfx deploy 

echo "Deployment Done!"
