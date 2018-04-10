'use strict';

const rp          = require('request-promise');

// TODO: resolve this issue:
  // "However, STREAMING THE RESPONSE (e.g. .pipe(...)) is DISCOURAGED
  // because Request-Promise would grow the memory footprint for large
  // requests unnecessarily high. Use the original Request library for
  // that. You can use both libraries in the same project."
                // Ref: https://github.com/request/request-promise
module.exports = {

  checkForUser: (data) => {
    return rp({
      method: 'GET',
      uri: 'http://localhost:3000/user',
      qs: {
        email: data.email
      },
      json: true,
      simple: false
    }).then(body => {
      return body;
    });
  },

  createNewUser: (data) => {
    return rp({
      method: 'POST',
      uri: 'http://localhost:3000/user/sign-up',
      body: data,
      json: true,
      simple: false
    })
    .then(body => {
      return body;
    });
  },

  createNewPost: (data) => {
    return rp({
      method: 'POST',
      uri: 'http://localhost:3000/post/create',
      body: data,
      json: true,
      simple: false
    })
    .then(body => {
      return body;
    });
  },

  editPost: (data) => {
    return rp({
      method: 'PUT',
      uri: 'http://localhost:3000/post/edit',
      body: data,
      json: true,
      simple: false
    })
    .then(body => {
      return body;
    });
  },

  deletePost: (data) => {
    return rp({
      method: 'DELETE',
      uri: 'http://localhost:3000/post/delete',
      qs: {
        email: data.email,
        postId: data.postId
      },
      json: true,
      simple: false
    })
    .then(body => {
      return body;
    });
  },

  listPosts: (data) => {
    return rp({
      method: 'GET',
      uri: 'http://localhost:3000/posts',
      qs: {
        email: data.email
      },
      json: true,
      simple: false
    })
    .then(body => {
      return body;
    });
  },

  login: (data) => {
    return rp({
      method: 'GET',
      uri: 'http://localhost:3000/user/log-in',
      qs: {
        email: data.email,
        password: data.password
      },
      json: true,
      simple: false
    }).then(body => {
      return body;
    });
  }

};
