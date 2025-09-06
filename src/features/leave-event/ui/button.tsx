import { trpc } from "@/shared/api";
import { useState } from "react";

type LeaveEventButtonProps = {
  eventId: number;
  onSuccess?: () => void;
};

export const LeaveEventButton = ({
  eventId,
  onSuccess,
}: LeaveEventButtonProps) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const { mutate, isLoading } = trpc.event.leave.useMutation({ 
    onSuccess: () => {
      setIsConfirming(false);
      onSuccess && onSuccess();
    } 
  });

  const handleConfirmClick = () => {
    mutate({ id: eventId });
  };

  const handleCancelClick = () => {
    setIsConfirming(false);
  };

  const handleInitialClick = () => {
    setIsConfirming(true);
  };

  if (isConfirming) {
    return (
      <div className="flex space-x-2">
        <button
          className="h-10 px-4 font-semibold rounded-md bg-red-600 text-white disabled:bg-red-400"
          onClick={handleConfirmClick}
          disabled={isLoading}
        >
          {isLoading ? "Отмена участия..." : "Подтвердить"}
        </button>
        <button
          className="h-10 px-4 font-semibold rounded-md border border-slate-300 text-slate-700"
          onClick={handleCancelClick}
          disabled={isLoading}
        >
          Отмена
        </button>
      </div>
    );
  }

  return (
    <button
      className="h-10 px-6 font-semibold rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
      onClick={handleInitialClick}
    >
      Покинуть
    </button>
  );
};
