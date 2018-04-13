var db = require('./db/database.js');

module.exports = (app, express, router) => {
  app.get('/user',
          db.findUserByEmail);

  app.get('/user/log-in',
          db.login);

  app.post('/user/sign-up',
          db.insertNewUser);

  app.get('/posts',
          db.getPosts);

  app.post('/post/create',
          db.insertNewPost);

  app.put('/post/edit',
          db.editPost);

  app.delete('/post/delete',
          db.deletePost);
}
