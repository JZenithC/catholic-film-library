import { publicFilms } from '../data/catalogue';
// Grey-area films are included; `grey` is null for recommended films.
export const GET = () =>
  new Response(
    JSON.stringify(
      publicFilms.map(
        ({
          id,
          slug,
          title,
          originalTitle,
          alternateTitles,
          year,
          format,
          directors,
          countries,
          languages,
          subjects,
          collections,
          historicalPeriod,
          reviewed,
          grey,
        }) => ({
          id,
          slug,
          title,
          originalTitle,
          alternateTitles,
          year,
          format,
          directors,
          countries,
          languages,
          subjects,
          collections,
          historicalPeriod,
          reviewed,
          grey,
        }),
      ),
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/json' } },
  );
