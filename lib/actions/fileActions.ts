"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getFilesByUserId = async (email: string) => {
  try {
    const files = await prisma.file.findMany({
      where: {
        User:{
          email:email,
        }
      },
      select: {
        id:true,
        name: true,
        url: true,
        uploadStatus: true,
        createdAt:true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return files;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw new Error("Failed to fetch files");
  }
};

export const deletefilebyId = async (id: string) => {
  try {
    await prisma.file.delete({
      where: {
        id: id,
      },
    });
    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    console.error("Error deleting file:", error);
    
    return { success: false, error: "Failed to delete file" };
  }
};
