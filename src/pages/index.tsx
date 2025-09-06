import { EventCard } from "@/entities/event";
import { JoinEventButton } from "@/features/join-event";
import { LeaveEventButton } from "@/features/leave-event";
import { trpc } from "@/shared/api";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  const { data: events, refetch, isLoading } = trpc.event.findMany.useQuery();

  // Подсчет количества событий, в которых участвует пользователь
  const joinedEventsCount = events?.filter(event => event.isJoined).length || 0;
  
  if (isLoading) {
    return <div className="text-center py-10">Загрузка событий...</div>;
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-4">Нет доступных событий</h2>
        <p className="text-gray-600">Скоро здесь появятся интересные мероприятия</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Доступные события</h1>
        {session.status === "authenticated" && (
          <p className="text-gray-600">
            Вы участвуете в {joinedEventsCount} из {events.length} событий
          </p>
        )}
      </div>
      
      <ul className="space-y-8">
        {events.map((event) => {
          const Action = event.isJoined ? LeaveEventButton : JoinEventButton;

          return (
            <li key={event.id}>
              <EventCard
                {...event}
                action={
                  session.status === "authenticated" && (
                    <Action eventId={event.id} onSuccess={refetch} />
                  )
                }
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
