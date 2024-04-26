import axios from "axios";
import {useEffect, useState} from "react";
import {
  Box,
  Card,
  Center,
  Chip,
  Group,
  Image,
  Loader,
  Pagination,
  Select,
  SimpleGrid,
  TextInput,
  Title
} from "@mantine/core";
import {MovieCard} from "../components/MovieCard";
import {AnimatePresence, motion} from "framer-motion";
import {useDebouncedValue, usePagination} from "@mantine/hooks";
import {Recommendations} from "../components/Recommendations";

const MOVIE_PER_PAGE = 24;

export default function Search() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalMovies, setTotalMovies] = useState(0);
  const pagination = usePagination({total: Math.ceil(totalMovies/MOVIE_PER_PAGE), initialPage: 1});
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 400);
  const [ordering, setOrdering] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genreFilter, setGenreFilter] = useState<number | undefined>(undefined);

  const search = async () => {
    setLoading(true);
    try {
      const response = await axios({
        method: "GET",
        url: process.env.NEXT_PUBLIC_BACKEND_URL + "movie/",
        headers: {},
        params: {
          page: pagination.active,
          search: debouncedQuery,
          ordering: ordering,
          genre: genreFilter ? genreFilter : undefined,
        }
      });
      setMovies(response.data.results);
      setTotalMovies(response.data.count);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  }

  const getGenres = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: process.env.NEXT_PUBLIC_BACKEND_URL + "genre/",
        headers: {}
      });
      setGenres(response.data.results);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    search();
  }, [pagination.active, debouncedQuery, ordering, genreFilter]);

  useEffect(() => {
    getGenres();
  }, []);

  return (
    <Box>
      <Recommendations />
      <Title order={2} mt="md">Search</Title>
      <SimpleGrid cols={{base: 1, sm: 2}} spacing={{base: 0, sm: "md"}}>
        <TextInput
          label="Search query"
          placeholder="Search movies"
          size="md"
          mb="xs"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <Select
          data={[
            {label: "Default", value: ""},
            {label: "Title", value: "title"},
            {label: "Duration", value: "duration"},
            {label: "Release date", value: "release_date"},
          ]}
          label="Order by"
          placeholder="Order by"
          size="md"
          mb="xs"
          value={ordering}
          onChange={setOrdering}
        />
      </SimpleGrid>
      <Chip.Group multiple={false} value={genreFilter} onChange={setGenreFilter}>
        <Group gap={3} mb="xs">
          <Chip radius="sm" size="md" value={undefined}>All</Chip>
          {genres.map((genre) => (
            <Chip key={genre.id} value={genre.id} radius="sm" size="md" checked={genreFilter == genre.id}>{genre.name}</Chip>
          ))}
        </Group>
      </Chip.Group>
      {!loading ? (
        <Box>
          <SimpleGrid cols={{base: 2, xs: 3, sm: 4, md: 5, lg: 6, xl: 7}}>
            <AnimatePresence>
              {movies.map((movie, index) => (
                <motion.div key={movie.id} initial={{opacity: 0}} animate={{opacity: 1}} layout>
                  <MovieCard
                    title={movie.title}
                    image_url={movie.image_url}
                    genres={movie.genres}
                    slug={movie.slug}
                    id={movie.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </SimpleGrid>
          <Center>
            <Pagination mt="md" onChange={pagination.setPage} total={Math.ceil(totalMovies/MOVIE_PER_PAGE)} siblings={3} value={pagination.active} defaultValue={1}/>
          </Center>
        </Box>
      ) : (
        <Center mt="md"><Loader size="md" type="bars"/></Center>
      )}
    </Box>
  )
}