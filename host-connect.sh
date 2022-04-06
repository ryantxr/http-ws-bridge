#! /bin/bash
# This script sends text to the http endpoint
H=`hostname`
if [ $H == 'homestead' ]
then
    HOST_IP=127.0.0.1
else
    HOST_IP=192.168.56.4
fi
curl http://${HOST_IP}:4202 -d "text=${1}"