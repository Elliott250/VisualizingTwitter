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
    var params = {
	locations: [-180,-90,180,90]
    }




    return {

      tweet: function(word){
     
      stream.stream(params);
      stream.on('data', function(json) {
	 // var jObj = JSON.parse(json);
	 // jObj.text
	  // console.log(json);
         
	      
	      ss.publish.all('tweet', json);
	 
	       
	  res(json);
  
      });
  }

  }
}