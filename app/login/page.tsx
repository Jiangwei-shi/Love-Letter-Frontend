'use client';

import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    TextInput,
    PasswordInput,
    Button,
    Alert,
    Text,
    Image, useMantineColorScheme,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { loginThunk } from '@/thunks/authorize-thunk';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

function Login() {
    // State hooks for managing user inputs and error messages
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    // Hooks for dispatching actions and navigating routes
    const dispatch = useAppDispatch();

    // Selector to access current user data from Redux store
    const user = useAppSelector(state => state.currentUser.user);
    // Derived state to determine if the form is valid for submission
    const isFormValid = username.trim() !== '' && password.trim() !== '';

    const { setColorScheme } = useMantineColorScheme();

    useEffect(() => {
        if (user && user._id) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else if (user && user.error === 'User does not exist') {
            // @ts-ignore
            setError('user id or password does not match');
        }
    }, [user]);

    const handleUsernameChange =
        (event: { target: { value: React.SetStateAction<string>; }; }) =>
            setUsername(event.target.value);
    const handlePasswordChange = (event: { target:
            { value: React.SetStateAction<string>; }; }) => setPassword(event.target.value);

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (!isFormValid) return;
        setError(null);
        try {
            await dispatch(loginThunk({ username, password }));
            // eslint-disable-next-line no-console
            console.log("here is user's information", user);
            // eslint-disable-next-line @typescript-eslint/no-shadow
        } catch (error) {
            // @ts-ignore
            setError('User does not exist');
        }
    };
    return (
        <Container
          size="xs"
          p={60}
          my={32}
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
            <div style={{ display: 'flex',
                justifyContent: 'center',
                marginBottom: '30px' }}
            >
                <Image src={' '} alt="Logo" style={{ width: '70%' }} />
            </div>

            <Paper withBorder shadow="sm" p={40} my={30} radius="md">
                {error && (
                    <Alert
                      icon={<IconAlertCircle size="1rem" />}
                      title="Sorry!"
                      color="red"
                    >
                        {error}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <TextInput
                      label="Username"
                      placeholder="you@mantine.dev"
                      required
                      value={username}
                      onChange={handleUsernameChange}
                    />
                    <PasswordInput
                      label="Password"
                      mt={20}
                      placeholder="Your password"
                      required
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <Button fullWidth mt={40} type="submit" disabled={!isFormValid}>
                        log in
                    </Button>
                </form>
            </Paper>
            <Button onClick={() => setColorScheme('light')}>Light</Button>
            <Button onClick={() => setColorScheme('dark')}>Dark</Button>

            <Text size="sm" mt={5}>
                Do not have an account yet?{' '}
            </Text>
        </Container>
    );
}

export default Login;
