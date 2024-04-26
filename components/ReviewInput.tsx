import axios from "axios";
import {Avatar, Box, Button, Center, Group, LoadingOverlay, Overlay, Rating, Text, Textarea} from "@mantine/core";
import {hasLength, isNotEmpty, useForm} from "@mantine/form";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";

export interface ReviewInputProps {
  reviews: Review[];
  movieId: number;
}

export interface ReviewFormValues {
  text: string;
  rating: number;
}

export function ReviewInput({reviews: reviewsProp, movieId}: ReviewInputProps) {
  const {data: session, status} = useSession();
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(reviewsProp);

  const form = useForm<ReviewFormValues>({
    initialValues: {
      text: "",
      rating: 0
    },
    validate: {
      text: hasLength({min: 1, max: 500}, "Review must be between 1 and 500 characters"),
    }
  })

  const submitReview = async ({text, rating}: ReviewFormValues) => {
    setLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: process.env.NEXT_PUBLIC_BACKEND_URL + `movie/${movieId}/reviews/submit/`,
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        },
        data: {
          text: text,
          rating: rating,
        }
      });
      const newReview = {
        username: session?.user?.username,
        ...response.data,
      }
      setReviews([newReview, ...reviews]);
      form.reset();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(`Review submit error: ${error.message}`);
    }
  }

  return (
    <Box pos="relative">
      <LoadingOverlay visible={status === "loading" || loading}/>
      <Overlay hidden={status === "authenticated"}/>
      <form onSubmit={form.onSubmit(submitReview)}>
        <Textarea
          label="Your review"
          placeholder="Write your review"
          size="md"
          {...form.getInputProps("text")}
        />
        <Center>
          <Rating size="xl" my="sm" {...form.getInputProps("rating")} />
        </Center>
        <Button fullWidth variant="default" type="submit">Submit</Button>
      </form>

      {reviews.map((review: Review, index) => (
        <Box key={review.id} my="md">
          <Group>
            <Avatar radius="xl"/>
            <Box>
              <Group>
                <Text size="lg">{review.username}</Text>
                <Rating size="sm" value={review.rating} readOnly />
              </Group>
              <Text size="sm" c="dimmed">
                {new Date(Date.parse(review.created)).toLocaleDateString()}
              </Text>
            </Box>
          </Group>
          <Text pl={54} pt="xs" size="md">
            {review.text}
          </Text>
        </Box>
      ))}
    </Box>
  )
}