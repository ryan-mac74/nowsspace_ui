"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle, Trash2, XCircle, X } from "lucide-react";
import Button from "../ui/Button";
import MenuIcon from "../ui/MenuIcon";

type Props = {
  className?: string;
  action: "activate" | "deactivate" | "delete";
  deletedAt?: string | Date | null;
  onConfirm?: () => Promise<void> | void;
};

export default function ActivationDialog({
  className, action, deletedAt, onConfirm
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);

    try {
      await onConfirm?.();
      setOpen(false);
    } catch (error) {
      console.error("❌ Failed to confirm action:", error);
    } finally {
      setLoading(false);
    }
  };

  let actionIcon = CheckCircle;
  let actionLabel = "";
  let actionTitle = "";
  let description = "";
  let actionButtonClass = "";

  switch (action) {
    case "activate":
      actionIcon = CheckCircle;
      actionLabel = deletedAt ? "Cancel Deletion" : "Activate Account";
      actionTitle = deletedAt ? "Cancel account deletion" : "Reactivate your account";
      description = deletedAt
        ? "Your account is scheduled for permanent deletion. Cancel the process to keep your account"
        : "Your account is currently disabled. Activate it to resume full feature access";
      actionButtonClass = "bg-emerald-600 hover:bg-emerald-500 text-white";

      break;
    case "deactivate":
      actionIcon = XCircle;
      actionLabel = "Deactivate Account";
      actionTitle = "Deactivate your account";
      description = "Your account will temporarily be disabled. Reactivate it at any time for full feature access";
      actionButtonClass = "bg-amber-600 hover:bg-amber-500 text-white";

      break;
    case "delete":
      actionIcon = Trash2;
      actionLabel = "Delete Account";
      actionTitle = "Delete your account";
      description = "Your account will be permanently queued for deletion. Reactivate it to prevent permanent deletion";
      actionButtonClass = "bg-rose-600 hover:bg-rose-500 text-white";

      break;
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          className={className}
          onClick={() => setOpen(true)}
        >
          <MenuIcon Icon={actionIcon} />
          {actionLabel}
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
              {actionTitle}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-zinc-400 mt-2 leading-relaxed">
              {description}
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
              onClick={handleAction}
              disabled={loading}
              className={actionButtonClass}
            >
              {loading ? "Processing..." : actionLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
