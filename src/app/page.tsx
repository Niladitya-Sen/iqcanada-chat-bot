import React from 'react';
import Chat from './Chat';
import Image from 'next/image';

export default function Home() {
    return (
        <main className='max-w-xl mx-auto h-screen flex flex-col'>
            <Image
                src="/logo.png"
                width={150}
                height={100}
                alt="logo"
            />
            <Chat />
        </main>
    )
}
