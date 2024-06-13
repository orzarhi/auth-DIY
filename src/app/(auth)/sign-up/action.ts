'use server'

import { db } from "@/db";
import { FormState, SignupFormSchema } from "@/lib/definitions";
import { createSession } from "@/lib/database-session";
import * as argon2 from "argon2";

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

    const hashedPassword = await argon2.hash(password);
    // const hashedPassword = await bcrypt.hash(password, 10);

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