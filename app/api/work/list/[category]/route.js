import { connectToDB } from "@mongodb/database";
import Work from "@models/Work";

export const GET = async (req, { params: { category } }) => {
  try {
    await connectToDB();

    // Build the query based on the category parameter
    const query = category !== "All" ? { category } : {};

    // Retrieve the work list with lean option for improved performance
    const workList = await Work.find(query)
      .populate({
        path: "creator",
        select: "name", // Select only necessary fields to reduce data transfer
      })
      .lean();

    return new Response(JSON.stringify(workList), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch Work List", error);
    return new Response("Failed to fetch Work List", { status: 500 });
  }
};
