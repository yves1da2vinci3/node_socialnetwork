const {postServiceController,deletePostController,likePost}=require('../PostService');
const Router=require('express').Router()
Router.route('/post').post(postServiceController);
Router.route('/delete-post/:postId').post(deletePostController);
Router.route('/like').post(likePost)
module.exports =Router;