var publicPaths = [
	'/login',
	'/testlogin',
	'/api/login',	
	'/logout',
	'/signup',
    '/auth/facebook',
    '/auth/facebook/token',
    '/auth/twitter',
    '/auth/google',
    '/auth/facebook/callback',
    '/auth/twitter/callback',
    '/auth/google/callback',
    '/images',
    '/css',
    '/img',
    '/js',
	'/'
];

module.exports = function() {
    return function(req, res, next) {
   console.log("BK middleware auth pre path: "+req.path);
   //console.log("BK middleware auth pre body: "+ JSON.stringify(req.body));
	if ( publicPaths.indexOf(req.path)>=0 || req.isAuthenticated() || req.user == "peterbaccay@gmail.com" ) {
			console.log("BK middleware auth Access allowed: "+req.path);
            res.locals.user = req.user || {};
    		return next();	
    	}  else { 
            console.log("BK middleware auth Not public page, move to next auth: "+req.path);
    		return next();	
    	}
    }
};