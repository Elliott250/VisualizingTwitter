exports.actions = function(req, res, ss){
    req.use('session');
    // return list of actions which can be called publicly                                                                                                                                                        

    var Stream = require('user-stream');
    var stream = new Stream({
        consumer_key: 'LHNHBON7aFMsQ3OS9os3qP8MP',
        consumer_secret: 'g2gkb4S1OUueC87iYGg7NalLplT6AsBZI0UtZKDbbN0kpu6uSn',
        access_token_key: '353231115-pO9VD0p299FKre0nuorO3veklPgVejNYwkO5Gkso',
        access_token_secret: 'MGFWwEWaxS77K4UYXL7WISXWFmB2f7lUbZgM0XEEL6j5d'
    	});
	
	   var connectionCount = 0;	




    return {
       
      allGeoTweets: function(){
    	
        var params = { locations: [-180,-90,180,90] }
		        
        stream.stream(params);
        
        var tweetCount = 0;
        stream.on('data', function(json) {
	       
	      if(json.hasOwnProperty("coordinates") && json.coordinates != null) {
	        if( (json.coordinates).hasOwnProperty("coordinates") && json.coordinates.coordinates != null) { 
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
     console.log('Hi');
     connectionCount = 0;
    } 
  console.log(conectionCount);
  }
  
  }
  
  
}
