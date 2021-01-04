const Post=require('../models/Post');
const Like = require('../models/Like')
// post,et supprimer de post
exports.postServiceController=(req,res,next) =>{
    const {title ,
        category ,
        skills ,
        price ,
        description ,
        typePost 
    } =  req.body;
    const post  = new Post ({
        title: title,
        category: category,
        skills: skills,
        price :price,
        description: description,
        like : [],
        typePost:typePost,
        time:  new Date.toLocaleString()
    })
    post.save().then(result => console.log('post created with successfully')).catch(err => console.log(err))

}

exports.deletePostController =(req, res,next) => {
     const PostId= req.params.postId;
     Post.deleteOne({_id :PostId});
     res.redirect('/');
}
exports.likePost = ( req,res,next) => {
    const IsAlready = req.body.IsAlready;
    if(IsAlready){
        
    }else{
      const AuthorID=req.params.AuthorID;
      const like_personID =req.params.like_personID
      User.findOne({_id :AuthorID}).then(user => {
            User.updateOne({_id : user._id },{like : like_personID}).then(result =>{}).catch(err => console.log(err))
      }).catch(err => console.log(err))
    }
}