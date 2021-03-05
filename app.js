const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

//REQUESTS FOR ALL ARTICLES

app
  .route("/articles")
  .get((req, res) => {
    //GET
    Article.find((err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    //POST
    console.log(req.body);
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully added new article");
      }
    });
  })
  .delete((req, res) => {
    // DELETE
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

//REQUEST TARGETTING SINGULAR ARTICLE

app
  .route("/articles/:articleName")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleName }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        console.log(err);
        res.send("No article found");
      }
    });
  })
  .put((req, res) => {
    //updates entire object
    Article.updateOne(
      { title: req.params.articleName }, //first param, identifies article by title
      {
        title: req.body.title, //second param, object that updates that particular article (both title and body)
        content: req.body.content,
      },
      (err) => {
        if (!err) {
          res.send("Successfully updated (put)");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch((req, res) => {
    //updates a parameter of the object
    Article.updateOne(
      { title: req.params.articleName },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("Successfully updated article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleName }, (err) => {
      if (!err) {
        res.send("Successfully deleted article");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, () => {
  console.log("server on 3000");
});
