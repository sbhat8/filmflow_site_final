import {useState} from "react";
import {useSession} from "next-auth/react";
import axios from "axios";
import {Box, Button, Loader} from "@mantine/core";

export default function Profile() {
  const {data: session, status} = useSession({required: true});
  const [response, setResponse] = useState("{}");

  const getUserDetails = async (useToken: boolean) => {
    try {
      const response = await axios({
        method: "get",
        url: process.env.NEXT_PUBLIC_BACKEND_URL + "auth/user/",
        headers: useToken ? {Authorization: "Bearer " + session?.access_token} : {},
      });
      setResponse(JSON.stringify(response.data));
    } catch (error) {
      setResponse(error.message);
    }
  };

  if (status == "loading") {
    return <Loader size="lg"/>;
  }

  return (
    <Box>
      <Box mt={50} textAlign="center">
        <Box>
          <Box>Get user details:</Box>
          <Box>
            <Button onClick={() => getUserDetails(false)}>Without token</Button>
            <Button onClick={() => getUserDetails(true)}>With token</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}