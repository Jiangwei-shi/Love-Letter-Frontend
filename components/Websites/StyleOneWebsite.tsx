import React from 'react';
import { Container } from '@mantine/core';
import { useParams } from 'next/navigation';
import styles from './StyleOneWebsite.module.css';

export function StyleOneWebsite() {
    const params = useParams<{ tag: string; item: string }>();
    // @ts-ignore
    const { userId } = params;
    console.log(userId);
    return (
        <Container size="auto" className={styles.containerStyle}>
            <h1>this is </h1>
        <div className={styles.shell}>
            <div className={styles.image} style={{ backgroundImage: "url('./1.jpg')" }}>
                <div className={styles.heading}>
                    <h1>When you are confused</h1>
                </div>
                <div className={styles.text}>
                    <h1>Set goals in your mind</h1>
                </div>
            </div>

            <div className={styles.image} style={{ backgroundImage: "url('./2.jpg')" }}>
                <div className={styles.heading}>
                    <h1>When you are down</h1>
                </div>
                <div className={styles.text}>
                    <h1>Try to wake up the beast in your heart</h1>
                </div>
            </div>

            <div className={styles.image} style={{ backgroundImage: "url('./3.jpg')" }}>
                <div className={styles.heading}>
                    <h1>When people leave you</h1>
                </div>
                <div className={styles.text}>
                    <h1>It is time to start your season</h1>
                </div>
            </div>

            <div className={styles.image} style={{ backgroundImage: "url('./4.jpg')" }}>
                <div className={styles.heading}>
                    <h1>Come on, stranger.</h1>
                </div>
            </div>
        </div>
        </Container>
    );
}
