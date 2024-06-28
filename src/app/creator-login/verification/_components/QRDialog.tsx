import Image from "next/image";

import QRCode from "react-qr-code";

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

export function QRDialog({
  children,
  requestUrl,
  providerName,
  providerImage,
  isOpen,
  setIsOpen,
}: {
  children?: React.ReactNode;
  requestUrl: any;
  providerName: string;
  providerImage: string;
  isOpen: boolean | undefined;
  setIsOpen: (value: boolean) => void;
}) {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-[#F7F7F7]/80 outline outline-[0.2px] outline-zkonnect-gray dark:bg-transparent/40 sm:max-w-[425px]">
        <DialogHeader className="flow-col flex items-center justify-center space-x-4 sm:flex-row sm:items-start">
          <Image
            src={`/assets/provider/${providerImage}`}
            alt="logo"
            className=""
            width={48}
            height={48}
          />
          <div>
            <DialogTitle className="mx-auto -mt-1 pb-3 font-medium text-black dark:text-white">
              X Followers Proof
            </DialogTitle>
            <DialogDescription className="pb-4 text-xs text-muted-foreground">
              Scan the below qr code in order <br /> to verify.
            </DialogDescription>
          </div>
        </DialogHeader>
        {requestUrl && (
          <QRCode
            value={requestUrl}
            className="mx-auto mb-4 bg-white p-4 outline"
          />
        )}
        <div className="mx-auto mb-4">
          <p className="text-xs text-muted-foreground">
            <u>Note:</u> Ensure proper lighting and steady positioning <br />{" "}
            when scanning QR codes for optimal recognition.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            type="submit"
            className="font-dmsans mx-auto w-[60%] bg-transparent text-sm font-medium text-black transition-all duration-500 hover:bg-accent-foreground hover:text-zkonnect-white-origin dark:text-white dark:hover:bg-secondary md:text-base"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
