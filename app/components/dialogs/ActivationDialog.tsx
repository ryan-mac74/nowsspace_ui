"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle, Trash2, XCircle, X } from "lucide-react";
import Button from "../ui/Button";
import MenuIcon from "../ui/MenuIcon";
import useLanguage from "../../hooks/useLanguage";

type Props = {
  className?: string;
  action: "activate" | "deactivate" | "delete";
  deleted_at?: string | Date | null;
  onConfirm?: () => Promise<void> | void;
};

export default function ActivationDialog({
  className, action, deleted_at, onConfirm
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

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

  const isPendingDeletion = Boolean(deleted_at);

  switch (action) {
    case "activate":
      actionIcon = CheckCircle;
      actionLabel = isPendingDeletion ? t("account.cancelDeletion") : t("account.activate");
      actionTitle = isPendingDeletion ? t("account.cancelDeletionTitle") : t("account.reactivateTitle");
      description = isPendingDeletion
        ? t("account.pendingDeletionDescription")
        : t("account.disabledDescription");
      actionButtonClass = "bg-emerald-600 hover:bg-emerald-500 text-white";

      break;
    case "deactivate":
      actionIcon = XCircle;
      actionLabel = t("account.deactivate");
      actionTitle = t("account.deactivateTitle");
      description = t("account.deactivateDescription");
      actionButtonClass = "bg-amber-600 hover:bg-amber-500 text-white";

      break;
    case "delete":
      actionIcon = Trash2;
      actionLabel = t("account.delete");
      actionTitle = t("account.deleteTitle");
      description = t("account.deleteDescription");
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
            bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-2xl p-6 shadow-2xl flex flex-col gap-4
          "
        >
          <Dialog.Close asChild>
            <Button className="absolute left-2 top-2 !p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-transparent">
              <X className="size-5" />
            </Button>
          </Dialog.Close>

          <div className="text-center">
            <Dialog.Title className="text-xl font-bold text-zinc-900 dark:text-white">
              {actionTitle}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              {description}
            </Dialog.Description>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <Dialog.Close asChild>
              <Button
                disabled={loading}
                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-300/50 dark:border-zinc-700/50"
              >
                {t("common.cancel")}
              </Button>
            </Dialog.Close>
            <Button
              onClick={handleAction}
              disabled={loading}
              className={actionButtonClass}
            >
              {loading ? t("account.processing") : actionLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
