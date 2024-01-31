import Work from "@models/Work";
import User from "@models/User";
import { connectToDB } from "@mongodb/database";

export const PATCH = async (req, { params: { id, workId } }) => {
  try {
    await connectToDB();

    const user = await User.findById(id);
    const work = await Work.findById(workId).populate("creator");

    const favoriteWork = user.wishlist.find(
      (item) => item._id.toString() === workId
    );

    if (favoriteWork) {
      user.wishlist = user.wishlist.filter(
        (item) => item._id.toString() !== workId
      );
      await user.save();
      return new Response(
        JSON.stringify({
          message: "Work removed from wishlist",
          wishlist: user.wishlist,
        }),
        { status: 200 }
      );
    } else {
      user.wishlist.push(work);
      await user.save();
      return new Response(
        JSON.stringify({
          message: "Work added to wishlist",
          wishlist: user.wishlist,
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error patching work to wishlist:", error);
    return new Response("Failed to patch work to wishlist", { status: 500 });
  }
};
