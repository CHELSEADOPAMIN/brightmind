import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#df3f35',
        tabBarInactiveTintColor: '#8b7d78',
        tabBarStyle: {
          backgroundColor: '#fffdfb',
          borderTopColor: '#eadbd4',
          height: 70,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Manrope_700Bold',
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => <FontAwesome name="home" color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: t('tabs.finance'),
          tabBarIcon: ({ color }) => <FontAwesome name="shield" color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="doctor"
        options={{
          title: t('tabs.doctor'),
          tabBarIcon: ({ color }) => <FontAwesome name="map-marker" color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="translate"
        options={{
          title: t('tabs.translate'),
          tabBarIcon: ({ color }) => <FontAwesome name="language" color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color }) => <FontAwesome name="user" color={color} size={20} />,
        }}
      />
    </Tabs>
  );
}
