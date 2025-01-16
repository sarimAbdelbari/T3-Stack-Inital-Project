"use client";

import { signIn ,signOut } from "next-auth/react";

export async function loginGithub() {
    try {
   
  
      await signIn("github");
  
      return { success: true, message: "Login successful" };
      
    } catch (error) {
      
      console.error("Google login error:", error);
      
      return {success: false, error: "Something went wrong" };
  
    }
  }

  export async function loginGoogle() {
    try {
  
      await signIn("google");
  
      
      return { success: true, message: "Login successful" };
       
  
    } catch (error) {
  
      console.error("Google login error:", error);
  
      return {success: false, error: "Something went wrong" };
    }
  }
  
  export async function logoutProvider() {
  try {

    await signOut({redirectTo: "/"});


    
    return { success: true , message: "Logout successful" };
    
  } 
  catch(error){
    console.error(error);
    return { success : false , error: "Something went wrong" };
  }
}