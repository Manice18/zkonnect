"use client";

import { useRouter } from "next/navigation";

import { z } from "zod";
import { useForm, useFormState } from "react-hook-form";
import { toast } from "sonner";
import {
  MoveRight,
  Calendar as CalendarIcon,
  Upload,
  CircleUserRound,
} from "lucide-react";
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
import { useZkonnect } from "@/hooks/useZkonnect";
import { useState } from "react";
import { ConfirmEvent } from "./confirmEvent";
import Image from "next/image";
import UploadDropzone from "../Common/UploadDropzone";

type EventCreationFormSchemaType = z.infer<typeof eventCreationFormSchema>;

const EventCreation = () => {
  const { publicKey } = useWallet();
  const router = useRouter();

  const { createTheEvent, payforTicket, closeAccount, getAllCreatorAccounts } =
    useZkonnect();

  const [allEvents, setAllEvents] = useState<any>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string>("");

  const form = useForm<EventCreationFormSchemaType>({
    resolver: zodResolver(eventCreationFormSchema),
    defaultValues: {
      eventName: "",
      eventDescription: "",
      eventDate: new Date(),
      bannerUrl: undefined,
      location: "",
      ticketPrice: 0,
      totalTickets: 1,
      collectionNft: "",
      nativePaymentToken: "USDC",
    },
  });

  const { isValid } = useFormState({ control: form.control });

  async function onSubmit(values: z.infer<typeof eventCreationFormSchema>) {
    if (!publicKey) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      let promise: Promise<void>;
      promise = new Promise<void>((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", values.bannerUrl[0]);
        fetch("/api/uploadImage", {
          method: "POST",
          body: formData,
        })
          .then(async (response) => {
            const uploadedImage = await response.json();
            console.log(uploadedImage);
            // await createTheEvent({
            //   eventName: values.eventName,
            //   eventDescription: values.eventDescription,
            //   creatorName: "John Doe",
            //   creatorDomain: "singing",
            //   bannerUrl: uploadedImage.userLogo,
            //   dateTime: values.eventDate.getTime(),
            //   location: values.location,
            //   ticketPrice: values.ticketPrice,
            //   totalTickets: values.totalTickets,
            //   tokenType: values.nativePaymentToken,
            //   collectionNft: values.collectionNft,
            // });
            console.log(values);
          })
          .then(() => {
            resolve();
          })
          .catch((error) => reject(error));
      });

      toast.promise(promise, {
        loading: "Your event is being created",
        success: "Event created successfully!",
        error: "Error creating event",
      });
    } catch (error) {
      console.error("Error uploading images:", error);
    }

    // await createTheEvent({
    //   eventName: values.eventName,
    //   eventDescription: values.eventDescription,
    //   creatorName: "John Doe",
    //   creatorDomain: "singing",
    //   bannerUrl: values.bannerUrl,
    //   dateTime: values.eventDate.getTime(),
    //   location: values.location,
    //   ticketPrice: values.ticketPrice,
    //   totalTickets: values.totalTickets,
    //   tokenType: values.nativePaymentToken,
    //   collectionNft: values.collectionNft,
    // });

    // toast.success("Event creation successful", {
    //   description: "Go to dashboard to view your event",
    //   position: "bottom-center",
    //   action: {
    //     label: "dashboard",
    //     onClick: () => router.push("/creator/dashboard"),
    //   },
    // });
    // form.reset();
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
          name="bannerUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black">
                Event Banner
              </FormLabel>
              <FormControl>
                <UploadDropzone baseImage={true} onChange={field.onChange} />
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
          name="eventDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Event</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
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
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date: any) => date < new Date()}
                    className="rounded-md border shadow"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The Date on which you want to host the event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black">
                Event location
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. https://example.com/banner.jpg"
                  {...field}
                  className="h-[50px] w-full rounded-md text-black transition-all dark:text-white"
                />
              </FormControl>
              <FormDescription>
                The location of the event you want to create
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
          name="totalTickets"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black">
                Total Tickets
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. 100"
                  {...field}
                  className="h-[50px] w-full rounded-md text-black transition-all dark:text-white"
                />
              </FormControl>
              <FormDescription>
                The total number of tickets available for the event you want to
                create
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="collectionNft"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium text-black">
                Collection NFT
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. 8RWXnLH7YoTYWP3oC7BWdgm4ZNYnaLzgF2xAB9Nfq3Jk"
                  {...field}
                  className="h-[50px] w-full rounded-md text-black transition-all dark:text-white"
                />
              </FormControl>
              <FormDescription>
                The address of the NFT collection you want to use for the event
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
                        <AvatarImage src="https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694" />
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
        <ConfirmEvent
          disabled={!isValid}
          onConfirm={form.handleSubmit(onSubmit)}
          eventName={form.getValues().eventName}
          eventDescription={form.getValues().eventDescription}
          bannerUrl={form.getValues().bannerUrl}
          dateTime={form.getValues().eventDate.toLocaleDateString()}
          ticketPrice={form.getValues().ticketPrice}
          totalTickets={form.getValues().totalTickets}
          tokenType={form.getValues().nativePaymentToken}
        />
        <label
          className="cursor-pointer rounded-md bg-black p-2 text-center text-white"
          onClick={() => {
            closeAccount("An online event")
              .then(() => {
                toast.success("Account closed successfully");
              })
              .catch((e) => {
                toast.error("Error closing account");
              });
          }}
        >
          Close Account
        </label>
        <label
          className="cursor-pointer rounded-md bg-black p-2 text-center text-white"
          onClick={async () => {
            const data = await getAllCreatorAccounts();
            setAllEvents(data);
          }}
        >
          Get all
        </label>
      </form>
    </Form>
  );
};

export default EventCreation;
