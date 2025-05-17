import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

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
    <TouchableOpacity 
      style={[
        styles.roomCard, 
        viewMode === 'grid' && styles.roomCardGrid
      ]}
    >
      <View style={styles.roomHeader}>
        <Text style={styles.roomNumber}>Phòng {item.roomNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <FontAwesome name={getStatusIcon(item.status)} size={12} color="white" />
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <View style={styles.roomDetails}>
        <Text style={styles.roomType}>{item.type}</Text>
        <Text style={styles.roomPrice}>{item.price.toLocaleString('vi-VN')} VNĐ/đêm</Text>
        <Text style={styles.roomFloor}>Tầng {item.floor}</Text>
      </View>
      <View style={styles.roomActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleActionPress(item, 'updateStatus')}
        >
          <FontAwesome name="edit" size={16} color="#1890ff" />
          <Text style={styles.actionText}>Cập nhật</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleActionPress(item, 'checkIn')}
        >
          <FontAwesome name="key" size={16} color="#52c41a" />
          <Text style={styles.actionText}>Nhận phòng</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleActionPress(item, 'checkOut')}
        >
          <FontAwesome name="sign-out" size={16} color="#f5222d" />
          <Text style={styles.actionText}>Trả phòng</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, !filter && styles.filterActive]}
            onPress={() => setFilter(null)}
          >
            <Text style={[styles.filterText, !filter && styles.filterActiveText]}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'vacant' && styles.filterActive]}
            onPress={() => setFilter('vacant')}
          >
            <Text style={[styles.filterText, filter === 'vacant' && styles.filterActiveText]}>Trống</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'occupied' && styles.filterActive]}
            onPress={() => setFilter('occupied')}
          >
            <Text style={[styles.filterText, filter === 'occupied' && styles.filterActiveText]}>Đã thuê</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'cleaning' && styles.filterActive]}
            onPress={() => setFilter('cleaning')}
          >
            <Text style={[styles.filterText, filter === 'cleaning' && styles.filterActiveText]}>Đang dọn</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.viewToggle}>
          <TouchableOpacity 
            style={[styles.viewButton, viewMode === 'list' && styles.viewActive]}
            onPress={() => setViewMode('list')}
          >
            <FontAwesome name="list" size={16} color={viewMode === 'list' ? 'white' : '#595959'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.viewButton, viewMode === 'grid' && styles.viewActive]}
            onPress={() => setViewMode('grid')}
          >
            <FontAwesome name="th-large" size={16} color={viewMode === 'grid' ? 'white' : '#595959'} />
          </TouchableOpacity>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nhận Phòng {selectedRoom?.roomNumber}</Text>
              <TouchableOpacity onPress={() => setCheckInModal(false)}>
                <FontAwesome name="close" size={20} color="#8c8c8c" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.inputLabel}>Tên khách hàng:</Text>
              <TextInput
                style={styles.input}
                value={guestInfo.name}
                onChangeText={(text) => setGuestInfo({...guestInfo, name: text})}
                placeholder="Nhập tên khách hàng"
              />
              
              <Text style={styles.inputLabel}>Số điện thoại:</Text>
              <TextInput
                style={styles.input}
                value={guestInfo.phone}
                onChangeText={(text) => setGuestInfo({...guestInfo, phone: text})}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
              />
              
              <Text style={styles.inputLabel}>Số CMND/CCCD:</Text>
              <TextInput
                style={styles.input}
                value={guestInfo.idNumber}
                onChangeText={(text) => setGuestInfo({...guestInfo, idNumber: text})}
                placeholder="Nhập số CMND/CCCD"
              />
              
              <View style={styles.roomInfoBox}>
                <Text style={styles.roomInfoTitle}>Thông tin phòng:</Text>
                <Text style={styles.roomInfoText}>Loại phòng: {selectedRoom?.type}</Text>
                <Text style={styles.roomInfoText}>Giá phòng: {selectedRoom?.price.toLocaleString('vi-VN')} VNĐ/đêm</Text>
                <Text style={styles.roomInfoText}>Tầng: {selectedRoom?.floor}</Text>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setCheckInModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleCheckIn}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Trả Phòng {selectedRoom?.roomNumber}</Text>
              <TouchableOpacity onPress={() => setCheckOutModal(false)}>
                <FontAwesome name="close" size={20} color="#8c8c8c" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.inputLabel}>Tổng tiền:</Text>
              <TextInput
                style={styles.input}
                value={checkOutInfo.totalAmount.toString()}
                onChangeText={(text) => setCheckOutInfo({...checkOutInfo, totalAmount: parseInt(text) || 0})}
                placeholder="Nhập tổng tiền"
                keyboardType="number-pad"
              />
              
              <Text style={styles.inputLabel}>Phương thức thanh toán:</Text>
              <View style={styles.paymentOptions}>
                <TouchableOpacity 
                  style={[
                    styles.paymentButton, 
                    checkOutInfo.paymentMethod === 'cash' && styles.paymentButtonActive
                  ]}
                  onPress={() => setCheckOutInfo({...checkOutInfo, paymentMethod: 'cash'})}
                >
                  <FontAwesome name="money" size={16} color={checkOutInfo.paymentMethod === 'cash' ? 'white' : '#595959'} />
                  <Text style={[
                    styles.paymentButtonText,
                    checkOutInfo.paymentMethod === 'cash' && styles.paymentButtonTextActive
                  ]}>Tiền mặt</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.paymentButton, 
                    checkOutInfo.paymentMethod === 'card' && styles.paymentButtonActive
                  ]}
                  onPress={() => setCheckOutInfo({...checkOutInfo, paymentMethod: 'card'})}
                >
                  <FontAwesome name="credit-card" size={16} color={checkOutInfo.paymentMethod === 'card' ? 'white' : '#595959'} />
                  <Text style={[
                    styles.paymentButtonText,
                    checkOutInfo.paymentMethod === 'card' && styles.paymentButtonTextActive
                  ]}>Thẻ</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.paymentButton, 
                    checkOutInfo.paymentMethod === 'transfer' && styles.paymentButtonActive
                  ]}
                  onPress={() => setCheckOutInfo({...checkOutInfo, paymentMethod: 'transfer'})}
                >
                  <FontAwesome name="bank" size={16} color={checkOutInfo.paymentMethod === 'transfer' ? 'white' : '#595959'} />
                  <Text style={[
                    styles.paymentButtonText,
                    checkOutInfo.paymentMethod === 'transfer' && styles.paymentButtonTextActive
                  ]}>Chuyển khoản</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.inputLabel}>Ghi chú:</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={checkOutInfo.notes}
                onChangeText={(text) => setCheckOutInfo({...checkOutInfo, notes: text})}
                placeholder="Nhập ghi chú"
                multiline={true}
                numberOfLines={4}
              />
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setCheckOutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleCheckOut}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
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
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, styles.statusModalContainer]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cập Nhật Trạng Thái Phòng {selectedRoom?.roomNumber}</Text>
              <TouchableOpacity onPress={() => setStatusModal(false)}>
                <FontAwesome name="close" size={20} color="#8c8c8c" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.statusOptions}>
              <TouchableOpacity 
                style={styles.statusOption}
                onPress={() => handleUpdateStatus('vacant')}
              >
                <View style={[styles.statusIcon, { backgroundColor: getStatusColor('vacant') }]}>
                  <FontAwesome name="check-circle" size={20} color="white" />
                </View>
                <Text style={styles.statusOptionText}>Phòng trống</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.statusOption}
                onPress={() => handleUpdateStatus('occupied')}
              >
                <View style={[styles.statusIcon, { backgroundColor: getStatusColor('occupied') }]}>
                  <FontAwesome name="user" size={20} color="white" />
                </View>
                <Text style={styles.statusOptionText}>Đã thuê</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.statusOption}
                onPress={() => handleUpdateStatus('cleaning')}
              >
                <View style={[styles.statusIcon, { backgroundColor: getStatusColor('cleaning') }]}>
                  <FontAwesome name="refresh" size={20} color="white" />
                </View>
                <Text style={styles.statusOptionText}>Đang dọn</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.statusOption}
                onPress={() => handleUpdateStatus('maintenance')}
              >
                <View style={[styles.statusIcon, { backgroundColor: getStatusColor('maintenance') }]}>
                  <FontAwesome name="wrench" size={20} color="white" />
                </View>
                <Text style={styles.statusOptionText}>Bảo trì</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setStatusModal(false)}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  filterActive: {
    backgroundColor: '#1890ff',
  },
  filterText: {
    fontSize: 14,
    color: '#595959',
  },
  filterActiveText: {
    color: 'white',
  },
  viewToggle: {
    flexDirection: 'row',
    padding: 10,
  },
  viewButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
  },
  viewActive: {
    backgroundColor: '#1890ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#8c8c8c',
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
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flex: 1,
  },
  roomCardGrid: {
    marginHorizontal: 5,
    width: '48%',
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  roomDetails: {
    marginBottom: 10,
  },
  roomType: {
    fontSize: 16,
    color: '#262626',
  },
  roomPrice: {
    fontSize: 14,
    color: '#1890ff',
    fontWeight: 'bold',
    marginTop: 2,
  },
  roomFloor: {
    fontSize: 14,
    color: '#8c8c8c',
    marginTop: 2,
  },
  roomActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusModalContainer: {
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
  },
  modalContent: {
    padding: 15,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  inputLabel: {
    fontSize: 14,
    color: '#8c8c8c',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  roomInfoBox: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
  },
  roomInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roomInfoText: {
    fontSize: 14,
    color: '#262626',
    marginBottom: 3,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
  },
  paymentButtonActive: {
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
  },
  paymentButtonText: {
    fontSize: 14,
    color: '#595959',
    marginLeft: 5,
  },
  paymentButtonTextActive: {
    color: 'white',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#595959',
    fontSize: 16,
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1890ff',
    borderRadius: 4,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
  statusOptions: {
    padding: 15,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statusOptionText: {
    fontSize: 16,
    color: '#262626',
  },
}); 