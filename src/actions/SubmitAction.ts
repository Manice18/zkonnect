"use server";

import { z } from "zod";

import { db } from "@/lib/prisma";
import { creatorSignupFormSchema } from "@/lib/validation";

export async function createCreatorAction(
  values: z.infer<typeof creatorSignupFormSchema> & { walletAddress: string },
) {
  await db.creator.create({
    data: {
      walletAddress: values.walletAddress,
      creatorName: values.creatorName,
      domainOfExpertise: values.domainOfEvent,
      eventsInaYear: values.expectedNumberOfEvents,
    },
  });
  return 1;
}
