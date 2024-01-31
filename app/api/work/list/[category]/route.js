import { connectToDB } from "@mongodb/database";
import Work from "@models/Work";

export const GET = async (req, { params: { category } }) => {
  try {
    await connectToDB();

    let workList;

    const query = category !== "All" ? { category } : {};

    workList = await Work.find(query)
      .populate({
        path: "creator",
        select: "name", // select only necessary fields to reduce data transfer
      })
      .lean();

    return new Response(JSON.stringify(workList), { status: 200 });
  } catch (err) {
    console.error("Failed to fetch Work List", err);
    return new Response("Failed to fetch Work List", { status: 500 });
  }
};
