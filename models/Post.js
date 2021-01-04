const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = {
    type: String
};
var PostSchema = new Schema({
    title : options,
    category : options,
    skills : options,
    price : options,
    description : options,
    like : [[{ type: Schema.ObjectId, ref: 'User' }]],
    time : options,
    typePost : options
});
module.exports = mongoose.model('Post',PostSchema);
