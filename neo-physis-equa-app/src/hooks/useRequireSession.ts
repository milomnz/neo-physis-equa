import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { getSession } from '../services/session';

export function useRequireSession(): boolean {
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const session = await getSession();
                if (session?.token) {
                    setReady(true);
                } else {
                    router.replace('/login');
                }
            } catch {
                router.replace('/login');
            }
        })();
    }, [router]);

    return ready;
}