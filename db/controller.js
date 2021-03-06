const mongoose = require('mongoose');
const Story = require('./model.js');

module.exports = {
  createTitle: (req, res, callback) => {
    let storyTitle = req.body.title;
    let authorNames = req.body.authors;
    for (var i = req.body.authors.length - 1; i > 0; i --) {
      if (req.body.authors[i] === ''){
        req.body.authors.pop();
      }
      console.log(req.body.authors)
    }
    Story.findOne({title: storyTitle}, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).end('failed');
      } else {
        if (result) {
          res.end('title taken')
        } else {
          Story.create({title: storyTitle, authors: authorNames}, (err, result) => {
            if (err) {
              console.log(err);
              callback(err, null)
            } else {
              console.log(result);
              callback(null, result)
            }
          });
        }
      }
    });
  },

  addLine: (storyTitle, storyLine, imageWords, imgUrl, callback) => {
    Story.findOne({title: storyTitle}, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).end('story not saved');
      } else {
        let story = result.storyLines;
        let storyObj = {
          line: storyLine,
          keyWords: imageWords,
          imgUrl: imgUrl
        };
        story.push(storyObj);
        Story.updateOne({title: storyTitle}, {storyLines: story}, (err, result) => {
          if (err) {
            console.log(err);
            callback();
          } else {
            console.log("result", result);
            callback();
          }
        });
      }
    });
  },

  getStory: (title, res) => {
    console.log(title)
    Story.findOne( {title: title}, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).end('story not saved');
      } else {
        console.log("result", result);
        res.status(200).send(result);
      }
    })
  },

  getText: (title, cb) => {
    Story.findOne( {title: title}, (err, result) => {
      if (err) {
        console.log(err);
        // res.status(400).end('title not available');
      } else {
        let array = [];
        result.storyLines.forEach(section => {
          array.push(section.line);
        })
        let wholeStory = array.join(', ');
        console.log("result", wholeStory);
        cb(null, wholeStory);
      }
    });
  },

    getLatest : (res) => {
    Story.find()
      .sort({_id: -1})
      .limit(5)
      .then(story => {
        console.log(story);
        res.send(story)
    })
    .catch(err => {
      console.log(err)
      res.send('no story found')
    })
  }


}