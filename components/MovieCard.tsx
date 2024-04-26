import {Badge, Card, Group, Image, Menu, Select, Text} from "@mantine/core";
import {motion} from "framer-motion";
import classes from "./MovieCard.module.css";
import Link from "next/link";
import {useState} from "react";
import {useSession} from "next-auth/react";
import axios from "axios";

export interface MovieCardProps {
  title: string;
  image_url: string;
  genres: Genre[];
  slug: string;
  entryId?: number;
  entryStatus?: string;
  removeEntryFromList?: (entryId: number) => void;
}

export function MovieCard({
                            title,
                            image_url,
                            genres,
                            slug,
                            entryId,
                            entryStatus: entryStatusProp,
                            removeEntryFromList,
                          }: MovieCardProps) {
  const {data: session} = useSession();
  const [entryStatus, setEntryStatus] = useState(entryStatusProp);

  const changeStatus = async (status: string) => {
    if (status === "remove") {
      try {
        await axios({
          method: "DELETE",
          url: process.env.NEXT_PUBLIC_BACKEND_URL + `library/${entryId}/delete/`,
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          },
        });
        setEntryStatus(undefined);
        removeEntryFromList(entryId);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      try {
        await axios({
          method: "PUT",
          url: process.env.NEXT_PUBLIC_BACKEND_URL + `library/${entryId}/update/`,
          headers: {
            Authorization: `Bearer ${session?.access_token}`
          },
          data: {
            status: status,
          },
        });
        setEntryStatus(status);
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  return (
    <motion.div initial={{y: 0}} whileHover={{y: -5}}>
      <Card className={classes.card}>
        <Card.Section className={classes.section}>
          <Link href={`/movie/${slug}`} className={classes.link}>
            <Image
              src={image_url}
              alt={title}
              h={270}
              width={500}
              objectFit="cover"
              radius="md"
            />
          </Link>
        </Card.Section>

        <Group className={classes.group}>
          {genres.slice(0, 2).map((g: Genre) => (
            <Badge className={classes.badge} variant="default" key={g.id}>
              {g.name}
            </Badge>
          ))}
        </Group>

        <Text
          mt="xs"
          component={Link}
          href={`/movie/${slug}`}
          fw={700}
          className={classes.title}
          lineClamp={2}
        >
          {title}
        </Text>

        {entryStatusProp && entryId && removeEntryFromList && (
          <Select
            mt="xs"
            data={[
              {label: "Plan to watch", value: "plan_to_watch"},
              {label: "Watching", value: "watching"},
              {label: "Completed", value: "completed"},
              {label: "Dropped", value: "dropped"},
              {label: "On hold", value: "on_hold"},
              {label: "Remove", value: "remove"},
            ]}
            radius="md"
            value={entryStatus}
            onChange={changeStatus}
          />
        )}
      </Card>
    </motion.div>
  )
}