import {Button, Group, Menu, UnstyledButton} from "@mantine/core";
import {signIn, signOut, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import classes from "./Layout.module.css";

export function LogInButton() {
  const router = useRouter();
  const {data: session, status} = useSession();

  if (status === "authenticated") {
    return (
      <Menu>
        <Menu.Target>
          <UnstyledButton className={classes.control}>
            {session?.user?.username}
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => signOut({callbackUrl: "/"})}>
            Sign out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    )
  } else return (
    <Group gap="xs" grow preventGrowOverflow={false}>
      <Button
        variant="light"
        size="compact-md"
        onClick={() => router.push("/signup")}
      >
        Sign up
      </Button>
      <Button
        variant="light"
        size="compact-md"
        onClick={() => signIn(undefined, {callbackUrl: "/profile"})}
      >
        Sign in
      </Button>
    </Group>
  )
}