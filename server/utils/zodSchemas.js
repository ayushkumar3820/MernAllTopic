import z, { email } from "zod";

export const RegisterSchema=z.object({
    userName:z.string().min(3),
    email:z.string().email(),
    password:z.string().min(6),
    role:z.enum(['user','admin']).optional()
})


export const loginSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6),
});


export const itemSchema=z.object({
    name:z.string().min(1),
    description:z.string().optional()
})
