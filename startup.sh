#!/bin/bash
# Build the client from react source code
REACT_APP_API_URL=$(ec2-metadata --public-hostname)':8080'
REACT_APP_API_URL=$(echo $REACT_APP_API_URL | sed 's/public-hostname: //')
REACT_APP_AUTH_URL=$(ec2-metadata --public-hostname)':8081'
REACT_APP_AUTH_URL=$(echo $REACT_APP_AUTH_URL | sed 's/public-hostname: //')
echo 'REACT_APP_API_URL="'$REACT_APP_API_URL'"' > /home/ec2-user/todoapp/client/.env
echo 'REACT_APP_AUTH_URL="'$REACT_APP_AUTH_URL'"' >> /home/ec2-user/todoapp/client/.env
cd /home/ec2-user/todoapp/client
npm run build
rm -rf /www/build
cp -R /home/ec2-user/todoapp/client/build /www
