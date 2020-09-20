//require the meilisearch librray
const MeiliSearch = require('meilisearch');
// instantiate a meilisearch client
const client = new MeiliSearch({ host: 'http://127.0.0.1:7700' })
//require Express
const express = require( 'express' );
// instanciate an instance of express and hold the value in a constant called app
const app = express();
//require the body-parser library. will be used for parsing body requests
const bodyParser = require('body-parser')
//require the path library
const path = require( 'path' );

// use the bodyparser as a middleware  
app.use(bodyParser.json())
// set port for the app to listen on
app.set( 'port', process.env.PORT || 3001 );
// enable CORS 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// defined the base route and return with an HTML file called tempate.html
app.get('/', function(req, res){
  res.sendFile('template.html', {
     root: path.join( __dirname, 'views' )
   });
})

// define the /search route that should return meiliesearch results 
app.get('/search', async function (req, res){
    try {
        // check if meilisearch is up and healthy:
        await client.isHealthy()
        // declare the index you want to search 
        const index = client.getIndex('movies')
        // declare the query object to search meilisearch search and return first 200 responses found 
        const search = await index.search(req.query['q'], {limit: 200})
        // return bit that matches
        return res.status(200).json(search.hits );
    } catch (error) {
        return res.status(400).json({error: error && error.message});
    }
})


// decare a new route. This route serves a static HTML template called template2.html
app.get('/client-search', function(req, res){
  res.sendFile('template2.html', {
     root: path.join( __dirname, 'views' )
   });
})

// listen on the specified port
app .listen( app.get( 'port' ), function(){
  console.log( 'Express server listening on port ' + app.get( 'port' ));
} );