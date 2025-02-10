"use server";

// import { sign, verify, JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {
  // LoginSchema,
  RegistrationSchema,
  FormState
} from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
// import { setCookie, getCookie, deleteCookie } from "cookies-next/server";

const prisma = new PrismaClient();


export async function register(state: FormState, formData: FormData) {
  try {
    const validatedFields = RegistrationSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, email, password, confirmPassword } = validatedFields.data;

    if (password !== confirmPassword) {
      return { success: false, warning: "Invalid Password Match" };
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return { success: false, warning: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    return { success: true, message: "Registration successful" };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Something went wrong" };
  }
}



// const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
// const JWT_EXPIRATION = "7d";

// export async function login(state: FormState, formData: FormData) {
//   try {
//     // Transform `rememberMe` into a boolean
//     const rememberMeB = formData.get("rememberMe") === "on";

//     const validatedFields = LoginSchema.safeParse({
//       email: formData.get("email"),
//       password: formData.get("password"),
//       rememberMeB,
//     });

//     // If any form fields are invalid, return early
//     if (!validatedFields.success) {
//       return {
//         errors: validatedFields.error.flatten().fieldErrors,
//       };
//     }

//     const { email, password, rememberMe } = validatedFields.data;

//     const user = await prisma.user.findUnique({
//       where: {
//         email: email,
//       },
//     });

//     if (!user || (await bcrypt.compare(password, user.password)) !== true) {
//       return { success: false, warning: "Invalid email or password" };
//     }

//     const token = sign(
//       {
//         id: user.id,
//         email: user.email,
//       },
//       JWT_SECRET,
//       { expiresIn: rememberMe ? JWT_EXPIRATION : "1d" }
//     );

//     // Store the JWT in a cookie
//     setCookie("authToken", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 30 * 24 * 60 * 60, // 30 days
//     });

//     return { success: true, message: "Login successful" };
//   } catch (error) {
//     console.error("Login error:", error);
//     return { success: false, error: "Something went wrong" };
//   }
// }



// export async function logout() {
//   try {
//     deleteCookie("authToken", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 0,
//     });

//     return { success: true, message: "Logout successful" };
//   } catch (error) {
//     console.error(error);
//     return { success: false, error: "Something went wrong" };
//   }
// }

// export async function getAuthenticatedUser() {
//   try {
//     const token = await getCookie("authToken");

//     if (!token) {
//       return null;
//     }

//     const decoded = verify(token as string, JWT_SECRET) as JwtPayload;

//     const user = await prisma.user.findUnique({
//       where: { id: decoded.id },
//     });

//     if (!user) {
//       return null;
//     }

//     return {
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         // image: user.image,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching user from token:", error);
//     return null;
//   } finally {
//     await prisma.$disconnect();
//   }
// }
