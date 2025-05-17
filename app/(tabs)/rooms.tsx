import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface Room {
  id: string;
  roomNumber: string;
  type: string;
  status: 'vacant' | 'occupied' | 'cleaning' | 'maintenance';
  price: number;
  floor: string;
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

  const renderRoomItem = ({ item }: { item: Room }) => (
    <TouchableOpacity style={styles.roomCard}>
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
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="edit" size={16} color="#1890ff" />
          <Text style={styles.actionText}>Cập nhật</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="key" size={16} color="#52c41a" />
          <Text style={styles.actionText}>Nhận phòng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome name="sign-out" size={16} color="#f5222d" />
          <Text style={styles.actionText}>Trả phòng</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
}); 