"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Button from "../ui/Button";

type Props = {
  isLoading: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
};

export default function ConsentDialog({
  isLoading, isOpen, setOpen, onConfirm
}: Props) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md" />
        <Dialog.Content
          className="
            fixed z-50 left-1/2 top-1/2 w-[90%] max-w-sm
            -translate-x-1/2 -translate-y-1/2
            bg-zinc-900 border border-zinc-800 text-white
            rounded-2xl shadow-2xl p-6
            flex flex-col gap-4
          "
        >
          <Dialog.Close asChild>
            <Button disabled={isLoading} className="absolute left-2 top-2 !p-1 text-zinc-400 hover:text-white bg-transparent">
              <X className="size-5" />
            </Button>
          </Dialog.Close>

          <div className="text-center mt-2">
            <Dialog.Title className="text-xl font-bold text-white">
              Create New Account
            </Dialog.Title>
            <Dialog.Description className="text-sm text-zinc-400 mt-2 leading-relaxed">
              We are not able to find an existing account linked to this profile
            </Dialog.Description>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              You can cancel this process, log in to your existing account if there are any,
              and link this profile OR proceed to get started with a new account
            </p>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <Dialog.Close asChild>
              <Button
                disabled={isLoading}
                className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700/50"
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
