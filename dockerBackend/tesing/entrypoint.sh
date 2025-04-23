#!/bin/bash

# Try to raise inotify watcher limit
echo "fs.inotify.max_user_watches=524288" > /etc/sysctl.conf && sysctl -p

# Start the Node server
exec node /server/index.js
