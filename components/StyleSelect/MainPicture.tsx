'use client';

import React from 'react';
import { Container, Paper, Text, Title, rem } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { Link } from 'react-scroll';
import styles from './MainPicture.module.css';

export function MainPicture() {
    return (
        <Container size="auto" className={styles.containerStyle}>
            <Paper shadow="sm" p={40} radius="md" className={styles.paperStyle}>
                <Title order={1} size="40" style={{ color: 'white', marginBottom: '30px' }}>
                    build your own website
                </Title>
                <Text fw={700} style={{ color: 'white' }}>
                    Hi, I&apos;m Jiangwei, the creator of this website. My goal is to build
                    websites for those who don&apos;t know how to create one for themselves.
                    It can be a gift for your friends, family, loved ones, children, or anyone
                    you wish to share a website with. You can scroll down to choose a template
                    you like. Clicking on the images in the template will show you the live
                    style of the website. Once you select a template, you can start building
                    your own website. If you don&apos;t want to use a template and instead wish
                    to create a website with a new style, you can reach out to me via email
                    for an in-depth discussion. I look forward to hearing from you. My email
                    is Jiangweishi8@gmail.com.
                </Text>
            </Paper>
            <div className={styles.ChevronDownIcon} style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)' }}>
                {/* @ts-ignore*/}
                <Link to="selectTemplate" smooth duration={1000}>
                    <IconChevronDown
                      style={{
                        width: rem(40),
                        height: rem(40),
                        backgroundColor: 'white', // 设置背景色为白色
                        borderRadius: '50%', // 使背景成为圆形
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        }}
                      stroke={1.0}
                      color="black" // 将图标颜色设置为黑色
                    />
                </Link>
            </div>
        </Container>
    );
}
