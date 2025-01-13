"use client";

import { signIn , signOut } from "next-auth/react"
import { PrismaClient } from "@prisma/client";
import { LoginSchema , RegistrationSchema ,FormState } from "@/lib/validations/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { errorToast, successToast, warnToast } from "@/components/utils/toastNotification";
import { setCookie, deleteCookie } from 'cookies-next/client';



const prisma = new PrismaClient();

export async function loginGithub() {
  try {

    await signIn("github");

    successToast("Login successful");

  } catch (error) {

    console.error("Google login error:", error);
    errorToast("Something went wrong");
  }
}
export async function loginGoogle() {
  try {

    await signIn("google");

    successToast("Login successful");

  } catch (error) {

    console.error("Google login error:", error);
    errorToast("Something went wrong");
  }
}




export async function login(data: z.infer<typeof LoginSchema>) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return { error: "Invalid Email" };
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch){
      return { error: "Invalid credentials" };
    }

    // Set session cookie
    const sessionToken = crypto.randomUUID();


    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });
    
 
    setCookie('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })
    

    successToast("Login successful");
    
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    errorToast("Something went wrong");
    return { error: "Something went wrong" };
  }
}


export async function register(state: FormState, formData: FormData) {
  
  try {
   const validatedFields = RegistrationSchema.safeParse({
     name: formData.get('name'),
     email: formData.get('email'),
     password: formData.get('password'),
     confirmPassword: formData.get('confirmPassword'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }


    const { name, email, password ,confirmPassword } = validatedFields.data;



    if (password !== confirmPassword) {
      warnToast("Passwords do not match");
    }

    const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  
  if (existingUser) {
    warnToast("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  

  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
  });

  
  const sessionToken = crypto.randomUUID();
  
  await prisma.session.create({
    data: {
      sessionToken,
      userId: newUser.id,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });


  setCookie('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  })
  


  successToast("Registration successful");
  
  return { success: true };
} catch (error) {
  console.error("Registration error:", error);
  errorToast(`Registration error: ${error}`);
  return { error: "Something went wrong" };
}

}


export async function logoutProvider() {
  try {

    await signOut({redirectTo: "/"});


    deleteCookie('session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    })
    

    successToast("Logout successful");

  } 
  catch(error){
    console.error(error);
    errorToast("Something went wrong");
  }
}

