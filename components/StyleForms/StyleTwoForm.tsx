'use client';

import { Modal, Group, Button, Container, Title, Grid, Avatar, FileInput, Flex, Image } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import firebase from '../../firebaseConfig';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { updateUserThunk } from '@/thunks/authorize-thunk';

export default function StyleOneForm() {
    const [firstPicture, setFirstPicture] = useState(null);
    const [secondPicture, setSecondPicture] = useState(null);
    const [thirdPicture, setThirdPicture] = useState(null);
    const [firstPictureViewerOpen, setFirstPictureViewerOpen] = useState(false);
    const [secondPictureViewerOpen, setSecondPictureViewerOpen] = useState(false);
    const [thirdPictureViewerOpen, setThirdPictureViewerOpen] = useState(false);
    const [FirstPictureView, setFirstPictureView] = useState(null);
    const [SecondPictureView, setSecondPictureView] = useState(null);
    const [ThirdPictureView, setThirdPictureView] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(false);
    const user = useAppSelector(state => state.currentUser);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const form = useForm({
        initialValues: {
            // @ts-ignore
            // eslint-disable-next-line max-len
            styleTwoData: user?.styleTwoData ? { ...user.styleTwoData } :
                {
                    firstPicture: 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/avatars%2FOriginal%20Xayah.jpg?alt=media&token=f2d151c6-b028-4077-8c24-4133c0fcc611',
                    secondPicture: 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/avatars%2FStar%20Guardian%20Xayah.jpg?alt=media&token=1456588f-6fba-4a4a-beba-14d5edd7ed70',
                    thirdPicture: 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/avatars%2FSweetheart%20Xayah.jpg?alt=media&token=f330abcf-ffb8-4895-b158-2f03689f3764',
                },
        },
    });

    useEffect(() => {
        setFirstPictureView(form.values.styleTwoData.firstPicture);
        setSecondPictureView(form.values.styleTwoData.secondPicture);
        setThirdPictureView(form.values.styleTwoData.thirdPicture);
    }, [user]);
    const handleFirstPictureChange = (file: any) => {
        setFirstPicture(file);
    };
    const handleSecondPictureChange = (file: any) => {
        setSecondPicture(file);
    };
    const handleThirdPictureChange = (file: any) => {
        setThirdPicture(file);
    };
    const handleFirstPictureClick = () => {
        setFirstPictureViewerOpen(true);
    };
    const handleSecondPictureClick = () => {
        setSecondPictureViewerOpen(true);
    };
    const handleThirdPictureClick = () => {
        setThirdPictureViewerOpen(true);
    };
    const lookWebsite = () => {
        // @ts-ignore
        router.push(`/styleSelect/styleTwo/${user._id}`);
    };
    const uploadFirstPicture = async () => {
        if (!firstPicture) return form.values.styleTwoData.firstPicture;
        const storage = getStorage(firebase);
        // @ts-ignore
        const storageRef = ref(storage, `avatars/${firstPicture.name}`);
        await uploadBytes(storageRef, firstPicture);
        return getDownloadURL(storageRef);
    };
    const uploadSecondPicture = async () => {
        if (!secondPicture) return form.values.styleTwoData.secondPicture;
        const storage = getStorage(firebase);
        // @ts-ignore
        const storageRef = ref(storage, `avatars/${secondPicture.name}`);
        await uploadBytes(storageRef, secondPicture);
        return getDownloadURL(storageRef);
    };
    const uploadThirdPicture = async () => {
        if (!thirdPicture) return form.values.styleTwoData.thirdPicture;
        const storage = getStorage(firebase);
        // @ts-ignore
        const storageRef = ref(storage, `avatars/${thirdPicture.name}`);
        await uploadBytes(storageRef, thirdPicture);
        return getDownloadURL(storageRef);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const firstPictureUrl = await uploadFirstPicture();
        const secondPictureUrl = await uploadSecondPicture();
        const thirdPictureUrl = await uploadThirdPicture();
        const userData = {
            styleTwoData: {
                ...form.values.styleTwoData,
                firstPicture: firstPictureUrl,
                secondPicture: secondPictureUrl,
                thirdPicture: thirdPictureUrl,
            },
        };
        // @ts-ignore
        const action = updateUserThunk({ uid: user._id, userData });
        const resultAction = await dispatch(action);
        resultAction.payload;
        setIsLoading(false);
        setIsButtonVisible(true);
    };

    return (
        <Container size="md" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <Modal
              opened={firstPictureViewerOpen}
              onClose={() => setFirstPictureViewerOpen(false)}
            >
                <Image
                  src={FirstPictureView}
                  alt="Avatar"
                  style={{ width: '100%' }}
                />
            </Modal>
            <Modal
              opened={secondPictureViewerOpen}
              onClose={() => setSecondPictureViewerOpen(false)}
            >
                <Image
                  src={SecondPictureView}
                  alt="Avatar"
                  style={{ width: '100%' }}
                />
            </Modal>
            <Modal
              opened={thirdPictureViewerOpen}
              onClose={() => setThirdPictureViewerOpen(false)}
            >
                <Image
                  src={ThirdPictureView}
                  alt="Avatar"
                  style={{ width: '100%' }}
                />
            </Modal>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Title
                  order={2}
                  size="h1"
                  style={{ fontFamily: 'Greycliff CF, var(--mantine-font-family)' }}
                  fw={900}
                  ta="center"
                >
                    basic information
                </Title>
                <Grid style={{ marginTop: '1rem', gap: '1rem' }}>
                    <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                        <Flex style={{ flex: 1, alignItems: 'center', gap: '1rem' }}>
                            <Avatar
                              src={FirstPictureView}
                              size="lg"
                              radius="sm"
                              style={{ cursor: 'pointer', height: '100%' }}
                              onClick={handleFirstPictureClick}
                            />
                            <FileInput
                              clearable
                              variant="filled"
                              label="上传第一张照片"
                              placeholder=".jpg .Png are acceptable"
                              accept="image/*"
                              onChange={handleFirstPictureChange}
                              style={{ flex: 1 }}
                            />
                        </Flex>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                        <Flex style={{ flex: 1, alignItems: 'center', gap: '1rem' }}>
                            <Avatar
                              src={SecondPictureView}
                              size="lg"
                              radius="sm"
                              style={{ cursor: 'pointer', height: '100%' }}
                              onClick={handleSecondPictureClick}
                            />
                            <FileInput
                              clearable
                              variant="filled"
                              label="上传第二张图片"
                              placeholder=".jpg .Png are acceptable"
                              accept="image/*"
                              onChange={handleSecondPictureChange}
                              style={{ flex: 1 }}
                            />
                        </Flex>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                        <Flex style={{ flex: 1, alignItems: 'center', gap: '1rem' }}>
                            <Avatar
                              src={ThirdPictureView}
                              size="lg"
                              radius="sm"
                              style={{ cursor: 'pointer', height: '100%' }}
                              onClick={handleThirdPictureClick}
                            />
                            <FileInput
                              clearable
                              variant="filled"
                              label="上传第三张图片"
                              placeholder=".jpg .Png are acceptable"
                              accept="image/*"
                              onChange={handleThirdPictureChange}
                              style={{ flex: 1 }}
                            />
                        </Flex>
                    </Grid.Col>
                </Grid>
                <Group justify="center" mt="xl">
                    {isLoading ? (
                        <Button loading loaderProps={{ type: 'dots' }}>Loading...</Button>
                    ) : (
                        <Button type="submit" size="md">Next</Button>
                    )}
                    {isButtonVisible && (
                        <Button size="md" onClick={lookWebsite}>
                            Look at my website
                        </Button>
                    )}
                </Group>
            </form>
        </Container>
    );
}
