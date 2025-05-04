#!/bin/bash

# Copy the latest Nginx configuration directly to DigitalOcean's default Nginx file
sudo cp /home/yogi/Collage/Sem6/WBD/Main-Progress/backend/nginx/containers.conf /etc/nginx/sites-available/default

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx

echo "Nginx configuration updated successfully on DigitalOcean droplet"
