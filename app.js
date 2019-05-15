var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://jeremiah:JballeR24!@ds211625.mlab.com:11625/rgbtrivia", { useNewUrlParser: true });

// mongoose.connect("mongodb://localhost:27017/colorGame", { useNewUrlParser: true });

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

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("RGB Trivia has started");
});