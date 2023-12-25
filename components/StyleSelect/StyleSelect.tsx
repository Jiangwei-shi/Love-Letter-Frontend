'use client';

import { Grid, Card, Group, Button, Image, Text, Container } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';

export function StyleSelect() {
    const user = useAppSelector(state => state.currentUser);
    const router = useRouter();
    const selectStyleOne = () => {
        if (user) {
            router.push('/styleSelect/styleOne');
        }
    };

    return (
        <Container>
            <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Card.Section component="a" href="https://loveletter.netlify.app/styleSelect/styleOne/6589a279ac405a553442b6bb">
                        <Image
                          src="https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/avatars%2FOriginal%20Xayah.jpg?alt=media&token=f2d151c6-b028-4077-8c24-4133c0fcc611"
                          height={200}
                          alt="Norway"
                        />
                    </Card.Section>

                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={500}>模板一</Text>
                    </Group>

                    <Text size="sm" c="dimmed">
                        点击图片可以查看样例
                    </Text>

                    <Button color="blue" fullWidth mt="md" radius="md" onClick={selectStyleOne}>
                        使用模板
                    </Button>
                    </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                            <Image
                              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                              height={200}
                              alt="Norway"
                            />
                        </Card.Section>

                        <Group justify="space-between" mt="md" mb="xs">
                            <Text fw={500}>模板一</Text>
                        </Group>

                        <Text size="sm" c="dimmed">
                            点击图片可以查看样例
                        </Text>

                        <Button color="blue" fullWidth mt="md" radius="md">
                            使用模板
                        </Button>
                    </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                            <Image
                              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                              height={200}
                              alt="Norway"
                            />
                        </Card.Section>

                        <Group justify="space-between" mt="md" mb="xs">
                            <Text fw={500}>模板一</Text>
                        </Group>

                        <Text size="sm" c="dimmed">
                            点击图片可以查看样例
                        </Text>

                        <Button color="blue" fullWidth mt="md" radius="md">
                            使用模板
                        </Button>
                    </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                            <Image
                              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                              height={200}
                              alt="Norway"
                            />
                        </Card.Section>

                        <Group justify="space-between" mt="md" mb="xs">
                            <Text fw={500}>模板一</Text>
                        </Group>

                        <Text size="sm" c="dimmed">
                            点击图片可以查看样例
                        </Text>

                        <Button color="blue" fullWidth mt="md" radius="md">
                            使用模板
                        </Button>
                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
