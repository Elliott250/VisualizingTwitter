
exports.actions = function(req, res, ss){
    req.use('session');
    var myModule = require('myModule');
    var Stream = require('user-stream');
   
    //connect to twitter 
    var stream = new Stream({
        
        consumer_key: myModule.cKey,
        consumer_secret: myModule.cSec,
        access_token_key:myModule.tKey,
        access_token_secret:myModule.tSec
      });
	
	   var connectionCount = 0;	
    return {
       
      allGeoTweets: function(){
        var params = { locations: [-180,-90,180,90] }
        stream.stream(params);
        var tweetCount = 0;
        stream.on('data', function(json) {
	       
	      if(json.hasOwnProperty("coordinates") && json.coordinates != null) {
	        if((json.coordinates).hasOwnProperty("coordinates") && json.coordinates.coordinates != null) { 
                ++tweetCount;
	           if(tweetCount == 3){
                ss.publish.all('tweet', json);
	              tweetCount = 0;
             }
	        }
	      }
      });
  },
  
    tweetsByWordAndGeo: function(word){
      
      var params = { track: word }
      if(connectionCount > 0){
      	stream.destroy();
      }
      
      stream.stream(params);
      ++connectionCount;
      stream.on('data', function(json) {
	
	      if(json.hasOwnProperty("coordinates") && json.coordinates != null) {
	        if( (json.coordinates).hasOwnProperty("coordinates") && json.coordinates.coordinates != null) { 
	          ss.publish.all('tweet', json);
	        }
	      }
	  });
    },
    

  killStream: function(){
    if(connectionCount > 0){
       stream.destroy();
       connectionCount = 0;
    } 


  }
}
  
  
}
