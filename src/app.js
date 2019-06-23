import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from "mongoose";
// import jwt from 'jsonwebtoken';
import passport from 'passport';
// import bearer from 'passport-http-bearer';

// import User from './api/user/user.model';
import config from './config';
import routes from './routes';


// const BearerStrategy = bearer.Strategy;


const app = express();
app.disable('x-powered-by');
// app.disable('etag');

// passport bearer strategy
// passport.use(new BearerStrategy(
// 	function(token, done) {
// 		console.log('Token: ', token);
// 		jwt.verify(token, config.token.secret, function(err, decoded) {
// 			if(err) { return done(err); }
// 			return done(null, decoded);
// 		});
// 		// User.findOne({toke: token}, function(err, user) {
// 		// 	if(err) { return done(err); }
// 		// 	if(!user) { return done(null, false); }
// 		// 	return done(null, user, { scope: 'read' });
// 		// });
// 	}
// ));


// DELETE THIS
// Enable CORS
// app.use(function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	// res.header("Access-Control-Allow-Credentials", "true");
// 	// res.header("Access-Control-Allow-Methods", "HEAD,OPTIONS,GET,POST,PUT,DELETE");
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
// 	// res.header("Access-Control-Allow-Authorization", "*");
// 	next();
// });


var whitelist = ['https://slotip-dashboard.herokuapp.com', 'http://localhost:4200'];
const corsOptions = {
  // origin: function (origin, callback) {
  //   if (whitelist.indexOf(origin) !== -1) {
  //     callback(null, true)
  //   } else {
  //     callback(new Error('Not allowed by CORS'))
  //   }
	// }
	origin: "*",
  methods: "GET,HEAD,PATCH,POST,DELETE,OPTIONS",
  preflightContinue: true,
	optionsSuccessStatus: 204,
	allowedHeaders: ['Origin', 'Authorization', 'Content-Type', 'Accept', 'X-Requested-With'],
	exposedHeaders: ['Content-Range', 'Authorization'],
	credentials: true
}

app.use(cors(corsOptions));



// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// app.set('secretKey', config.secret)

// app.use(morgan('dev', {
//   skip: () => app.get('env') === 'test'
// }));
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));


app.use(passport.initialize());


// Database connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

/* mongoose.set('debug', true); */


// Routes
// app.use('/', routes);
routes(app, passport);

// // Catch 404 and forward to error handler
// app.use((req, res, next) => {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // Error handler
// app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
//   res
//     .status(err.status || 500)
//     .render('error', {
//       message: err.message
//     });
// });

export default app;
