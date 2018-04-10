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

var cmdMapping = {
  list: (data) => {
    return model.listPosts(data).then(resp => {
      if (!resp.success) {
        console.log(resp.message);
      } else {
        console.log('Here are your posts:', resp.data);
      }
      askWhatDoYouWantToDo();
    });
  },
  create: (data) => {
    return model.createNewPost(data).then(resp => {
      console.log(resp.message);
      askWhatDoYouWantToDo();
    });
  },
  edit: (data) => {
    return model.editPost(data)
    .then(resp => {
      console.log(resp.message);
      askWhatDoYouWantToDo();
    })
  },
  delete: (data) => {
    return model.deletePost(data).then(resp => {
      console.log(resp.message);
      askWhatDoYouWantToDo();
    })
  },
  signout: () => {
    loggedInUser = null;
    startup();
  },
};

var helpers = {
  newPassword: async () => {
    const buffer = await crypto.randomBytes(16);
    return buffer.toString('hex');
  },
  reqPasswordRetUser: (email) => {
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
          return helpers.reqPasswordRetUser(email);
        }
      });
  }
};

const startup = () => {
  clear();
  console.log(
    chalk.yellow(
      figlet.textSync('cli gist app', { horizontalLayout: 'full' })
    )
  );
  database.createDb(run);
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
      helpers.reqPasswordRetUser(userEmail);
    }
    // if user does not exist, create password
    else {
      return helpers.newPassword()
      .then(pw => {
        userPassword = pw;
        return model.createNewUser({ 'email': userEmail, 'password': pw })
      })
      .then(data => {
        if (data.success) {
          console.log('Your password to log in is:', userPassword);
          helpers.reqPasswordRetUser(userEmail);
        } else {
          console.log('Error, please exit and try again.');
        }
      });
    }
  })
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
    // Cmds that require postId
    else if (cmd === 'edit' || cmd === 'delete') {
      currCmd.cmd = cmd;
      inquirer.postId(cmd).then(id => {
        currCmd.postId = id;
        if (cmd === 'delete') {
          var data = {
            postId: id,
            email: loggedInUser.email
          };
          cmdMapping[cmd](data);
        }
        if (cmd === 'edit') {
          inquirer.editPost().then(content => {
            var data = {
              postId: currCmd.postId,
              email: loggedInUser.email,
              content: content
            };
            cmdMapping[cmd](data);
          });
        }
      });
    } else {
      if (cmd === 'signout') {
        cmdMapping[cmd]();
      }
      if (cmd === 'list') {
        cmdMapping[cmd](loggedInUser);
      }
      if (cmd === 'create') {
        inquirer.createPost().then(postContent => {
          var data = {
            content: postContent,
            email: loggedInUser.email
          };
          cmdMapping[cmd](data);
        });
      }
    }
  })
};

require('./server').listen(3000);

startup();
