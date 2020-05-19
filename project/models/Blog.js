const mongoose = require("mongoose");
const _=require('lodash')
const Blog = mongoose.Schema(
  {
    userId: {
      type: mongoose.ObjectId,
      ref: 'User'
    },
    title: { type: String, required: true, min: 5, max: 20, indexed: true },
    body: { type: String, optional: true,  min: 5, max: 256, indexed: true},
    tags: { type: [String], optional: true, maxlength: 10 },
    pic: { type: String, optional: true},
    author:{ type: String, required: true}

  },
  {
    timestamps: true,
  toJSON:{transform:(doc)=>{return _.pick(doc,['title','body','pic','tags','_id','author','userId'])}}

  }
);
module.exports = mongoose.model('Blog', Blog);

