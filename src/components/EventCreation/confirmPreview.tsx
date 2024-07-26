import { Copy } from "lucide-react";
import { CircleCheck, MoveRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Label } from "@/components/ui/label";

export function ConfirmPreview({
  onConfirm,
  bannerUrl,
}: {
  onConfirm: () => void;
  bannerUrl: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen((p: boolean) => !p)}
          size="default"
          className="text-xs"
        >
          <CircleCheck size={16} className="mr-2" />
          Confirm
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[450px] sm:min-w-[425px]">
        <DialogHeader>
          <DialogTitle>Here you goo! 🤩</DialogTitle>
          <DialogDescription>
            Share on Social Media and engage with others.{" "}
          </DialogDescription>
        </DialogHeader>
        <Image
          src={bannerUrl}
          width={208}
          height={208}
          alt="event banner"
          className="size-46 bg-[#FF6D4D]"
        />
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="blink-link" className="mb-1 flex items-center">
              <Image
                src="/assets/blink-icon.svg"
                width={20}
                height={20}
                alt="blink-icon"
                className="mr-2"
              />
              <span>Blink</span>
            </Label>
            <Input
              id="blink-link"
              defaultValue="https://zkonnect.blinks.com/event"
              readOnly
            />
          </div>
          <div className="mt-6">
            <Button type="submit" size="sm" className="bg-[#808080] px-3">
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="meet-link" className="mb-1 flex items-center">
              <Image
                src="/assets/meet-icon.svg"
                width={20}
                height={20}
                alt="meet-icon"
                className="mr-2"
              />
              <span>Meeting Link</span>
            </Label>
            <Input
              id="meet-link"
              defaultValue="https://zkonnect.meet.com/id"
              readOnly
            />
          </div>
          <div className="mt-6">
            <Button type="submit" size="sm" className="bg-[#808080] px-3">
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
