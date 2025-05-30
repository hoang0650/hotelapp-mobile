import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

// Định nghĩa kiểu dữ liệu giao dịch
interface Transaction {
  id: string;
  amount: number;
  bank: string;
  accountNumber: string;
  description: string;
  transactionDate: string;
  status: 'pending' | 'confirmed' | 'rejected';
  bankReference: string;
  customerName: string;
  roomNumber?: string;
  bookingId?: string;
}

// Danh sách ngân hàng hỗ trợ
const SUPPORTED_BANKS = [
  { id: 'vcb', name: 'Vietcombank', color: '#186B47' },
  { id: 'tcb', name: 'Techcombank', color: '#F4323F' },
  { id: 'bidv', name: 'BIDV', color: '#1B3E99' },
  { id: 'mb', name: 'MB Bank', color: '#5A5AC5' },
  { id: 'acb', name: 'ACB', color: '#F37021' },
  { id: 'vpb', name: 'VPBank', color: '#046A38' },
  { id: 'tpb', name: 'TPBank', color: '#984994' },
  { id: 'ocb', name: 'OCB', color: '#D11F00' },
];

// Mẫu dữ liệu giao dịch
const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    amount: 1200000,
    bank: 'vcb',
    accountNumber: '10201234567',
    description: 'Thanh toan phong 101',
    transactionDate: '2025-05-18T09:30:45',
    status: 'confirmed',
    bankReference: 'VCB123456789',
    customerName: 'Nguyễn Văn A',
    roomNumber: '101',
    bookingId: 'b1'
  },
  {
    id: 'tx2',
    amount: 4800000,
    bank: 'mb',
    accountNumber: '0987654321',
    description: 'CHUYEN KHOAN PHONG 201',
    transactionDate: '2025-05-17T14:15:23',
    status: 'pending',
    bankReference: 'MB98765432',
    customerName: 'Trần Thị B',
    roomNumber: '201',
    bookingId: 'b2'
  },
  {
    id: 'tx3',
    amount: 3600000,
    bank: 'tcb',
    accountNumber: '19876543210',
    description: 'THANH TOAN PHONG 301',
    transactionDate: '2025-05-16T18:45:12',
    status: 'confirmed',
    bankReference: 'TCB87654321',
    customerName: 'Lê Văn C',
    roomNumber: '301',
    bookingId: 'b3'
  },
  {
    id: 'tx4',
    amount: 800000,
    bank: 'bidv',
    accountNumber: '31234567890',
    description: 'LE VAN D CHUYEN KHOAN PHONG',
    transactionDate: '2025-05-15T10:20:35',
    status: 'rejected',
    bankReference: 'BIDV76543210',
    customerName: 'Lê Văn D',
  },
  {
    id: 'tx5',
    amount: 2200000,
    bank: 'acb',
    accountNumber: '9876543210',
    description: 'PHAM THI E THANH TOAN PHONG 502',
    transactionDate: '2025-05-14T16:30:42',
    status: 'confirmed',
    bankReference: 'ACB65432109',
    customerName: 'Phạm Thị E',
    roomNumber: '502'
  }
];

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');
  const [filterBank, setFilterBank] = useState<string | null>(null);
  const [bankSelectionModalVisible, setBankSelectionModalVisible] = useState(false);

  // Tải dữ liệu giao dịch
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Lọc giao dịch khi searchQuery hoặc filters thay đổi
  useEffect(() => {
    filterTransactions();
  }, [searchQuery, filterStatus, filterBank, transactions]);

  // Mô phỏng việc lấy dữ liệu từ API
  const fetchTransactions = async () => {
    setLoading(true);
    // Giả lập API call
    setTimeout(() => {
      setTransactions(SAMPLE_TRANSACTIONS);
      setLoading(false);
    }, 1000);
  };

  // Làm mới dữ liệu
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  // Lọc giao dịch theo điều kiện
  const filterTransactions = () => {
    let filtered = [...transactions];

    // Lọc theo trạng thái
    if (filterStatus !== 'all') {
      filtered = filtered.filter(tx => tx.status === filterStatus);
    }

    // Lọc theo ngân hàng
    if (filterBank) {
      filtered = filtered.filter(tx => tx.bank === filterBank);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(tx => 
        tx.customerName.toLowerCase().includes(query) ||
        tx.description.toLowerCase().includes(query) ||
        tx.accountNumber.includes(query) ||
        tx.bankReference.toLowerCase().includes(query) ||
        (tx.roomNumber && tx.roomNumber.includes(query))
      );
    }

    setFilteredTransactions(filtered);
  };

  // Xử lý khi click vào giao dịch
  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsModalVisible(true);
  };

  // Cập nhật trạng thái giao dịch
  const updateTransactionStatus = (id: string, status: 'pending' | 'confirmed' | 'rejected') => {
    const updatedTransactions = transactions.map(tx => 
      tx.id === id ? { ...tx, status } : tx
    );
    setTransactions(updatedTransactions);
    
    if (selectedTransaction && selectedTransaction.id === id) {
      setSelectedTransaction({ ...selectedTransaction, status });
    }
  };

  // Kiểm tra API ngân hàng (mô phỏng)
  const checkBankAPI = (transaction: Transaction) => {
    setLoading(true);
    // Giả lập API call
    setTimeout(() => {
      // Giả định 80% giao dịch sẽ được xác nhận
      const isConfirmed = Math.random() > 0.2;
      updateTransactionStatus(transaction.id, isConfirmed ? 'confirmed' : 'rejected');
      setLoading(false);
      setDetailsModalVisible(false);
      alert(isConfirmed 
        ? 'Giao dịch đã được xác nhận từ ngân hàng' 
        : 'Không tìm thấy giao dịch trên hệ thống ngân hàng');
    }, 2000);
  };

  // Lấy thông tin ngân hàng
  const getBankInfo = (bankId: string) => {
    const bank = SUPPORTED_BANKS.find(b => b.id === bankId);
    return bank || { id: bankId, name: bankId.toUpperCase(), color: '#999999' };
  };

  // Format định dạng tiền
  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
  };

  // Format định dạng ngày giờ
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Hiển thị một giao dịch
  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const bankInfo = getBankInfo(item.bank);
    
    return (
      <Pressable
        style={({ pressed }) => [
          styles.transactionCard,
          pressed && styles.pressedItem
        ]}
        onPress={() => handleTransactionPress(item)}
      >
        <View style={styles.transactionHeader}>
          <View style={[styles.bankBadge, { backgroundColor: bankInfo.color }]}>
            <Text style={styles.bankCode}>{bankInfo.name.substring(0, 3)}</Text>
          </View>
          <Text style={styles.transactionAmount}>{formatCurrency(item.amount)}</Text>
        </View>
        
        <View style={styles.transactionBody}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.transactionReference}>Mã GD: {item.bankReference}</Text>
          <Text style={styles.accountNumber}>TK: {item.accountNumber}</Text>
          <Text style={styles.description}>{item.description}</Text>
          
          {item.roomNumber && (
            <View style={styles.roomInfo}>
              <FontAwesome name="home" size={12} color="#8c8c8c" />
              <Text style={styles.roomNumber}>Phòng {item.roomNumber}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.transactionFooter}>
          <Text style={styles.transactionDate}>{formatDateTime(item.transactionDate)}</Text>
          <View style={[styles.statusBadge, getStatusStyle(item.status).badge]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  // Hiển thị icon và màu theo trạng thái
  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'confirmed':
        return {
          badge: { backgroundColor: '#e6f7ff', borderColor: '#91d5ff' },
          icon: { name: 'check-circle' as const, color: '#52c41a' }
        };
      case 'pending':
        return {
          badge: { backgroundColor: '#fff7e6', borderColor: '#ffd591' },
          icon: { name: 'clock-o' as const, color: '#faad14' }
        };
      case 'rejected':
        return {
          badge: { backgroundColor: '#fff1f0', borderColor: '#ffa39e' },
          icon: { name: 'times-circle' as const, color: '#f5222d' }
        };
      default:
        return {
          badge: { backgroundColor: '#f5f5f5', borderColor: '#d9d9d9' },
          icon: { name: 'question-circle' as const, color: '#8c8c8c' }
        };
    }
  };

  // Lấy text hiển thị theo trạng thái
  const getStatusText = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Chờ xác nhận';
      case 'rejected': return 'Từ chối';
      default: return 'Không xác định';
    }
  };

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={16} color="#bfbfbf" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên, SĐT, phòng..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={({pressed}) => [styles.clearButton, pressed && styles.pressedItem]}>
              <FontAwesome name="times-circle" size={20} color="#888" />
            </Pressable>
          )}
        </View>
      </View>
      
      {/* Bộ lọc */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Pressable
            style={({pressed}) => [styles.filterButton, filterStatus === 'all' && styles.activeFilter, pressed && styles.pressedItem]}
            onPress={() => setFilterStatus('all')}
          >
            <Text style={[styles.filterText, filterStatus === 'all' && styles.activeFilterText]}>Tất cả</Text>
          </Pressable>
          
          <Pressable
            style={({pressed}) => [styles.filterButton, filterStatus === 'pending' && styles.activeFilter, pressed && styles.pressedItem]}
            onPress={() => setFilterStatus('pending')}
          >
            <Text style={[styles.filterText, filterStatus === 'pending' && styles.activeFilterText]}>Chờ xử lý</Text>
          </Pressable>
          
          <Pressable
            style={({pressed}) => [styles.filterButton, filterStatus === 'confirmed' && styles.activeFilter, pressed && styles.pressedItem]}
            onPress={() => setFilterStatus('confirmed')}
          >
            <Text style={[styles.filterText, filterStatus === 'confirmed' && styles.activeFilterText]}>Đã xác nhận</Text>
          </Pressable>
          
          <Pressable
            style={({pressed}) => [styles.filterButton, filterStatus === 'rejected' && styles.activeFilter, pressed && styles.pressedItem]}
            onPress={() => setFilterStatus('rejected')}
          >
            <Text style={[styles.filterText, filterStatus === 'rejected' && styles.activeFilterText]}>Bị từ chối</Text>
          </Pressable>
          
          <Pressable
            style={({pressed}) => [styles.filterButton, styles.bankFilterButton, pressed && styles.pressedItem]}
            onPress={() => setBankSelectionModalVisible(true)}
          >
            <FontAwesome name="bank" size={16} color={filterBank ? '#1890ff' : '#555'} />
            <Text style={[styles.filterText, filterBank && styles.activeBankFilterText, { marginLeft: 5 }]}>
              {filterBank ? getBankInfo(filterBank).name : 'Ngân hàng'}
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Danh sách giao dịch */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1890ff" />
          <Text style={styles.loadingText}>Đang tải dữ liệu giao dịch...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.transactionList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome name="inbox" size={48} color="#d9d9d9" />
              <Text style={styles.emptyText}>Không tìm thấy giao dịch nào</Text>
            </View>
          }
        />
      )}

      {/* Modal Chi tiết giao dịch */}
      <Modal
        visible={detailsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        {selectedTransaction && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chi tiết giao dịch</Text>
                <Pressable onPress={() => setDetailsModalVisible(false)} style={({pressed}) => pressed && styles.pressedItem}>
                  <FontAwesome name="times" size={24} color="#888" />
                </Pressable>
              </View>
              
              <ScrollView style={styles.modalContent}>
                <View style={styles.amountContainer}>
                  <Text style={styles.amountLabel}>Số tiền:</Text>
                  <Text style={styles.amountValue}>{formatCurrency(selectedTransaction.amount)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Khách hàng:</Text>
                  <Text style={styles.detailValue}>{selectedTransaction.customerName}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ngân hàng:</Text>
                  <View style={styles.bankDetail}>
                    <View style={[styles.bankColorDot, { backgroundColor: getBankInfo(selectedTransaction.bank).color }]} />
                    <Text style={styles.detailValue}>{getBankInfo(selectedTransaction.bank).name}</Text>
                  </View>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Số tài khoản:</Text>
                  <Text style={styles.detailValue}>{selectedTransaction.accountNumber}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Mã giao dịch:</Text>
                  <Text style={styles.detailValue}>{selectedTransaction.bankReference}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Thời gian:</Text>
                  <Text style={styles.detailValue}>{formatDateTime(selectedTransaction.transactionDate)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nội dung:</Text>
                  <Text style={styles.detailValue}>{selectedTransaction.description}</Text>
                </View>
                
                {selectedTransaction.roomNumber && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phòng:</Text>
                    <Text style={styles.detailValue}>Phòng {selectedTransaction.roomNumber}</Text>
                  </View>
                )}
                
                {selectedTransaction.bookingId && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Mã đặt phòng:</Text>
                    <Text style={styles.detailValue}>{selectedTransaction.bookingId}</Text>
                  </View>
                )}
                
                <View style={styles.statusContainer}>
                  <Text style={styles.statusLabel}>Trạng thái:</Text>
                  <View style={[styles.statusBadgeLarge, getStatusStyle(selectedTransaction.status).badge]}>
                    <FontAwesome 
                      name={getStatusStyle(selectedTransaction.status).icon.name} 
                      size={16} 
                      color={getStatusStyle(selectedTransaction.status).icon.color}
                      style={styles.statusIcon}
                    />
                    <Text style={[styles.statusTextLarge, { color: getStatusStyle(selectedTransaction.status).icon.color }]}>
                      {getStatusText(selectedTransaction.status)}
                    </Text>
                  </View>
                </View>
              </ScrollView>
              
              <View style={styles.modalFooter}>
                {selectedTransaction.status === 'pending' && (
                  <>
                    <Pressable
                      style={({pressed}) => [styles.updateButton, pressed && styles.pressedItem]}
                      onPress={() => checkBankAPI(selectedTransaction)}
                    >
                      <FontAwesome name="refresh" size={16} color="#fff" style={styles.buttonIcon} />
                      <Text style={styles.updateButtonText}>Kiểm tra với ngân hàng</Text>
                    </Pressable>
                    
                    <View style={styles.actionButtonGroup}>
                      <Pressable
                        style={({pressed}) => [styles.actionButton, styles.confirmButton, pressed && styles.pressedItem]}
                        onPress={() => {
                          updateTransactionStatus(selectedTransaction.id, 'confirmed');
                          setDetailsModalVisible(false);
                        }}
                      >
                        <FontAwesome name="check" size={16} color="#fff" />
                        <Text style={styles.actionButtonText}>Xác nhận</Text>
                      </Pressable>
                      
                      <Pressable
                        style={({pressed}) => [styles.actionButton, styles.rejectButton, pressed && styles.pressedItem]}
                        onPress={() => {
                          updateTransactionStatus(selectedTransaction.id, 'rejected');
                          setDetailsModalVisible(false);
                        }}
                      >
                        <FontAwesome name="times" size={16} color="#fff" />
                        <Text style={styles.actionButtonText}>Từ chối</Text>
                      </Pressable>
                    </View>
                  </>
                )}
                
                <Pressable
                  style={({pressed}) => [styles.closeButton, pressed && styles.pressedItem]}
                  onPress={() => setDetailsModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Đóng</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </Modal>

      {/* Modal Chọn ngân hàng */}
      <Modal
        visible={bankSelectionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBankSelectionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, styles.bankSelectionModal]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn ngân hàng</Text>
              <Pressable onPress={() => setBankSelectionModalVisible(false)} style={({pressed}) => pressed && styles.pressedItem}>
                <FontAwesome name="times" size={24} color="#888" />
              </Pressable>
            </View>
            
            <ScrollView style={styles.bankList}>
              <Pressable
                style={({pressed}) => [styles.bankItem, filterBank === null && styles.activeBankSelectItem, pressed && styles.pressedItem]}
                onPress={() => {
                  setFilterBank(null);
                  setBankSelectionModalVisible(false);
                }}
              >
                <Text style={styles.bankItemText}>Tất cả ngân hàng</Text>
              </Pressable>
              
              {SUPPORTED_BANKS.map(bank => (
                <Pressable
                  key={bank.id}
                  style={({pressed}) => [styles.bankItem, filterBank === bank.id && styles.activeBankSelectItem, pressed && styles.pressedItem]}
                  onPress={() => {
                    setFilterBank(bank.id);
                    setBankSelectionModalVisible(false);
                  }}
                >
                  <View style={styles.bankItemContent}>
                    <View style={[styles.bankColorDot, { backgroundColor: bank.color }]} />
                    <Text style={styles.bankItemText}>{bank.name}</Text>
                  </View>
                  {filterBank === bank.id && (
                    <FontAwesome name="check" size={16} color="#52c41a" />
                  )}
                </Pressable>
              ))}
            </ScrollView>
            {filterBank && (
              <Pressable
                style={({pressed}) => [styles.modalButton, styles.clearBankFilterButton, pressed && styles.pressedItem]}
                onPress={() => {
                  setFilterBank(null);
                  setBankSelectionModalVisible(false);
                }}
              >
                <FontAwesome name="trash-o" size={18} color="white" style={styles.buttonIcon} />
                <Text style={styles.modalButtonText}>Bỏ chọn ngân hàng</Text>
              </Pressable>
            )}
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
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  filterText: {
    color: '#595959',
    fontSize: 14,
  },
  filterActive: {
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
  },
  filterActiveText: {
    color: '#fff',
  },
  bankFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  bankFilterIcon: {
    marginLeft: 4,
  },
  transactionList: {
    padding: 16,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bankBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  bankCode: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1890ff',
  },
  transactionBody: {
    marginBottom: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionReference: {
    fontSize: 14,
    color: '#595959',
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 14,
    color: '#8c8c8c',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#262626',
    marginBottom: 4,
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomNumber: {
    fontSize: 14,
    color: '#8c8c8c',
    marginLeft: 4,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  transactionDate: {
    fontSize: 12,
    color: '#8c8c8c',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8c8c8c',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8c8c8c',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bankSelectionModal: {
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 16,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    color: '#8c8c8c',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1890ff',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    width: 120,
    fontSize: 14,
    color: '#8c8c8c',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#262626',
  },
  bankDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusLabel: {
    width: 120,
    fontSize: 14,
    color: '#8c8c8c',
  },
  statusBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusTextLarge: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1890ff',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  buttonIcon: {
    marginRight: 6,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: 10,
    flex: 1,
    marginHorizontal: 4,
  },
  confirmButton: {
    backgroundColor: '#52c41a',
  },
  rejectButton: {
    backgroundColor: '#f5222d',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    padding: 10,
  },
  closeButtonText: {
    color: '#595959',
    fontSize: 16,
  },
  bankList: {
    padding: 8,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  bankItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankItemText: {
    fontSize: 16,
    color: '#262626',
  },
  pressedItem: {
    opacity: 0.7,
  },
  activeFilter: {
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
  },
  activeFilterText: {
    color: '#fff',
  },
  activeBankFilterText: {
    color: '#fff',
  },
  activeBankSelectItem: {
    backgroundColor: '#e6f7ff',
    borderColor: '#91d5ff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: 10,
    flex: 1,
    marginHorizontal: 4,
  },
  checkApiButton: {
    backgroundColor: '#1890ff',
  },
  modalLoading: {
    marginTop: 10,
  },
  clearBankFilterButton: {
    backgroundColor: '#f5222d',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
}); 