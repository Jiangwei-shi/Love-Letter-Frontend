'use client';

import { Modal, Group, Button, Container, Title, Grid, TextInput, Avatar, FileInput, Flex, Image } from '@mantine/core';
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
    const [fourthPicture, setFourthPicture] = useState(null);
    const [firstPictureViewerOpen, setFirstPictureViewerOpen] = useState(false);
    const [secondPictureViewerOpen, setSecondPictureViewerOpen] = useState(false);
    const [thirdPictureViewerOpen, setThirdPictureViewerOpen] = useState(false);
    const [fourthPictureViewerOpen, setFourthPictureViewerOpen] = useState(false);
    const [FirstPictureView, setFirstPictureView] = useState(null);
    const [SecondPictureView, setSecondPictureView] = useState(null);
    const [ThirdPictureView, setThirdPictureView] = useState(null);
    const [FourthPictureView, setFourthPictureView] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(false);
    const user = useAppSelector(state => state.currentUser);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const form = useForm({
        initialValues: {
            // @ts-ignore
            // eslint-disable-next-line max-len
            styleOneData: user?.styleOneData ? { ...user.styleOneData } :
                {
                    firstPicture: 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/avatars%2FOriginal%20Xayah.jpg?alt=media&token=f2d151c6-b028-4077-8c24-4133c0fcc611',
                    firstSentence: 'How do you like me today？',
                    secondSentence: 'More than yesterday, less than tomorrow.',
                    secondPicture: 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/avatars%2FStar%20Guardian%20Xayah.jpg?alt=media&token=1456588f-6fba-4a4a-beba-14d5edd7ed70',
                    thirdSentence: 'Do I make you happy, Rakan?',
                    fourthSentence: 'Every day of my life.',
                    thirdPicture: 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/avatars%2FSweetheart%20Xayah.jpg?alt=media&token=f330abcf-ffb8-4895-b158-2f03689f3764',
                    fifthSentence: 'I am lucky to have you.',
                    sixthSentence: 'No. I am the lucky one.',
                    fourthPicture: 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/avatars%2FBroken%20Covenant%20Xayah.jpg?alt=media&token=4cc5b15d-5244-4820-bc41-80a8c4440cce',
                    seventhSentence: 'I love you',
                },
        },
    });

    useEffect(() => {
        setFirstPictureView(form.values.styleOneData.firstPicture);
        setSecondPictureView(form.values.styleOneData.secondPicture);
        setThirdPictureView(form.values.styleOneData.thirdPicture);
        setFourthPictureView(form.values.styleOneData.fourthPicture);
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
    const handleFourthPictureChange = (file: any) => {
        setFourthPicture(file);
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
    const handleFourthPictureClick = () => {
        setFourthPictureViewerOpen(true);
    };
    const lookWebsite = () => {
        // @ts-ignore
        router.push(`/styleSelect/styleOne/${user._id}`);
    };
    const uploadFirstPicture = async () => {
        if (!firstPicture) return form.values.styleOneData.firstPicture;
        const storage = getStorage(firebase);
        // @ts-ignore
        const storageRef = ref(storage, `avatars/${firstPicture.name}`);
        const url = await getDownloadURL(storageRef);
        form.setFieldValue('styleOneData.firstPicture', url);
        return url;
    };
    const uploadSecondPicture = async () => {
        if (!secondPicture) return form.values.styleOneData.secondPicture;
        const storage = getStorage(firebase);
        // @ts-ignore
        const storageRef = ref(storage, `avatars/${secondPicture.name}`);
        await uploadBytes(storageRef, secondPicture);
        return getDownloadURL(storageRef);
    };
    const uploadThirdPicture = async () => {
        if (!thirdPicture) return form.values.styleOneData.thirdPicture;
        const storage = getStorage(firebase);
        // @ts-ignore
        const storageRef = ref(storage, `avatars/${thirdPicture.name}`);
        await uploadBytes(storageRef, thirdPicture);
        return getDownloadURL(storageRef);
    };
    const uploadFourthPicture = async () => {
        if (!fourthPicture) return form.values.styleOneData.fourthPicture;
        const storage = getStorage(firebase);
        // @ts-ignore
        const storageRef = ref(storage, `avatars/${fourthPicture.name}`);
        await uploadBytes(storageRef, fourthPicture);
        return getDownloadURL(storageRef);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const firstPictureUrl = await uploadFirstPicture();
        const secondPictureUrl = await uploadSecondPicture();
        const thirdPictureUrl = await uploadThirdPicture();
        const fourthPictureUrl = await uploadFourthPicture();
        const userData = {
        styleOneData: {
        ...form.values.styleOneData,
        firstPicture: firstPictureUrl,
        secondPicture: secondPictureUrl,
        thirdPicture: thirdPictureUrl,
        fourthPicture: fourthPictureUrl,
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
            <Modal
              opened={fourthPictureViewerOpen}
              onClose={() => setFourthPictureViewerOpen(false)}
            >
                <Image
                  src={FourthPictureView}
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
                        <TextInput
                          label="上传第一句话"
                          name="selfFullName"
                          variant="filled"
                          {...form.getInputProps('styleOneData.firstSentence')}
                          style={{ flex: 1 }}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                        <TextInput
                          label="上传第二句话"
                          name="coupleFullName"
                          variant="filled"
                          {...form.getInputProps('styleOneData.secondSentence')}
                          style={{ flex: 1 }}
                        />
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
                        <TextInput
                          label="上传第三句话"
                          name="selfFullName"
                          variant="filled"
                          {...form.getInputProps('styleOneData.thirdSentence')}
                          style={{ flex: 1 }}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                        <TextInput
                          label="上传第四句话"
                          name="coupleFullName"
                          variant="filled"
                          {...form.getInputProps('styleOneData.fourthSentence')}
                          style={{ flex: 1 }}
                        />
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
                    <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                        <TextInput
                          label="上传第五句话"
                          name="selfFullName"
                          variant="filled"
                          {...form.getInputProps('styleOneData.fifthSentence')}
                          style={{ flex: 1 }}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                        <TextInput
                          label="上传第六句话"
                          name="coupleFullName"
                          variant="filled"
                          {...form.getInputProps('styleOneData.sixthSentence')}
                          style={{ flex: 1 }}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                        <Flex style={{ flex: 1, alignItems: 'center', gap: '1rem' }}>
                            <Avatar
                              src={FourthPictureView}
                              size="lg"
                              radius="sm"
                              style={{ cursor: 'pointer', height: '100%' }}
                              onClick={handleFourthPictureClick}
                            />
                            <FileInput
                              clearable
                              variant="filled"
                              label="上传第四张图片"
                              placeholder=".jpg .Png are acceptable"
                              accept="image/*"
                              onChange={handleFourthPictureChange}
                              style={{ flex: 1 }}
                            />
                        </Flex>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                        <TextInput
                          label="上传第七句话"
                          name="selfFullName"
                          variant="filled"
                          {...form.getInputProps('styleOneData.seventhSentence')}
                          style={{ flex: 1 }}
                        />
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
