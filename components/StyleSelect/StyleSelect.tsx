'use client';

import { Grid, Card, Group, Button, Image, Text, Container } from '@mantine/core';
import { useAppSelector } from '@/lib/hooks';

export function StyleSelect() {
    return (
        <Container>
            <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
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
