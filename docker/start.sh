#!/bin/bash

# start Mongodb and Redis
mongod &
redis-server &
# start application
npm start
