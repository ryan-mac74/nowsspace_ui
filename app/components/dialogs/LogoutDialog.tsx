"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { LogOut, X } from "lucide-react";
import Button from "../ui/Button";
import MenuIcon from "../ui/MenuIcon";

type Props = {
  className?: string;
  onLogout?: () => Promise<void> | void;
};

export default function LogoutDialog({ className, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await onLogout?.();
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          className={className}
          onClick={() => setOpen(true)}
        >
          <MenuIcon Icon={LogOut} />
          Log Out
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md" />
        <Dialog.Content
          className="
            fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm
            bg-zinc-900 border border-zinc-800 text-white rounded-2xl p-6 shadow-2xl flex flex-col gap-4
          "
        >
          <Dialog.Close asChild>
            <Button className="absolute left-2 top-2 !p-1 text-zinc-400 hover:text-white bg-transparent">
              <X className="size-5" />
            </Button>
          </Dialog.Close>

          <div className="text-center">
            <Dialog.Title className="text-xl font-bold text-white">
              Log out to your account
            </Dialog.Title>
            <Dialog.Description className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Are you sure you want to log out?
            </Dialog.Description>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <Dialog.Close asChild>
              <Button
                disabled={loading}
                className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700/50"
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              onClick={handleLogout}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 text-white"
            >
              {loading ? "Logging out..." : "Log Out"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
