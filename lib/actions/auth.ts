
"use server";

import { PrismaClient } from "@prisma/client";
import { LoginSchema , RegistrationSchema ,FormState } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { setCookie, deleteCookie ,getCookie } from 'cookies-next/client';

import { GetServerSidePropsContext } from 'next';


const prisma = new PrismaClient();

export async function login(state: FormState, formData: FormData) {
  try {

    console.log("i am here");
    console.log("validatedFields", formData);

    // Transform `rememberMe` into a boolean
    const rememberMeB = formData.get('rememberMe') === 'on';

    const validatedFields = LoginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
      rememberMeB,
    });

    
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
  }



const { email, password ,rememberMe } = validatedFields.data;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return { success: false, warning: "Invalid Email" };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch){
      return { success: false, warning: "Invalid Password Match" };
    }

    // Default session expiration to 1 day
    let sessionExpiration = 1 * 24 * 60 * 60 * 1000; // 1 day

    // If rememberMe is true, extend the session expiration to 30 days
    if (rememberMe) {
      sessionExpiration = 30 * 24 * 60 * 60 * 1000; // 30 days
    }

    // Generate a session token
    const sessionToken = crypto.randomUUID();

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires: new Date(Date.now() + sessionExpiration),
      },
    });

    // Set the session cookie with the appropriate expiration
    setCookie('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: sessionExpiration / 1000, // Convert milliseconds to seconds
    });

    

     
 
    return { success: true, message: "Login successful" };
  } catch (error) {
    
    console.error("Login error:", error);  
    return {success: false, error: "Something went wrong" };
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
      return { success: false, warning: "Invalid Password Match" };
    }
    
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    
    if (existingUser) {
    return {success: false, warning: "Email already exists" }
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
  
  
 
   
  
  return { success: true , message: "Registration successful" };
} catch (error) {
  console.error("Registration error:", error);
  return {success: false , error: "Something went wrong" };
}

}


export async function logout() {
  try {



    deleteCookie('session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    })

    
    return { success: true , message: "Logout successful" };
    
  } 
  catch(error){
    console.error(error);
    return { success : false , error: "Something went wrong" };
  }
}




export async function getAuthenticatedUser(context: GetServerSidePropsContext) {
  const sessionToken =  getCookie('session', { req: context.req, res: context.res });
  
  if (!sessionToken) {
    return null;
  }

  try {
    const session = await prisma.session.findUnique({
      where: { sessionToken: sessionToken as string },
      include: { user: true },
    });

    if (!session || new Date(session.expires) < new Date()) {
      return null;
    }

    return {
      user: {
        // id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        // image: session.user.image || "",
      },
    };
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}




// export async function logoutProvider() {
//   try {

//     await signOut({redirectTo: "/"});


//     deleteCookie('session', {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 0,
//     })

    
//     return { success: true , message: "Logout successful" };
    
//   } 
//   catch(error){
//     console.error(error);
//     return { success : false , error: "Something went wrong" };
//   }
// }