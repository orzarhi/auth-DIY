'use server'

import { db } from "@/db";
import { FormState, LoginFormSchema } from "@/lib/definitions";
import { createSession } from "@/lib/database-session";
import * as argon2 from "argon2";

export async function signIn(
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

    const passwordMatch = await argon2.verify(
        user.password,
        validatedFields.data.password,
    );
    // const passwordMatch = await bcrypt.compare(
    //     validatedFields.data.password,
    //     user.password,
    // );


    if (!passwordMatch) {
        return errorMessage;
    }

    const userId = user.id
    await createSession(userId);
}
