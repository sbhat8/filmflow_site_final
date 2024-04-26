import {AppShell, Burger, Button, Container, Group, Text, Title, UnstyledButton} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import classes from './Layout.module.css';
import {signIn, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {LogInButton} from "./LogInButton";
import Link from "next/link";
import {ColorSchemeToggle} from "./ColorSchemeToggle";

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({children}: LayoutProps) {
  const [opened, {toggle}] = useDisclosure();

  return (
    <AppShell
      header={{height: 60}}
      navbar={{width: 300, breakpoint: 'sm', collapsed: {desktop: true, mobile: !opened}}}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
          <Group justify="space-between" style={{flex: 1}}>
            <Group component={Link} href="/" gap={4} align="center" style={{textDecoration: "none", color: "inherit"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   className="icon icon-tabler icons-tabler-outline icon-tabler-ripple">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M3 7c3 -2 6 -2 9 0s6 2 9 0"/>
                <path d="M3 17c3 -2 6 -2 9 0s6 2 9 0"/>
                <path d="M3 12c3 -2 6 -2 9 0s6 2 9 0"/>
              </svg>
              <Text fw={1000} fz={24} gradient={{from: 'teal', to: 'cyan', deg: 270}}>FilmFlow</Text>
            </Group>
            <Group ml="xl" gap={0} visibleFrom="sm">
              <UnstyledButton component={Link} href="/" className={classes.control}>Home</UnstyledButton>
              <UnstyledButton component={Link} href="/library" className={classes.control}>Library</UnstyledButton>
              <LogInButton/>
              <ColorSchemeToggle/>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <UnstyledButton component={Link} href="/" className={classes.control}>Home</UnstyledButton>
        <UnstyledButton component={Link} href="/library" className={classes.control}>Library</UnstyledButton>
        <LogInButton/>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="100rem" mt={10} p={0}>
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
