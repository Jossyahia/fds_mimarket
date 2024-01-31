import Work from "@models/Work";
import { connectToDB } from "@mongodb/database";

export const GET = async (req, { params: { query } }) => {
  try {
    await connectToDB();

    let works = [];

    if (query === "all") {
      works = await Work.find().populate("creator");
    } else {
      works = await Work.find({
        $or: [
          { category: { $regex: query, $options: "i" } },
          { title: { $regex: query, $options: "i" } },
        ],
      }).populate("creator");
    }

    if (Array.isArray(works) && works.length === 0) {
      return new Response("No works found", { status: 404 });
    }

    return new Response(JSON.stringify(works), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
};
