import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity, Dimensions, TextInput, Modal, Alert } from 'react-native';
import { useNavigation, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { LinearGradient } from 'expo-linear-gradient';

// Định nghĩa các tab được hỗ trợ
type AppTab = '/(tabs)/rooms' | '/(tabs)/services' | '/(tabs)/invoices' | '/(tabs)/profile';
type RevenueTab = 'day' | 'week' | 'month';
type OTASource = 'booking' | 'agoda' | 'traveloka' | 'airbnb' | 'expedia';

// Giao diện cho thông tin đặt phòng từ OTA
interface OTABooking {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: number;
  source: OTASource;
  status: 'pending' | 'confirmed' | 'cancelled';
  contactInfo: string;
}

function HomeScreen() {
  const navigation = useNavigation();
  const [revenueTab, setRevenueTab] = useState<RevenueTab>('day');
  const [roomSalesTab, setRoomSalesTab] = useState<RevenueTab>('day');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOTA, setSelectedOTA] = useState<OTASource | null>(null);
  const [otaUsername, setOtaUsername] = useState('');
  const [otaPassword, setOtaPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otaBookings, setOtaBookings] = useState<OTABooking[]>([]);

  const navigateTo = (route: AppTab) => {
    router.push(route);
  };

  // Dữ liệu doanh thu theo ngày
  const dayRevenueData = [
    {value: 1500000, label: 'Sáng', labelTextStyle: {color: 'gray', width: 60}},
    {value: 2200000, label: 'Trưa', labelTextStyle: {color: 'gray', width: 60}},
    {value: 1800000, label: 'Chiều', labelTextStyle: {color: 'gray', width: 60}},
    {value: 2500000, label: 'Tối', labelTextStyle: {color: 'gray', width: 60}},
  ];

  // Dữ liệu doanh thu theo tuần
  const weekRevenueData = [
    {value: 12500000, label: 'T2', labelTextStyle: {color: 'gray', width: 30}},
    {value: 10800000, label: 'T3', labelTextStyle: {color: 'gray', width: 30}},
    {value: 9500000, label: 'T4', labelTextStyle: {color: 'gray', width: 30}},
    {value: 13200000, label: 'T5', labelTextStyle: {color: 'gray', width: 30}},
    {value: 16500000, label: 'T6', labelTextStyle: {color: 'gray', width: 30}},
    {value: 19800000, label: 'T7', labelTextStyle: {color: 'gray', width: 30}},
    {value: 18200000, label: 'CN', labelTextStyle: {color: 'gray', width: 30}},
  ];

  // Dữ liệu doanh thu theo tháng
  const monthRevenueData = [
    {value: 82000000, label: 'T1', labelTextStyle: {color: 'gray', width: 30}},
    {value: 78500000, label: 'T2', labelTextStyle: {color: 'gray', width: 30}},
    {value: 92000000, label: 'T3', labelTextStyle: {color: 'gray', width: 30}},
    {value: 88500000, label: 'T4', labelTextStyle: {color: 'gray', width: 30}},
    {value: 84200000, label: 'T5', labelTextStyle: {color: 'gray', width: 30}},
    {value: 95800000, label: 'T6', labelTextStyle: {color: 'gray', width: 30}},
    {value: 102300000, label: 'T7', labelTextStyle: {color: 'gray', width: 30}},
    {value: 98700000, label: 'T8', labelTextStyle: {color: 'gray', width: 30}},
    {value: 86500000, label: 'T9', labelTextStyle: {color: 'gray', width: 30}},
    {value: 91200000, label: 'T10', labelTextStyle: {color: 'gray', width: 30}},
    {value: 96500000, label: 'T11', labelTextStyle: {color: 'gray', width: 30}},
    {value: 125000000, label: 'T12', labelTextStyle: {color: 'gray', width: 30}},
  ];

  // Dữ liệu lượt bán phòng theo ngày
  const dayRoomSalesData = [
    {value: 5, label: 'Sáng', labelTextStyle: {color: 'gray', width: 60}, frontColor: '#52c41a'},
    {value: 8, label: 'Trưa', labelTextStyle: {color: 'gray', width: 60}, frontColor: '#52c41a'},
    {value: 6, label: 'Chiều', labelTextStyle: {color: 'gray', width: 60}, frontColor: '#52c41a'},
    {value: 10, label: 'Tối', labelTextStyle: {color: 'gray', width: 60}, frontColor: '#52c41a'},
  ];

  // Dữ liệu lượt bán phòng theo tuần
  const weekRoomSalesData = [
    {value: 25, label: 'T2', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 18, label: 'T3', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 22, label: 'T4', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 30, label: 'T5', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 35, label: 'T6', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 42, label: 'T7', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 38, label: 'CN', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
  ];

  // Dữ liệu lượt bán phòng theo tháng
  const monthRoomSalesData = [
    {value: 180, label: 'T1', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 165, label: 'T2', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 195, label: 'T3', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 188, label: 'T4', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 178, label: 'T5', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 203, label: 'T6', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 220, label: 'T7', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 215, label: 'T8', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 182, label: 'T9', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 195, label: 'T10', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 210, label: 'T11', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
    {value: 260, label: 'T12', labelTextStyle: {color: 'gray', width: 30}, frontColor: '#52c41a'},
  ];

  // Chọn dữ liệu doanh thu dựa theo tab hiện tại
  const getRevenueData = () => {
    switch (revenueTab) {
      case 'day':
        return dayRevenueData;
      case 'week':
        return weekRevenueData;
      case 'month':
        return monthRevenueData;
      default:
        return dayRevenueData;
    }
  };

  // Chọn dữ liệu lượt bán phòng dựa theo tab hiện tại
  const getRoomSalesData = () => {
    switch (roomSalesTab) {
      case 'day':
        return dayRoomSalesData;
      case 'week':
        return weekRoomSalesData;
      case 'month':
        return monthRoomSalesData;
      default:
        return dayRoomSalesData;
    }
  };

  // Format số tiền
  const formatMoney = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Lấy tổng doanh thu
  const getTotalRevenue = () => {
    switch (revenueTab) {
      case 'day':
        return 8000000;
      case 'week':
        return 100500000;
      case 'month':
        return 1025700000;
      default:
        return 0;
    }
  };

  // Lấy tổng lượt bán phòng
  const getTotalRoomSales = () => {
    switch (roomSalesTab) {
      case 'day':
        return 29;
      case 'week':
        return 210;
      case 'month':
        return 2190;
      default:
        return 0;
    }
  };

  // Mở modal đăng nhập OTA
  const openOTAModal = (source: OTASource) => {
    setSelectedOTA(source);
    setOtaUsername('');
    setOtaPassword('');
    setModalVisible(true);
  };

  // Lấy dữ liệu từ OTA
  const fetchOTAData = useCallback(async () => {
    if (!selectedOTA || !otaUsername || !otaPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin đăng nhập');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mô phỏng gọi API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dữ liệu mẫu dựa trên OTA được chọn
      const mockData: OTABooking[] = [
        {
          id: '123456',
          guestName: 'Nguyễn Văn An',
          checkIn: '25/05/2025',
          checkOut: '27/05/2025',
          roomType: 'Phòng Deluxe',
          guests: 2,
          source: selectedOTA,
          status: 'confirmed',
          contactInfo: '0912345678'
        },
        {
          id: '789012',
          guestName: 'Trần Thị Bình',
          checkIn: '26/05/2025',
          checkOut: '29/05/2025',
          roomType: 'Phòng Suite',
          guests: 3,
          source: selectedOTA,
          status: 'pending',
          contactInfo: '0987654321'
        }
      ];
      
      setOtaBookings(mockData);
      setModalVisible(false);
      Alert.alert('Thành công', `Đã lấy ${mockData.length} đơn đặt phòng từ ${getOTAName(selectedOTA)}`);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối với dịch vụ. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedOTA, otaUsername, otaPassword]);

  // Lấy tên OTA
  const getOTAName = (source: OTASource): string => {
    switch(source) {
      case 'booking': return 'Booking.com';
      case 'agoda': return 'Agoda';
      case 'traveloka': return 'Traveloka';
      case 'airbnb': return 'Airbnb';
      case 'expedia': return 'Expedia';
      default: return '';
    }
  };

  // Lấy màu OTA
  const getOTAColor = (source: OTASource): string => {
    switch(source) {
      case 'booking': return '#003580';
      case 'agoda': return '#5542F6';
      case 'traveloka': return '#0064D2';
      case 'airbnb': return '#FF5A5F';
      case 'expedia': return '#00355F';
      default: return '#333333';
    }
  };

  // Lấy icon OTA
  const getOTAIcon = (source: OTASource): any => {
    switch(source) {
      case 'booking': return 'calendar-check-o';
      case 'agoda': return 'globe';
      case 'traveloka': return 'plane';
      case 'airbnb': return 'home';
      case 'expedia': return 'suitcase';
      default: return 'question';
    }
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

      {/* Phần OTA Sync */}
      <View style={styles.otaSection}>
        <Text style={styles.sectionTitle}>Đồng bộ đặt phòng OTA</Text>
        <View style={styles.otaGrid}>
          <TouchableOpacity 
            style={styles.otaItem}
            onPress={() => openOTAModal('booking')}
          >
            <View style={[styles.otaIconContainer, {backgroundColor: '#003580'}]}>
              <FontAwesome name="calendar-check-o" size={20} color="white" />
            </View>
            <Text style={styles.otaName}>Booking.com</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.otaItem}
            onPress={() => openOTAModal('agoda')}
          >
            <View style={[styles.otaIconContainer, {backgroundColor: '#5542F6'}]}>
              <FontAwesome name="globe" size={20} color="white" />
            </View>
            <Text style={styles.otaName}>Agoda</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.otaItem}
            onPress={() => openOTAModal('traveloka')}
          >
            <View style={[styles.otaIconContainer, {backgroundColor: '#0064D2'}]}>
              <FontAwesome name="plane" size={20} color="white" />
            </View>
            <Text style={styles.otaName}>Traveloka</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.otaItem}
            onPress={() => openOTAModal('airbnb')}
          >
            <View style={[styles.otaIconContainer, {backgroundColor: '#FF5A5F'}]}>
              <FontAwesome name="home" size={20} color="white" />
            </View>
            <Text style={styles.otaName}>Airbnb</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.otaItem}
            onPress={() => openOTAModal('expedia')}
          >
            <View style={[styles.otaIconContainer, {backgroundColor: '#00355F'}]}>
              <FontAwesome name="suitcase" size={20} color="white" />
            </View>
            <Text style={styles.otaName}>Expedia</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hiển thị danh sách đặt phòng OTA nếu có */}
      {otaBookings.length > 0 && (
        <View style={styles.otaBookingsSection}>
          <Text style={styles.sectionTitle}>Đơn đặt phòng gần đây từ OTA</Text>
          {otaBookings.map((booking) => (
            <View key={booking.id} style={styles.otaBookingItem}>
              <View style={styles.otaBookingHeader}>
                <View style={styles.otaBookingSource}>
                  <View style={[styles.otaSourceIcon, { backgroundColor: getOTAColor(booking.source) }]}>
                    <FontAwesome name={getOTAIcon(booking.source)} size={14} color="white" />
                  </View>
                  <Text style={styles.otaSourceName}>{getOTAName(booking.source)}</Text>
                </View>
                <View style={[styles.otaBookingStatus, 
                  booking.status === 'confirmed' 
                    ? styles.statusConfirmed 
                    : booking.status === 'pending' 
                      ? styles.statusPending 
                      : styles.statusCancelled
                ]}>
                  <Text style={styles.otaBookingStatusText}>
                    {booking.status === 'confirmed' ? 'Đã xác nhận' : 
                    booking.status === 'pending' ? 'Chờ xác nhận' : 'Đã hủy'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.otaBookingDetails}>
                <View style={styles.otaBookingDetail}>
                  <Text style={styles.otaBookingLabel}>Khách hàng:</Text>
                  <Text style={styles.otaBookingValue}>{booking.guestName}</Text>
                </View>
                <View style={styles.otaBookingDetail}>
                  <Text style={styles.otaBookingLabel}>Nhận phòng:</Text>
                  <Text style={styles.otaBookingValue}>{booking.checkIn}</Text>
                </View>
                <View style={styles.otaBookingDetail}>
                  <Text style={styles.otaBookingLabel}>Trả phòng:</Text>
                  <Text style={styles.otaBookingValue}>{booking.checkOut}</Text>
                </View>
                <View style={styles.otaBookingDetail}>
                  <Text style={styles.otaBookingLabel}>Loại phòng:</Text>
                  <Text style={styles.otaBookingValue}>{booking.roomType}</Text>
                </View>
                <View style={styles.otaBookingDetail}>
                  <Text style={styles.otaBookingLabel}>Số khách:</Text>
                  <Text style={styles.otaBookingValue}>{booking.guests} người</Text>
                </View>
                <View style={styles.otaBookingDetail}>
                  <Text style={styles.otaBookingLabel}>Liên hệ:</Text>
                  <Text style={styles.otaBookingValue}>{booking.contactInfo}</Text>
                </View>
              </View>
              
              <View style={styles.otaBookingActions}>
                <TouchableOpacity style={styles.otaBookingAction}>
                  <FontAwesome name="check-circle" size={16} color="#52c41a" />
                  <Text style={styles.otaBookingActionText}>Xác nhận</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.otaBookingAction}>
                  <FontAwesome name="calendar-plus-o" size={16} color="#1890ff" />
                  <Text style={styles.otaBookingActionText}>Đặt phòng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.otaBookingAction}>
                  <FontAwesome name="times-circle" size={16} color="#f5222d" />
                  <Text style={styles.otaBookingActionText}>Từ chối</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

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

      {/* Biểu đồ doanh thu */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Thống kê doanh thu</Text>
        
        {/* Tab chọn loại biểu đồ */}
        <View style={styles.chartTabs}>
          <TouchableOpacity 
            style={[styles.chartTab, revenueTab === 'day' && styles.chartTabActive]}
            onPress={() => setRevenueTab('day')}
          >
            <Text style={[styles.chartTabText, revenueTab === 'day' && styles.chartTabTextActive]}>Theo ngày</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.chartTab, revenueTab === 'week' && styles.chartTabActive]}
            onPress={() => setRevenueTab('week')}
          >
            <Text style={[styles.chartTabText, revenueTab === 'week' && styles.chartTabTextActive]}>Theo tuần</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.chartTab, revenueTab === 'month' && styles.chartTabActive]}
            onPress={() => setRevenueTab('month')}
          >
            <Text style={[styles.chartTabText, revenueTab === 'month' && styles.chartTabTextActive]}>Theo tháng</Text>
          </TouchableOpacity>
        </View>
        
        {/* Biểu đồ */}
        <View style={styles.chartContainer}>
          <LineChart
            data={getRevenueData()}
            width={Dimensions.get('window').width - 40}
            height={180}
            spacing={revenueTab === 'month' ? 15 : 30}
            initialSpacing={10}
            color="#1890ff"
            thickness={2}
            hideDataPoints={false}
            dataPointsColor="#1890ff"
            dataPointsRadius={4}
            noOfSections={5}
            yAxisTextStyle={{color: 'gray'}}
            yAxisLabelPrefix=""
            yAxisLabelSuffix=" đ"
            // @ts-ignore
            yAxisFormatter={(value: any) => {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(0) + 'tr';
              }
              return value.toString();
            }}
            rulesType="solid"
            rulesColor="rgba(200, 200, 200, 0.2)"
          />
        </View>

        {/* Tổng doanh thu */}
        <View style={styles.chartTotal}>
          <View style={styles.chartTotalItem}>
            <Text style={styles.chartTotalLabel}>Tổng doanh thu:</Text>
            <Text style={[styles.chartTotalValue, {color: '#1890ff'}]}>
              {formatMoney(getTotalRevenue())} đ
            </Text>
          </View>
        </View>
      </View>

      {/* Biểu đồ lượt bán phòng */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Thống kê lượt bán phòng</Text>
        
        {/* Tab chọn loại biểu đồ */}
        <View style={styles.chartTabs}>
          <TouchableOpacity 
            style={[styles.chartTab, roomSalesTab === 'day' && styles.chartTabActive]}
            onPress={() => setRoomSalesTab('day')}
          >
            <Text style={[styles.chartTabText, roomSalesTab === 'day' && styles.chartTabTextActive]}>Theo ngày</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.chartTab, roomSalesTab === 'week' && styles.chartTabActive]}
            onPress={() => setRoomSalesTab('week')}
          >
            <Text style={[styles.chartTabText, roomSalesTab === 'week' && styles.chartTabTextActive]}>Theo tuần</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.chartTab, roomSalesTab === 'month' && styles.chartTabActive]}
            onPress={() => setRoomSalesTab('month')}
          >
            <Text style={[styles.chartTabText, roomSalesTab === 'month' && styles.chartTabTextActive]}>Theo tháng</Text>
          </TouchableOpacity>
        </View>
        
        {/* Biểu đồ */}
        <View style={styles.chartContainer}>
          <BarChart
            data={getRoomSalesData()}
            width={Dimensions.get('window').width - 40}
            height={180}
            spacing={roomSalesTab === 'month' ? 8 : 30}
            initialSpacing={10}
            barWidth={roomSalesTab === 'month' ? 12 : 25}
            noOfSections={5}
            yAxisTextStyle={{color: 'gray'}}
            showLine={false}
            showVerticalLines={false}
            rulesType="solid"
            rulesColor="rgba(200, 200, 200, 0.2)"
          />
        </View>

        {/* Tổng lượt bán phòng */}
        <View style={styles.chartTotal}>
          <View style={styles.chartTotalItem}>
            <Text style={styles.chartTotalLabel}>Tổng lượt bán:</Text>
            <Text style={[styles.chartTotalValue, {color: '#52c41a'}]}>
              {getTotalRoomSales()} phòng
            </Text>
          </View>
        </View>
      </View>

      {/* OTA Login Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              {selectedOTA && (
                <LinearGradient
                  colors={['rgba(0,0,0,0.1)', getOTAColor(selectedOTA)]}
                  style={styles.modalBanner}
                >
                  <FontAwesome name={getOTAIcon(selectedOTA)} size={24} color="white" />
                  <Text style={styles.modalTitle}>Đăng nhập {getOTAName(selectedOTA)}</Text>
                </LinearGradient>
              )}
              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setModalVisible(false)}
              >
                <FontAwesome name="times" size={20} color="#999" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Tài khoản</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nhập tài khoản"
                value={otaUsername}
                onChangeText={setOtaUsername}
                autoCapitalize="none"
              />
              
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nhập mật khẩu"
                value={otaPassword}
                onChangeText={setOtaPassword}
                secureTextEntry
              />
              
              <TouchableOpacity 
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={fetchOTAData}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Đang xử lý...' : 'Lấy dữ liệu đặt phòng'}
                </Text>
              </TouchableOpacity>
              
              <Text style={styles.helpText}>
                Lưu ý: Dữ liệu sẽ được đồng bộ hàng ngày từ hệ thống OTA
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

export default HomeScreen;

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
  chartSection: {
    paddingBottom: 20,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    paddingTop: 10,
  },
  chartTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  chartTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#f5f5f5',
  },
  chartTabActive: {
    backgroundColor: '#1890ff',
  },
  chartTabText: {
    fontSize: 12,
    color: '#8c8c8c',
  },
  chartTabTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  chartTotal: {
    paddingHorizontal: 20,
    marginTop: 5,
  },
  chartTotalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  chartTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8c8c8c',
  },
  chartTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Styles cho phần OTA
  otaSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  otaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  otaItem: {
    width: '18%',
    alignItems: 'center',
    marginBottom: 15,
  },
  otaIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  otaName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  
  // Styles cho Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    position: 'relative',
  },
  modalBanner: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalClose: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#1890ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#bae7ff',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpText: {
    marginTop: 15,
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  
  // Styles cho danh sách đặt phòng OTA
  otaBookingsSection: {
    marginTop: 20,
  },
  otaBookingItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  otaBookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  otaBookingSource: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otaSourceIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  otaSourceName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  otaBookingStatus: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: '#f6ffed',
  },
  statusPending: {
    backgroundColor: '#e6f7ff',
  },
  statusCancelled: {
    backgroundColor: '#fff1f0',
  },
  otaBookingStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#52c41a',
  },
  otaBookingDetails: {
    padding: 15,
  },
  otaBookingDetail: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  otaBookingLabel: {
    width: 100,
    fontSize: 14,
    color: '#888',
  },
  otaBookingValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  otaBookingActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  otaBookingAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  otaBookingActionText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#333',
  },
}); 