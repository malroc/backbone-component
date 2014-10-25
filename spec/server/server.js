var express = require( "express" );
var path = require( "path" );

var app = express( );

// Serve static files
app.use( express.static( path.join( __dirname, "../.." ) ) );

// Get the port from environment variables
var port = process.env.PORT || 8000;

app.listen( port );

console.log( "Server running on port %d", port );
