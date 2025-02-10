"use server";

import { utapi } from "@/components/utils/uploadthingUTapi";
import { PrismaClient, UploadStatus } from "@prisma/client";
import {  z } from "zod";

const prisma = new PrismaClient();

export const getFilesByUserId = async (email: string) => {
  try { 
    
    z.object({
      email: z.string().email("Invalid email address"),
    })

    const files = await prisma.file.findMany({
      where: {
        user:{
          email:email,
        }
      },
      select: {
        id:true,
        name: true,
        url: true,
        key:true,
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

interface PostFileData {
  name: string;
  url: string;
  key: string;
  hash : string;
  userId: string;
  uploadStatus: UploadStatus;
}

export const findFileById = async ({ fileName, userId }: { fileName: string; userId: string }) => {
  try {
 

    const file = await prisma.file.findFirst({
      where: {
        name : fileName,
        user:{
          id: userId,
        }
      }
    })
   
    return file;
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to find file" };

  }
}

export const postFile = async (data:PostFileData) => {
  try {
  
  if(data.name === "" || data.url === "" || data.key === "" || data.userId === ""){
    return { success: false, error: "All fields are required" };
  }

    await prisma.file.create({
      data: {
        name: data.name,
        url: data.url,
        key: data.key,
        hash: data.hash,
        userId: data.userId,
        uploadStatus: data.uploadStatus ?? "SUCCESS",
      },
    });
   
    
    return { success: true , error: "File Created Successfully" };

  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to Create file" };

  }
}


export const deletefilebyId = async ({ id, key }: { id: string; key: string; }) => {
  try {
     
    console.log("key",key);


    const result = await utapi.deleteFiles(key);

    console.log("result",result);
   const resulta = await prisma.file.delete({
      where: {
        id: id,
      },
    });
    console.log("resulta",resulta);
    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    console.error("Error deleting file:", error);
    
    return { success: false, error: "Failed to delete file" };
  }
};
