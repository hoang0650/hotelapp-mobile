import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  Alert,
  FlatList
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, DateData } from 'react-native-calendars';

// Định nghĩa các loại phòng
type RoomType = 'standard' | 'deluxe' | 'suite' | 'family' | 'executive';
type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
type BookingSource = 'direct' | 'booking' | 'agoda' | 'traveloka' | 'airbnb' | 'expedia';

// Interface cho dữ liệu phòng
interface Room {
  id: string;
  number: string;
  type: RoomType;
  price: number;
  maxGuests: number;
  available: boolean;
  amenities: string[];
  imageUrl?: string;
}

// Interface cho dữ liệu đặt phòng
interface Booking {
  id: string;
  guestName: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  roomIds: string[];
  totalPrice: number;
  status: BookingStatus;
  source: BookingSource;
  notes?: string;
  createdAt: string;
}

// Dữ liệu mẫu - danh sách phòng
const SAMPLE_ROOMS: Room[] = [
  {
    id: '1',
    number: '101',
    type: 'standard',
    price: 800000,
    maxGuests: 2,
    available: true,
    amenities: ['Wifi', 'TV', 'Điều hòa', 'Minibar']
  },
  {
    id: '2',
    number: '102',
    type: 'standard',
    price: 800000,
    maxGuests: 2,
    available: false,
    amenities: ['Wifi', 'TV', 'Điều hòa', 'Minibar']
  },
  {
    id: '3',
    number: '201',
    type: 'deluxe',
    price: 1200000,
    maxGuests: 3,
    available: true,
    amenities: ['Wifi', 'TV', 'Điều hòa', 'Minibar', 'Bồn tắm']
  },
  {
    id: '4',
    number: '202',
    type: 'deluxe',
    price: 1200000,
    maxGuests: 3,
    available: true,
    amenities: ['Wifi', 'TV', 'Điều hòa', 'Minibar', 'Bồn tắm']
  },
  {
    id: '5',
    number: '301',
    type: 'suite',
    price: 1800000,
    maxGuests: 4,
    available: true,
    amenities: ['Wifi', 'TV', 'Điều hòa', 'Minibar', 'Bồn tắm', 'Phòng khách']
  },
  {
    id: '6',
    number: '302',
    type: 'suite',
    price: 1800000,
    maxGuests: 4,
    available: false,
    amenities: ['Wifi', 'TV', 'Điều hòa', 'Minibar', 'Bồn tắm', 'Phòng khách']
  },
  {
    id: '7',
    number: '401',
    type: 'family',
    price: 2200000,
    maxGuests: 6,
    available: true,
    amenities: ['Wifi', 'TV', 'Điều hòa', 'Minibar', 'Bồn tắm', 'Phòng khách', '2 phòng ngủ']
  },
  {
    id: '8',
    number: '501',
    type: 'executive',
    price: 3500000,
    maxGuests: 2,
    available: true,
    amenities: ['Wifi', 'TV', 'Điều hòa', 'Minibar', 'Jacuzzi', 'Phòng khách', 'Ban công']
  }
];

// Dữ liệu mẫu - danh sách đặt phòng
const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    guestName: 'Nguyễn Văn A',
    guestPhone: '0912345678',
    checkIn: '20/05/2025',
    checkOut: '22/05/2025',
    roomIds: ['1'],
    totalPrice: 1600000,
    status: 'confirmed',
    source: 'direct',
    createdAt: '18/05/2025'
  },
  {
    id: 'b2',
    guestName: 'Trần Thị B',
    guestPhone: '0987654321',
    checkIn: '21/05/2025',
    checkOut: '25/05/2025',
    roomIds: ['3'],
    totalPrice: 4800000,
    status: 'pending',
    source: 'booking',
    createdAt: '15/05/2025'
  },
  {
    id: 'b3',
    guestName: 'Lê Văn C',
    guestPhone: '0909123456',
    checkIn: '22/05/2025',
    checkOut: '24/05/2025',
    roomIds: ['5'],
    totalPrice: 3600000,
    status: 'confirmed',
    source: 'agoda',
    createdAt: '19/05/2025'
  }
];

export default function BookingScreen() {
  // State cho các tab
  const [activeTab, setActiveTab] = useState<'rooms' | 'bookings'>('rooms');
  
  // State cho phòng và đặt phòng
  const [rooms, setRooms] = useState<Room[]>(SAMPLE_ROOMS);
  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS);
  
  // State cho ngày được chọn
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [markedDates, setMarkedDates] = useState<{[key: string]: any}>({});
  
  // State cho bộ lọc
  const [filters, setFilters] = useState({
    roomType: '' as RoomType | '',
    available: true,
    minPrice: 0,
    maxPrice: 5000000,
    dateRange: '',
  });
  
  // State cho modal đặt phòng
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);
  const [bookingDetails, setBookingDetails] = useState({
    guestName: '',
    guestPhone: '',
    checkIn: '',
    checkOut: '',
    source: 'direct' as BookingSource,
    notes: ''
  });

  // Cập nhật markedDates khi bookings thay đổi
  useEffect(() => {
    const newMarkedDates: {[key: string]: any} = {};
    
    // Đánh dấu ngày được chọn
    newMarkedDates[selectedDate] = {
      selected: true,
      selectedColor: '#1890ff'
    };
    
    // Đánh dấu ngày có booking
    bookings.forEach(booking => {
      // Convert định dạng dd/mm/yyyy sang yyyy-mm-dd
      const checkInParts = booking.checkIn.split('/');
      const checkOutParts = booking.checkOut.split('/');
      
      if (checkInParts.length === 3 && checkOutParts.length === 3) {
        const checkInFormatted = `${checkInParts[2]}-${checkInParts[1]}-${checkInParts[0]}`;
        const checkOutFormatted = `${checkOutParts[2]}-${checkOutParts[1]}-${checkOutParts[0]}`;
        
        // Đánh dấu ngày check-in
        if (newMarkedDates[checkInFormatted]) {
          newMarkedDates[checkInFormatted] = {
            ...newMarkedDates[checkInFormatted],
            startingDay: true,
            color: '#faad14',
            textColor: 'white'
          };
        } else {
          newMarkedDates[checkInFormatted] = {
            startingDay: true,
            color: '#faad14',
            textColor: 'white'
          };
        }
        
        // Đánh dấu ngày check-out
        if (newMarkedDates[checkOutFormatted]) {
          newMarkedDates[checkOutFormatted] = {
            ...newMarkedDates[checkOutFormatted],
            endingDay: true,
            color: '#52c41a',
            textColor: 'white'
          };
        } else {
          newMarkedDates[checkOutFormatted] = {
            endingDay: true,
            color: '#52c41a',
            textColor: 'white'
          };
        }
      }
    });
    
    setMarkedDates(newMarkedDates);
  }, [selectedDate, bookings]);

  // Xử lý khi ngày được chọn thay đổi
  const handleDateSelect = (day: DateData) => {
    setSelectedDate(day.dateString);
    
    // Lọc phòng theo ngày được chọn
    const selectedDateObj = new Date(day.dateString);
    const formattedSelectedDate = `${selectedDateObj.getDate().toString().padStart(2, '0')}/${(selectedDateObj.getMonth() + 1).toString().padStart(2, '0')}/${selectedDateObj.getFullYear()}`;
    
    // Kiểm tra xem phòng có được đặt trong ngày này không
    const updatedRooms = SAMPLE_ROOMS.map(room => {
      const isBooked = bookings.some(booking => {
        // Kiểm tra xem phòng có trong booking nào mà ngày được chọn nằm trong khoảng check-in và check-out
        if (!booking.roomIds.includes(room.id)) return false;
        
        const checkInParts = booking.checkIn.split('/');
        const checkOutParts = booking.checkOut.split('/');
        
        if (checkInParts.length !== 3 || checkOutParts.length !== 3) return false;
        
        const checkInDate = new Date(
          parseInt(checkInParts[2]), 
          parseInt(checkInParts[1]) - 1, 
          parseInt(checkInParts[0])
        );
        
        const checkOutDate = new Date(
          parseInt(checkOutParts[2]), 
          parseInt(checkOutParts[1]) - 1, 
          parseInt(checkOutParts[0])
        );
        
        return selectedDateObj >= checkInDate && selectedDateObj <= checkOutDate;
      });
      
      return { ...room, available: !isBooked };
    });
    
    setRooms(updatedRooms);
  };

  // Lọc bookings theo ngày được chọn
  const filteredBookings = bookings.filter(booking => {
    // Convert định dạng dd/mm/yyyy sang Date
    const checkInParts = booking.checkIn.split('/');
    const checkOutParts = booking.checkOut.split('/');
    
    if (checkInParts.length !== 3 || checkOutParts.length !== 3) return false;
    
    const checkInDate = new Date(
      parseInt(checkInParts[2]), 
      parseInt(checkInParts[1]) - 1, 
      parseInt(checkInParts[0])
    );
    
    const checkOutDate = new Date(
      parseInt(checkOutParts[2]), 
      parseInt(checkOutParts[1]) - 1, 
      parseInt(checkOutParts[0])
    );
    
    const selectedDateObj = new Date(selectedDate);
    
    return selectedDateObj >= checkInDate && selectedDateObj <= checkOutDate;
  });

  // Xử lý lọc phòng
  const filteredRooms = rooms.filter(room => {
    if (filters.roomType && room.type !== filters.roomType) return false;
    if (filters.available && !room.available) return false;
    if (room.price < filters.minPrice || room.price > filters.maxPrice) return false;
    return true;
  });
  
  // Format số tiền VND
  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
  };
  
  // Lấy màu theo trạng thái đặt phòng
  const getStatusColor = (status: BookingStatus) => {
    switch(status) {
      case 'confirmed': return '#52c41a';
      case 'pending': return '#faad14';
      case 'completed': return '#1890ff';
      case 'cancelled': return '#f5222d';
      default: return '#8c8c8c';
    }
  };
  
  // Lấy tên hiển thị cho nguồn đặt phòng
  const getSourceName = (source: BookingSource) => {
    switch(source) {
      case 'direct': return 'Trực tiếp';
      case 'booking': return 'Booking.com';
      case 'agoda': return 'Agoda';
      case 'traveloka': return 'Traveloka';
      case 'airbnb': return 'Airbnb';
      case 'expedia': return 'Expedia';
      default: return source;
    }
  };
  
  // Lấy màu cho nguồn đặt phòng
  const getSourceColor = (source: BookingSource) => {
    switch(source) {
      case 'direct': return '#1890ff';
      case 'booking': return '#003580';
      case 'agoda': return '#5542F6';
      case 'traveloka': return '#0064D2';
      case 'airbnb': return '#FF5A5F';
      case 'expedia': return '#00355F';
      default: return '#8c8c8c';
    }
  };
  
  // Xử lý đặt phòng mới
  const handleBookRoom = () => {
    if (selectedRoomIds.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một phòng');
      return;
    }
    
    if (!bookingDetails.guestName || !bookingDetails.guestPhone || 
        !bookingDetails.checkIn || !bookingDetails.checkOut) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    // Tính tổng tiền
    const totalPrice = selectedRoomIds.reduce((sum, roomId) => {
      const room = rooms.find(r => r.id === roomId);
      return sum + (room ? room.price : 0);
    }, 0);
    
    // Tạo đặt phòng mới
    const newBooking: Booking = {
      id: 'b' + (bookings.length + 1),
      guestName: bookingDetails.guestName,
      guestPhone: bookingDetails.guestPhone,
      checkIn: bookingDetails.checkIn,
      checkOut: bookingDetails.checkOut,
      roomIds: selectedRoomIds,
      totalPrice,
      status: 'confirmed',
      source: bookingDetails.source,
      notes: bookingDetails.notes,
      createdAt: new Date().toLocaleDateString('vi-VN')
    };
    
    // Cập nhật trạng thái phòng
    const updatedRooms = rooms.map(room => {
      if (selectedRoomIds.includes(room.id)) {
        return { ...room, available: false };
      }
      return room;
    });
    
    setRooms(updatedRooms);
    setBookings([...bookings, newBooking]);
    setShowBookingModal(false);
    resetBookingForm();
    
    Alert.alert('Thành công', 'Đã đặt phòng thành công');
  };
  
  // Reset form đặt phòng
  const resetBookingForm = () => {
    setSelectedRoomIds([]);
    setBookingDetails({
      guestName: '',
      guestPhone: '',
      checkIn: '',
      checkOut: '',
      source: 'direct',
      notes: ''
    });
  };
  
  // Toggle chọn phòng
  const toggleRoomSelection = (roomId: string) => {
    if (selectedRoomIds.includes(roomId)) {
      setSelectedRoomIds(selectedRoomIds.filter(id => id !== roomId));
    } else {
      setSelectedRoomIds([...selectedRoomIds, roomId]);
    }
  };

  // Component hiển thị một phòng
  const RoomItem = ({ room }: { room: Room }) => (
    <TouchableOpacity 
      style={[
        styles.roomCard, 
        !room.available && styles.roomUnavailable,
        selectedRoomIds.includes(room.id) && styles.roomSelected
      ]}
      onPress={() => room.available && toggleRoomSelection(room.id)}
      disabled={!room.available}
    >
      <View style={styles.roomHeader}>
        <Text style={styles.roomNumber}>Phòng {room.number}</Text>
        <View style={[
          styles.roomStatusBadge, 
          { backgroundColor: room.available ? '#e6f7ff' : '#fff1f0' }
        ]}>
          <Text style={[
            styles.roomStatusText, 
            { color: room.available ? '#1890ff' : '#f5222d' }
          ]}>
            {room.available ? 'Trống' : 'Đã đặt'}
          </Text>
        </View>
      </View>
      
      <View style={styles.roomDetails}>
        <Text style={styles.roomType}>
          {room.type === 'standard' ? 'Phòng Tiêu chuẩn' :
           room.type === 'deluxe' ? 'Phòng Deluxe' :
           room.type === 'suite' ? 'Phòng Suite' :
           room.type === 'family' ? 'Phòng Gia đình' :
           'Phòng Executive'}
        </Text>
        <Text style={styles.roomPrice}>{formatCurrency(room.price)}/đêm</Text>
        <Text style={styles.roomGuests}>Tối đa {room.maxGuests} khách</Text>
        
        <View style={styles.roomAmenities}>
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityTag}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
          {room.amenities.length > 3 && (
            <View style={styles.amenityTag}>
              <Text style={styles.amenityText}>+{room.amenities.length - 3}</Text>
            </View>
          )}
        </View>
      </View>
      
      {selectedRoomIds.includes(room.id) && (
        <View style={styles.selectedOverlay}>
          <FontAwesome name="check-circle" size={24} color="#52c41a" />
        </View>
      )}
    </TouchableOpacity>
  );

  // Component hiển thị một đặt phòng
  const BookingItem = ({ booking }: { booking: Booking }) => {
    const roomNumbers = booking.roomIds.map(roomId => {
      const room = rooms.find(r => r.id === roomId);
      return room ? room.number : '';
    }).join(', ');
    
    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <View style={styles.bookingSource}>
            <View style={[styles.sourceTag, { backgroundColor: getSourceColor(booking.source) }]}>
              <Text style={styles.sourceTagText}>{getSourceName(booking.source)}</Text>
            </View>
            <Text style={styles.bookingId}>#{booking.id}</Text>
          </View>
          <View style={[styles.statusTag, { backgroundColor: `${getStatusColor(booking.status)}20` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
              {booking.status === 'confirmed' ? 'Đã xác nhận' :
               booking.status === 'pending' ? 'Chờ xác nhận' :
               booking.status === 'completed' ? 'Hoàn thành' :
               'Đã hủy'}
            </Text>
          </View>
        </View>
        
        <View style={styles.bookingBody}>
          <View style={styles.bookingDetail}>
            <Text style={styles.bookingLabel}>Khách hàng:</Text>
            <Text style={styles.bookingValue}>{booking.guestName}</Text>
          </View>
          <View style={styles.bookingDetail}>
            <Text style={styles.bookingLabel}>SĐT:</Text>
            <Text style={styles.bookingValue}>{booking.guestPhone}</Text>
          </View>
          <View style={styles.bookingDetail}>
            <Text style={styles.bookingLabel}>Ngày đến:</Text>
            <Text style={styles.bookingValue}>{booking.checkIn}</Text>
          </View>
          <View style={styles.bookingDetail}>
            <Text style={styles.bookingLabel}>Ngày đi:</Text>
            <Text style={styles.bookingValue}>{booking.checkOut}</Text>
          </View>
          <View style={styles.bookingDetail}>
            <Text style={styles.bookingLabel}>Phòng:</Text>
            <Text style={styles.bookingValue}>Phòng {roomNumbers}</Text>
          </View>
          <View style={styles.bookingDetail}>
            <Text style={styles.bookingLabel}>Tổng tiền:</Text>
            <Text style={styles.bookingValue}>{formatCurrency(booking.totalPrice)}</Text>
          </View>
        </View>
        
        <View style={styles.bookingFooter}>
          <TouchableOpacity style={styles.bookingAction}>
            <FontAwesome name="info-circle" size={16} color="#1890ff" />
            <Text style={styles.actionText}>Chi tiết</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookingAction}>
            <FontAwesome name="edit" size={16} color="#faad14" />
            <Text style={styles.actionText}>Chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookingAction}>
            <FontAwesome name="ban" size={16} color="#f5222d" />
            <Text style={styles.actionText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Calendar */}
      <View style={styles.calendarContainer}>
        <Calendar
          current={selectedDate}
          onDayPress={handleDateSelect}
          markedDates={markedDates}
          markingType={'period'}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#1890ff',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#1890ff',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: '#1890ff',
            monthTextColor: '#2d4150',
            indicatorColor: '#1890ff',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14
          }}
        />
        <View style={styles.calendarInfo}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#1890ff' }]} />
            <Text style={styles.legendText}>Ngày đã chọn</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#faad14' }]} />
            <Text style={styles.legendText}>Check-in</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#52c41a' }]} />
            <Text style={styles.legendText}>Check-out</Text>
          </View>
        </View>
      </View>

      {/* Header với tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'rooms' && styles.activeTabButton]} 
          onPress={() => setActiveTab('rooms')}
        >
          <Text style={[styles.tabText, activeTab === 'rooms' && styles.activeTabText]}>
            Danh sách phòng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'bookings' && styles.activeTabButton]} 
          onPress={() => setActiveTab('bookings')}
        >
          <Text style={[styles.tabText, activeTab === 'bookings' && styles.activeTabText]}>
            Đặt phòng
          </Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách phòng */}
      {activeTab === 'rooms' && (
        <View style={styles.contentContainer}>
          {/* Hiển thị ngày được chọn */}
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateText}>
              Phòng {filters.available ? 'trống' : ''} cho ngày: {selectedDate.split('-').reverse().join('/')}
            </Text>
            <Text style={styles.availabilityCount}>
              {filteredRooms.filter(r => r.available).length}/{rooms.length} phòng trống
            </Text>
          </View>
          
          {/* Filter options */}
          <View style={styles.filterContainer}>
            <Text style={styles.filterTitle}>Bộ lọc:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <TouchableOpacity 
                style={[styles.filterButton, filters.roomType === '' && styles.activeFilterButton]}
                onPress={() => setFilters({...filters, roomType: ''})}
              >
                <Text style={styles.filterText}>Tất cả</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, filters.roomType === 'standard' && styles.activeFilterButton]}
                onPress={() => setFilters({...filters, roomType: 'standard'})}
              >
                <Text style={styles.filterText}>Tiêu chuẩn</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, filters.roomType === 'deluxe' && styles.activeFilterButton]}
                onPress={() => setFilters({...filters, roomType: 'deluxe'})}
              >
                <Text style={styles.filterText}>Deluxe</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, filters.roomType === 'suite' && styles.activeFilterButton]}
                onPress={() => setFilters({...filters, roomType: 'suite'})}
              >
                <Text style={styles.filterText}>Suite</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, filters.roomType === 'family' && styles.activeFilterButton]}
                onPress={() => setFilters({...filters, roomType: 'family'})}
              >
                <Text style={styles.filterText}>Gia đình</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.filterButton, filters.roomType === 'executive' && styles.activeFilterButton]}
                onPress={() => setFilters({...filters, roomType: 'executive'})}
              >
                <Text style={styles.filterText}>Executive</Text>
              </TouchableOpacity>
            </ScrollView>
            
            <View style={styles.availabilityFilter}>
              <TouchableOpacity 
                style={[styles.availabilityButton, filters.available && styles.activeAvailabilityButton]}
                onPress={() => setFilters({...filters, available: true})}
              >
                <Text style={[styles.availabilityText, filters.available && styles.activeAvailabilityText]}>
                  Phòng trống
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.availabilityButton, !filters.available && styles.activeAvailabilityButton]}
                onPress={() => setFilters({...filters, available: false})}
              >
                <Text style={[styles.availabilityText, !filters.available && styles.activeAvailabilityText]}>
                  Tất cả phòng
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Danh sách phòng */}
          <FlatList
            data={filteredRooms}
            renderItem={({ item }) => <RoomItem room={item} />}
            keyExtractor={item => item.id}
            style={styles.roomList}
            showsVerticalScrollIndicator={false}
          />
          
          {/* Nút đặt phòng */}
          {selectedRoomIds.length > 0 && (
            <View style={styles.bookingButtonContainer}>
              <TouchableOpacity 
                style={styles.bookingButton}
                onPress={() => setShowBookingModal(true)}
              >
                <Text style={styles.bookingButtonText}>
                  Đặt {selectedRoomIds.length} phòng
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Danh sách đặt phòng */}
      {activeTab === 'bookings' && (
        <View style={styles.contentContainer}>
          {/* Hiển thị ngày được chọn */}
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateText}>
              Đặt phòng cho ngày: {selectedDate.split('-').reverse().join('/')}
            </Text>
            <Text style={styles.availabilityCount}>
              {filteredBookings.length} đặt phòng
            </Text>
          </View>
          
          <FlatList
            data={filteredBookings}
            renderItem={({ item }) => <BookingItem booking={item} />}
            keyExtractor={item => item.id}
            style={styles.bookingList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FontAwesome name="calendar-o" size={48} color="#d9d9d9" />
                <Text style={styles.emptyText}>Không có đặt phòng nào cho ngày này</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}

// Định nghĩa styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingBottom: 8,
  },
  calendarInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#8c8c8c',
  },
  selectedDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262626',
  },
  availabilityCount: {
    fontSize: 14,
    color: '#52c41a',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#1890ff',
  },
  tabText: {
    fontSize: 16,
    color: '#8c8c8c',
  },
  activeTabText: {
    color: '#1890ff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8c8c8c',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  activeFilterButton: {
    backgroundColor: '#e6f7ff',
    borderColor: '#91d5ff',
  },
  filterText: {
    color: '#595959',
  },
  availabilityFilter: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 2,
  },
  availabilityButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeAvailabilityButton: {
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  availabilityText: {
    color: '#8c8c8c',
  },
  activeAvailabilityText: {
    color: '#1890ff',
    fontWeight: 'bold',
  },
  roomList: {
    flex: 1,
  },
  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roomUnavailable: {
    opacity: 0.6,
  },
  roomSelected: {
    borderWidth: 2,
    borderColor: '#52c41a',
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roomStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  roomStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  roomDetails: {
    marginBottom: 8,
  },
  roomType: {
    fontSize: 16,
    color: '#262626',
    marginBottom: 4,
  },
  roomPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f5222d',
    marginBottom: 4,
  },
  roomGuests: {
    fontSize: 14,
    color: '#8c8c8c',
    marginBottom: 8,
  },
  roomAmenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityTag: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 12,
    color: '#595959',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  bookingButtonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bookingButton: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookingList: {
    flex: 1,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingSource: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  sourceTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingId: {
    fontSize: 14,
    color: '#8c8c8c',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookingBody: {
    marginBottom: 12,
  },
  bookingDetail: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bookingLabel: {
    width: 100,
    fontSize: 14,
    color: '#8c8c8c',
  },
  bookingValue: {
    flex: 1,
    fontSize: 14,
    color: '#262626',
  },
  bookingFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  bookingAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#595959',
  },
}); 