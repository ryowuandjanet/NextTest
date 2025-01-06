import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, '標題是必需的'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, '內容是必需的'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
