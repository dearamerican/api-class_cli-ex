const inquirer   = require('inquirer');

module.exports = {

  password: () => {
    const question = [
      {
        name: 'password',
        type: 'input',
        message: 'Enter your password:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter the 16-character password we assigned to you.';
          }
        }
      },
    ];
    return inquirer.prompt(question).then(answers => {
      return answers.password;
    });
  },
  email: () => {
    const question = [
      {
        name: 'email',
        type: 'input',
        message: 'Enter your e-mail address:',
        validate: (value) => {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your username or e-mail address.';
          }
        }
      }
    ];
    return inquirer.prompt(question).then(answers => {
      return answers.email;
    });
  },

  command: () => {
    const question = [
      {
        name: 'cmd',
        type: 'list',
        message: 'What would you like to do next?',
        choices: ["list", "create", "edit", "delete", "signout"],
        validate: (value) => {
          if (value.length) {
            return true;
          } else {
            return 'Possible actions: "list", "create", "edit",' +
            '"delete", "signout"';
          }
        }
      }
    ];
    return inquirer.prompt(question).then(answers => {
      return answers.cmd;
    });
  },

  postId: (cmd) => {
    const question = [
      {
        name: 'postId',
        type: 'input',
        message: 'What post would you like to ' + cmd +
          '? Please enter the post ID.',
        validate: (value) => {
          if (value.length) {
            return true;
          } else {
            return 'Enter to the ID of the post you would like to ' + cmd + '.';
          }
        }
      }
    ];
    return inquirer.prompt(question).then(answers => {
      return answers.postId;
    });
  },

  createPost: () => {
    const question = [
      {
        name: 'postContent',
        type: 'input',
        message: 'Type your post here:',
        validate: (value) => {
          if (value.length) {
            return true;
          } else {
            return 'Type in your post content here.';
          }
        }
      }
    ];
    return inquirer.prompt(question).then(answers => {
      return answers.postContent;
    });
  },

  editPost: () => {
    const question = [
      {
        name: 'newPostContent',
        type: 'input',
        message: 'Type your updated post here:',
        validate: (value) => {
          if (value.length) {
            return true;
          } else {
            return 'Type in your updated post content here.';
          }
        }
      }
    ];
    return inquirer.prompt(question).then(answers => {
      return answers.newPostContent;
    });
  },
}