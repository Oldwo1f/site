app.filter('regex', function() {
  return function(input, regex,reverse) {
      var patt = new RegExp(regex);      
      var out = false;
          if(patt.test(input))
              out = input;
    
      	if(reverse)
      		out = !out   

    return out;
  };
});