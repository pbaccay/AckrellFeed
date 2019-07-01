var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var routesAuthConfig          = require('./authconfig');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated()) {
		console.log("PBK routes auth isat");
		return next();
	// if the user is not authenticated then redirect him to the login page
	}
	console.log("PBK routes auth invl");
	res.redirect('/');
}

module.exports = function(app,passport) {
/*
	app.post('/login', passport.authenticate('local-login', {		
		successRedirect : '/ackrellnews', 
		failureRedirect : '/#signin', 
		failureFlash : true 
	}));
*/	

	
	app.post('/login', (req, res) => {
	passport.authenticate(
    'local-login',
    { session: false },
    (error, user) => {

      if (error || !user) {
		console.log("PBK routes auth login Error user: " + user + " error: " + error);
		if(!user) {
			res.send(401);
		} else 
        res.status(400).json({ error });
		
      } else {
			console.log("PBK routes auth login user: " + user);
		 // This is what ends up in our JWT
		  const payload = {
			username: req.body.email, //user.username,
			expires: Math.floor(Date.now() / 1000) + (60 * 60),
		  };
			console.log("PBK routes auth login  payload ", payload);
		 // assigns payload to req.user
		  req.login(payload, {session: false}, (error) => {
			if (error) {
						console.log("PBK routes auth login payload ERROR");
			  res.status(400).send({ error });
			}

			// generate a signed json web token and return it in the response 
			const token = jwt.sign(JSON.stringify(payload), routesAuthConfig.ackrell.clientSecret);
			console.log("PBK routes auth login jwt: ", token);
			// assign our jwt to the cookie 
			res.json({ success: true, message: 'Token login granted', token, user: req.body.email });
		  });
		}
    },
  )(req, res);
});

	app.post('/signup', (req, res) => {
	passport.authenticate(
	'local-signup',  
	{ session: false },
    (error, user) => {

      if (error || !user) {
		console.log("PBK routes auth signup Error user: " + user + " error: " + error);
		if(!user) {
			res.send(401);
		} else 
        res.status(400).json({ error });
		
      } else {
			console.log("PBK routes auth signup user: " + user);
		 // This is what ends up in our JWT
		  const payload = {
			username: req.body.email, //user.username,
			expires: Math.floor(Date.now() / 1000) + (60 * 60),
		  };
			console.log("PBK routes auth signup payload ", payload);
		 // assigns payload to req.user
		  req.login(payload, {session: false}, (error) => {
			if (error) {
						console.log("PBK routes auth signup payload ERROR");
			  res.status(400).send({ error });
			}
			// generate a signed json web token and return it in the response 
			const token = jwt.sign(JSON.stringify(payload), routesAuthConfig.ackrell.clientSecret);
			console.log("PBK routes signup auth jwt: ", token);
			// assign our jwt to the cookie 
			res.json({ success: true, message: 'Token signup granted', token, user: req.body.email });
		  });
		}
    },
  )(req, res);
});


	app.post('/api/login', passport.authenticate('local-login', {
		successRedirect : '/ackrellnews', 
		failureRedirect : '/#signin', 
		failureFlash : true 
	}));
	  
	app.get('/home', passport.authenticate('jwt', { session : false }),  
        function (req, res) {	
			  			console.log("PBK routes auth /home");
			res.json({
			message : 'You made it to the secure route',
			user : req.user,
			token : req.query.secret_token
			}); 
		}
  );
/*	
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/ackrellnews', 
		failureRedirect : '/#signin', 
		failureFlash : true 
	}));
*/
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/#signin');
	});

	app.get('/auth/facebook', passport.authenticate('facebook', { 
		scope : 'email' 
	}));
	
	app.get('/auth/facebook/token', 
        passport.authenticate(['facebook-token','other-strategies']));
		
	app.post('/auth/facebook/token', 
        passport.authenticate(['facebook-token','other-strategies']), 
        function (req, res) {

            if (req.user){
                //you're authenticated! return sensitive secret information here.
res.json({"success":1,"existing": req.user.existing});
            } else {
                // not authenticated. go away.
                res.send(401)
            }

        }
		);
		
	app.post('/auth/facebook/token/signup', 
isAuthenticated, function(req, res){

            if (req.user){
															console.log("PBK auth facebook token request data " + JSON.stringify(req.body) );	
                //you're authenticated! return sensitive secret information here.
					if(issignup && issignup == true) {
					user.info.personal_status = personal_status;
					}
res.json({"success":1,"existing": req.user.existing});
            } else {
                // not authenticated. go away.
                res.send(401)
            }

        }
		);
		
		
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect : '/success',
		failureRedirect : '/#signin'
	}));

	app.get('/auth/twitter', passport.authenticate('twitter'));

	app.get('/auth/twitter/callback', passport.authenticate('twitter', {
		successRedirect : '/ackrellnews',
		failureRedirect : '/#signin'
	}));

	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect : '/success',
        failureRedirect : '/#signin'
    }));	
};