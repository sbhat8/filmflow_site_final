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
  Stack,
  TextInput
} from "@mantine/core";
import {MovieCard} from "../../components/MovieCard";
import {AnimatePresence, motion} from "framer-motion";
import {useDebouncedValue, usePagination} from "@mantine/hooks";
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";

const MOVIE_PER_PAGE = 24;

export default function Library() {
  const router = useRouter();
  const {data: session, status} = useSession();
  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const pagination = usePagination({total: Math.ceil(totalEntries / MOVIE_PER_PAGE), initialPage: 1});
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 400);
  const [entryStatus, setEntryStatus] = useState('');
  const [ordering, setOrdering] = useState("");

  const search = async () => {
    setLoading(true);
    if (!session) return;
    try {
      const response = await axios({
        method: "GET",
        url: process.env.NEXT_PUBLIC_BACKEND_URL + "library/",
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        },
        params: {
          page: pagination.active,
          search: debouncedQuery,
          ordering: ordering,
          status: entryStatus,
        }
      });
      setEntries(response.data.results);
      setTotalEntries(response.data.count);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  }

  const removeEntryFromList = async (entryId: number) => {
    setEntries(entries.filter(entry => entry.id !== entryId));
  }

  useEffect(() => {
    search();
  }, [pagination.active, debouncedQuery, status, ordering, entryStatus]);

  useEffect(() => {
    pagination.setPage(1);
  }, [entryStatus, ordering, debouncedQuery]);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(undefined, {callbackUrl: router.pathname})
    }
  }, [status]);

  if (status === "loading") {
    return (
      <Center><Loader size="lg" type="bars" /></Center>
    )
  }

  return (
    <Box>
      <SimpleGrid cols={{base: 1, sm: 2}} spacing={{base: 0, sm: "md"}}>
        <TextInput
          label="Search query"
          placeholder="Search library"
          size="md"
          mb="xs"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
        <Select
          data={[
            {label: "Default", value: ""},
            {label: "Title", value: "movie__title"},
            {label: "Duration", value: "movie__duration"},
            {label: "Release date", value: "movie__release_date"},
          ]}
          label="Order by"
          placeholder="Order by"
          size="md"
          mb="xs"
          value={ordering}
          onChange={setOrdering}
        />
      </SimpleGrid>
      <Chip.Group multiple={false} value={entryStatus} onChange={setEntryStatus}>
        <Group gap={3} mb="xs">
          <Chip value="" radius="sm" size="md">All</Chip>
          <Chip value="watching" radius="sm" size="md">Watching</Chip>
          <Chip value="completed" radius="sm" size="md">Completed</Chip>
          <Chip value="plan_to_watch" radius="sm" size="md">Plan to watch</Chip>
          <Chip value="on_hold" radius="sm" size="md">On hold</Chip>
          <Chip value="dropped" radius="sm" size="md">Dropped</Chip>
        </Group>
      </Chip.Group>
      {!loading ? (
        <Box>
          <SimpleGrid cols={{base: 2, xs: 3, sm: 4, md: 5, lg: 6, xl: 7}}>
            <AnimatePresence>
              {entries.map((entry, index) => (
                <motion.div key={entry.id} initial={{opacity: 0}} animate={{opacity: 1}} layout>
                  <MovieCard
                    title={entry.movie.title}
                    image_url={entry.movie.image_url}
                    genres={entry.movie.genres}
                    slug={entry.movie.slug}
                    entryId={entry.id}
                    entryStatus={entry.status}
                    removeEntryFromList={removeEntryFromList}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </SimpleGrid>
          <Center>
            <Pagination mt="md" onChange={pagination.setPage} total={Math.ceil(totalEntries/MOVIE_PER_PAGE)} siblings={3} value={pagination.active} defaultValue={1}/>
          </Center>
        </Box>
      ) : (
        <Center mt="md"><Loader size="md" type="bars"/></Center>
      )}
    </Box>
  )
}