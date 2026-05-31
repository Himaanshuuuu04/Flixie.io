const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const getToken = () =>
  process.env.NEXT_PUBLIC_TMDB_API_TOKEN || process.env.NEXT_PUBLIC_API_TOKEN;

export const tmdbHeaders = () => ({
  accept: "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const tmdbUrl = (path, query = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${path}`);

  Object.entries(query).forEach(([key, value]) => {
    const isObjectValue = typeof value === "object" && value !== null;

    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !isObjectValue
    ) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

export const tmdbFetchJson = async (path, query = {}) => {
  const response = await fetch(tmdbUrl(path, query), {
    method: "GET",
    headers: tmdbHeaders(),
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}`);
  }

  return response.json();
};
