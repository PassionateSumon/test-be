import Hapi from "@hapi/hapi";
import { prisma } from "./config/prisma";
import indexRoutes from "./routes/index.route";

const init = async () => {
  const server = Hapi.server({
    port: 3030,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
        additionalHeaders: ["Accept", "Authorization", "If-Not_Matched"],
      },
      state: {
        parse: true,
        failAction: "error",
      },
    },
  });

  try {
    await prisma.$connect();
    console.log("database connected");
  } catch (err: any) {
    console.error("database connection error", err);
  }

  server.route(indexRoutes);

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

process.on("unhandledRejection", () => {
  process.exit(1);
});

init();
