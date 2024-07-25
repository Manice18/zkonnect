import { NextRequest, NextResponse } from "next/server";

import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    if (files.length === 1) {
      const userLogo = files[0];
      const userLogoData = await userLogo.arrayBuffer();
      const userLogoBuffer = Buffer.from(userLogoData);
      const base64UserLogo = userLogoBuffer.toString("base64");
      const baseUserLogoData: any = await uploadImage(
        `data:${userLogo.type};base64,${base64UserLogo}`,
      );
      const baseUserLogoURL = baseUserLogoData.secure_url;
      return NextResponse.json({ userLogo: baseUserLogoURL }, { status: 200 });
    }

    // Process the base image first
    const baseImageFile = files[0];
    const baseImageFileData = await baseImageFile.arrayBuffer();
    const baseImageBuffer = Buffer.from(baseImageFileData);
    const base64BaseImage = baseImageBuffer.toString("base64");
    const baseImageData: any = await uploadImage(
      `data:${baseImageFile.type};base64,${base64BaseImage}`,
    );
    const baseImageURL = baseImageData.secure_url;

    // Process the remaining images
    const remainingFiles = files.slice(1);
    const uploadPromises = remainingFiles.map(async (file) => {
      const fileData = await file.arrayBuffer();
      const imageBuffer = Buffer.from(fileData);
      const base64String = imageBuffer.toString("base64");
      const imageData: any = await uploadImage(
        `data:${file.type};base64,${base64String}`,
      );
      return imageData.secure_url;
    });

    const uploadedImageUrls = await Promise.all(uploadPromises);

    return NextResponse.json(
      { baseImageURL, urls: uploadedImageUrls },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      { error: "Error uploading images" },
      { status: 500 },
    );
  }
}
