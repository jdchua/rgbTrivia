const cors = require("cors");

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const dbConfig = require("./app/config/db.config");


mongoose.connect("mongodb+srv://jchua:rgbdatabase@cluster0.khgzn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

// mongoose.connect("mongodb://localhost:2/colorGame", { useNewUrlParser: true, useUnifiedTopology: true });

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); 


//schema setup
var leaderboardSchema = new mongoose.Schema({
   name: String,
   scores: String
});

var Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

app.get("/", function(req, res){
    Leaderboard.find({}, function(err, scores) {
       if(err){
           console.log(err);
       } else {
           res.render("index", {scores: scores});
       }
    }).sort({scores: -1}).limit(5).collation({locale: "en_US", numericOrdering: true});
});

app.get ("/scores", function(req, res){
    Leaderboard.find({}, function(err, scores) {
       if(err){
           console.log(err);
       } else {
           res.render("scores", {scores: scores});
       }
    }).sort({scores: -1}).limit(5).collation({locale: "en_US", numericOrdering: true});
});

app.post ("/scores", function(req, res) {
    var name = req.body.name;
    var scores = req.body.scores;
    var newScores = {name: name, scores: scores};
    Leaderboard.create(newScores, function(err, newCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/scores");
        }
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
