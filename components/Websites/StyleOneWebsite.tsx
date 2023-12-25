'use client';

import React, { useEffect } from 'react';
import { Container } from '@mantine/core';
import { useParams } from 'next/navigation';
import styles from './StyleOneWebsite.module.css';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { findUserByIdThunk } from '@/thunks/website-thunk';

export function StyleOneWebsite() {
    const params = useParams<{ tag: string; item: string }>();
    const dispatch = useAppDispatch();
    type StyleOneData = {
        fifthSentence : string
        firstPicture : string
        firstSentence : string
        fourthPicture : string
        fourthSentence : string
        secondPicture : string
        secondSentence : string
        seventhSentence: string
        sixthSentence : string
        thirdPicture : string
        thirdSentence : string
    };

    type User = {
        username : string
        password : string
        role : string
        styleOneData: StyleOneData;
    };
    // @ts-ignore
    const { userId } = params;
    const user = useAppSelector((state): User | undefined | null => state.userById.user);
    useEffect(() => {
        if (userId) {
            dispatch(findUserByIdThunk(userId));
        }
    }, [userId, dispatch]);
    if (!user || !user?.styleOneData) {
        // Render a loading indicator, placeholder, or some fallback UI
        return <div>Loading...</div>; // or any other fallback UI
    }
    const backgroundOneImageUrl = user && user?.styleOneData.firstPicture ? `url('${user.styleOneData.firstPicture}')` : 'none';
    const backgroundTwoImageUrl = user && user?.styleOneData.secondPicture ? `url('${user.styleOneData.secondPicture}')` : 'none';
    const backgroundThirdImageUrl = user && user?.styleOneData.thirdPicture ? `url('${user.styleOneData.thirdPicture}')` : 'none';
    const backgroundFourthImageUrl = user && user?.styleOneData.fourthPicture ? `url('${user.styleOneData.fourthPicture}')` : 'none';
    return (
        <Container size="auto" className={styles.containerStyle}>
        <div className={styles.shell}>
            <div className={styles.image} style={{ backgroundImage: backgroundOneImageUrl }} />
            <div className={styles.heading}>
                <h1>{user.styleOneData.firstSentence}</h1>
            </div>
            <div className={styles.text}>
                <h1>{user.styleOneData.secondSentence}</h1>
            </div>

            <div className={styles.image} style={{ backgroundImage: backgroundTwoImageUrl }} />
                <div className={styles.heading}>
                    <h1>{user.styleOneData.thirdSentence}</h1>
                </div>
                <div className={styles.text}>
                    <h1>{user.styleOneData.fourthSentence}</h1>
                </div>

            <div className={styles.image} style={{ backgroundImage: backgroundThirdImageUrl }} />

                <div className={styles.heading}>
                    <h1>{user.styleOneData.fifthSentence}</h1>
                </div>
                <div className={styles.text}>
                    <h1>{user.styleOneData.sixthSentence}</h1>
                </div>

            <div className={styles.image} style={{ backgroundImage: backgroundFourthImageUrl }} />
                <div className={styles.heading}>
                    <h1>{user.styleOneData.seventhSentence}</h1>
                </div>
        </div>
        </Container>
    );
}
