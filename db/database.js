var sqlite3 = require('sqlite3').verbose();
var db;

 module.exports = {
  createDb: (cb) => {
    db = new sqlite3.Database('./database.db',
      // sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
      if (err) {
        console.log('err', err);
        return console.error(err.message);
      }
      console.log('Connected to the SQlite database. Creating tables...');
      db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS users (email TEXT NOT NULL PRIMARY" +
          " KEY, password TEXT NOT NULL);");
        db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER NOT NULL PRIMARY" +
          " KEY AUTOINCREMENT, user_email TEXT NOT NULL, content TEXT NOT" +
          " NULL, created_date TEXT NOT NULL,last_edited_date TEXT);");
        cb()
      });
    });
  },

  insertNewUser: (req, res) => {
    // Expected input: data = { email: ..., password: ... };
    var data = req.body;
    console.log('Inserting new user...');
    db.run("INSERT INTO users (email, password) " +
           "VALUES ( '" + data.email + "', '" + data.password + "');",
           (err) => {
            if (err) {
             return res.status(400).json({
                success: false,
                data: null,
                message: err
              });
            }
            return res.status(200).json({
              success: true,
              data: null,
              message: 'User created.'
            });
    });
  },


  login: (req, res) => {
    // Expected input: data = { email: ..., password: ... };
    var data = req.query;
    var sql = `SELECT * FROM users WHERE email=? AND password=?`
    db.get(sql, [data.email, data.password], (err, row) => {
      if (err) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'User with that email not found.'
        });
      }
      return res.status(200).json({
        success: false,
        data: row,
        message: 'Found user!'
      });
    });
  },

  findUserByEmail: (req, res) => {
    // Expected input: data = { email: ..., password: ... };
    var data = req.query;
    var sql = `SELECT * FROM users WHERE email=?`
    db.get(sql, [data.email], (err, row) => {
      if (err || !row) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'User with that email not found.'
        });
      }
      return res.status(200).json({
        success: true,
        data: null,
        message: 'User exists.'
      });
    });
  },

  getPosts: (req, res) => {
    // Expected input: data = { email: ... };
    var data = req.query;
    db.all("SELECT * FROM posts WHERE user_email=?", [data.email], (err, rows) => {
      if (err) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'No posts found in association with that email.'
        });
      }
      return res.status(200).json({
        success: true,
        data: rows,
        message: 'Posts found!'
      });
    });
  },

  insertNewPost: (req, res) => {
    // Expected input: data = { user_email: ..., content: ... };
    var data = req.body;
    var dateString = new Date().toISOString();
    data.created_date = dateString;
    data.last_edited_date = dateString;
    db.run("INSERT INTO posts (user_email, content, created_date, " +
      "last_edited_date)" +
      "VALUES ('" + data.email + "', '" + data.content + "', '" +
        data.created_date + "', '" + data.last_edited_date + "')", (err) => {
          if (err) {
           return res.status(400).json({
              success: false,
              data: null,
              message: err
            });
          }
          return res.status(200).json({
            success: true,
            data: null,
            message: 'Post created!'
          });
    });
  },

  editPost: (req, res) => {
    // Expected input: data = { email: ..., content: ..., postId: .... };
    var data = req.body;
    var dateString = new Date().toISOString();
    data.last_edited_date = dateString;
    db.run(
      "UPDATE posts SET content = ?, last_edited_date = ? WHERE user_email=? AND id=?",
      [data.content, data.last_edited_date, data.email, data.postId],
      (err, rows) => {
      if (err) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'No post found with that data.'
        });
      }
      return res.status(200).json({
        success: true,
        data: rows,
        message: 'Post updated!'
      });
    });
  },

  deletePost: (req, res) => {
    // Expected input: data = { email: ..., postId = ... };
    var data = req.query;
    db.all(
      "DELETE FROM posts WHERE user_email=? AND id=?",
      [data.email, data.postId],
      (err) => {
      if (err) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'No post found with that data.'
        });
      }
      return res.status(200).json({
        success: true,
        data: null,
        message: 'Post deleted!'
      });
    });
  },
  
  
 }
 
// db.close();