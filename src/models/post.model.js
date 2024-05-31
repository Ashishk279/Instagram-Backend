import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
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
  created_At: {
    type: Date,
    default: Date.now, // Set the current timestamp as default
  },
});

// Create the "posts" model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;