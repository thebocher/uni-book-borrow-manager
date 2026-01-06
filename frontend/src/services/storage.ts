import { useLocalStorage } from "@vueuse/core"

export enum Role {
    user = 'user',
    manager = 'manager',
    admin = 'admin'
}

export const storage = {
    access_token: useLocalStorage('access_token', ''),
    role: useLocalStorage('role', null)
}