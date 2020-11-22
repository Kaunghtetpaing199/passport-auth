if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//import modules
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

//import file and using modules
const app = express();
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");

const rootDir = path.dirname(process.mainModule.filename);

//Passport config
require("./config/passport")(passport);

//Connect to mongo
mongoose
  .connect(process.env.MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected ...."))
  .catch((error) => console.log(error));

//ejs
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(rootDir, "views"));
app.set("layout", "layouts");

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Express session
app.use(
  session({
    secret: "secret key",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("Success_msg");
  res.locals.error_msg = req.flash("Error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Routes
app.use("/", indexRouter);
app.use("/users", userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server start running at port ${port}`));
