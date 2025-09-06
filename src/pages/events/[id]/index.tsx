import { EventDetail } from "@/entities/event";
import { EditEventButton } from "@/features/create-event";
import { trpc } from "@/shared/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Event() {
  const router = useRouter();
  const session = useSession();
  const [isOwner, setIsOwner] = useState<boolean | null>(null);

  // Получаем ID события из URL и проверяем, что это число
  const eventId = router.query.id ? Number(router.query.id) : undefined;
  const isValidId = !isNaN(Number(eventId)) && eventId !== undefined;

  // Запрос данных события только если ID валидный
  const { data: event, isLoading, isError } = trpc.event.findUnique.useQuery(
    { id: eventId as number },
    { enabled: isValidId, retry: 1 }
  );

  // Определяем, является ли текущий пользователь владельцем события
  useEffect(() => {
    if (event && session.data?.user) {
      setIsOwner(event.authorId === session.data.user.id);
    }
  }, [event, session]);

  // Обработка состояний загрузки и ошибок
  if (!isValidId) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-red-500 mb-4">Некорректный ID события</h2>
        <Link href="/" className="text-blue-500 hover:underline">Вернуться на главную</Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="mb-4 text-gray-600">Загрузка информации о событии...</div>
          <div className="w-8 h-8 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-red-500 mb-4">Ошибка при загрузке события</h2>
        <p className="mb-4">Не удалось загрузить информацию о событии</p>
        <Link href="/" className="text-blue-500 hover:underline">Вернуться на главную</Link>
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-amber-500 mb-4">Требуется авторизация</h2>
        <p className="mb-4">Для просмотра информации о событии необходимо войти в систему</p>
        <Link href="/" className="text-blue-500 hover:underline">Вернуться на главную</Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Событие не найдено</h2>
        <p className="mb-4">Запрашиваемое событие не существует или было удалено</p>
        <Link href="/" className="text-blue-500 hover:underline">Вернуться на главную</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-blue-500 hover:underline flex items-center">
          <span className="mr-1">←</span> Назад к списку событий
        </Link>
      </div>
      
      <EventDetail
        {...event}
        action={
          isOwner && (
            <EditEventButton id={event.id} />
          )
        }
      />
    </div>
  );
}
