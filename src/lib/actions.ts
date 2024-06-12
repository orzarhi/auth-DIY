'use server'

import { db } from "@/db";
import { FormState, LoginFormSchema, SignupFormSchema } from "@/lib/definitions";
import { createSession } from "@/lib/database-session";
import bcrypt from 'bcrypt';
import { deleteSession } from "./stateless-session";

export async function signUp(
    state: FormState,
    formData: FormData,
): Promise<FormState> {
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, password } = validatedFields.data;

    const existingUser = await db.user.findFirst({
        where: { email },
    })

    if (existingUser) {
        return {
            message: 'Email already exists, please use a different email or login.',
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        select: {
            id: true,
        },
    });

    if (!user) {
        return {
            message: 'An error occurred while creating your account.',
        };
    }

    const userId = user.id;
    await createSession(userId);
}

export async function login(
    state: FormState,
    formData: FormData,
): Promise<FormState> {
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });
    const errorMessage = { message: 'Invalid login credentials.' };

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const user = await db.user.findFirst({
        where: { email: validatedFields.data.email },
    });


    if (!user) {
        return errorMessage;
    }

    const passwordMatch = await bcrypt.compare(
        validatedFields.data.password,
        user.password,
    );


    if (!passwordMatch) {
        return errorMessage;
    }

    const userId = user.id
    await createSession(userId);
}


export async function logout() {
    deleteSession();
}
