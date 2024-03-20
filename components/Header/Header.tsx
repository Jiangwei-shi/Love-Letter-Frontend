'use client';

import {
    Group,
    Button,
    Box,
    Burger,
    Drawer,
    ScrollArea,
    rem, Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import classes from './Header.module.css';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { deleteUserThunk, logoutThunk } from '@/thunks/authorize-thunk';

export function Header() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.currentUser);
    const router = useRouter();

    useEffect(() => {
        // Check if user is null on component mount
        if (!user) {
            // Redirect to /welcome if user is null
            router.push('/welcome');
        }
    }, [user, router]);

    const handleLogoutClick = () => {
        dispatch(logoutThunk())
            .then(() => {
                localStorage.removeItem('currentUser');
                router.push('/welcome');
            });
    };
    const handleDeleteAccountClick = () => {
        if (user) {
            // @ts-ignore
            dispatch(deleteUserThunk(user._id))
                .then(() => {
                    localStorage.removeItem('currentUser');
                    router.push('/welcome');
                })
                .catch(error => {
                    // Handle error (e.g., log or display error message)
                    console.error('Error deleting account:', error);
                });
        } else {
            // Handle the case when user is null (e.g., show error or redirect)
        }
    };
    return (
        <Box>
            <header className={classes.header}>
                <Group justify="flex-end" h="100%">
                    <Group visibleFrom="xs">
                        <Button onClick={handleLogoutClick}>Log out</Button>
                        <Button color="#C91A25" onClick={handleDeleteAccountClick}>Delete Account</Button>
                    </Group>
                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="xs" />
                </Group>
            </header>

            <Drawer
              opened={drawerOpened}
              onClose={closeDrawer}
              size="50%"
              padding="md"
              title="Navigation"
              hiddenFrom="sm"
              zIndex={1000000}
              position="right"
            >
                <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
                    <Stack justify="space-around" pb="xl" px="md">
                        <Button>Log out</Button>
                        <Button color="#C91A25" onClick={handleDeleteAccountClick}>Delete Account</Button>
                    </Stack>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}
