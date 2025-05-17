import { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity, TextInput, FlatList, Modal, SafeAreaView, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: number;
  duration?: string;
}

const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Dịch vụ giặt ủi',
    price: 150000,
    description: 'Giặt ủi quần áo với dịch vụ lấy và giao tận phòng. Thời gian thực hiện trong 24h với chất lượng cao nhất.',
    category: 'laundry',
    image: 'https://img.icons8.com/color/96/000000/washing-machine.png',
    rating: 4.8,
    duration: '24h'
  },
  {
    id: '2',
    name: 'Dịch vụ massage',
    price: 400000,
    description: 'Dịch vụ massage thư giãn tại phòng hoặc spa của khách sạn. Massage toàn thân kết hợp tinh dầu thư giãn.',
    category: 'spa',
    image: 'https://img.icons8.com/color/96/000000/spa-care.png',
    rating: 4.9,
    duration: '60 phút'
  },
  {
    id: '3',
    name: 'Dịch vụ đưa đón sân bay',
    price: 350000,
    description: 'Dịch vụ đưa đón sân bay bằng xe riêng, thoải mái và an toàn với tài xế chuyên nghiệp.',
    category: 'transport',
    image: 'https://img.icons8.com/color/96/000000/airport.png',
    rating: 4.7,
    duration: 'Theo lịch bay'
  },
  {
    id: '4',
    name: 'Dịch vụ ăn sáng tại phòng',
    price: 200000,
    description: 'Dịch vụ phục vụ ăn sáng tại phòng với nhiều lựa chọn món ăn, từ món Âu đến món Á.',
    category: 'food',
    image: 'https://img.icons8.com/color/96/000000/breakfast.png',
    rating: 4.6,
    duration: '6:00 - 10:00'
  },
  {
    id: '5',
    name: 'Dịch vụ tour du lịch',
    price: 500000,
    description: 'Dịch vụ hướng dẫn tham quan các địa điểm du lịch nổi tiếng tại địa phương với hướng dẫn viên chuyên nghiệp.',
    category: 'tour',
    image: 'https://img.icons8.com/color/96/000000/tour-guide.png',
    rating: 4.9,
    duration: '8 tiếng'
  },
  {
    id: '6',
    name: 'Dịch vụ phòng tập gym',
    price: 100000,
    description: 'Sử dụng phòng tập gym đầy đủ thiết bị hiện đại, có huấn luyện viên hỗ trợ nếu cần.',
    category: 'fitness',
    image: 'https://img.icons8.com/color/96/000000/barbell.png',
    rating: 4.5,
    duration: 'Cả ngày'
  },
];

type CategoryIconName = 'th-large' | 'tint' | 'leaf' | 'car' | 'cutlery' | 'map-marker' | 'heartbeat';

export default function ServicesScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const categories = [
    { id: 'all', name: 'Tất cả', icon: 'th-large' as CategoryIconName },
    { id: 'laundry', name: 'Giặt ủi', icon: 'tint' as CategoryIconName },
    { id: 'spa', name: 'Spa', icon: 'leaf' as CategoryIconName },
    { id: 'transport', name: 'Đưa đón', icon: 'car' as CategoryIconName },
    { id: 'food', name: 'Ẩm thực', icon: 'cutlery' as CategoryIconName },
    { id: 'tour', name: 'Tour', icon: 'map-marker' as CategoryIconName },
    { id: 'fitness', name: 'Thể thao', icon: 'heartbeat' as CategoryIconName },
  ];

  const filteredServices = MOCK_SERVICES.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchText.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openServiceDetail = useCallback((service: Service) => {
    setSelectedService(service);
    setModalVisible(true);
  }, []);

  const handleOrderService = useCallback((service: Service) => {
    setModalVisible(false);
    // Có thể thực hiện điều hướng hoặc mở một modal đặt dịch vụ
    setTimeout(() => {
      alert(`Đã đặt dịch vụ: ${service.name}`);
    }, 500);
  }, []);

  const renderStars = (rating: number = 0) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <View style={styles.starsContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesome key={`full-${i}`} name="star" size={12} color="#fadb14" style={{ marginRight: 2 }} />
        ))}
        {halfStar && <FontAwesome key="half" name="star-half-o" size={12} color="#fadb14" style={{ marginRight: 2 }} />}
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesome key={`empty-${i}`} name="star-o" size={12} color="#fadb14" style={{ marginRight: 2 }} />
        ))}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  const renderServiceItem = ({ item }: { item: Service }) => (
    <TouchableOpacity 
      style={styles.serviceCard}
      onPress={() => openServiceDetail(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.serviceImage}
      />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>{item.price.toLocaleString('vi-VN')} VNĐ</Text>
        {item.rating && renderStars(item.rating)}
        <Text 
          style={styles.serviceDescription}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.description}
        </Text>
        <TouchableOpacity 
          style={styles.orderButton}
          onPress={() => handleOrderService(item)}
        >
          <Text style={styles.orderButtonText}>Đặt dịch vụ</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color="#8c8c8c" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm dịch vụ..."
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText !== '' && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <FontAwesome name="times-circle" size={16} color="#8c8c8c" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        horizontal={true} 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
          >
            <FontAwesome 
              name={category.icon}
              size={16} 
              color={selectedCategory === category.id ? 'white' : '#595959'} 
            />
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.servicesGrid}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedService && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <FontAwesome name="close" size={20} color="#333" />
              </TouchableOpacity>

              <Image
                source={{ uri: selectedService.image }}
                style={styles.modalImage}
              />

              <Text style={styles.modalTitle}>{selectedService.name}</Text>
              
              <View style={styles.modalInfoRow}>
                <View style={styles.modalInfoItem}>
                  <FontAwesome name="money" size={16} color="#1890ff" />
                  <Text style={styles.modalInfoText}>
                    {selectedService.price.toLocaleString('vi-VN')} VNĐ
                  </Text>
                </View>
                
                {selectedService.duration && (
                  <View style={styles.modalInfoItem}>
                    <FontAwesome name="clock-o" size={16} color="#52c41a" />
                    <Text style={styles.modalInfoText}>{selectedService.duration}</Text>
                  </View>
                )}
                
                {selectedService.rating && (
                  <View style={styles.modalInfoItem}>
                    <FontAwesome name="star" size={16} color="#fadb14" />
                    <Text style={styles.modalInfoText}>{selectedService.rating.toFixed(1)}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.modalDescriptionTitle}>Mô tả dịch vụ</Text>
              <Text style={styles.modalDescription}>{selectedService.description}</Text>

              <TouchableOpacity 
                style={styles.modalOrderButton}
                onPress={() => handleOrderService(selectedService)}
              >
                <Text style={styles.modalOrderButtonText}>Đặt dịch vụ ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    paddingVertical: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#1890ff',
  },
  categoryText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#595959',
  },
  selectedCategoryText: {
    color: 'white',
  },
  servicesGrid: {
    padding: 10,
    paddingBottom: 20,
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  serviceImage: {
    width: 110,
    height: 140,
    backgroundColor: '#f0f0f0',
  },
  serviceInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#262626',
  },
  servicePrice: {
    fontSize: 14,
    color: '#1890ff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#faad14',
    marginLeft: 2,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#8c8c8c',
    marginBottom: 10,
    lineHeight: 18,
  },
  orderButton: {
    backgroundColor: '#52c41a',
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: 'center',
  },
  orderButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 6,
    borderRadius: 20,
  },
  modalImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 12,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  modalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  modalInfoText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#595959',
  },
  modalDescriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#595959',
    marginBottom: 20,
  },
  modalOrderButton: {
    backgroundColor: '#1890ff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalOrderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 