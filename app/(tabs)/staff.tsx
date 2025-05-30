import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

// Định nghĩa kiểu dữ liệu
interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  avatar: string;
  phone: string;
  email: string;
  status: 'active' | 'onLeave' | 'dayOff';
  salary: number;
  startDate: string;
}

interface Shift {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'missed' | 'current';
}

interface Leave {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Salary {
  id: string;
  employeeId: string;
  month: string;
  year: string;
  baseAmount: number;
  bonus: number;
  deduction: number;
  paymentDate: string;
  status: 'pending' | 'paid';
}

// Mẫu dữ liệu
const SAMPLE_EMPLOYEES: Employee[] = [
  {
    id: 'e1',
    name: 'Nguyễn Văn A',
    position: 'Lễ tân',
    department: 'Tiếp tân',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    phone: '0901234567',
    email: 'nguyenvana@example.com',
    status: 'active',
    salary: 8000000,
    startDate: '2023-01-15'
  },
  {
    id: 'e2',
    name: 'Trần Thị B',
    position: 'Quản lý',
    department: 'Quản lý',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    phone: '0909876543',
    email: 'tranthib@example.com',
    status: 'active',
    salary: 15000000,
    startDate: '2022-05-10'
  },
  {
    id: 'e3',
    name: 'Phạm Văn C',
    position: 'Nhân viên vệ sinh',
    department: 'Dịch vụ phòng',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    phone: '0907654321',
    email: 'phamvanc@example.com',
    status: 'onLeave',
    salary: 6500000,
    startDate: '2023-08-20'
  },
  {
    id: 'e4',
    name: 'Lê Thị D',
    position: 'Đầu bếp',
    department: 'Nhà hàng',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    phone: '0903456789',
    email: 'lethid@example.com',
    status: 'dayOff',
    salary: 12000000,
    startDate: '2022-11-05'
  },
  {
    id: 'e5',
    name: 'Hoàng Văn E',
    position: 'Bảo vệ',
    department: 'An ninh',
    avatar: 'https://randomuser.me/api/portraits/men/81.jpg',
    phone: '0908765432',
    email: 'hoangvane@example.com',
    status: 'active',
    salary: 7000000,
    startDate: '2023-03-01'
  }
];

const SAMPLE_SHIFTS: Shift[] = [
  {
    id: 's1',
    employeeId: 'e1',
    date: '2025-05-18',
    startTime: '07:00',
    endTime: '15:00',
    status: 'completed'
  },
  {
    id: 's2',
    employeeId: 'e1',
    date: '2025-05-19',
    startTime: '15:00',
    endTime: '23:00',
    status: 'scheduled'
  },
  {
    id: 's3',
    employeeId: 'e2',
    date: '2025-05-18',
    startTime: '08:00',
    endTime: '17:00',
    status: 'completed'
  },
  {
    id: 's4',
    employeeId: 'e3',
    date: '2025-05-18',
    startTime: '06:00',
    endTime: '14:00',
    status: 'missed'
  },
  {
    id: 's5',
    employeeId: 'e5',
    date: '2025-05-19',
    startTime: '00:00',
    endTime: '08:00',
    status: 'scheduled'
  }
];

const SAMPLE_LEAVES: Leave[] = [
  {
    id: 'l1',
    employeeId: 'e3',
    startDate: '2025-05-17',
    endDate: '2025-05-19',
    reason: 'Lý do gia đình',
    status: 'approved'
  },
  {
    id: 'l2',
    employeeId: 'e4',
    startDate: '2025-05-18',
    endDate: '2025-05-18',
    reason: 'Khám sức khỏe định kỳ',
    status: 'approved'
  },
  {
    id: 'l3',
    employeeId: 'e1',
    startDate: '2025-05-20',
    endDate: '2025-05-22',
    reason: 'Nghỉ phép năm',
    status: 'pending'
  }
];

const SAMPLE_SALARIES: Salary[] = [
  {
    id: 'p1',
    employeeId: 'e1',
    month: '04',
    year: '2025',
    baseAmount: 8000000,
    bonus: 500000,
    deduction: 0,
    paymentDate: '2025-05-10',
    status: 'paid'
  },
  {
    id: 'p2',
    employeeId: 'e2',
    month: '04',
    year: '2025',
    baseAmount: 15000000,
    bonus: 1000000,
    deduction: 0,
    paymentDate: '2025-05-10',
    status: 'paid'
  },
  {
    id: 'p3',
    employeeId: 'e3',
    month: '04',
    year: '2025',
    baseAmount: 6500000,
    bonus: 300000,
    deduction: 200000,
    paymentDate: '2025-05-10',
    status: 'paid'
  },
  {
    id: 'p4',
    employeeId: 'e1',
    month: '05',
    year: '2025',
    baseAmount: 8000000,
    bonus: 0,
    deduction: 0,
    paymentDate: '2025-06-10',
    status: 'pending'
  }
];

export default function StaffScreen() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'employees' | 'shifts' | 'leaves' | 'salaries'>('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);

  // Load dữ liệu
  React.useEffect(() => {
    fetchData();
  }, []);

  // Mô phỏng lấy dữ liệu từ API
  const fetchData = () => {
    setLoading(true);
    // Mô phỏng API call
    setTimeout(() => {
      setEmployees(SAMPLE_EMPLOYEES);
      setShifts(SAMPLE_SHIFTS);
      setLeaves(SAMPLE_LEAVES);
      setSalaries(SAMPLE_SALARIES);
      setLoading(false);
    }, 1000);
  };

  // Làm mới dữ liệu
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  // Hiển thị chi tiết nhân viên
  const handleEmployeePress = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEmployeeModalVisible(true);
  };

  // Định dạng tiền
  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
  };

  // Xử lý tìm kiếm
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Lọc nhân viên theo từ khóa tìm kiếm
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Lấy trạng thái nhân viên
  const getEmployeeStatusText = (status: string) => {
    switch(status) {
      case 'active': return 'Đang làm việc';
      case 'onLeave': return 'Nghỉ phép';
      case 'dayOff': return 'Ngày nghỉ';
      default: return 'Không xác định';
    }
  };

  // Lấy style cho trạng thái
  const getEmployeeStatusStyle = (status: string) => {
    switch(status) {
      case 'active':
        return { color: '#52c41a', backgroundColor: '#f6ffed', borderColor: '#b7eb8f' };
      case 'onLeave':
        return { color: '#1890ff', backgroundColor: '#e6f7ff', borderColor: '#91d5ff' };
      case 'dayOff':
        return { color: '#faad14', backgroundColor: '#fffbe6', borderColor: '#ffe58f' };
      default:
        return { color: '#8c8c8c', backgroundColor: '#f5f5f5', borderColor: '#d9d9d9' };
    }
  };

  // Render item nhân viên
  const renderEmployeeItem = ({ item }: { item: Employee }) => {
    const statusStyle = getEmployeeStatusStyle(item.status);
    const statusText = getEmployeeStatusText(item.status);
    return (
      <Pressable
        style={({ pressed }) => [
          styles.employeeCard,
          pressed && styles.pressedItem
        ]}
        onPress={() => handleEmployeePress(item)}
      >
        <View style={styles.employeeHeader}>
          <Image 
            source={{ uri: item.avatar }} 
            style={styles.employeeAvatar} 
          />
          <View style={styles.employeeInfo}>
            <Text style={styles.employeeName}>{item.name}</Text>
            <Text style={styles.employeePosition}>{item.position}</Text>
            <Text style={styles.employeeDepartment}>{item.department}</Text>
          </View>
        </View>
        <View style={styles.employeeFooter}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor, borderColor: statusStyle.borderColor }]}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {statusText}
            </Text>
          </View>
          <Text style={styles.employeeSalary}>{formatCurrency(item.salary)}</Text>
        </View>
      </Pressable>
    );
  };

  // Render giao diện tùy thuộc vào tab đang active
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1890ff" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'employees':
        return (
          <FlatList
            data={filteredEmployees}
            renderItem={renderEmployeeItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FontAwesome name="users" size={48} color="#d9d9d9" />
                <Text style={styles.emptyText}>Không tìm thấy nhân viên nào</Text>
              </View>
            }
          />
        );
        
      case 'shifts':
        // Sẽ cài đặt sau
        return (
          <View style={styles.comingSoonContainer}>
            <FontAwesome name="clock-o" size={48} color="#d9d9d9" />
            <Text style={styles.comingSoonText}>Đang cài đặt tính năng quản lý ca làm việc</Text>
          </View>
        );
        
      case 'leaves':
        // Sẽ cài đặt sau
        return (
          <View style={styles.comingSoonContainer}>
            <FontAwesome name="calendar-minus-o" size={48} color="#d9d9d9" />
            <Text style={styles.comingSoonText}>Đang cài đặt tính năng quản lý ngày nghỉ</Text>
          </View>
        );
        
      case 'salaries':
        // Sẽ cài đặt sau
        return (
          <View style={styles.comingSoonContainer}>
            <FontAwesome name="money" size={48} color="#d9d9d9" />
            <Text style={styles.comingSoonText}>Đang cài đặt tính năng quản lý lương</Text>
          </View>
        );
        
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Tìm kiếm ${activeTab === 'employees' ? 'nhân viên' : activeTab === 'shifts' ? 'ca làm việc' : activeTab === 'leaves' ? 'đơn nghỉ phép' : 'bảng lương'}...`}
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#888"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} style={({pressed}) => [styles.clearButton, pressed && styles.pressedItem]}>
            <FontAwesome name="times-circle" size={20} color="#888" />
          </Pressable>
        )}
      </View>

      {/* Tab navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          style={({pressed}) => [styles.tabButton, activeTab === 'employees' && styles.activeTabButton, pressed && styles.pressedItem]}
          onPress={() => setActiveTab('employees')}
        >
          <FontAwesome name="users" size={18} color={activeTab === 'employees' ? '#1890ff' : '#555'} style={styles.tabIcon} />
          <Text style={[styles.tabText, activeTab === 'employees' && styles.activeTabText]}>Nhân viên</Text>
        </Pressable>
        <Pressable
          style={({pressed}) => [styles.tabButton, activeTab === 'shifts' && styles.activeTabButton, pressed && styles.pressedItem]}
          onPress={() => setActiveTab('shifts')}
        >
          <FontAwesome name="calendar-check-o" size={18} color={activeTab === 'shifts' ? '#1890ff' : '#555'} style={styles.tabIcon} />
          <Text style={[styles.tabText, activeTab === 'shifts' && styles.activeTabText]}>Ca làm việc</Text>
        </Pressable>
        <Pressable
          style={({pressed}) => [styles.tabButton, activeTab === 'leaves' && styles.activeTabButton, pressed && styles.pressedItem]}
          onPress={() => setActiveTab('leaves')}
        >
          <FontAwesome name="calendar-times-o" size={18} color={activeTab === 'leaves' ? '#1890ff' : '#555'} style={styles.tabIcon} />
          <Text style={[styles.tabText, activeTab === 'leaves' && styles.activeTabText]}>Nghỉ phép</Text>
        </Pressable>
        <Pressable
          style={({pressed}) => [styles.tabButton, activeTab === 'salaries' && styles.activeTabButton, pressed && styles.pressedItem]}
          onPress={() => setActiveTab('salaries')}
        >
          <FontAwesome name="money" size={18} color={activeTab === 'salaries' ? '#1890ff' : '#555'} style={styles.tabIcon} />
          <Text style={[styles.tabText, activeTab === 'salaries' && styles.activeTabText]}>Lương</Text>
        </Pressable>
      </View>

      {/* Nội dung chính */}
      {loading ? (
        <ActivityIndicator size="large" color="#1890ff" style={{ marginTop: 20 }}/>
      ) : renderContent()}

      {/* Floating action button */}
      {activeTab === 'employees' && (
        <Pressable style={({pressed}) => [styles.fab, pressed && styles.pressedItem]} onPress={() => setEmployeeModalVisible(true)}>
          <FontAwesome name="plus" size={24} color="white" />
        </Pressable>
      )}

      {/* Modal chi tiết nhân viên */}
      {selectedEmployee && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={employeeModalVisible}
          onRequestClose={() => setEmployeeModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedEmployee ? 'Chi tiết nhân viên' : 'Thêm nhân viên mới'}</Text>
                  <Pressable onPress={() => setEmployeeModalVisible(false)} style={({pressed}) => pressed && styles.pressedItem}>
                    <FontAwesome name="times" size={24} color="#888" />
                  </Pressable>
                </View>

                <View style={styles.profileHeader}>
                  <Image 
                    source={{ uri: selectedEmployee?.avatar }} 
                    style={styles.profileAvatar} 
                  />
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{selectedEmployee?.name}</Text>
                    <Text style={styles.profilePosition}>{selectedEmployee?.position}</Text>
                    <View style={[
                      styles.profileStatusBadge, 
                      { backgroundColor: getEmployeeStatusStyle(selectedEmployee?.status || '').backgroundColor }
                    ]}>
                      <Text style={{ color: getEmployeeStatusStyle(selectedEmployee?.status || '').color }}>
                        {getEmployeeStatusText(selectedEmployee?.status || '')}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.profileSection}>
                  <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
                  
                  <View style={styles.profileItem}>
                    <FontAwesome name="phone" size={16} color="#8c8c8c" style={styles.itemIcon} />
                    <Text style={styles.itemLabel}>Điện thoại:</Text>
                    <Text style={styles.itemValue}>{selectedEmployee?.phone}</Text>
                  </View>
                  
                  <View style={styles.profileItem}>
                    <FontAwesome name="envelope" size={16} color="#8c8c8c" style={styles.itemIcon} />
                    <Text style={styles.itemLabel}>Email:</Text>
                    <Text style={styles.itemValue}>{selectedEmployee?.email}</Text>
                  </View>
                </View>
                
                <View style={styles.profileSection}>
                  <Text style={styles.sectionTitle}>Thông tin công việc</Text>
                  
                  <View style={styles.profileItem}>
                    <FontAwesome name="building" size={16} color="#8c8c8c" style={styles.itemIcon} />
                    <Text style={styles.itemLabel}>Phòng ban:</Text>
                    <Text style={styles.itemValue}>{selectedEmployee?.department}</Text>
                  </View>
                  
                  <View style={styles.profileItem}>
                    <FontAwesome name="calendar" size={16} color="#8c8c8c" style={styles.itemIcon} />
                    <Text style={styles.itemLabel}>Ngày bắt đầu:</Text>
                    <Text style={styles.itemValue}>{new Date(selectedEmployee?.startDate || '').toLocaleDateString('vi-VN')}</Text>
                  </View>
                  
                  <View style={styles.profileItem}>
                    <FontAwesome name="money" size={16} color="#8c8c8c" style={styles.itemIcon} />
                    <Text style={styles.itemLabel}>Lương cơ bản:</Text>
                    <Text style={styles.itemValue}>{formatCurrency(selectedEmployee?.salary || 0)}</Text>
                  </View>
                </View>
                
                <View style={styles.profileSection}>
                  <Text style={styles.sectionTitle}>Ca làm việc gần đây</Text>
                  
                  {shifts.filter(shift => shift.employeeId === selectedEmployee?.id).length > 0 ? (
                    shifts
                      .filter(shift => shift.employeeId === selectedEmployee?.id)
                      .slice(0, 3)
                      .map(shift => (
                        <View key={shift.id} style={styles.shiftItem}>
                          <View style={styles.shiftDate}>
                            <FontAwesome name="calendar-o" size={14} color="#8c8c8c" />
                            <Text style={styles.shiftDateText}>{new Date(shift.date).toLocaleDateString('vi-VN')}</Text>
                          </View>
                          
                          <View style={styles.shiftTime}>
                            <Text style={styles.shiftTimeText}>{shift.startTime} - {shift.endTime}</Text>
                          </View>
                          
                          <View style={[styles.shiftStatus, getShiftStatusStyle(shift.status)]}>
                            <Text style={styles.shiftStatusText}>{getShiftStatusText(shift.status)}</Text>
                          </View>
                        </View>
                      ))
                  ) : (
                    <Text style={styles.noDataText}>Không có ca làm việc nào</Text>
                  )}
                </View>
                
                <View style={styles.profileSection}>
                  <Text style={styles.sectionTitle}>Ngày nghỉ</Text>
                  
                  {leaves.filter(leave => leave.employeeId === selectedEmployee?.id).length > 0 ? (
                    leaves
                      .filter(leave => leave.employeeId === selectedEmployee?.id)
                      .map(leave => (
                        <View key={leave.id} style={styles.leaveItem}>
                          <View style={styles.leavePeriod}>
                            <FontAwesome name="calendar" size={14} color="#8c8c8c" />
                            <Text style={styles.leavePeriodText}>
                              {new Date(leave.startDate).toLocaleDateString('vi-VN')}
                              {leave.startDate !== leave.endDate ? ` → ${new Date(leave.endDate).toLocaleDateString('vi-VN')}` : ''}
                            </Text>
                          </View>
                          
                          <Text style={styles.leaveReason}>{leave.reason}</Text>
                          
                          <View style={[styles.leaveStatus, getLeaveStatusStyle(leave.status)]}>
                            <Text style={styles.leaveStatusText}>{getLeaveStatusText(leave.status)}</Text>
                          </View>
                        </View>
                      ))
                  ) : (
                    <Text style={styles.noDataText}>Không có ngày nghỉ nào</Text>
                  )}
                </View>
                
                <View style={styles.profileSection}>
                  <Text style={styles.sectionTitle}>Lương gần đây</Text>
                  
                  {salaries.filter(salary => salary.employeeId === selectedEmployee?.id).length > 0 ? (
                    salaries
                      .filter(salary => salary.employeeId === selectedEmployee?.id)
                      .slice(0, 3)
                      .map(salary => (
                        <View key={salary.id} style={styles.salaryItem}>
                          <View style={styles.salaryPeriod}>
                            <FontAwesome name="calendar-check-o" size={14} color="#8c8c8c" />
                            <Text style={styles.salaryPeriodText}>
                              Tháng {salary.month}/{salary.year}
                            </Text>
                          </View>
                          
                          <View style={styles.salaryDetails}>
                            <Text style={styles.salaryBaseText}>Lương cơ bản: {formatCurrency(salary.baseAmount)}</Text>
                            {salary.bonus > 0 && (
                              <Text style={styles.salaryBonusText}>Thưởng: +{formatCurrency(salary.bonus)}</Text>
                            )}
                            {salary.deduction > 0 && (
                              <Text style={styles.salaryDeductionText}>Khấu trừ: -{formatCurrency(salary.deduction)}</Text>
                            )}
                            <Text style={styles.salaryTotalText}>
                              Tổng: {formatCurrency(salary.baseAmount + salary.bonus - salary.deduction)}
                            </Text>
                          </View>
                          
                          <View style={[
                            styles.salaryStatus, 
                            { backgroundColor: salary.status === 'paid' ? '#f6ffed' : '#fffbe6' }
                          ]}>
                            <Text style={{ 
                              color: salary.status === 'paid' ? '#52c41a' : '#faad14'
                            }}>
                              {salary.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </Text>
                          </View>
                        </View>
                      ))
                  ) : (
                    <Text style={styles.noDataText}>Không có dữ liệu lương</Text>
                  )}
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <Pressable
                  style={({pressed}) => [styles.footerButton, styles.editButton, pressed && styles.pressedItem]}
                  onPress={() => {
                    // Xử lý chỉnh sửa
                    setEmployeeModalVisible(false);
                  }}
                >
                  <FontAwesome name="edit" size={16} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Chỉnh sửa</Text>
                </Pressable>
                
                <Pressable
                  style={({pressed}) => [styles.footerButton, styles.closeButton, pressed && styles.pressedItem]}
                  onPress={() => setEmployeeModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Đóng</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

// Xử lý trạng thái ca làm việc
const getShiftStatusText = (status: string) => {
  switch(status) {
    case 'scheduled': return 'Đã lên lịch';
    case 'completed': return 'Hoàn thành';
    case 'missed': return 'Vắng mặt';
    case 'current': return 'Đang làm việc';
    default: return 'Không xác định';
  }
};

const getShiftStatusStyle = (status: string) => {
  switch(status) {
    case 'scheduled':
      return { backgroundColor: '#e6f7ff' };
    case 'completed':
      return { backgroundColor: '#f6ffed' };
    case 'missed':
      return { backgroundColor: '#fff1f0' };
    case 'current':
      return { backgroundColor: '#fffbe6' };
    default:
      return { backgroundColor: '#f5f5f5' };
  }
};

// Xử lý trạng thái ngày nghỉ
const getLeaveStatusText = (status: string) => {
  switch(status) {
    case 'pending': return 'Đang chờ';
    case 'approved': return 'Đã duyệt';
    case 'rejected': return 'Từ chối';
    default: return 'Không xác định';
  }
};

const getLeaveStatusStyle = (status: string) => {
  switch(status) {
    case 'pending':
      return { backgroundColor: '#fffbe6' };
    case 'approved':
      return { backgroundColor: '#f6ffed' };
    case 'rejected':
      return { backgroundColor: '#fff1f0' };
    default:
      return { backgroundColor: '#f5f5f5' };
  }
};

// Phần style cho giao diện quản lý nhân viên
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
  tabContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#f5f5f5',
  },
  activeTabButton: {
    backgroundColor: '#e6f7ff',
    borderColor: '#91d5ff',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    color: '#8c8c8c',
  },
  activeTabText: {
    color: '#1890ff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  employeeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  employeeHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  employeeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  employeeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  employeePosition: {
    fontSize: 14,
    color: '#262626',
    marginBottom: 2,
  },
  employeeDepartment: {
    fontSize: 14,
    color: '#8c8c8c',
  },
  employeeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
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
  employeeSalary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1890ff',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8c8c8c',
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  comingSoonText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8c8c8c',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1890ff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
    maxHeight: '85%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profilePosition: {
    fontSize: 16,
    color: '#262626',
    marginBottom: 8,
  },
  profileStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  profileSection: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1890ff',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemIcon: {
    marginRight: 8,
    width: 20,
    textAlign: 'center',
  },
  itemLabel: {
    width: 100,
    fontSize: 14,
    color: '#8c8c8c',
  },
  itemValue: {
    flex: 1,
    fontSize: 14,
  },
  shiftItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  shiftDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shiftDateText: {
    marginLeft: 4,
    fontSize: 14,
  },
  shiftTime: {
    flex: 1,
    marginLeft: 10,
  },
  shiftTimeText: {
    fontSize: 14,
  },
  shiftStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  shiftStatusText: {
    fontSize: 12,
  },
  leaveItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leavePeriod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  leavePeriodText: {
    marginLeft: 4,
    fontSize: 14,
  },
  leaveReason: {
    fontSize: 14,
    color: '#262626',
    marginTop: 4,
    marginBottom: 6,
  },
  leaveStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  leaveStatusText: {
    fontSize: 12,
  },
  salaryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  salaryPeriod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  salaryPeriodText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  salaryDetails: {
    marginLeft: 24,
    marginBottom: 6,
  },
  salaryBaseText: {
    fontSize: 14,
    marginBottom: 2,
  },
  salaryBonusText: {
    fontSize: 14,
    color: '#52c41a',
    marginBottom: 2,
  },
  salaryDeductionText: {
    fontSize: 14,
    color: '#f5222d',
    marginBottom: 2,
  },
  salaryTotalText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  salaryStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  noDataText: {
    fontSize: 14,
    color: '#8c8c8c',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerButton: {
    flex: 1,
    borderRadius: 4,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#1890ff',
    marginRight: 8,
  },
  closeButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#d9d9d9',
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButtonText: {
    color: '#595959',
    fontSize: 16,
  },
  pressedItem: {
    opacity: 0.7,
  },
}); 