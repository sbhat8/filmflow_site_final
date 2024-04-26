import {GetServerSidePropsContext} from "next";
import axios from "axios";
import {
  Badge,
  Box,
  Group,
  Image,
  SimpleGrid,
  Spoiler, Stack,
  Text,
  Title
} from "@mantine/core";
import {ReviewInput} from "../../components/ReviewInput";
import {LibraryButton} from "../../components/LibraryButton";


export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const {params} = context;
  const {slug} = params;
  console.log(slug);

  let movie = {} as Movie;
  try {
    const response = await axios({
      method: "get",
      url: process.env.NEXT_PUBLIC_BACKEND_URL + `movie/${slug}/`,
      headers: {},
    });
    movie = response.data;
  } catch (error) {
    return {
      notFound: true
    }
  }

  let reviews = [] as Review[];
  try {
    const response = await axios({
      method: "get",
      url: process.env.NEXT_PUBLIC_BACKEND_URL + `movie/${movie.slug}/reviews/`,
      headers: {},
    });
    reviews = response.data.results;
  } catch (error) {
    console.log(`Review fetch error: ${error.message}`);
  }

  return {
    props: {movie, reviews}
  }
}

export interface MovieProps {
  movie: Movie;
  reviews: Review[];
}

export default function Movie({movie, reviews}: MovieProps) {

  return (
    <Box>
      <Group justify="flex-start" align="flex-start" wrap="nowrap" gap="md" pos="relative">
        <Box miw={250} w={250} mah={353} h={353} pos="relative">
          <Image
            src={movie.image_url}
            alt={movie.title}
            height={353}
            width={250}
            objectFit="cover"
            radius="md"
          />
        </Box>

        <Box>
          <Title
            order={1}
            size="xxx-large"
          >
            {movie.title}
          </Title>
          <Group align="flex-start" gap="xs" my="xs">
            {movie.genres.map((g: Genre, index) => (
              <Badge variant="default" size="lg" radius="sm" key={g.id}>
                {g.name}
              </Badge>
            ))}
          </Group>

          <Text fw={800} fz="xl">
            Description
          </Text>
          <Text fz="lg" mb="xs">
            {movie.description}
          </Text>

          <Text fw={800} fz="xl">
            Information
          </Text>
          <Text fz="lg">
            <Text span inherit fw={600}>Released</Text>: {movie.release_date}
          </Text>
          <Text fz="lg">
            <Text span inherit fw={600}>Duration</Text>: {movie.duration} minutes
          </Text>

        </Box>
      </Group>

      <LibraryButton movieId={movie.id} />

      <Box mt="sm">
        <Title
          order={3}
          size="x-large"
          mb="sm"
        >
          Crew Members
        </Title>
        <Spoiler showLabel="Show more crew" hideLabel="Hide crew" maxHeight={500}>
          <SimpleGrid cols={{base: 2, xs: 3, sm: 4, md: 5, lg: 6, xl: 7}}>
            {movie.crew.map((crew: MovieCrew, index) => (
              <Stack key={crew.crew_member.id} align="center" gap={0}>
                <Box height={300} width={200} pos="relative">
                  {crew.crew_member.image_url ? (
                    <Image
                      src={crew.crew_member.image_url}
                      alt={crew.crew_member.name}
                      height={300}
                      width={200}
                      objectFit="cover"
                      radius="lg"
                    />
                  ) : (
                    <Box
                      mih={300}
                      width="100%"
                      radius="lg"
                      pos="relative"
                    >
                      <Text align="center" fz="xl" pt={150}>
                        No Image
                      </Text>
                    </Box>
                  )}
                </Box>
                <Badge variant="default" mt="xs">
                  {crew.role}
                </Badge>
                <Text fz="lg" ta="center" mt={3} fw={600}>
                  {crew.crew_member.name}
                </Text>
                {crew.character && (
                  <>
                    <Text fz="sm" ta="center" mt={0}>
                      as
                    </Text>
                    <Text fz="lg" ta="center" mt={0}>
                      {crew.character}
                    </Text>
                  </>
                )}
              </Stack>
            ))}
          </SimpleGrid>
        </Spoiler>
      </Box>

      <Box mt="xl">
        <Title
          order={3}
          size="x-large"
          mb="sm"
        >
          Reviews
        </Title>

        <ReviewInput reviews={reviews} movieId={movie.id} />
      </Box>
    </Box>
  )
}