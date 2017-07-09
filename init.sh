#!/bin/bash

echo ""
echo -e "\e[1;36mJS-VASTCLIENT - Init\e[0m"
echo ""


echo -e -n "    \e[34minit                                   \e[0m"
rm -rf node_modules > log
npm config set strict-ssl false > log
npm install --loglevel warn --save-dev > log
echo "" >> log
echo -e "\e[92mok\e[0m"

echo ""
echo -e "    \e[2msee the file ./log for more details\e[0m"

echo ""
echo -e "\e[1;36mdone\e[0m"
echo ""