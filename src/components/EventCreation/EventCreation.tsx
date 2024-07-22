"use client";

import { useRouter } from "next/navigation";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MoveRight, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { cn } from "@/lib/utils";
import { eventCreationFormSchema } from "@/lib/validation";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type EventCreationFormSchemaType = z.infer<typeof eventCreationFormSchema>;

const EventCreation = () => {
  const { publicKey } = useWallet();
  const router = useRouter();

  const form = useForm<EventCreationFormSchemaType>({
    resolver: zodResolver(eventCreationFormSchema),
    defaultValues: {
      eventName: "",
      eventDescription: "",
      eventBanner: "",
      maxParticipants: 0,
      ticketPrice: 0,
      nativePaymentToken: "USDC",
      eventDate: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof eventCreationFormSchema>) {
    if (!publicKey) {
      toast.error("Wallet not connected");
      return;
    }

    console.log(values);

    toast.success("Event creation successful", {
      description: "Go to dashboard to view your event",
      position: "bottom-center",
      action: {
        label: "dashboard",
        onClick: () => router.push("/creator/dashboard"),
      },
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 p-4 sm:min-w-[500px]"
      >
        <FormField
          control={form.control}
          name="eventName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black dark:text-white">
                Event Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. An Online Event - By John Doe"
                  {...field}
                  className="h-[50px] w-full rounded-md text-black transition-all dark:text-white"
                />
              </FormControl>
              <FormDescription>
                The name of the event you want to create
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black dark:text-white">
                Event Description
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. A description of the event"
                  {...field}
                  className="h-[50px] w-full rounded-md text-black transition-all dark:text-white"
                />
              </FormControl>
              <FormDescription>
                A brief description of the event you want to create
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={field.onChange}
                    disabled={(date: any) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maxParticipants"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black">
                Max Participants
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. 100"
                  {...field}
                  className="h-[50px] w-full rounded-md text-black transition-all dark:text-white"
                />
              </FormControl>
              <FormDescription>
                The maximum number of participants allowed for the event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventBanner"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black">
                Event Banner
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. https://example.com/banner.jpg"
                  {...field}
                  className="h-[50px] w-full rounded-md text-black transition-all dark:text-white"
                />
              </FormControl>
              <FormDescription>
                A banner image for the event you want to create
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ticketPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black">
                Ticket Price
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. 2"
                  {...field}
                  className="h-[50px] w-full rounded-md text-black transition-all dark:text-white"
                />
              </FormControl>
              <FormDescription>
                The price of the ticket for the event you want to create
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nativePaymentToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Native Payment Token</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a token" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USDC">
                    <div className="flex items-center space-x-2">
                      <Avatar className="size-7">
                        <AvatarImage
                          src="https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694"
                          //   className="size-7 rounded-full"
                        />
                        <AvatarFallback>USDC</AvatarFallback>
                      </Avatar>
                      <span>USDC</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="SOL">
                    <div className="flex items-center space-x-2">
                      <Avatar className="size-7">
                        <AvatarImage src="https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756" />
                        <AvatarFallback>SOL</AvatarFallback>
                      </Avatar>
                      <span>SOL</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The native payment token you want to users to pay
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="z-10 w-[150px] space-x-3 self-end px-7 py-6 text-sm"
          type="submit"
        >
          <span>Create</span>
          <MoveRight size={20} />
        </Button>
      </form>
    </Form>
  );
};

export default EventCreation;
