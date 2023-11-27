"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Send, Mic, MicOff } from 'lucide-react';
import ChatBubble from './ChatBubble';
import socket from '@/socket/socket';

type MessageType = {
    message: string;
    role: 'sender' | 'bot';
    time: string;
}

const grammar =
    "#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;";

export default function Chat() {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const chatDivRef = useRef<HTMLDivElement>(null);
    const [speech, setSpeech] = useState<any>();
    const [listening, setListening] = useState(false);

    useEffect(() => {
        socket.connect();
        socket.emit('joined');
        const recognition = new (window as any).webkitSpeechRecognition();
        const speechRecognitionList = new (window as any).webkitSpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
        recognition.continuous = true;
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        setSpeech(recognition);
    }, []);

    useEffect(() => {
        if (chatDivRef.current) chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
    }, [messages]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('connected');
        });

        return () => {
            socket.off('connect');
        }
    }, []);

    useEffect(() => {
        socket.on('receive-message', ({ message }) => {
            setMessages(prev => [
                ...prev,
                {
                    message,
                    role: 'bot',
                    time: new Date().toLocaleTimeString(
                        'en-US',
                        { hour: 'numeric', minute: 'numeric', hour12: true },
                    )
                }
            ]);
        });

        return () => {
            socket.off('receive-message');
        }
    });

    function sendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const message = textareaRef.current?.value;
        if (!message) return;
        setMessages(prev => [
            ...prev,
            {
                message,
                role: 'sender',
                time: new Date().toLocaleTimeString(
                    'en-US',
                    { hour: 'numeric', minute: 'numeric', hour12: true },
                )
            }
        ]);
        socket.emit('send-message', { message });
        textareaRef.current.value = '';
    }

    return (
        <section className='flex flex-col flex-1 my-5 p-5 border-2 rounded-[0.75rem] shadow-md bg-background max-h-[82svh]'>
            <div ref={chatDivRef} className='flex-grow overflow-y-auto flex flex-col gap-2 scrollbar-none'>
                {
                    messages.map((message, index) => (
                        <ChatBubble
                            key={index}
                            {...message}
                        />
                    ))
                }
            </div>
            <form
                className='flex justify-between w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-transparent'
                onSubmit={sendMessage}
            >
                <textarea
                    ref={textareaRef}
                    name="message"
                    className={cn('border-0 w-full outline-none min-h-[80px] px-3 py-2 bg-transparent transition-all duration-300')}
                    placeholder={listening ? 'Listening...' : 'Type a message...'}
                />
                <div className='flex flex-col justify-between items-end'>
                    <Button
                        variant={"ghost"}
                        onClick={() => {
                            if (listening) {
                                speech.stop();
                                setListening(false);
                                return;
                            } else {
                                speech.start();
                                setListening(true);
                            }
                            speech.onresult = function (event: any) {
                                const speechResult = event.results[0][0].transcript;
                                if (textareaRef.current) textareaRef.current.value = speechResult;
                                sendMessage(event);
                            };
                        }}
                    >
                        {
                            listening ? <MicOff size={22} className='text-primary' /> : <Mic size={22} className='text-primary' />
                        }
                    </Button>
                    <Button
                        className={cn('self-end')}
                    >
                        <Send size={22} />
                    </Button>
                </div>
            </form>
        </section>
    )
}
