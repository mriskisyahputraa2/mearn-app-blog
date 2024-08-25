import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      unique: true, // title harus unik, tidak boleh ada yang sama
    },

    image: {
      type: String,
      default:
        "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },

    category: {
      type: String,
      default: "uncategorized",
    },

    slug: {
      type: String,
      required: true,
      unique: true, // slug harus unik, tidak boleh ada yang sama
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
