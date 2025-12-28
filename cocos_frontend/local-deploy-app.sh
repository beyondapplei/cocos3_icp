#!/bin/bash
set -e


echo "Building Cocos Creator project..."

set +e
/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator --project "./" --build "configPath=buildConfig_web-mobile.json"
EXIT_C
ODE=$?
set -e

if [ $EXIT_CODE -ne 0 ] && [ $EXIT_CODE -ne 36 ]; then
    echo "Cocos Creator build failed with exit code $EXIT_CODE"
    exit $EXIT_CODE
fi

if [ $EXIT_CODE -eq 36 ]; then
    echo "Cocos Creator build finished with exit code 36 (likely warnings), proceeding..."
fi


dfx deploy 

echo "Deployment Done!"
