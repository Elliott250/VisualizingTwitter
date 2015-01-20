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
 
 