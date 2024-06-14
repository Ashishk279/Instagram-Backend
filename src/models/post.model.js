import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  postNo: {
    type: Number,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
    default: ""
  },
  body: {
    type: String,
    trim: true,
    default: "",
  },
  post: {
    type: String,
    trim: true,
    default: "",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'], // Example status values
    default: 'draft', // Default status
  },
  isDeleted: {
    type: Boolean,
    trim: true,
    default: false,
  },
  isCommentsEnabled: {
    type: Boolean,
    default: true,
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  created_At: {
    type: Date,
    default: Date.now, // Set the current timestamp as default
  },
});

// Create the "posts" model
const Post = mongoose.model('Post', postSchema);

export { Post }