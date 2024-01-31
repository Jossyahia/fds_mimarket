import { connectToDB } from "@mongodb/database";
import User from "@models/User";

export const POST = async (req, { params: { id } }) => {
  try {
    const { cart } = await req.json();

    await connectToDB();

    const user = await User.findById(id);

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    user.cart = cart;
    await user.save();

    return new Response(JSON.stringify(user.cart), { status: 200 });
  } catch (error) {
    console.error("Error updating cart:", error);
    return new Response("Failed to update cart", { status: 500 });
  }
};
