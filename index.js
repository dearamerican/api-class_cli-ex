#! /usr/bin/env node
'use strict';

const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');
const crypto      = require('crypto-promise');
const inquirer    = require('./lib/inquirer');
const database    = require('./db/database.js');
const model       = require('./model.js');

var loggedInUser = null;

var currCmd = {
  cmd: '',
  postId: ''
};

var startup = () => {
  clear();
  console.log(
    chalk.yellow(
      figlet.textSync('cli gist app', { horizontalLayout: 'full' })
    )
  );
  database.createDb(run);
};

var cmdMapping = {
  list: '',
  create:'',
  edit:'',
  delete: '',
  signout:'',
};

var signout = () => {
  loggedInUser = null;
  startup();
};

var newPassword = async () => {
  const buffer = await crypto.randomBytes(16);
  return buffer.toString('hex');
};

var reqPasswordRetUser = (email) => {
  return inquirer.password()
    .then(password => {
      var userData = { email: email, password: password };
      return model.login(userData)
    })
    .then(data => {
      if (data.data) {
        loggedInUser = data.data;
        console.log('Success! You\'ve been logged in as: ' +
          loggedInUser.email);
        askWhatDoYouWantToDo();
      } else {
        return reqPasswordRetUser(email);
      }
    });
};

const askWhatDoYouWantToDo = () => {
  currCmd = {
    cmd: '',
    postId: ''
  };
  return inquirer.command()
  .then(cmd => {
    if (Object.keys(cmdMapping).indexOf(cmd) < 0) {
      console.log('Not a valid command. Try one of following:' +
        '"list", "create", "edit", "delete", "signout".');
      askWhatDoYouWantToDo();
    }
    else if (cmd === 'edit' || cmd === 'delete') {
      currCmd.cmd = cmd;
      inquirer.postId(cmd).then(id => {
        currCmd.postId = id;
        if (cmd === 'delete') {
          return model.deletePost({
            postId: id,
            email: loggedInUser.email
          }).then(resp => {
            console.log(resp.message);
            askWhatDoYouWantToDo();
          })
        }
        if (cmd === 'edit') {
          inquirer.editPost().then(content => {
            return model.editPost({
              postId: currCmd.postId,
              email: loggedInUser.email,
              content: content
            })
            .then(resp => {
              console.log(resp.message);
              askWhatDoYouWantToDo();
            })
          });
        }
      });
    } else {
      currCmd.cmd = cmd;
      if (cmd === 'signout') {
        signout();
      }
      if (cmd === 'list') {
        return model.listPosts(loggedInUser).then(resp => {
          if (!resp.success) {
            console.log(resp.message);
          } else {
            console.log('Here are your posts:', resp.data);
          }
          askWhatDoYouWantToDo();
        });
      }
      if (cmd === 'create') {
        inquirer.createPost().then(postContent => {
          var data = {
            content: postContent,
            email: loggedInUser.email
          };
          return model.createNewPost(data).then(resp => {
            console.log(resp.message);
            askWhatDoYouWantToDo();
          });
        });
      }
    }
     
  })
};

const run = () => {
  var userEmail;
  var userPassword;
  return inquirer.email()
  .then(email => {
    userEmail = email;
    // check to see if user is in DB
    return model.checkForUser({ email: email })
  })
  .then(data => {
    // if user exists, ask for password
    if (data.success) {
      reqPasswordRetUser(userEmail);
    }
    // if user does not exist, create password
    else {
      return newPassword()
      .then(pw => {
        userPassword = pw;
        return model.createNewUser({ 'email': userEmail, 'password': pw })
      })
      .then(data => {
        if (data.success) {
          console.log('Your password to log in is:', userPassword);
          reqPasswordRetUser(userEmail);
        } else {
          console.log('Error, please exit and try again.');
        }
      });
    }
  })
};

require('./server').listen(3000);

startup();
