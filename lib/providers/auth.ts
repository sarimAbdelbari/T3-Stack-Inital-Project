"use client";

import { signIn ,signOut } from "next-auth/react";

export async function loginGithub() {
    try {
   
  
      await signIn("github",{redirectTo:"/main/user/files"});
  
      return { success: true, message: "Login successful" };
      
    } catch (error) {
      
      console.error("Google login error:", error);
      
      return {success: false, error: "Something went wrong" };
  
    }
  }


  export async function loginGoogle() {
    try {
  
       await signIn("google",{redirectTo:"/main/user/files"});
  
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
export async function loginCredentials(formData: FormData) {
try {
  const result = await signIn("credentials", {
    redirect: false,
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on",
  });
      
    
  if (result?.error) {
    return { success: false, error: result.error };
  }
      
  return { success: true, message: "Login successful" };
} catch (error) {
  console.error("login error:", error);
  return { success: false, error: "Something went wrong" };
}}