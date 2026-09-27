#!/bin/bash
echo "Starting PlacementGPT Server..."
cd "$(dirname "$0")/backend"
mvn clean jetty:run
