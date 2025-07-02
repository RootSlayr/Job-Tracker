"use client"
import { useEffect } from 'react';

export default function SessionInit({ children }: React.PropsWithChildren<object>) {

    useEffect(() => {
        const existing = localStorage.getItem('session_token');
        if (existing) return;

        fetch('/api/session')
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem("session_token", data.token);
            })
            .catch((err) => console.error("Failed to init session", err));
    }, []);

    return <>{children}</>

}
