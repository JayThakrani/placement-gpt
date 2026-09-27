@echo off
echo Starting PlacementGPT Server...
cd backend
mvn clean jetty:run
pause
