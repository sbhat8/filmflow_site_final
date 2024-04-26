import '@mantine/carousel/styles.css';
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Paper, Title, Text, useMantineTheme, rem} from "@mantine/core";
import classes from "./Recommendations.module.css";
import {useMediaQuery} from "@mantine/hooks";
import {Carousel} from "@mantine/carousel";
import Link from "next/link";

interface CardProps {
  image: string;
  title: string;
  category: string;
}

function Card({image, title, category}: CardProps) {
  return (
    <Paper
      component={Link}
      href={`/movie/${title}`}
      shadow="md"
      p="xl"
      radius="md"
      style={{backgroundImage: `url(${image})`}}
      className={classes.card}
    >
      <div>
        <Text className={classes.category} size="xs">
          {category}
        </Text>
        <Title order={3} className={classes.title}>
          {title}
        </Title>
      </div>
      <Button
        href={`/movie/${title}`}
        component={Link}
        variant="white"
        color="dark"
      >
        More details
      </Button>
    </Paper>
  );
}

export function Recommendations() {
  const {data: session, status} = useSession();
  const [movies, setMovies] = useState<Movie[]>([]);
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const getRecommendations = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: process.env.NEXT_PUBLIC_BACKEND_URL + "recommendations/",
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        },
      });
      setMovies(response.data)
    } catch (error) {
      console.log(`Recommendations error: ${error.message}`);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      getRecommendations();
    }
  }, [status]);

  if (status !== "authenticated") {
    return (
      <></>
    )
  } else return (
    <>
      <Title order={2}>Recommendations</Title>
      <Text mb="xs">Personalized based on your library and ratings.</Text>
      <Carousel
        slideSize={{base: '100%', sm: '50%'}}
        slideGap={{base: rem(2), sm: 'xl'}}
        align="start"
        slidesToScroll={mobile ? 1 : 2}
        loop
      >
        {movies.map((movie) => (
          <Carousel.Slide key={movie.id}>
            <Card image={movie.image_url} title={movie.title} category={movie.genres.at(0).name}/>
          </Carousel.Slide>
        ))}
      </Carousel>
    </>
  )
}