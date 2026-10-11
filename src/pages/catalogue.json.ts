import { films } from '../data/catalogue';
export const GET = () =>
  new Response(
    JSON.stringify(
      films.map(
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
        }),
      ),
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/json' } },
  );
