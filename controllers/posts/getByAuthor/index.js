import Post from "../../../models/post/index.js";
import { defaultPaginationLimit } from "../../../constants/index.js";

const getPostsByAuthor = async (req, res, next) => {
  try {
    const {
      params: { author },
      query,
    } = req;

    const limit =
      (+query.limit > 0 && +query.limit) ||
      (query.page && defaultPaginationLimit) ||
      Number.MAX_SAFE_INTEGER;
    const skip = query.page ? (+query.page - 1) * limit : 0;

    const posts = await Post.aggregate([
      { $match: { author: { $regex: author, $options: "i" } } },
      { $sort: { likes: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $group: {
          _id: {
            author: "$author",
            type: "$type",
          },
          posts: {
            $push: {
              _id: "$_id",
              author: "$author",
              title: "$title",
              body: "$body",
              likes: "$likes",
              date: "$date",
              type: "$type",
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id.author",
          types: {
            $push: {
              type: "$_id.type",
              posts: "$posts",
            },
          },
        },
      },
    ]);

    res.status(200).json({
      error: false,
      message: "Successfully returned posts by author.",
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export default getPostsByAuthor;