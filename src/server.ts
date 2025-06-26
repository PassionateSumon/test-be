import Hapi from "@hapi/hapi";
import { prisma } from "./config/prisma";
import indexRoutes from "./routes/index.route";

const init = async () => {
  const server = Hapi.server({
    port: 3030,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
        additionalHeaders: ["Accept", "Authorization", "If-Not-Matched"],
      },
      state: {
        parse: true,
        failAction: "error",
      },
    },
  });

  try {
    await prisma.$connect();
    console.log("database connected - server.ts:23");
  } catch (err: any) {
    console.error("database connection error - server.ts:25", err);
  }

  server.route(indexRoutes);

  await server.start();
  console.log(`Server is running on ${server.info.uri} - server.ts:31`);
};

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("unhandledRejection", async () => {
  await prisma.$disconnect();
  process.exit(1);
});

init();
