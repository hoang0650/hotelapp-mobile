import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: 'paid' | 'pending' | 'canceled';
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

const MOCK_INVOICES: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-001',
    customerName: 'Nguyễn Văn A',
    roomNumber: '101',
    checkInDate: '12/09/2023',
    checkOutDate: '15/09/2023',
    totalAmount: 1850000,
    status: 'paid',
    items: [
      { id: '1-1', description: 'Phòng Standard - 3 đêm', quantity: 3, unitPrice: 500000, amount: 1500000 },
      { id: '1-2', description: 'Dịch vụ giặt ủi', quantity: 1, unitPrice: 150000, amount: 150000 },
      { id: '1-3', description: 'Ăn sáng buffet', quantity: 4, unitPrice: 50000, amount: 200000 },
    ]
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-002',
    customerName: 'Trần Thị B',
    roomNumber: '205',
    checkInDate: '14/09/2023',
    checkOutDate: '17/09/2023',
    totalAmount: 2600000,
    status: 'pending',
    items: [
      { id: '2-1', description: 'Phòng Deluxe - 3 đêm', quantity: 3, unitPrice: 800000, amount: 2400000 },
      { id: '2-2', description: 'Nước uống minibar', quantity: 4, unitPrice: 50000, amount: 200000 },
    ]
  },
  {
    id: '3',
    invoiceNumber: 'INV-2023-003',
    customerName: 'Lê Văn C',
    roomNumber: '302',
    checkInDate: '10/09/2023',
    checkOutDate: '11/09/2023',
    totalAmount: 1200000,
    status: 'canceled',
    items: [
      { id: '3-1', description: 'Phòng Suite - 1 đêm', quantity: 1, unitPrice: 1200000, amount: 1200000 },
    ]
  }
];

// Tách các hàm helper ra ngoài component
const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return '#52c41a';
    case 'pending': return '#faad14';
    case 'canceled': return '#f5222d';
    default: return '#8c8c8c';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'paid': return 'Đã thanh toán';
    case 'pending': return 'Chờ thanh toán';
    case 'canceled': return 'Đã hủy';
    default: return 'Không xác định';
  }
};

export default function InvoicesScreen() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'paid' | 'pending'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Sử dụng useMemo để tránh tính toán lại khi component render
  const filteredInvoices = useMemo(() => {
    if (selectedTab === 'all') return MOCK_INVOICES;
    return MOCK_INVOICES.filter(invoice => invoice.status === selectedTab);
  }, [selectedTab]);

  // Tạo renderInvoiceItem bằng useCallback để tránh tạo lại khi component render
  const renderInvoiceItem = useCallback(({ item }: { item: Invoice }) => (
    <TouchableOpacity 
      style={styles.invoiceCard}
      onPress={() => setSelectedInvoice(item)}
    >
      <View style={styles.invoiceHeader}>
        <Text style={styles.invoiceNumber}>{item.invoiceNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.customerName}>{item.customerName}</Text>
      <Text style={styles.roomInfo}>Phòng {item.roomNumber} • {item.checkInDate} - {item.checkOutDate}</Text>
      
      <View style={styles.invoiceFooter}>
        <Text style={styles.totalAmount}>{item.totalAmount.toLocaleString('vi-VN')} VNĐ</Text>
        <TouchableOpacity style={styles.detailsButton} onPress={() => setSelectedInvoice(item)}>
          <Text style={styles.detailsButtonText}>Chi tiết</Text>
          <FontAwesome name="angle-right" size={16} color="#1890ff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  ), []);

  return (
    <View style={styles.container}>
      {!selectedInvoice ? (
        <>
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, selectedTab === 'all' && styles.activeTab]}
              onPress={() => setSelectedTab('all')}
            >
              <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>Tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, selectedTab === 'paid' && styles.activeTab]}
              onPress={() => setSelectedTab('paid')}
            >
              <Text style={[styles.tabText, selectedTab === 'paid' && styles.activeTabText]}>Đã thanh toán</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabButton, selectedTab === 'pending' && styles.activeTab]}
              onPress={() => setSelectedTab('pending')}
            >
              <Text style={[styles.tabText, selectedTab === 'pending' && styles.activeTabText]}>Chờ thanh toán</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredInvoices}
            renderItem={renderInvoiceItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
        </>
      ) : (
        <ScrollView style={styles.detailContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedInvoice(null)}
          >
            <FontAwesome name="arrow-left" size={16} color="#1890ff" />
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>

          <View style={styles.invoiceDetailCard}>
            <View style={styles.invoiceDetailHeader}>
              <View>
                <Text style={styles.invoiceDetailTitle}>Hóa đơn {selectedInvoice.invoiceNumber}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedInvoice.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(selectedInvoice.status)}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.printButton}>
                <FontAwesome name="print" size={16} color="#1890ff" />
              </TouchableOpacity>
            </View>

            <View style={styles.customerInfo}>
              <Text style={styles.infoLabel}>Khách hàng:</Text>
              <Text style={styles.infoValue}>{selectedInvoice.customerName}</Text>
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.infoLabel}>Phòng:</Text>
              <Text style={styles.infoValue}>{selectedInvoice.roomNumber}</Text>
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.infoLabel}>Nhận phòng:</Text>
              <Text style={styles.infoValue}>{selectedInvoice.checkInDate}</Text>
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.infoLabel}>Trả phòng:</Text>
              <Text style={styles.infoValue}>{selectedInvoice.checkOutDate}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Chi tiết các khoản</Text>
            {selectedInvoice.items.map(item => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemDescription}>
                  <Text style={styles.itemText}>{item.description}</Text>
                  <Text style={styles.itemQuantity}>{item.quantity} x {item.unitPrice.toLocaleString('vi-VN')} VNĐ</Text>
                </View>
                <Text style={styles.itemAmount}>{item.amount.toLocaleString('vi-VN')} VNĐ</Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Tổng cộng:</Text>
              <Text style={styles.totalValue}>{selectedInvoice.totalAmount.toLocaleString('vi-VN')} VNĐ</Text>
            </View>

            {selectedInvoice.status === 'pending' && (
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Thanh toán ngay</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1890ff',
  },
  tabText: {
    fontSize: 14,
    color: '#8c8c8c',
  },
  activeTabText: {
    color: '#1890ff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 10,
  },
  invoiceCard: {
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
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
  },
  customerName: {
    fontSize: 16,
    marginBottom: 4,
  },
  roomInfo: {
    fontSize: 14,
    color: '#8c8c8c',
    marginBottom: 10,
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1890ff',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    color: '#1890ff',
    marginRight: 5,
  },
  detailContainer: {
    flex: 1,
    padding: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1890ff',
    marginLeft: 5,
  },
  invoiceDetailCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  invoiceDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  invoiceDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  printButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  customerInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 120,
    fontSize: 14,
    color: '#8c8c8c',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemDescription: {
    flex: 1,
  },
  itemText: {
    fontSize: 14,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#8c8c8c',
    marginTop: 2,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1890ff',
  },
  actionsContainer: {
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#52c41a',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 