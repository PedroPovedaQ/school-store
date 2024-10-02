#!/bin/bash
# Restore uploads from persistent volume
if [ -d "/mnt/data/uploads" ]; then
    cp -r /mnt/data/uploads ./uploads
fi