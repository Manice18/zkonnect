import { Copy, Check } from "lucide-react";
import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const [copiedBlink, setCopiedBlink] = useState<boolean>(false);
  const [copiedMeet, setCopiedMeet] = useState<boolean>(false);
  const [blinkUrl, setBlinkUrl] = useState<string>(
    "https://zkonnect.blinks.com/event",
  );
  const [meetUrl, setMeetUrl] = useState<string>(
    "https://zkonnect.meet.com/id",
  );

  const onCopy = (url: string, setCopied: (value: boolean) => void) => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

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
          className="size-46 mx-auto bg-[#FF6D4D]"
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
            <div className="flex gap-2">
              <Input
                id="blink-link"
                value={blinkUrl}
                readOnly
                onClick={() => onCopy(blinkUrl, setCopiedBlink)}
              />
              <Button
                type="submit"
                size="sm"
                className="h-full bg-[#808080] px-3"
                onClick={() => onCopy(blinkUrl, setCopiedBlink)}
                disabled={copiedBlink}
              >
                <span className="sr-only">Copy</span>
                {copiedBlink ? <Check size={20} /> : <Copy size={20} />}
              </Button>
            </div>
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
            <div className="flex gap-2">
              <Input
                id="meet-link"
                value={meetUrl}
                readOnly
                onClick={() => onCopy(meetUrl, setCopiedMeet)}
              />
              <Button
                type="submit"
                size="sm"
                className="h-full bg-[#808080] px-3"
                onClick={() => onCopy(meetUrl, setCopiedMeet)}
                disabled={copiedMeet}
              >
                <span className="sr-only">Copy</span>
                {copiedMeet ? <Check size={20} /> : <Copy size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
