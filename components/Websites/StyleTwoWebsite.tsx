'use client';

import React from 'react';
import { Container } from '@mantine/core';
import styles from './StyleTwoWebsite.module.css';

export default function StyleTwoForm() {
    return (
        <Container size="auto" className={styles.containerStyle}>
        <div className={styles.shell}>
            <div className={styles.content}>
                <div className={styles.item} style={{ backgroundImage: 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/avatars%2FOriginal%20Xayah.jpg?alt=media&token=f2d151c6-b028-4077-8c24-4133c0fcc611' }} />
                <div className={styles.item} style={{ backgroundImage: 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/avatars%2FOriginal%20Xayah.jpg?alt=media&token=f2d151c6-b028-4077-8c24-4133c0fcc611' }} />
                <div className={styles.item} style={{ backgroundImage: 'https://firebasestorage.googleapis.com/v0/b/create-your-own-website-ebf54.appspot.com/o/avatars%2FOriginal%20Xayah.jpg?alt=media&token=f2d151c6-b028-4077-8c24-4133c0fcc611' }} />
            </div>
        </div>
        </Container>
    );
}
