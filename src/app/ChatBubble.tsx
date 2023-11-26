"use client";

import React, { useEffect, useState } from 'react';
import { AiTwotoneSound } from "react-icons/ai";
import { cn } from "@/lib/utils";

export default function ChatBubble({ role, message, time }: Readonly<{ role: string, message: string, time: string }>) {
    const [audioSrc, setAudioSrc] = useState<string>('');
    const audioRef = React.useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const msg = message.endsWith('?') ? message.slice(0, -1) : message;
        setAudioSrc(`https://ae.arrive.waysdatalabs.com/node-api/get-speech/${msg}?language=en`);
    }, [message]);

    return (
        <div
            className={cn("flex flex-row items-center gap-2", {
                'justify-end': role === 'sender',
                'justify-start': role === 'bot',
            })}
        >
            <div
                className={cn("relative isolate bg-white px-4 py-2 rounded-2xl flex flex-col gap-1 items-start max-w-[28rem]", {
                    'rounded-br-none bg-primary text-white': role === 'sender',
                    'rounded-bl-none bg-primary/10': role === 'bot',
                })}
            >
                <audio
                    src={audioSrc}
                    ref={audioRef}
                    autoPlay={false}
                />
                <p>{message}</p>
                <div
                    className={cn("text-xs self-end flex justify-between items-center w-full gap-2", {
                        'text-white/80': role === 'sender',
                        'text-black/80': role === 'bot',
                    })}
                >
                    <AiTwotoneSound
                        className={`${role === 'sender' && 'hidden'}`}
                        onClick={() => {
                            if (audioRef.current) {
                                audioRef.current.playbackRate = 1.25;
                                audioRef.current.play();
                            }
                        }}
                    />
                    <p>{time}</p>
                </div>
            </div>
        </div>
    )
}