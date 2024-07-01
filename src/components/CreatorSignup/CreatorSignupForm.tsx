"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MoveRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@solana/wallet-adapter-react";

import { creatorSignupFormSchema } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCreatorAction } from "@/actions";

type CreatorSignupFormSchemaType = z.infer<typeof creatorSignupFormSchema>;

const CreatorSignupForm = () => {
  const { publicKey, connected } = useWallet();
  const router = useRouter();

  const form = useForm<CreatorSignupFormSchemaType>({
    resolver: zodResolver(creatorSignupFormSchema),
    defaultValues: {
      creatorName: "",
      domainOfEvent: "",
      expectedNumberOfEvents: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof creatorSignupFormSchema>) {
    if (publicKey === null || !connected) {
      toast.error("Please connect your wallet first");
      return;
    }
    try {
      let promise: any;
      promise = new Promise<void>((resolve, reject) => {
        createCreatorAction({ ...values, walletAddress: publicKey.toBase58() })
          .then(() => {
            resolve();
            router.push("/creator-signup/verification");
          })
          .catch((error) => {
            reject(error);
          });
      });

      toast.promise(promise, {
        loading: "Verifying...",
        success: "Profile Created, now taking you to verification page.",
        error: "Error creating profile. Please try again.",
      });
    } catch (error) {
      console.error("Error creating profile", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-w-[500px] flex-col space-y-4 p-4"
      >
        <FormField
          control={form.control}
          name="creatorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black">
                Creator&apos;s Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. Josh Gupta"
                  {...field}
                  className="h-[50px] w-full rounded-md text-black transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="domainOfEvent"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black">
                Domain of the Event
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. Singing"
                  {...field}
                  className="h-[50px] w-full rounded-md text-black transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expectedNumberOfEvents"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black">
                Expected number of events to host yearly
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. 50"
                  {...field}
                  className="h-[50px] w-full rounded-md text-black transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="z-10 w-[150px] space-x-3 self-end px-7 py-6 text-sm"
          type="submit"
        >
          <span>Continue</span>
          <MoveRight size={20} />
        </Button>
      </form>
    </Form>
  );
};

export default CreatorSignupForm;
