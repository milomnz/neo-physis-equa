import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { getSession } from '../src/services/session';

export default function Index() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    getSession().then((session) => setHasToken(Boolean(session?.token)));
  }, []);

  if (hasToken === null) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-900">
        <ActivityIndicator color="#ffffff" size="large" />
      </View>
    );
  }

  return <Redirect href={hasToken ? '/home' : '/login'} />;
}