// load .env ===================================================================
require('dotenv').config()

// get all modules =============================================================
const express           = require('express');
const app               = express();
const mongoose          = require('mongoose');
const bodyParser        = require('body-parser');
const moment            = require('moment');
const passport          = require('passport');
const flash             = require('connect-flash');
const session           = require('express-session');
const cookieParser      = require('cookie-parser');
const fileUpload        = require('express-fileupload');
const MongoStore        = require('connect-mongo')(session);

const port              = process.env.PORT;
const hostname          = process.env.HOST;
const dbName            = process.env.DB_NAME;
const useHTTPS          = (process.env.HTTPS === 'true' ? true : false);
const logError          = (process.env.LOG_ERR === 'true' ? true : false);
const gLockMail         = process.env.GLOCK_MAIL;

// Configuration ===============================================================
const servconf          = require('./config/server.conf');
moment.locale('id');

// Connect database ============================================================
mongoose.connect(servconf.mongodb, {
  useCreateIndex        : true,
  useNewUrlParser       : true,
  useFindAndModify      : false,
  useUnifiedTopology    : true
});

// set up our express application ==============================================
app.use(cookieParser());
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : 'temp'
}));
app.set('view engine', 'ejs');

// required for passport =======================================================
// app.use(session({ secret: 'mysecretinyourass' }));
var MemoryStore = session.MemoryStore;
app.set('trustproxy', true)
app.use(session({
  cookie:{
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store             : new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
   }),
  saveUninitialized : true,
  resave            : false,
  name : 'app.sid',
  secret: "mysecretinyourass",
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes ======================================================================
// ---------------------------------------------------------------- [main route]
require('./routes/index')(app);

app.get('*', function(req, res){
  res.redirect('/404');
});

// start app ===================================================================
// app.listen(port, () => {
//   var now = moment().format('DD-MM-YYYY, HH:mm:ss')
//   console.log(now + ' : Server running on port ' + port)
// });

// Memulai server ==============================================================
if (useHTTPS) {
  require('greenlock-express')
  .init({
    packageRoot: __dirname,
    configDir: './greenlock.d',
    maintainerEmail: gLockMail,
    cluster: false
  })
  .ready(httpsWorker);
} else {
  const server = app.listen(port, hostname, () => {
    var now = moment().format('DD-MM-YYYY, HH:mm:ss')
    console.log(
      '\x1b[32m%s\x1b[0m',
      `${now} SERVER BERJALAN DI PORT : ${port}`
    )
  });
}

function httpsWorker(glx) {
  let socketio  = require("socket.io");
  let server    = glx.httpsServer();
  let io        = socketio(server);
  let proxy     = require("http-proxy").createProxyServer({ xfwd: true });

  proxy.on("error", function(err, req, res) {
    console.error(err);
    res.statusCode = 500;
    res.end();
    return;
  });

  app.listen(port, hostname, () => {
    var now = moment().format('DD-MM-YYYY, HH:mm:ss')
    console.log(
      '\x1b[32m%s\x1b[0m',
      `${now} SERVER BERJALAN DI PORT : ${port} | MODE AMAN`
    )
  });
  glx.serveApp(function(req, res) {
    proxy.web(req, res, {
      target: "http://localhost:"+process.env.PORT
    });
  });
}
