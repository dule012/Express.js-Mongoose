import mongoose from "mongoose";
import User from "../../../models/user/index.js";

const updateUser = async (req, res, next) => {
  const session = await mongoose.connection.startSession();
  try {
    const {
      body,
      params: { id },
    } = req;

    await session.startTransaction();
    const user = await User.findOne({ _id: id });

    if (!user)
      return res.status(404).json({ error: false, message: "User not found." });

    await User.updateOne({ _id: id }, body);
    await session.commitTransaction();
    await session.endSession();

    res
      .status(200)
      .json({ error: false, message: "Successfully updated user." });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    next(error);
  }
};

export default updateUser;
