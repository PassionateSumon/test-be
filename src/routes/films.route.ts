import type { ServerRoute } from "@hapi/hapi";
import { filterComponents, flimActors, flimInfo, listFilms } from "src/controllers/films.controller";

const filmsRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/films",
    handler: listFilms,
  },
  {
    method: "GET",
    path: "/filter-components",
    handler: filterComponents,
  },
  {
    method: "GET",
    path: "/flim-info/{id}",
    handler: flimInfo,
  },
  {
    method: "GET",
    path: "/flim-actors/{id}",
    handler: flimActors,
  },
];

export default filmsRoutes;
