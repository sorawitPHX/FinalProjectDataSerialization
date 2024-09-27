const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const connectDB = require('./db');

// Router
const loginRouter = require('./routes/login');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const aboutmeRoute = require('./routes/aboutme'); // ตรวจสอบให้แน่ใจว่าไฟล์นี้มีอยู่
const projectRouter = require('./routes/project');


const app = express();

// Connect MongoDB
connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use express-ejs-layouts
app.use(expressLayouts);
// Set default layout file (main.ejs)
app.set('layout', 'layout/main'); // บอกให้ใช้ layout หลัก

// Bootstrap
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

// Setup session
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}));

// Body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/login', loginRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/aboutme', aboutmeRoute); // เปลี่ยนเส้นทางตามที่ต้องการ
app.use('/project', projectRouter)


// Catch 404
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
