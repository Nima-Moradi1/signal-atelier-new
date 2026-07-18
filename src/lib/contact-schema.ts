import { z } from "zod";
import englishMessages from "@/messages/en/common.json";

export type ContactValidationMessages = {
  nameMin: string;
  nameMax: string;
  email: string;
  messageMin: string;
  messageMax: string;
  company: string;
};

export function createContactSchema(messages: ContactValidationMessages) {
  return z.object({
    name: z.string().trim().min(2, messages.nameMin).max(80, messages.nameMax),
    email: z.email(messages.email),
    message: z
      .string()
      .trim()
      .min(20, messages.messageMin)
      .max(2000, messages.messageMax),
    company: z.string().max(0, messages.company).optional(),
  });
}

export const contactSchema = createContactSchema(
  englishMessages.ContactForm.validation,
);

export type ContactFormValues = z.infer<typeof contactSchema>;
