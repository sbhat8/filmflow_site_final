import {useSession} from "next-auth/react";
import {Button} from "@mantine/core";
import {useEffect, useState} from "react";
import axios from "axios";

export interface LibraryButtonProps {
  movieId: number;
}

export function LibraryButton({movieId, isInLibrary}: LibraryButtonProps) {
  const {data: session, status} = useSession();
  const [loading, setLoading] = useState(true);
  const [entryStatus, setEntryStatus] = useState<string | null>(null);

  const addToLibrary = async () => {
    setLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: process.env.NEXT_PUBLIC_BACKEND_URL + "library/add/",
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        },
        data: {
          movie: movieId,
        }
      });
      setEntryStatus(response.data.status)
      setLoading(false);
    } catch (error) {
      console.log(`Library add error: ${error.message}`);
      setLoading(false);
    }
  }

  const getEntryStatus = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: process.env.NEXT_PUBLIC_BACKEND_URL + "library/entry/",
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        },
        params: {
          movie: movieId
        }
      });
      setLoading(false);
      setEntryStatus(response.data.status)
    } catch (error) {
      setLoading(false);
      if (error.response.status === 404) {
        setEntryStatus(null);
        return;
      } else console.log(`Library status error: ${error.message}`);
    }
  }

  useEffect(() => {
    if (session) {
      getEntryStatus();
    } else {
      setEntryStatus(null);
      setLoading(false);
    }
  }, [status])

  return (
    <Button
      size="lg"
      mt="md"
      variant="default"
      loading={loading || status === "loading"}
      disabled={entryStatus !== null || status === "unauthenticated"}
      onClick={addToLibrary}
    >
      {entryStatus !== null ? "In library" : "Add to library"}
    </Button>
  )
}