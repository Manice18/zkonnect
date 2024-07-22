import { z } from "zod";

const creatorSignupFormSchema = z.object({
  creatorName: z.string().trim().min(1, "Cannot be empty"),
  domainOfEvent: z.string().trim().min(1, "Cannot be empty"),
  expectedNumberOfEvents: z.coerce
    .number()
    .gte(1, "Value must be greater than 0"),
});

const nativeTokenEnum = z.enum(["SOL", "USDC", "USDT", "BTC", "ETH"]);

const eventCreationFormSchema = z.object({
  eventName: z.string().trim().min(1, "Cannot be empty"),
  eventDescription: z.string().trim().min(1, "Cannot be empty"),
  eventDate: z.date({
    required_error: "A date of event is required",
  }),
  bannerUrl: z.string().url(),
  location: z.string().trim().min(1, "Cannot be empty"),
  ticketPrice: z.coerce
    .number()
    .gte(0, "Value must be greater than or equal to 0"),
  totalTickets: z.coerce.number().gte(1, "Value must be greater than 0"),
  collectionNft: z.string().trim().min(1, "Cannot be empty"),
  nativePaymentToken: nativeTokenEnum,
});

export { creatorSignupFormSchema, eventCreationFormSchema };
