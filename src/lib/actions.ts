'use server'

import { deleteSession } from "./stateless-session";

export async function logout() {
    deleteSession();
}
