import type { ServerRoute } from "@hapi/hapi";
import filmsRoutes from "./films.route";
import rentalRoutes from "./rental.route";
import storeRoutes from "./store.route";

const indexRoutes: ServerRoute[] = [
  ...filmsRoutes,
  ...rentalRoutes,
  ...storeRoutes,
];

export default indexRoutes;
