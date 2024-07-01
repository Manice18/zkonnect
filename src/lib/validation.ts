import { z } from "zod";

const creatorSignupFormSchema = z.object({
  creatorName: z.string().trim().min(1, "Cannot be empty"),
  domainOfEvent: z.string().trim().min(1, "Cannot be empty"),
  expectedNumberOfEvents: z.coerce
    .number()
    .gte(1, "Value must be greater than 0"),
});

export { creatorSignupFormSchema };
