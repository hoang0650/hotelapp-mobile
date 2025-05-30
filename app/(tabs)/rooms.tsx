import { FontAwesome } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface Room {
  id: string;
  roomNumber: string;
  type: string;
  status: 'vacant' | 'occupied' | 'cleaning' | 'maintenance';
  price: number;
  floor: string;
}

interface Guest {
  name: string;
  phone: string;
  idNumber: string;
}

// Tách các hàm chuyển đổi status ra ngoài component để tránh tạo lại mỗi khi component render
const getStatusColor = (status: string) => {
  switch (status) {
    case 'vacant': return '#52c41a';
    case 'occupied': return '#1890ff';
    case 'cleaning': return '#faad14';
    case 'maintenance': return '#f5222d';
    default: return '#8c8c8c';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'vacant': return 'Trống';
    case 'occupied': return 'Đã thuê';
    case 'cleaning': return 'Đang dọn';
    case 'maintenance': return 'Bảo trì';
    default: return 'Không xác định';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'vacant': return 'check-circle';
    case 'occupied': return 'user';
    case 'cleaning': return 'refresh';
    case 'maintenance': return 'wrench';
    default: return 'question-circle';
  }
};

export default function RoomsScreen() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // State cho các modal
  const [checkInModal, setCheckInModal] = useState(false);
  const [checkOutModal, setCheckOutModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  // State cho form nhận phòng
  const [guestInfo, setGuestInfo] = useState<Guest>({
    name: '',
    phone: '',
    idNumber: '',
  });
  
  // State cho form trả phòng
  const [checkOutInfo, setCheckOutInfo] = useState({
    totalAmount: 0,
    paymentMethod: 'cash',
    notes: '',
  });

  useEffect(() => {
    // Giả lập API call
    setTimeout(() => {
      const mockRooms: Room[] = [
        { id: '1', roomNumber: '101', type: 'Standard', status: 'vacant', price: 500000, floor: '1' },
        { id: '2', roomNumber: '102', type: 'Standard', status: 'occupied', price: 500000, floor: '1' },
        { id: '3', roomNumber: '103', type: 'Standard', status: 'cleaning', price: 500000, floor: '1' },
        { id: '4', roomNumber: '201', type: 'Deluxe', status: 'vacant', price: 800000, floor: '2' },
        { id: '5', roomNumber: '202', type: 'Deluxe', status: 'occupied', price: 800000, floor: '2' },
        { id: '6', roomNumber: '203', type: 'Deluxe', status: 'maintenance', price: 800000, floor: '2' },
        { id: '7', roomNumber: '301', type: 'Suite', status: 'vacant', price: 1200000, floor: '3' },
        { id: '8', roomNumber: '302', type: 'Suite', status: 'occupied', price: 1200000, floor: '3' },
      ];
      setRooms(mockRooms);
      setLoading(false);
    }, 1000);
  }, []);

  // Sử dụng useCallback để memoize hàm này
  const getFilteredRooms = useCallback(() => {
    if (!filter) return rooms;
    return rooms.filter(room => room.status === filter);
  }, [filter, rooms]);
  
  // Xử lý nhận phòng
  const handleCheckIn = () => {
    if (!selectedRoom) return;
    
    // Kiểm tra thông tin khách hàng
    if (!guestInfo.name || !guestInfo.phone || !guestInfo.idNumber) {
      alert('Vui lòng điền đầy đủ thông tin khách hàng');
      return;
    }
    
    // Cập nhật trạng thái phòng
    const updatedRooms = rooms.map(room => 
      room.id === selectedRoom.id 
        ? { ...room, status: 'occupied' as const } 
        : room
    );
    
    setRooms(updatedRooms);
    setCheckInModal(false);
    
    // Reset form
    setGuestInfo({
      name: '',
      phone: '',
      idNumber: '',
    });
    
    alert(`Đã nhận phòng ${selectedRoom.roomNumber} thành công`);
    setSelectedRoom(null);
  };
  
  // Xử lý trả phòng
  const handleCheckOut = () => {
    if (!selectedRoom) return;
    
    // Cập nhật trạng thái phòng
    const updatedRooms = rooms.map(room => 
      room.id === selectedRoom.id 
        ? { ...room, status: 'cleaning' as const } 
        : room
    );
    
    setRooms(updatedRooms);
    setCheckOutModal(false);
    
    // Reset form
    setCheckOutInfo({
      totalAmount: 0,
      paymentMethod: 'cash',
      notes: '',
    });
    
    alert(`Đã trả phòng ${selectedRoom.roomNumber} thành công`);
    setSelectedRoom(null);
  };
  
  // Xử lý cập nhật trạng thái
  const handleUpdateStatus = (status: 'vacant' | 'occupied' | 'cleaning' | 'maintenance') => {
    if (!selectedRoom) return;
    
    // Cập nhật trạng thái phòng
    const updatedRooms = rooms.map(room => 
      room.id === selectedRoom.id 
        ? { ...room, status } 
        : room
    );
    
    setRooms(updatedRooms);
    setStatusModal(false);
    setSelectedRoom(null);
    
    alert(`Đã cập nhật trạng thái phòng ${selectedRoom.roomNumber} thành công`);
  };

  // Xử lý khi nhấn vào các nút action
  const handleActionPress = (room: Room, action: 'checkIn' | 'checkOut' | 'updateStatus') => {
    setSelectedRoom(room);
    
    if (action === 'checkIn') {
      if (room.status !== 'vacant') {
        alert('Chỉ có thể nhận phòng khi phòng đang trống');
        return;
      }
      setCheckInModal(true);
    } else if (action === 'checkOut') {
      if (room.status !== 'occupied') {
        alert('Chỉ có thể trả phòng khi phòng đang được sử dụng');
        return;
      }
      // Mặc định tổng tiền dựa trên giá phòng
      setCheckOutInfo({
        ...checkOutInfo,
        totalAmount: room.price,
      });
      setCheckOutModal(true);
    } else if (action === 'updateStatus') {
      setStatusModal(true);
    }
  };

  const renderRoomItem = ({ item }: { item: Room }) => (
    <Pressable
      style={({ pressed }) => [
        styles.roomCard,
        viewMode === 'grid' && styles.roomCardGrid,
        pressed && styles.pressedItem
      ]}
    >
      <View style={styles.roomHeader}>
        <Text style={styles.roomNumber}>Phòng {item.roomNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <FontAwesome name={getStatusIcon(item.status) as any} size={12} color="white" />
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <View style={styles.roomDetails}>
        <Text style={styles.roomType}>{item.type}</Text>
        <Text style={styles.roomPrice}>{item.price.toLocaleString('vi-VN')} VNĐ/đêm</Text>
        <Text style={styles.roomFloor}>Tầng {item.floor}</Text>
      </View>
      <View style={styles.roomActions}>
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressedItem]}
          onPress={() => handleActionPress(item, 'updateStatus')}
        >
          <FontAwesome name="edit" size={16} color="#1890ff" />
          <Text style={styles.actionText}>Cập nhật</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressedItem]}
          onPress={() => handleActionPress(item, 'checkIn')}
        >
          <FontAwesome name="key" size={16} color="#52c41a" />
          <Text style={styles.actionText}>Nhận phòng</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressedItem]}
          onPress={() => handleActionPress(item, 'checkOut')}
        >
          <FontAwesome name="sign-out" size={16} color="#f5222d" />
          <Text style={styles.actionText}>Trả phòng</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.filterButton,
              !filter && styles.activeFilter,
              pressed && styles.pressedItem
            ]}
            onPress={() => setFilter(null)}
          >
            <Text style={[styles.filterText, !filter && styles.activeFilterText]}>Tất cả</Text>
          </Pressable>
          {['vacant', 'occupied', 'cleaning', 'maintenance'].map(status => (
            <Pressable
              key={status}
              style={({ pressed }) => [
                styles.filterButton,
                filter === status && styles.activeFilter,
                pressed && styles.pressedItem
              ]}
              onPress={() => setFilter(status)}
            >
              <FontAwesome name={getStatusIcon(status) as any} size={12} color={filter === status ? '#fff' : getStatusColor(status)} />
              <Text style={[styles.filterText, filter === status && styles.activeFilterText]}>{getStatusText(status)}</Text>
            </Pressable>
          ))}
        </View>
        
        <View style={styles.viewModeContainer}>
          <Pressable
            style={({ pressed }) => [styles.viewModeButton, viewMode === 'list' && styles.activeViewMode, pressed && styles.pressedItem]}
            onPress={() => setViewMode('list')}
          >
            <FontAwesome name="list" size={16} color={viewMode === 'list' ? '#fff' : '#1890ff'} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.viewModeButton, viewMode === 'grid' && styles.activeViewMode, pressed && styles.pressedItem]}
            onPress={() => setViewMode('grid')}
          >
            <FontAwesome name="th-large" size={16} color={viewMode === 'grid' ? '#fff' : '#1890ff'} />
          </Pressable>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1890ff" />
          <Text style={styles.loadingText}>Đang tải danh sách phòng...</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredRooms()}
          renderItem={renderRoomItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode} // Buộc FlatList render lại khi chuyển đổi chế độ xem
          columnWrapperStyle={viewMode === 'grid' ? styles.gridWrapper : undefined}
        />
      )}
      
      {/* Modal Nhận Phòng */}
      <Modal
        visible={checkInModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCheckInModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhận phòng {selectedRoom?.roomNumber}</Text>
            <TextInput 
              style={styles.input}
              placeholder="Tên khách hàng"
              value={guestInfo.name}
              onChangeText={text => setGuestInfo({...guestInfo, name: text})}
            />
            <TextInput 
              style={styles.input}
              placeholder="Số điện thoại"
              value={guestInfo.phone}
              onChangeText={text => setGuestInfo({...guestInfo, phone: text})}
              keyboardType="phone-pad"
            />
            <TextInput 
              style={styles.input}
              placeholder="Số CMND/CCCD"
              value={guestInfo.idNumber}
              onChangeText={text => setGuestInfo({...guestInfo, idNumber: text})}
            />
            <View style={styles.modalActions}>
              <Pressable style={({pressed}) => [styles.modalButton, styles.cancelButton, pressed && styles.pressedItem]} onPress={() => setCheckInModal(false)}>
                <Text style={styles.buttonText}>Hủy</Text>
              </Pressable>
              <Pressable style={({pressed}) => [styles.modalButton, styles.confirmButton, pressed && styles.pressedItem]} onPress={handleCheckIn}>
                <Text style={styles.buttonText}>Xác nhận</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Modal Trả Phòng */}
      <Modal
        visible={checkOutModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCheckOutModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Trả phòng {selectedRoom?.roomNumber}</Text>
            <TextInput 
              style={styles.input}
              placeholder="Tổng tiền thanh toán"
              value={checkOutInfo.totalAmount.toString()}
              onChangeText={text => setCheckOutInfo({...checkOutInfo, totalAmount: parseFloat(text) || 0})}
              keyboardType="numeric"
            />
            <TextInput 
              style={styles.input}
              placeholder="Phương thức thanh toán (cash/card)"
              value={checkOutInfo.paymentMethod}
              onChangeText={text => setCheckOutInfo({...checkOutInfo, paymentMethod: text})}
            />
            <TextInput 
              style={[styles.input, styles.notesInput]}
              placeholder="Ghi chú (nếu có)"
              value={checkOutInfo.notes}
              onChangeText={text => setCheckOutInfo({...checkOutInfo, notes: text})}
              multiline
            />
            <View style={styles.modalActions}>
              <Pressable style={({pressed}) => [styles.modalButton, styles.cancelButton, pressed && styles.pressedItem]} onPress={() => setCheckOutModal(false)}>
                <Text style={styles.buttonText}>Hủy</Text>
              </Pressable>
              <Pressable style={({pressed}) => [styles.modalButton, styles.confirmButton, pressed && styles.pressedItem]} onPress={handleCheckOut}>
                <Text style={styles.buttonText}>Xác nhận</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Modal Cập Nhật Trạng Thái */}
      <Modal
        visible={statusModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setStatusModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật trạng thái phòng {selectedRoom?.roomNumber}</Text>
            <View style={styles.statusOptionsContainer}>
              {['vacant', 'occupied', 'cleaning', 'maintenance'].map(status => (
                <Pressable
                  key={status}
                  style={({pressed}) => [
                    styles.statusOptionButton,
                    { backgroundColor: getStatusColor(status) }, 
                    pressed && styles.pressedItem
                  ]}
                  onPress={() => handleUpdateStatus(status as any)}
                >
                  <FontAwesome name={getStatusIcon(status) as any} size={16} color="#fff" />
                  <Text style={styles.statusOptionText}>{getStatusText(status)}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={({pressed}) => [styles.modalButton, styles.cancelButton, {marginTop: 10}, pressed && styles.pressedItem]} onPress={() => setStatusModal(false)}>
              <Text style={styles.buttonText}>Hủy</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 5,
    flexWrap: 'wrap',
    flex: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    margin: 3,
    backgroundColor: '#fff',
  },
  activeFilter: {
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
  },
  filterText: {
    fontSize: 12,
    marginLeft: 5,
    color: '#595959',
  },
  activeFilterText: {
    color: 'white',
  },
  viewModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 4,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#1890ff',
  },
  activeViewMode: {
    backgroundColor: '#1890ff',
  },
  listContent: {
    padding: 10,
  },
  gridWrapper: {
    justifyContent: 'space-between',
  },
  roomCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  roomCardGrid: {
    flex: 1,
    margin: 5,
    maxWidth: '48%', // Adjust for 2 columns
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
    color: '#262626',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 5,
    fontWeight: '500',
  },
  roomDetails: {
    marginBottom: 10,
  },
  roomType: {
    fontSize: 14,
    color: '#595959',
    marginBottom: 3,
  },
  roomPrice: {
    fontSize: 14,
    color: '#262626',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  roomFloor: {
    fontSize: 12,
    color: '#8c8c8c',
  },
  roomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    marginTop: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  actionText: {
    fontSize: 12,
    marginLeft: 5,
    color: '#595959',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#8c8c8c',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#52c41a',
  },
  cancelButton: {
    backgroundColor: '#f5222d',
  },
  statusOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statusOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4,
    margin: 5,
    minWidth: '45%',
    justifyContent: 'center',
  },
  statusOptionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  pressedItem: {
    opacity: 0.7,
  },
}); 