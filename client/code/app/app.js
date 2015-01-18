

/*_________________Form Code___________________________________________*/
var i = ss.rpc('twitterStream.allGeoTweets');


var stopButton = document.getElementById('topStream');
stopButton.addEventListener('click', function() {
	ss.rpc('twitterStream.killStream');
 });
/*______________________Globe Visualization________________________________*/


(function() {
  var globe = planetaryjs.planet();
  // Load our custom `autorotate` plugin; see below.
  globe.loadPlugin(autorotate(10));
  // The `earth` plugin draws the oceans and the land; it's actually
  // a combination of several separate built-in plugins.
  //
  // Note that we're loading a special TopoJSON file
  // (world-110m-withlakes.json) so we can render lakes.
  globe.loadPlugin(planetaryjs.plugins.earth({
    
    topojson: { file:   'worldLakes.json' },
    oceans:   { fill:   '#000080' },
    land:     { fill:   '#339966' },
    borders:  { stroke: '#008000' }
  
  }));
  
  globe.loadPlugin(lakes({ fill: '#000080'}));
  globe.loadPlugin(planetaryjs.plugins.pings());
  globe.loadPlugin(planetaryjs.plugins.zoom({scaleExtent: [300, 500]}));
  
  globe.loadPlugin(planetaryjs.plugins.drag({
    // Dragging the globe should pause the
    // automatic rotation until we release the mouse.
    onDragStart: function() {
      this.plugins.autorotate.pause();
    },
    onDragEnd: function() {
      this.plugins.autorotate.resume();
    }
  }));
  
  // Set up the globe's initial scale, offset, and rotation.
 // globe.projection.scale(175).translate([175, 175]).rotate([0, -10, 0]);
  globe.projection.scale(350).translate([350, 350]).rotate([0, -10, 0]);

/*___________________Code to interact with Twitter API from Server_______________*/ 
  var searchForm = document.searchForm;
  var searchValue = undefined; 
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      searchValue = searchForm.elements[0].value;
 });
  var printCountry = 0
  ss.event.on('tweet', function(message) {
    if(hasCountry(message) && ++printCountry == 20){
      console.log(getCountry(message));
      printCountry = 0;
    }
    if(searchValue !== undefined && hasCountry(message)){

         if(searchValue == getCountry(message)){
          var location = message.coordinates.coordinates;
          drawTweetOnGlobe(location[1],location[0]);
         }
 	 // drawTweetOnGlobe(location[1],location[0]);
    }
  });

  function drawTweetOnGlobe(lat, lng) {
    var color = "red";
	  console.log(lat);	
 	  globe.plugins.pings.add(lng, lat, { color: color, ttl: 9000, angle: 1.5 });
  }

  function hasCountry(obj) {
    if( obj.hasOwnProperty("place") &&
        obj.place !== undefined &&
        obj.place.hasOwnProperty("country") &&
        obj.place.country !== undefined ) {

          return true;
        }
     return false;
  }



  function getCountry(obj) {
    return obj.place.country; 
  }

 /*__________End of Code to interact with Twitter API from Server_______________*/ 
 
  var canvas = document.getElementById('rotatingGlobe');
  // Special code to handle high-density displays (e.g. retina, some phones)
  // In the future, Planetary.js will handle this by itself (or via a plugin).
  if (window.devicePixelRatio == 2) {
    canvas.width = 800;
    canvas.height = 800;
    context = canvas.getContext('2d');
    context.scale(2, 2);
  }
  // Draw that globe!
  globe.draw(canvas);

  // This plugin will automatically rotate the globe around its vertical
  // axis a configured number of degrees every second.
  function autorotate(degPerSec) {
    // Planetary.js plugins are functions that take a `planet` instance
    // as an argument...
    return function(planet) {
      var lastTick = null;
      var paused = false;
      planet.plugins.autorotate = {
        pause:  function() { paused = true;  },
        resume: function() { paused = false; }
      };
      // ...and configure hooks into certain pieces of its lifecycle.
      planet.onDraw(function() {
        if (paused || !lastTick) {
          lastTick = new Date();
        } else {
          var now = new Date();
          var delta = now - lastTick;
          // This plugin uses the built-in projection (provided by D3)
          // to rotate the globe each time we draw it.
          var rotation = planet.projection.rotate();
          rotation[0] += degPerSec * delta / 1000;
          if (rotation[0] >= 180) rotation[0] -= 360;
          planet.projection.rotate(rotation);
          lastTick = now;
        }
      });
    };
  };

  // This plugin takes lake data from the special
  // TopoJSON we're loading and draws them on the map.
  function lakes(options) {
    options = options || {};
    var lakes = null;

    return function(planet) {
      planet.onInit(function() {
        // We can access the data loaded from the TopoJSON plugin
        // on its namespace on `planet.plugins`. We're loading a custom
        // TopoJSON file with an object called "ne_110m_lakes".
        var world = planet.plugins.topojson.world;
        lakes = topojson.feature(world, world.objects.ne_110m_lakes);
      });

      planet.onDraw(function() {
        planet.withSavedContext(function(context) {
          context.beginPath();
          planet.path.context(context)(lakes);
          context.fillStyle = options.fill || 'black';
          context.fill();
          
        });
      });
    };
  };
	/*
	d3.json('countries.json', function(err, data) {
		if(err) {
			alert("contries didnt Load");
			return;
	    } else {
	    	alert("countries did Load");
	    	return;
		}
	}
	*/
})();
