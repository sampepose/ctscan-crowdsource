## Dev
1. `npm run server` to start the API server
2. `npm start`  to start the static assets dev server (builds client-side assets on change)
3. http://localhost:3000/

## Prod
1. `npm run build` to compile client-side assets
2. `npm run server prod` to start API server + static asset serving
3. http://localhost:8001/

## Database
`server/config.js` has the URL to the MongoDB instance. By default, it'll use a locally running Mongo instance.

## Loading images to be labeled
TBD!! Prob some script doo-hickey.
