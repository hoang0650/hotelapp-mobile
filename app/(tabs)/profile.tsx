import { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

// Thông tin người dùng giả lập
const mockUser = {
  id: 'user1',
  fullName: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0912345678',
  position: 'Quản lý',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  joinDate: '15/06/2023',
};

export default function ProfileScreen() {
  // State cho các cài đặt
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [fingerprintEnabled, setFingerprintEnabled] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  // Xử lý đăng xuất
  const handleLogout = () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          style: 'destructive',
          onPress: () => {
            // Chuyển hướng đến màn hình đăng nhập
            router.replace('/login');
          } 
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Phần thông tin người dùng */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{mockUser.fullName}</Text>
        <Text style={styles.userPosition}>{mockUser.position}</Text>
        
        <View style={styles.userInfoCard}>
          <View style={styles.userInfoRow}>
            <FontAwesome name="envelope" size={16} color="#1890ff" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{mockUser.email}</Text>
          </View>
          
          <View style={styles.userInfoRow}>
            <FontAwesome name="phone" size={16} color="#1890ff" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Điện thoại:</Text>
            <Text style={styles.infoValue}>{mockUser.phone}</Text>
          </View>
          
          <View style={styles.userInfoRow}>
            <FontAwesome name="calendar" size={16} color="#1890ff" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Ngày tham gia:</Text>
            <Text style={styles.infoValue}>{mockUser.joinDate}</Text>
          </View>
        </View>
      </View>

      {/* Phần menu tùy chọn */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Tùy chọn tài khoản</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIconContainer}>
            <FontAwesome name="user" size={20} color="white" />
          </View>
          <Text style={styles.menuText}>Chỉnh sửa thông tin cá nhân</Text>
          <FontAwesome name="angle-right" size={20} color="#bfbfbf" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIconContainer, { backgroundColor: '#52c41a' }]}>
            <FontAwesome name="lock" size={20} color="white" />
          </View>
          <Text style={styles.menuText}>Đổi mật khẩu</Text>
          <FontAwesome name="angle-right" size={20} color="#bfbfbf" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIconContainer, { backgroundColor: '#faad14' }]}>
            <FontAwesome name="history" size={20} color="white" />
          </View>
          <Text style={styles.menuText}>Lịch sử hoạt động</Text>
          <FontAwesome name="angle-right" size={20} color="#bfbfbf" />
        </TouchableOpacity>
      </View>

      {/* Phần cài đặt */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Cài đặt ứng dụng</Text>
        
        <View style={styles.settingItem}>
          <View style={[styles.menuIconContainer, { backgroundColor: '#1890ff' }]}>
            <FontAwesome name="bell" size={20} color="white" />
          </View>
          <Text style={styles.menuText}>Thông báo</Text>
          <Switch
            trackColor={{ false: '#d9d9d9', true: '#b7eb8f' }}
            thumbColor={notificationsEnabled ? '#52c41a' : '#f4f3f4'}
            onValueChange={setNotificationsEnabled}
            value={notificationsEnabled}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={[styles.menuIconContainer, { backgroundColor: '#722ed1' }]}>
            <FontAwesome name="moon-o" size={20} color="white" />
          </View>
          <Text style={styles.menuText}>Chế độ tối</Text>
          <Switch
            trackColor={{ false: '#d9d9d9', true: '#d3adf7' }}
            thumbColor={darkModeEnabled ? '#722ed1' : '#f4f3f4'}
            onValueChange={setDarkModeEnabled}
            value={darkModeEnabled}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={[styles.menuIconContainer, { backgroundColor: '#fa541c' }]}>
            <FontAwesome name="key" size={20} color="white" />
          </View>
          <Text style={styles.menuText}>Đăng nhập vân tay</Text>
          <Switch
            trackColor={{ false: '#d9d9d9', true: '#ffccc7' }}
            thumbColor={fingerprintEnabled ? '#fa541c' : '#f4f3f4'}
            onValueChange={setFingerprintEnabled}
            value={fingerprintEnabled}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={[styles.menuIconContainer, { backgroundColor: '#13c2c2' }]}>
            <FontAwesome name="refresh" size={20} color="white" />
          </View>
          <Text style={styles.menuText}>Tự động đồng bộ</Text>
          <Switch
            trackColor={{ false: '#d9d9d9', true: '#87e8de' }}
            thumbColor={autoSyncEnabled ? '#13c2c2' : '#f4f3f4'}
            onValueChange={setAutoSyncEnabled}
            value={autoSyncEnabled}
          />
        </View>
      </View>

      {/* Phần hỗ trợ */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Hỗ trợ</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIconContainer, { backgroundColor: '#eb2f96' }]}>
            <FontAwesome name="life-ring" size={20} color="white" />
          </View>
          <Text style={styles.menuText}>Trợ giúp và hỗ trợ</Text>
          <FontAwesome name="angle-right" size={20} color="#bfbfbf" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIconContainer, { backgroundColor: '#faad14' }]}>
            <FontAwesome name="info-circle" size={20} color="white" />
          </View>
          <Text style={styles.menuText}>Về ứng dụng</Text>
          <FontAwesome name="angle-right" size={20} color="#bfbfbf" />
        </TouchableOpacity>
      </View>

      {/* Nút đăng xuất */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <FontAwesome name="sign-out" size={18} color="white" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#1890ff',
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 5,
  },
  userPosition: {
    fontSize: 16,
    color: '#1890ff',
    marginBottom: 20,
  },
  userInfoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    width: '100%',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 10,
    width: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#8c8c8c',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#262626',
    flex: 1,
  },
  menuSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#1890ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: '#262626',
  },
  logoutButton: {
    backgroundColor: '#f5222d',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 15,
    marginTop: 30,
    marginBottom: 15,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  versionText: {
    color: '#8c8c8c',
    fontSize: 12,
  },
}); 