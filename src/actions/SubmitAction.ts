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

export async function updateCreatorFollowers(
  walletAddress: string,
  noOfFollowers: number,
  isVerified: boolean,
) {
  await db.creator.update({
    where: {
      walletAddress,
    },
    data: {
      noOfFollowers,
      isVerified,
    },
  });
  return;
}
