import type { Request, ResponseToolkit } from "@hapi/hapi";
import { statusCodes } from "src/config/constants";
import { prisma } from "src/config/prisma";
import { error, success } from "src/utils/returnFunctions";

// It should list all the films with title, release year, language, length, replacement cost and rating.

/*
      Filter - I should be able to filter films by category, language, release year, length (greater than, less than, equal to) and actor. Multiple filter conditions should work in AND mode.  
  */
export const listFilms = async (req: Request, h: ResponseToolkit) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
    } = req.query as {
      page: number;
      limit: number;
      search?: {
        category?: string;
        language?: string;
        release_year?: number;
        actor?: string;
      };
    };

    // console.log(req.query)

    const s = search;
    // console.log(s)
    var obj = eval("(" + s + ")");
    // console.log(obj)

    let whereClause: any = {
      ...(obj?.category && {
        film_category: { name: obj.category },
      }),
      ...(obj?.language && {
        language_film_language_idTolanguage: { name: obj.language },
      }),
      ...(obj?.release_year && { release_year: obj.release_year }),
      ...(obj?.actor && {
        film_actor: {
          OR: [
            {
              actor: {
                first_name: { contains: obj.actor },
              },
            },
            {
              actor: {
                last_name: { contains: obj.actor },
              },
            },
          ],
        },
      }),
    };

    // console.log(whereClause)
    // console.log(page, limit);

    const [films, total] = await Promise.all([
      prisma.film.findMany({
        skip: Number((page - 1) * limit),
        take: Number(limit),
        where: whereClause,
        select: {
          film_id: true,
          title: true,
          release_year: true,
          language_film_language_idTolanguage: {
            select: {
              name: true,
            },
          },
          length: true,
          replacement_cost: true,
          rating: true,
          film_actor: {
            select: {
              actor: {
                select: {
                  first_name: true,
                  last_name: true,
                },
              },
            },
          },
          film_category: {
            select: {
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.film.count({ where: whereClause }),
    ]);

    // console.log(JSON.stringify(films))

    return success(
      { films, total, totalPages: Math.ceil(total / limit) },
      "Fetched successfully",
      statusCodes.SUCCESS
    )(h);
  } catch (err: any) {
    // console.error("error", err);
    return error(
      null,
      err.message || "Internal server error in listfilms!",
      statusCodes.SERVER_ERROR
    )(h);
  }
};

export const filterComponents = async (req: Request, h: ResponseToolkit) => {
  try {
    const [category, actor, language] = await Promise.all([
      prisma.category.findMany({
        select: {
          category_id: true,
          name: true,
        },
      }),

      prisma.actor.findMany({
        select: {
          actor_id: true,
          first_name: true,
          last_name: true,
        },
      }),

      prisma.language.findMany({
        select: {
          language_id: true,
          name: true,
        },
      }),
    ]);

    const result = {
      category,
      actor,
      language,
    };

    return success(
      result,
      "Fetched filter components successfully",
      statusCodes.SUCCESS
    )(h);
  } catch (err: any) {
    console.error("Internal error in filter-components!", err);
    return error(
      null,
      err.message || "Internal error in filter-components!",
      statusCodes.SERVER_ERROR
    )(h);
  }
};

export const flimInfo = async (req: Request, h: ResponseToolkit) => {
  try {
    const { id } = req.params;
    // console.log(id)
    const filmInfo = await prisma.film.findUnique({
      where: {
        film_id: Number(id),
      },
      select: {
        title: true,
        release_year: true,
        length: true,
        replacement_cost: true,
        rating: true,
      },
    });

    return success(
      filmInfo,
      "Fetched film info successfully",
      statusCodes.SUCCESS
    )(h);
  } catch (err: any) {
    return error(
      null,
      err.message || "Internal server error in flimInfo!",
      statusCodes.SERVER_ERROR
    )(h);
  }
};

export const flimActors = async (req: Request, h: ResponseToolkit) => {
  try {
    const { id } = req.params;
    const flimDetails = await prisma.film.findUnique({
      where: {
        film_id: Number(id),
      },
      include: {
        film_actor: {
          include: {
            actor: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    }) as any;
    // console.log(flimActors)
    console.log(flimDetails.film_actor);

    return success(
      {flimActors: flimDetails.film_actor},
      "Fetched flim actors successfully",
      statusCodes.SUCCESS
    )(h);
  } catch (err: any) {
    return error(
      null,
      err.message || "Internal server error in flimActors!",
      statusCodes.SERVER_ERROR
    )(h);
  }
};
