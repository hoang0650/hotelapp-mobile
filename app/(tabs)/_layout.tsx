import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#2f95dc',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="rooms"
        options={{
          title: 'Phòng',
          tabBarIcon: ({ color }) => <TabBarIcon name="bed" color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Dịch vụ',
          tabBarIcon: ({ color }) => <TabBarIcon name="th-list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="invoices"
        options={{
          title: 'Hóa đơn',
          tabBarIcon: ({ color }) => <TabBarIcon name="file-text" color={color} />,
        }}
      />
      <Tabs.Screen
        name="revenue"
        options={{
          title: 'Doanh thu',
          tabBarIcon: ({ color }) => <FontAwesome name="bar-chart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
} 