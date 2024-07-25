import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CircleCheck, MoveRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function ConfirmEvent({
  onConfirm,
  eventName,
  eventDescription,
  bannerUrl,
  dateTime,
  ticketPrice,
  totalTickets,
  tokenType,
  disabled,
}: {
  onConfirm: () => void;
  eventName: string;
  eventDescription: string;
  bannerUrl: string;
  dateTime: string;
  ticketPrice: number;
  totalTickets: number;
  tokenType: string;
  disabled: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="z-10 w-[150px] space-x-3 self-end px-7 py-6 text-sm"
          onClick={() => setIsOpen((p: boolean) => !p)}
          disabled={disabled}
        >
          <span>Create</span>
          <MoveRight size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm the given details👇🏻</DialogTitle>
          <DialogDescription className="space-y-2 pt-4">
            <p className="text-base font-semibold leading-none tracking-tight text-black">
              {eventName}
            </p>
            <p className="text-xs">Starts on: {dateTime}</p>
          </DialogDescription>
          <Separator className="my-4" />
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-4 h-full text-sm text-black">{eventDescription}</p>
            <div className="space-y-1 text-sm">
              <p>Start Time: {dateTime}</p>
              <p>Total Tickets: {totalTickets}</p>
              <p>Ticket Price: {ticketPrice}</p>
              <p>Token Type: {tokenType}</p>
            </div>
          </div>
          <Image
            src={bannerUrl}
            width={208}
            height={208}
            alt="event banner"
            className="size-52 bg-red-300"
          />
        </div>
        <DialogFooter className="sm:justify-start">
          <div className="flex items-start justify-start space-x-1">
            <Button
              variant="outline"
              size="default"
              className="text-xs"
              onClick={() => {
                setIsOpen((p: boolean) => !p);
              }}
            >
              Cancel
            </Button>
            <Button onClick={onConfirm} size="default" className="text-xs">
              <CircleCheck size={16} className="mr-2" />
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
