import Link from "next/link";

export const CreateEventButton = () => {
  return (
    <Link
      href="/events/create"
      className="rounded-md bg-green-500 px-5 py-3 text-sm font-semibold text-white hover:bg-green-400 focus-visible:outline"
    >
      Создать событие
    </Link>
  );
};

type EditEventButtonProps = {
  id: number;
};

export const EditEventButton = ({ id }: EditEventButtonProps) => {
  return (
    <Link
      href={`/events/${id}/edit`}
      className="rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-500 focus-visible:outline"
    >
      Редактировать событие
    </Link>
  );
};
