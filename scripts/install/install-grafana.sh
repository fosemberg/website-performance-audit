#!/usr/bin/env bash
# https://grafana.com/docs/grafana/latest/installation/debian/

sudo apt-get install -y apt-transport-https
sudo apt-get install -y software-properties-common wget
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -

# Alternatively you can add the beta repository, see in the table above
# sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"

sudo apt-get update
sudo apt-get install grafana
