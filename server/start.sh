#!/bin/sh

echo "$VARIABLES" > /tmp/env.list

while IFS='=' read -r key value; do
  export "$key=$value"
done < /tmp/env.list

rm /tmp/env.list
npm start
