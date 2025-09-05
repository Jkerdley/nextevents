import * as trpcNext from "@trpc/next";
import { appRouter } from "@/server/routes";

export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext: () => ({}),
});
