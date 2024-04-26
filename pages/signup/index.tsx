import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Container,
  Group,
  LoadingOverlay,
  PasswordInput, Text,
  TextInput,
  Title
} from "@mantine/core";
import {hasLength, matchesField, useForm} from "@mantine/form";
import axios from "axios";
import {useState} from "react";
import {signIn} from "next-auth/react";

export interface SignUpFormValues {
  username: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<SignUpFormValues>({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      username: hasLength({min: 3, max: 12}, "Username must be between 3 and 12 characters."),
      password: hasLength({min: 5, max: 24}, "Password must be between 5 and 24 characters."),
      confirmPassword: matchesField("password", "Passwords do not match"),
    },
  });

  const signUp = async ({username, password, confirmPassword}: SignUpFormValues) => {
    setLoading(true);
    try {
      await axios({
        method: "POST",
        url: process.env.NEXT_PUBLIC_BACKEND_URL + "auth/register/",
        headers: {},
        data: {
          username: username,
          password1: password,
          password2: confirmPassword,
        }
      });
      setLoading(false);
      await signIn(undefined, {callbackUrl: "/profile"})
    } catch (error) {
      setLoading(false);
      setError(error.message);
      console.log(error.message);
    }
  }

  return (
    <>
      <Title
        order={1}
        fw={1000}
        ta="center"
      >
        Sign Up
      </Title>

      <Container p={0} maw={524}>
        <form onSubmit={form.onSubmit(signUp)}>
          <Box pos="relative">
            <LoadingOverlay visible={loading} />
            <TextInput label="Username" placeholder="Your username" required {...form.getInputProps("username")} />
            <PasswordInput label="Password" placeholder="Your password" required mt="md" {...form.getInputProps("password")} />
            <PasswordInput label="Confirm password" placeholder="Your password again" required mt="md" {...form.getInputProps("confirmPassword")} />
            <Text c="red" mt="xs">{error}</Text>
            <Button fullWidth mt="xl" type="submit">
              Sign up
            </Button>
          </Box>
        </form>
      </Container>
    </>
  )
}