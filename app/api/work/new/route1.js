import { connectToDB } from "@mongodb/database";
import { writeFile } from "fs/promises";
import Work from "@models/Work";
import { createClient } from "@supabase/supabase-js";
import uniqid from "uniqid";

export async function POST(req) {
  try {
    /* Connect to MongoDB */
    await connectToDB();

    const data = await req.formData();

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      process.env.NEXT_PUBLIC_SUPABASE_URL
    );
    /* Extract info from the data */
    const creator = data.get("creator");
    const category = data.get("category");
    const title = data.get("title");
    const description = data.get("description");
    const price = data.get("price");

    /* Get an array of uploaded photos */
    const photos = data.getAll("workPhotoPaths");
    const bucket = "fastfastfood";
      const workPhotoPaths = [];

    /* Process and store each photo  */
    for (const photo of photos) {
      console.log(photo, "this is the photo");

      const ext = photo.name.split(".").pop();
      const newphotosName = uniqid() + "." + ext;
      // Convert it to a Buffer
      // Read the photo as an ArrayBuffer
     // const bytes = await photo.arrayBuffer();
      //console.log(bytes, "this is bytes"); 

      //const buffer = Buffer.from(bytes);
      //console.log(buffer, "this is buffer");

      // Define the destination path for the uploaded file
      // Upload file
      const uploadResult = await supabase.storage
        .from(bucket)
        .upload(workPhotoPaths, newphotosName);
        console.log(newphotosName);
        console.log(workPhotoPaths);
      const { error } = uploadResult;
console.log(uploadResult, "this is uploadResult");
      /// const workImagePath = `C:/Users/HP/Desktop/mimarket/public/uploads/${photo.name}`;

      // Write the buffer to the filessystem
      //await writeFile(workImagePath, buffer);

      // Store the file path in an array
      // workPhotoPaths.push(`/uploads/${photo.name}`);
      if (error) {
        return Response.json({ error });
      }
      const link =
        "https://frsmcjzgunhzcsxffmyj.supabase.co/storage/v1/object/public/" +
        bucket +
        "/" +
        newphotosName;
      console.log(link);
      workPhotoPaths.push(link);
    }

    /* Create a new Work */
    const newWork = new Work({
      creator,
      category,
      title,
      description,
      price,
      workPhotoPaths,
    });

    await newWork.save();

    return new Response(JSON.stringify(newWork), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to create a new Work", { status: 500 });
  }
}
