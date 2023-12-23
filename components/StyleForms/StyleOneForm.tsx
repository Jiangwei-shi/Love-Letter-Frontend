'use client';

import { Modal, Group, Button, Container, Title, Grid, TextInput, Avatar, FileInput, Textarea, Flex } from '@mantine/core';
import React, { useState } from 'react';
import { useForm } from '@mantine/form';
// import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';

export default function StyleOneForm() {
    const [firstPicture, setFirstPicture] = useState(null);
    const [secondPicture, setSecondPicture] = useState(null);
    const [thirdPicture, setThirdPicture] = useState(null);
    const [fourthPicture, setFourthPicture] = useState(null);
    const [SelfViewerOpen, setSelfViewerOpen] = useState(false);
    const [CoupleViewerOpen, setCoupleViewerOpen] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    const user = useAppSelector(state => state.currentUser.user);
    // const dispatch = useAppDispatch();
    // const router = useRouter();
    const form = useForm({
        initialValues: {
            // @ts-ignore
            // eslint-disable-next-line max-len
            styleOneData: (user?.styleOneData && user.styleOneData.length > 0) ? user?.styleOneData :
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

    const handleFirstPictureChange = (e: any) => {
            const file = e.target.files[0];
            setFirstPicture(file);
    };
    const handleSecondPictureChange = (e: any) => {
        const file = e.target.files[0];
        setSecondPicture(file);
    };
    const handleThirdPictureChange = (e: any) => {
        const file = e.target.files[0];
        setThirdPicture(file);
    };
    const handleFourthPictureChange = (e: any) => {
        const file = e.target.files[0];
        setFourthPicture(file);
    };

    const handleSelfAvatarClick = () => {
        setSelfViewerOpen(true);
    };
    // const handleCoupleAvatarClick = () => {
    //     setCoupleViewerOpen(true);
    // };

    const uploadSelfAvatar = async () => {
        if (!firstPicture) return form.values.styleOneData.firstPicture;
        const storage = getStorage(firebase);
        const storageRef = ref(storage, `avatars/${selfAvatar.name}`);
        await uploadBytes(storageRef, selfAvatar);
        return getDownloadURL(storageRef);
    };
    //
    // const uploadCoupleAvatar = async () => {
    //     if (!coupleAvatar) return form.values.coupleAvatarUrl;
    //     const storage = getStorage(firebase);
    //     const storageRef = ref(storage, `avatars/${coupleAvatar.name}`);
    //     await uploadBytes(storageRef, coupleAvatar);
    //     return getDownloadURL(storageRef);
    // };

    // if (!user) {
    //     return (
    //         <div style={{
    //             display: 'flex',
    //             justifyContent: 'center',
    //             alignItems: 'center',
    //             height: '100vh',
    //         }}
    //         >
    //             <Text size="xl">
    //                 Welcome, Guest!
    //             </Text>
    //         </div>
    //     );
    // }

    const handleSubmit = async () => {
        // setIsLoading(true);
        // try {
        //     const selfAvatarUrl = await uploadSelfAvatar();
        //     const coupleAvatarUrl = await uploadCoupleAvatar();
        //     const userData = {

        //     };
        //     // Dispatch an update action - replace with the actual thunk if different
        //     const action = updateUserThunk({ uid: user._id, userData });
        //     const resultAction = await dispatch(action);
        //     const updatedUser = resultAction.payload;
        //     console.log('Update successful: ', updatedUser);
        //     navigate('/dashboard/picture');
        //     // alert('You already successfully saved!');
        // } catch (error) {
        //     console.error('Update failed: ', error);
        // } finally {
        //     setIsLoading(false);
        // }
    };

    return (
        <Container size="md" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <Modal
              opened={SelfViewerOpen}
              onClose={() => setSelfViewerOpen(false)}
            >
                <img
                  src={form.values.styleOneData[0]}
                  alt="Avatar"
                  style={{ width: '100%' }}
                />
            </Modal>
            <Modal
              opened={CoupleViewerOpen}
              onClose={() => setCoupleViewerOpen(false)}
            >
                <img
                  src={form.values.styleOneData[1]}
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
                              onClick={handleSelfAvatarClick}
                            />
                            <FileInput
                              clearable
                              variant="filled"
                              label="upload first photo"
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
                              onClick={handleSelfAvatarClick}
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
                              onClick={handleSelfAvatarClick}
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
                              onClick={handleSelfAvatarClick}
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
                    {/*    <Button type="submit" size="md">Next</Button>*/}
                    {/*)}*/}
                </Group>
            </form>

        </Container>
    );
}
