import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  Animated,
  Image,
  Modal,
  Pressable,
  Dimensions,
  ScrollView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Lấy kích thước màn hình
const { width, height } = Dimensions.get('window');

// Định nghĩa kiểu dữ liệu tin nhắn
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  createdAt: Date;
  image?: string; // URI cho ảnh
}

// Danh sách gợi ý câu hỏi
const SUGGESTED_QUESTIONS = [
  'Làm thế nào để thêm phòng mới?',
  'Cách xác nhận đặt phòng?',
  'Kiểm tra giao dịch qua ngân hàng?',
  'Các dịch vụ khách sạn có những gì?',
  'Làm thế nào để xuất hóa đơn?',
  'Cách xử lý khiếu nại của khách hàng?',
  'Cài đặt giá phòng theo mùa?'
];

const AIChat = () => {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: 'Xin chào! Tôi là trợ lý AI của hệ thống quản lý khách sạn. Tôi có thể giúp gì cho bạn?',
      isUser: false,
      createdAt: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputOpacity = useRef(new Animated.Value(1)).current;
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // Animation for chat button
  const buttonScale = useRef(new Animated.Value(1)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.9)).current;

  // Xử lý ẩn/hiện bàn phím
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        setIsSuggestionVisible(false);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        if (messages.length <= 1) {
          setIsSuggestionVisible(true);
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [messages.length]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (messages.length > 0 && visible) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, visible]);

  // Hiệu ứng khi button được nhấn
  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

  // Hiệu ứng khi mở modal
  const openModal = () => {
    setVisible(true);
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(modalScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  };

  // Hiệu ứng khi đóng modal
  const closeModal = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(modalScale, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      setVisible(false);
    });
  };

  // Xử lý khi nhấn vào button chat
  const handleChatButtonPress = () => {
    animateButton();
    openModal();
  };

  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    // Xin quyền truy cập thư viện ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Cần quyền truy cập vào thư viện ảnh để sử dụng tính năng này!');
      return;
    }

    // Mở thư viện ảnh
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setImagePreviewVisible(true);
    }
  };

  // Gửi tin nhắn và nhận phản hồi
  const handleSendMessage = async (text: string = inputText) => {
    if ((!text.trim() && !selectedImage)) return;

    // Tạo hiệu ứng khi gửi tin nhắn
    Animated.sequence([
      Animated.timing(inputOpacity, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true
      }),
      Animated.timing(inputOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
      })
    ]).start();

    // Tạo tin nhắn mới với ảnh nếu có
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      createdAt: new Date(),
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setImagePreviewVisible(false);
    setIsLoading(true);
    setIsSuggestionVisible(false);

    // Mô phỏng nhận phản hồi từ API
    setTimeout(() => {
      generateAIResponse(text, userMessage.image);
    }, 1000);
  };

  // Mô phỏng tạo phản hồi
  const generateAIResponse = (query: string, imageUri?: string) => {
    let response = '';

    // Nếu có ảnh thì phản hồi liên quan đến ảnh
    if (imageUri) {
      response = 'Tôi đã nhận được hình ảnh của bạn. ';
      
      if (query.trim()) {
        response += 'Về câu hỏi của bạn: ';
      } else {
        response += 'Đây là một hình ảnh đẹp. Tôi có thể giúp gì liên quan đến hình ảnh này?';
      }
    }

    // Mô phỏng phản hồi dựa trên từ khóa
    if (query.toLowerCase().includes('phòng')) {
      response += 'Bạn có thể quản lý phòng trong tab "Phòng". Ở đó bạn có thể thêm, sửa, xóa thông tin phòng và kiểm tra tình trạng phòng.';
    } else if (query.toLowerCase().includes('đặt') || query.toLowerCase().includes('book')) {
      response += 'Để xử lý đặt phòng, vui lòng vào tab "Đặt phòng". Bạn có thể tạo đặt phòng mới, kiểm tra lịch đặt phòng và quản lý các yêu cầu đặc biệt của khách.';
    } else if (query.toLowerCase().includes('giao dịch') || query.toLowerCase().includes('thanh toán')) {
      response += 'Thông tin giao dịch được hiển thị trong tab "Giao dịch". Bạn có thể xác nhận các giao dịch từ ngân hàng và kiểm tra lịch sử thanh toán.';
    } else if (query.toLowerCase().includes('dịch vụ')) {
      response += 'Tab "Dịch vụ" cho phép bạn quản lý các dịch vụ khách sạn như giặt là, spa, đưa đón, ăn uống. Bạn có thể thêm dịch vụ mới và quản lý yêu cầu dịch vụ từ khách hàng.';
    } else if (query.toLowerCase().includes('hóa đơn')) {
      response += 'Bạn có thể tạo và quản lý hóa đơn trong tab "Hóa đơn". Hệ thống hỗ trợ tạo hóa đơn tự động dựa trên thông tin đặt phòng và dịch vụ khách đã sử dụng.';
    } else if (!imageUri && query.trim()) {
      response = 'Tôi hiểu câu hỏi của bạn. Bạn có thể tìm thấy thông tin chi tiết trong các mục quản lý tương ứng. Nếu cần hỗ trợ thêm, đừng ngại hỏi tôi bất cứ lúc nào.';
    }

    // Thêm tin nhắn AI
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: response,
      isUser: false,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  // Format thời gian tin nhắn
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Hủy ảnh đã chọn
  const cancelImage = () => {
    setSelectedImage(null);
    setImagePreviewVisible(false);
  };

  // Render từng tin nhắn
  const renderMessage = ({ item }: { item: Message }) => {
    return (
      <View style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.aiMessageContainer
      ]}>
        {!item.isUser && (
          <View style={styles.avatarContainer}>
            <FontAwesome name="comment-o" size={20} color="#1890ff" />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.aiBubble
        ]}>
          {item.image && (
            <TouchableOpacity 
              onPress={() => {
                setSelectedImage(item.image || null);
                setImagePreviewVisible(true);
              }}
              style={styles.messageImageContainer}
            >
              <Image 
                source={{ uri: item.image }} 
                style={styles.messageImage} 
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
          {item.text.trim() !== '' && (
            <Text style={[
              styles.messageText,
              item.isUser ? styles.userMessageText : styles.aiMessageText
            ]}>
              {item.text}
            </Text>
          )}
          <Text style={styles.messageTime}>
            {formatMessageTime(item.createdAt)}
          </Text>
        </View>
        {item.isUser && (
          <View style={styles.avatarContainer}>
            <FontAwesome name="user" size={20} color="#4caf50" />
          </View>
        )}
      </View>
    );
  };

  // Render gợi ý câu hỏi
  const renderSuggestions = () => {
    if (!isSuggestionVisible) return null;

    return (
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Gợi ý câu hỏi:</Text>
        <View style={styles.suggestionsList}>
          {SUGGESTED_QUESTIONS.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => handleSendMessage(question)}
            >
              <Text style={styles.suggestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <>
      {/* Nút mở chat cố định góc dưới phải */}
      <Animated.View style={[styles.chatButtonContainer, { transform: [{ scale: buttonScale }] }]}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleChatButtonPress}
          activeOpacity={0.8}
        >
          <FontAwesome name="comments" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Modal chat */}
      <Modal
        transparent={true}
        visible={visible}
        onRequestClose={closeModal}
        animationType="none"
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={closeModal}
        >
          <Animated.View 
            style={[
              styles.modalContainer,
              { 
                opacity: modalOpacity,
                transform: [{ scale: modalScale }]
              }
            ]}
          >
            <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <View style={styles.headerContent}>
                  <FontAwesome name="comments" size={24} color="#1890ff" style={styles.headerIcon} />
                  <View>
                    <Text style={styles.headerTitle}>Trợ lý AI</Text>
                    <Text style={styles.headerSubtitle}>Luôn sẵn sàng hỗ trợ bạn</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={closeModal}>
                  <FontAwesome name="times" size={24} color="#8c8c8c" />
                </TouchableOpacity>
              </View>

              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messagesContainer}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                  isLoading ? (
                    <View style={styles.loadingContainer}>
                      <View style={styles.loadingBubble}>
                        <ActivityIndicator size="small" color="#1890ff" />
                        <Text style={styles.loadingText}>Đang trả lời...</Text>
                      </View>
                    </View>
                  ) : null
                }
              />

              {renderSuggestions()}

              {/* Xem trước ảnh đã chọn */}
              {selectedImage && imagePreviewVisible && (
                <View style={styles.imagePreviewContainer}>
                  <Image 
                    source={{ uri: selectedImage }} 
                    style={styles.imagePreview} 
                    resizeMode="contain"
                  />
                  <TouchableOpacity 
                    style={styles.cancelImageButton}
                    onPress={cancelImage}
                  >
                    <FontAwesome name="times-circle" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}

              {/* Preview Modal khi click vào ảnh */}
              <Modal
                transparent={true}
                visible={imagePreviewVisible && selectedImage !== null}
                onRequestClose={() => setImagePreviewVisible(false)}
                animationType="fade"
              >
                <View style={styles.imageViewerContainer}>
                  <TouchableOpacity 
                    style={styles.closeImageViewer}
                    onPress={() => setImagePreviewVisible(false)}
                  >
                    <FontAwesome name="times" size={24} color="#fff" />
                  </TouchableOpacity>
                  {selectedImage && (
                    <Image 
                      source={{ uri: selectedImage }} 
                      style={styles.fullImage} 
                      resizeMode="contain"
                    />
                  )}
                </View>
              </Modal>

              <View style={styles.inputContainer}>
                <Animated.View style={[styles.inputWrapper, { opacity: inputOpacity }]}>
                  <TouchableOpacity 
                    style={styles.imageButton}
                    onPress={pickImage}
                  >
                    <FontAwesome name="image" size={20} color="#8c8c8c" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập câu hỏi của bạn..."
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                  />
                  <TouchableOpacity 
                    style={[styles.sendButton, (!inputText.trim() && !selectedImage ? styles.sendButtonDisabled : null)]}
                    onPress={() => handleSendMessage()}
                    disabled={!inputText.trim() && !selectedImage}
                  >
                    <FontAwesome 
                      name="send" 
                      size={18} 
                      color={!inputText.trim() && !selectedImage ? "#bfbfbf" : "#fff"} 
                    />
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  chatButtonContainer: {
    position: 'absolute',
    bottom: 80, // Để nút không bị che bởi thanh tab
    right: 20,
    zIndex: 999,
  },
  chatButton: {
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    height: height * 0.8,
    maxHeight: 600,
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262626',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8c8c8c',
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  userBubble: {
    backgroundColor: '#e6f7ff',
    borderBottomRightRadius: 0,
    marginLeft: 8,
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 0,
    marginRight: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#1890ff',
  },
  aiMessageText: {
    color: '#262626',
  },
  messageTime: {
    fontSize: 10,
    color: '#8c8c8c',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageImageContainer: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  messageImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },
  avatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#8c8c8c',
  },
  imagePreviewContainer: {
    position: 'relative',
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  imagePreview: {
    width: '100%',
    height: 120,
  },
  cancelImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: height,
  },
  closeImageViewer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  suggestionsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#595959',
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#1890ff',
  },
  inputContainer: {
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  imageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  sendButton: {
    backgroundColor: '#1890ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
});

export default AIChat; 