#!/bin/bash
# Save current uploads to persistent volume
if [ -d "./uploads" ]; then
    cp -r ./uploads /mnt/data/uploads
fi 