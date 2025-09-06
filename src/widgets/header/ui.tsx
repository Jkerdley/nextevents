import { CreateEventButton } from "@/features/create-event";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export const Header = () => {
  const session = useSession();

  return (
    <header>
      <nav className="flex w-auto justify-around items-center p-10">
        <section className="flex flex-1">
          <Link href="/">
            <Image src="/logo.svg" alt="Logo" height={32} width={160} />
          </Link>
        </section>
        <section className="flex justify-end">
          {session.status === "authenticated" ? (
            <button className="mr-4" onClick={() => signOut()}>
              {session.data.user.name} &larr;
            </button>
          ) : (
            <Link href="/api/auth/signin">Войти &rarr;</Link>
          )}
          {session.status === "authenticated" && <CreateEventButton />}
        </section>
      </nav>
    </header>
  );
};
