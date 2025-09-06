import { CreateEventForm } from "@/features/create-event";
import { CreateEventSchema, trpc } from "@/shared/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function EditEvent() {
  const router = useRouter();
  const utils = trpc.useContext();
  const session = useSession();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const eventId = Number(router.query.id);
  const { data: event, isError } = trpc.event.findUnique.useQuery(
    { id: eventId },
    { enabled: !!router.query.id && router.query.id !== 'undefined' }
  );

  useEffect(() => {
    if (event && session.data?.user) {
      // Проверяем, является ли текущий пользователь автором события
      setIsAuthorized(event.authorId === session.data.user.id);
      setIsLoading(false);
    } else if (event || session.status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [event, session]);

  const { mutate, isLoading: isSaving } = trpc.event.update.useMutation({
    onSuccess: (data) => {
      // Обновляем кэш
      utils.event.findUnique.setData({ id: data.id }, (prev) => ({
        ...data,
        participations: prev?.participations ?? [],
      }));
      
      // Показываем уведомление об успешном обновлении (можно реализовать через toast)
      // Перенаправляем на страницу события
      router.push(`/events/${data.id}`);
    },
    onError: (error) => {
      console.error('Ошибка при обновлении события:', error);
      // Здесь можно добавить отображение ошибки пользователю
    }
  });

  const handleSubmit = (data: CreateEventSchema) => {
    if (event) {
      mutate({ id: event.id, data });
    }
  };

  // Обработка состояний загрузки и ошибок
  if (isLoading) {
    return <div className="text-center py-10">Загрузка...</div>;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Ошибка при загрузке события</div>;
  }

  if (!event) {
    return <div className="text-center py-10">Событие не найдено</div>;
  }

  if (isAuthorized === false) {
    return (
      <div className="text-center py-10 text-red-500">
        У вас нет прав для редактирования этого события
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Редактирование события</h1>
      <CreateEventForm
        onSubmit={handleSubmit}
        onCancel={router.back}
        defaultValues={event}
        okText={isSaving ? "Сохранение..." : "Обновить"}
      />
    </div>
  );
}
