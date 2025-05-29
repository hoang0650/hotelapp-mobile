const USERS = '/users';
const HOTELS = '/hotels';
const ROOMS = '/rooms';
const BOOKINGS = '/bookings';
const SERVICES = '/services';
const SERVICE_ORDERS = '/serviceOrders'; // Hoặc '/services/orders' tùy theo cấu trúc API của bạn
const BUSINESSES = '/businesses';
const STAFFS = '/staffs';
const PRICE_CONFIG = '/priceConfig';
const PRICING_PACKAGES = '/pricing-packages';
const EMAILS = '/emails';
const CHATS = '/chats';
const CHATBOXES = '/chatboxes'; // Hoặc '/chatboxes/messages' cho messages
const SEPAY = '/sepay';
const OTA_INTEGRATIONS = '/otaIntegrations';

export const API_ENDPOINTS = {
  // Users
  SIGNUP: `${USERS}/signup`,
  LOGIN: `${USERS}/login`,
  USER_INFO: `${USERS}/info`,
  USER_PROFILE: `${USERS}/profile`,
  USER_PREFERENCES: `${USERS}/preferences`,
  BUSINESS_SIGNUP: `${USERS}/business/signup`,
  USERS_BY_ROLE: (role: string) => `${USERS}/role/${role}`,
  UPDATE_USER: (userId: string) => `${USERS}/${userId}`,
  UPDATE_USER_STATUS: (userId: string) => `${USERS}/${userId}/status`,
  CHANGE_PASSWORD: (userId: string) => `${USERS}/${userId}/change-password`,

  // Hotels
  GET_HOTELS: HOTELS,
  HOTEL_BY_ID: (id: string) => `${HOTELS}/${id}`,
  CREATE_HOTEL: HOTELS,
  UPDATE_HOTEL: (id: string) => `${HOTELS}/${id}`,
  UPDATE_HOTEL_STATUS: (id: string) => `${HOTELS}/${id}/status`,
  DELETE_HOTEL: (id: string) => `${HOTELS}/${id}`,
  UPLOAD_HOTEL_IMAGE: (id: string) => `${HOTELS}/${id}/images`,
  DELETE_HOTEL_IMAGE: (id: string, imageIndex: string | number) => `${HOTELS}/${id}/images/${imageIndex}`,
  UPDATE_HOTEL_SETTINGS: (id: string) => `${HOTELS}/${id}/settings`,
  CREATE_HOTEL_SERVICE: (id: string) => `${HOTELS}/${id}/services`,
  UPDATE_HOTEL_SERVICE: (id: string, serviceId: string) => `${HOTELS}/${id}/services/${serviceId}`,
  DELETE_HOTEL_SERVICE: (id: string, serviceId: string) => `${HOTELS}/${id}/services/${serviceId}`,

  // Rooms
  GET_ROOMS: ROOMS,
  AVAILABLE_ROOMS: `${ROOMS}/available`,
  ROOM_HISTORY: `${ROOMS}/history`,
  ROOM_INVOICE_DETAILS: (invoiceId: string) => `${ROOMS}/invoice/${invoiceId}`,
  ROOM_BY_ID: (id: string) => `${ROOMS}/${id}`,
  CREATE_ROOM: ROOMS,
  UPDATE_ROOM: (id: string) => `${ROOMS}/${id}`,
  DELETE_ROOM: (id: string) => `${ROOMS}/${id}`,
  CHECK_IN_ROOM: (id: string) => `${ROOMS}/checkin/${id}`,
  CHECK_OUT_ROOM: (id: string) => `${ROOMS}/checkout/${id}`,
  CLEAN_ROOM: (id: string) => `${ROOMS}/clean/${id}`,
  UPDATE_ROOM_STATUS: (id: string) => `${ROOMS}/${id}/status`,
  TRANSFER_ROOM: `${ROOMS}/transfer`,
  ASSIGN_SERVICE_TO_ROOM: (roomId: string, serviceId: string) => `${ROOMS}/${roomId}/services/${serviceId}`,
  DELETE_SERVICE_FROM_ROOM: (roomId: string, serviceId: string) => `${ROOMS}/${roomId}/services/${serviceId}`,
  ROOMS_BY_FLOOR: (hotelId: string, floor: string | number) => `${ROOMS}/hotel/${hotelId}/floor/${floor}`,
  HOTEL_FLOORS: (hotelId: string) => `${ROOMS}/hotel/${hotelId}/floors`,

  // Bookings
  GET_BOOKINGS: BOOKINGS,
  BOOKINGS_BY_HOTEL: (hotelId: string) => `${BOOKINGS}/hotel/${hotelId}`,
  BOOKING_BY_ID: (bookingId: string) => `${BOOKINGS}/${bookingId}`,
  CREATE_BOOKING: BOOKINGS,
  CONFIRM_BOOKING: (bookingId: string) => `${BOOKINGS}/${bookingId}/confirm`,
  CHECK_IN_BOOKING: (bookingId: string) => `${BOOKINGS}/${bookingId}/checkin`,
  CHECK_OUT_BOOKING: (bookingId: string) => `${BOOKINGS}/${bookingId}/checkout`,
  CANCEL_BOOKING: (bookingId: string) => `${BOOKINGS}/${bookingId}/cancel`,
  CALCULATE_BOOKING_COST: (bookingId: string) => `${BOOKINGS}/calculate-cost/${bookingId}`,

  // Services
  GET_SERVICES: SERVICES,
  SERVICE_BY_ID: (id: string) => `${SERVICES}/${id}`,
  CREATE_SERVICE: SERVICES,
  UPDATE_SERVICE: (id: string) => `${SERVICES}/${id}`,
  DELETE_SERVICE: (id: string) => `${SERVICES}/${id}`,
  SERVICE_CATEGORIES: `${SERVICES}/categories`,

  // Service Orders (Lưu ý: API của bạn có vẻ có 2 nhóm endpoint cho Service Orders, chọn 1 hoặc gộp lại)
  // Nhóm 1: /services/orders
  CREATE_SERVICE_ORDER_V1: `${SERVICES}/orders`,
  UPDATE_SERVICE_ORDER_STATUS_V1: (id: string) => `${SERVICES}/orders/${id}/status`,
  SERVICE_ORDER_DETAILS_V1: (id: string) => `${SERVICES}/orders/${id}`,
  SERVICE_ORDERS_BY_ROOM_V1: (roomId: string) => `${SERVICES}/orders/room/${roomId}`,
  SERVICE_ORDERS_BY_HOTEL_V1: `${SERVICES}/orders/hotel`, // Cần query params
  DELETE_SERVICE_ORDER_V1: (id: string) => `${SERVICES}/orders/${id}`,
  // Nhóm 2: /serviceOrders
  SERVICE_ORDERS_BY_HOTEL_V2: (hotelId: string) => `${SERVICE_ORDERS}/hotel/${hotelId}`,
  SERVICE_ORDERS_BY_ROOM_V2: (roomId: string) => `${SERVICE_ORDERS}/room/${roomId}`,
  SERVICE_ORDERS_BY_BOOKING_V2: (bookingId: string) => `${SERVICE_ORDERS}/booking/${bookingId}`,
  CREATE_SERVICE_ORDER_V2: SERVICE_ORDERS,
  UPDATE_SERVICE_ORDER_STATUS_V2: (orderId: string) => `${SERVICE_ORDERS}/${orderId}/status`,
  PAY_SERVICE_ORDER_V2: (orderId: string) => `${SERVICE_ORDERS}/${orderId}/pay`,
  CANCEL_SERVICE_ORDER_V2: (orderId: string) => `${SERVICE_ORDERS}/${orderId}/cancel`,

  // Businesses
  GET_BUSINESSES: BUSINESSES,
  BUSINESS_BY_ID: (id: string) => `${BUSINESSES}/${id}`,
  CREATE_BUSINESS: BUSINESSES,
  UPDATE_BUSINESS: (id: string) => `${BUSINESSES}/${id}`,
  UPDATE_BUSINESS_STATUS: (id: string) => `${BUSINESSES}/${id}/status`,
  UPDATE_BUSINESS_SUBSCRIPTION: (id: string) => `${BUSINESSES}/${id}/subscription`,

  // Staffs
  GET_STAFFS: STAFFS,
  STAFFS_BY_HOTEL: (hotelId: string) => `${STAFFS}/hotel/${hotelId}`,
  STAFF_BY_ID: (id: string) => `${STAFFS}/${id}`,
  CREATE_STAFF: STAFFS,
  UPDATE_STAFF: (id: string) => `${STAFFS}/${id}`,
  DELETE_STAFF: (id: string) => `${STAFFS}/${id}`,

  // Price Config
  PRICE_CONFIG_BY_HOTEL: (hotelId: string) => `${PRICE_CONFIG}/hotel/${hotelId}`,
  PRICE_CONFIG_BY_ROOM_TYPE: (hotelId: string, roomTypeId: string) => `${PRICE_CONFIG}/hotel/${hotelId}/roomType/${roomTypeId}`,
  CREATE_PRICE_CONFIG: (hotelId: string) => `${PRICE_CONFIG}/hotel/${hotelId}`,
  UPDATE_PRICE_CONFIG: (configId: string) => `${PRICE_CONFIG}/${configId}`,
  DEACTIVATE_PRICE_CONFIG: (configId: string) => `${PRICE_CONFIG}/${configId}/deactivate`,
  CALCULATE_PRICE_CONFIG: `${PRICE_CONFIG}/calculate`,

  // Pricing Packages
  PRICING_PERMISSIONS: `${PRICING_PACKAGES}/permissions`,
  GET_PRICING_PACKAGES: PRICING_PACKAGES,
  PRICING_PACKAGE_BY_ID: (id: string) => `${PRICING_PACKAGES}/${id}`,
  CREATE_PRICING_PACKAGE: PRICING_PACKAGES,
  UPDATE_PRICING_PACKAGE: (id: string) => `${PRICING_PACKAGES}/${id}`,
  DELETE_PRICING_PACKAGE: (id: string) => `${PRICING_PACKAGES}/${id}`,
  ALL_SUBSCRIBERS: `${PRICING_PACKAGES}/subscribers/all`,
  SUBSCRIBE_PACKAGE: `${PRICING_PACKAGES}/subscribe`,

  // Emails
  SEND_EMAIL: `${EMAILS}/send-email`,
  SEND_OTP: `${EMAILS}/send-otp`,
  LOAD_OTP: `${EMAILS}/load-otp`,

  // Chats
  PRIVATE_CHATS: `${CHATS}/private`,
  PRIVATE_CHAT_WITH_USER: (userId: string) => `${CHATS}/private/${userId}`,
  CREATE_GROUP_CHAT: `${CHATS}/group`,
  GROUP_CHAT_INFO: (groupId: string) => `${CHATS}/group/${groupId}`,

  // Chatboxes (Messages)
  CREATE_CHATBOX_MESSAGE: `${CHATBOXES}/messages`,
  GET_CHATBOX_MESSAGES: `${CHATBOXES}/messages`,

  // Sepay
  SEPAY_AUTH: `${SEPAY}/auth`,
  SEPAY_TRANSACTIONS: `${SEPAY}/transactions`,

  // OTA Integrations
  GET_OTA_INTEGRATIONS: OTA_INTEGRATIONS,
  CREATE_OTA_INTEGRATION: OTA_INTEGRATIONS,
  OTA_INTEGRATION_BY_ID: (id: string) => `${OTA_INTEGRATIONS}/${id}`,
  UPDATE_OTA_INTEGRATION: (id: string) => `${OTA_INTEGRATIONS}/${id}`,
  DELETE_OTA_INTEGRATION: (id: string) => `${OTA_INTEGRATIONS}/${id}`,
  OTA_LOGIN: (id: string) => `${OTA_INTEGRATIONS}/${id}/login`,
  OTA_BOOKINGS: (id: string) => `${OTA_INTEGRATIONS}/${id}/bookings`,
  OTA_SYNC: (id: string) => `${OTA_INTEGRATIONS}/${id}/sync`,

  // Root
  HOME: '/',
  API_DOCS: '/api-docs',
}; 