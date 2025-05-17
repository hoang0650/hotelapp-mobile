import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

// Định nghĩa các tab được hỗ trợ
type AppTab = '/(tabs)/rooms' | '/(tabs)/services' | '/(tabs)/invoices' | '/(tabs)/profile';

export default function HomeScreen() {
  const navigation = useNavigation();

  const navigateTo = (route: AppTab) => {
    router.push(route);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Phần mềm Quản lý Khách sạn</Text>
        <Text style={styles.headerSubtitle}>Chào mừng bạn trở lại!</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Phòng Trống</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Phòng Đã đặt</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>6</Text>
          <Text style={styles.statLabel}>Đang dọn dẹp</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Truy cập nhanh</Text>
      <View style={styles.quickAccessGrid}>
        <TouchableOpacity 
          style={styles.quickAccessItem}
          onPress={() => navigateTo('/(tabs)/rooms')}
        >
          <View style={styles.iconContainer}>
            <FontAwesome name="bed" size={24} color="#1890ff" />
          </View>
          <Text style={styles.quickAccessLabel}>Quản lý phòng</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAccessItem}
          onPress={() => navigateTo('/(tabs)/invoices')}
        >
          <View style={styles.iconContainer}>
            <FontAwesome name="file-text" size={24} color="#52c41a" />
          </View>
          <Text style={styles.quickAccessLabel}>Hóa đơn</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAccessItem}
          onPress={() => navigateTo('/(tabs)/services')}
        >
          <View style={styles.iconContainer}>
            <FontAwesome name="th-list" size={24} color="#fa8c16" />
          </View>
          <Text style={styles.quickAccessLabel}>Dịch vụ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAccessItem}
          onPress={() => navigateTo('/(tabs)/profile')}
        >
          <View style={styles.iconContainer}>
            <FontAwesome name="user" size={24} color="#722ed1" />
          </View>
          <Text style={styles.quickAccessLabel}>Tài khoản</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Đặt phòng gần đây</Text>
      <View style={styles.bookingList}>
        <View style={styles.bookingItem}>
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingName}>Nguyễn Văn A</Text>
            <Text style={styles.bookingDetails}>Phòng 101 • Ngày 12/09/2023 - 15/09/2023</Text>
          </View>
          <View style={[styles.bookingStatus, {backgroundColor: '#e6f7ff'}]}>
            <Text style={{color: '#1890ff'}}>Đã check-in</Text>
          </View>
        </View>
        
        <View style={styles.bookingItem}>
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingName}>Trần Thị B</Text>
            <Text style={styles.bookingDetails}>Phòng 205 • Ngày 14/09/2023 - 17/09/2023</Text>
          </View>
          <View style={[styles.bookingStatus, {backgroundColor: '#fff7e6'}]}>
            <Text style={{color: '#fa8c16'}}>Sắp đến</Text>
          </View>
        </View>
      </View>

      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <FontAwesome name="sign-in" size={16} color="white" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>
                <Text style={styles.activityHighlight}>Nguyễn Văn A</Text> đã check-in vào phòng 101
              </Text>
              <Text style={styles.activityTime}>15 phút trước</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, {backgroundColor: '#52c41a'}]}>
              <FontAwesome name="check" size={16} color="white" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>
                Phòng 103 đã được dọn dẹp xong
              </Text>
              <Text style={styles.activityTime}>1 giờ trước</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, {backgroundColor: '#fa8c16'}]}>
              <FontAwesome name="bell" size={16} color="white" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>
                <Text style={styles.activityHighlight}>Lê Văn C</Text> đã yêu cầu dịch vụ giặt ủi
              </Text>
              <Text style={styles.activityTime}>3 giờ trước</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#1890ff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: -20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    margin: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1890ff',
  },
  statLabel: {
    fontSize: 12,
    color: '#8c8c8c',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  quickAccessItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconText: {
    fontSize: 24,
  },
  quickAccessLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  bookingList: {
    paddingHorizontal: 20,
  },
  bookingItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookingDetails: {
    fontSize: 14,
    color: '#8c8c8c',
    marginTop: 4,
  },
  bookingStatus: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginLeft: 10,
  },
  activitySection: {
    paddingBottom: 30,
  },
  activityList: {
    paddingHorizontal: 20,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1890ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activityContent: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15,
  },
  activityText: {
    fontSize: 14,
    color: '#262626',
    marginBottom: 4,
  },
  activityHighlight: {
    fontWeight: 'bold',
  },
  activityTime: {
    fontSize: 12,
    color: '#8c8c8c',
  },
}); 