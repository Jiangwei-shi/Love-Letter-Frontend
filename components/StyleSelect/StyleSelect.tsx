import { Grid, Card, Group, Button, Image, Text } from '@mantine/core';

export function StyleSelect() {
    return (
        <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }} ml={200} mr={200}>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                    <Image
                      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                      height={160}
                      alt="Norway"
                    />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>Norway Fjord Adventures</Text>
                </Group>

                <Text size="sm" c="dimmed">
                    With Fjord Tours you can explore more of the magical
                    fjord landscapes with tours and activities on and
                    around the fjords of Norway
                </Text>

                <Button color="blue" fullWidth mt="md" radius="md">
                    Book classic tour now
                </Button>
                </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}><Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                    <Image
                      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                      height={160}
                      alt="Norway"
                    />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>Norway Fjord Adventures</Text>
                </Group>

                <Text size="sm" c="dimmed">
                    With Fjord Tours you can explore more of the magical
                    fjord landscapes with tours and activities on and
                    around the fjords of Norway
                </Text>

                <Button color="blue" fullWidth mt="md" radius="md">
                    Book classic tour now
                </Button>
                                                        </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}><Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                    <Image
                      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                      height={160}
                      alt="Norway"
                    />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>Norway Fjord Adventures</Text>
                </Group>

                <Text size="sm" c="dimmed">
                    With Fjord Tours you can explore more of the magical
                    fjord landscapes with tours and activities on and
                    around the fjords of Norway
                </Text>

                <Button color="blue" fullWidth mt="md" radius="md">
                    Book classic tour now
                </Button>
                                                        </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}><Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                    <Image
                      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                      height={160}
                      alt="Norway"
                    />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>Norway Fjord Adventures</Text>
                </Group>

                <Text size="sm" c="dimmed">
                    With Fjord Tours you can explore more of the
                    magical fjord landscapes with tours and
                    activities on and around the fjords of Norway
                </Text>

                <Button color="blue" fullWidth mt="md" radius="md">
                    Book classic tour now
                </Button>
                                                        </Card>
            </Grid.Col>
        </Grid>
    );
}
