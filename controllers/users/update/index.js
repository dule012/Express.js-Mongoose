import mongoose from "mongoose";
import Users from "../../../models/usersindex.js";
import { response } from "../../../utils/common/index.js";

const updateUser = async (req, res, next) => {
  const session = await mongoose.connection.startSession();
  try {
    const {
      body,
      params: { id },
    } = req;

    await session.startTransaction();

    const user = await Users.updateOne({ _id: id }, body);
    if (!user.acknowledged)
      return await response(res, { status: 404, message: "Not found user." });

    await session.commitTransaction();

    response(res, { status: 200, message: "Successfully updated user." });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }
};

export default updateUser;
