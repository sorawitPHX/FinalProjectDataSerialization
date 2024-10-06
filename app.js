const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const connectDB = require('./db');
const methodOverride = require('method-override');
const User = require('./models/User.js')

// auth middleware
const authenticateToken = require('./middleware/authMiddleware.js'); // import middleware ที่สร้างขึ้นมา

// Router
const loginRouter = require('./routes/login');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const aboutmeRoute = require('./routes/aboutme');
const projectRouter = require('./routes/projects');
const searchScoreRouter = require('./routes/searchScore');
const insertNews = require('./routes/insertNews');
const commentRouter = require('./routes/comment.js');
const authRouter = require('./routes/auth')
const newsRouter = require('./routes/news');

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
app.use(methodOverride('_method'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout/main'); // บอกให้ใช้ layout หลัก

// Bootstrap
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

// Setup session
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/',authenticateToken, indexRouter); // ปล่อยให้หน้าแรกเข้าถึงได้
app.use('/auth',authenticateToken,  authRouter);
app.use('/users', authenticateToken, usersRouter);
app.use('/aboutme', authenticateToken, aboutmeRoute);
app.use('/project', authenticateToken, projectRouter);
app.use('/insertNews', authenticateToken, insertNews);
app.use('/searchScore', authenticateToken, searchScoreRouter);
app.use('/comments', authenticateToken, commentRouter);
app.use('/news', authenticateToken, newsRouter);


// Routes
// Catch 404
app.use(async (req, res, next) => {
  let loggedUser = undefined
  if (typeof res.locals.user !== 'undefined') {
    loggedUser = await User.findOne({ _id: res.locals.user.userId })
  }
  res.render('404', { loggedUser });
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
