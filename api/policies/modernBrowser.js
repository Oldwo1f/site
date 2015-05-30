var UAParser = require('ua-parser-js');


module.exports = function(req, res, next) {
  // sails.log('modernd BROWSERS')
  
    var parser = new UAParser();
    var ua1 = req.headers['user-agent'];
    result = parser.setUA(ua1).getResult()
    if(result.browser.name=="IE" && Number(result.browser.major) <=8)
    {
      res.render('modernBrowser')
    }
    else{
      next();
    }

 

};