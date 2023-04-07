#!/bin/bash
cd "${0%/*}"

bwrap --dev-bind / / \
    --bind ../dist/license/etc/os-release /etc/os-release \
    --bind ../dist/license/etc/lsb-release /etc/lsb-release \
    --bind ../dist/license/var/ /var/ \
    --bind ../dist/usr/lib/license/ /usr/lib/license/ \
    --bind ../dist/app/ /opt/app \
    yarn electron /opt/app
