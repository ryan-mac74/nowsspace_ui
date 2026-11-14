"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Button from "../ui/Button";
import useLanguage from "../../hooks/useLanguage";

type Props = {
  isLoading: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
};

export default function ConsentDialog({
  isLoading, isOpen, setOpen, onConfirm
}: Props) {
  const { t } = useLanguage();

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md" />
        <Dialog.Content
          className="
            fixed z-50 left-1/2 top-1/2 w-[90%] max-w-sm
            -translate-x-1/2 -translate-y-1/2
            bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white
            rounded-2xl shadow-2xl p-6
            flex flex-col gap-4
          "
        >
          <Dialog.Close asChild>
            <Button disabled={isLoading} className="absolute left-2 top-2 !p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-transparent">
              <X className="size-5" />
            </Button>
          </Dialog.Close>

          <div className="text-center mt-2">
            <Dialog.Title className="text-xl font-bold text-zinc-900 dark:text-white">
              {t("consent.title")}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              {t("consent.description")}
            </Dialog.Description>
            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
              {t("consent.details")}
            </p>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <Dialog.Close asChild>
              <Button
                disabled={isLoading}
                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-300/50 dark:border-zinc-700/50"
              >
                {t("common.cancel")}
              </Button>
            </Dialog.Close>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              {isLoading ? t("consent.creating") : t("consent.create")}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
