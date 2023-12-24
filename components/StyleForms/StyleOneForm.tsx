'use client';

import { Modal, Group, Button, Container, Title, Grid, TextInput, Avatar, FileInput, Flex, Text, Image } from '@mantine/core';
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
    const user = useAppSelector(state => state.currentUser);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const form = useForm({
        initialValues: {
            // @ts-ignore
            // eslint-disable-next-line max-len
            styleOneData: user?.styleOneData ||
                { firstPicture: 'https://firebasestorage.googleapis.com/v0/b/portfolio-generator-394004.appspot.com/o/avatars%2Fcxk.jpg?alt=media&token=29c9ba5e-ea2a-4c76-9e15-4ba58ff13c69',
                  firstSentence: '111',
                  secondSentence: '222',
                  secondPicture: 'https://firebasestorage.googleapis.com/v0/b/portfolio-generator-394004.appspot.com/o/avatars%2Fcxk.jpg?alt=media&token=29c9ba5e-ea2a-4c76-9e15-4ba58ff13c69',
                  thirdSentence: '333',
                  fourthSentence: '444',
                  thirdPicture: 'https://firebasestorage.googleapis.com/v0/b/portfolio-generator-394004.appspot.com/o/avatars%2Fcxk.jpg?alt=media&token=29c9ba5e-ea2a-4c76-9e15-4ba58ff13c69',
                  fifthSentence: '555',
                  sixthSentence: '666',
                  fourthPicture: 'https://firebasestorage.googleapis.com/v0/b/portfolio-generator-394004.appspot.com/o/avatars%2Fcxk.jpg?alt=media&token=29c9ba5e-ea2a-4c76-9e15-4ba58ff13c69',
                  seventhSentence: '777' },
        },
    });

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
    };
    if (!user) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
            >
                <Text size="xl">
                    Welcome, Guest!
                </Text>
            </div>
        );
    }

    return (
        <Container size="md" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <Modal
              opened={firstPictureViewerOpen}
              onClose={() => setFirstPictureViewerOpen(false)}
            >
                <Image
                  src={form.values.styleOneData?.firstPicture}
                  alt="Avatar"
                  style={{ width: '100%' }}
                />
            </Modal>
            <Modal
              opened={secondPictureViewerOpen}
              onClose={() => setSecondPictureViewerOpen(false)}
            >
                <Image
                  src={form.values.styleOneData?.secondPicture}
                  alt="Avatar"
                  style={{ width: '100%' }}
                />
            </Modal>
            <Modal
              opened={thirdPictureViewerOpen}
              onClose={() => setThirdPictureViewerOpen(false)}
            >
                <Image
                  src={form.values.styleOneData?.thirdPicture}
                  alt="Avatar"
                  style={{ width: '100%' }}
                />
            </Modal>
            <Modal
              opened={fourthPictureViewerOpen}
              onClose={() => setFourthPictureViewerOpen(false)}
            >
                <Image
                  src={form.values.styleOneData?.fourthPicture}
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
                              src={form.values.styleOneData.firstPicture}
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
                              src={form.values.styleOneData.secondPicture}
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
                              src={form.values.styleOneData.thirdPicture}
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
                              src={form.values.styleOneData.fourthPicture}
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
                    {/*{isLoading ? (*/}
                    {/*    <Button loading loaderProps={{ type: 'dots' }}>Loading...</Button>*/}
                    {/*) : (*/}
                        <Button type="submit" size="md">Next</Button>
                    {/*)}*/}
                </Group>
            </form>
        </Container>
    );
}
