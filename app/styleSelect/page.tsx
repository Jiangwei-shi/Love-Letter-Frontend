'use client';

import { Header } from '@/components/Header/Header';
import { MainPicture } from '@/components/StyleSelect/MainPicture';
import { StyleSelect } from '@/components/StyleSelect/StyleSelect';

export default function page() {
    return (
        <>
            <Header />
            <MainPicture />
            <StyleSelect />
        </>
    );
}
