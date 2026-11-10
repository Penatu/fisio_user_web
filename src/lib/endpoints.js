export const API_BASE_URL = "http://76.13.23.68:8990/api/v1";

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth-user/user/login`,
  LOGOUT: `${API_BASE_URL}/auth-user/user/logout`,
  REGISTER: `${API_BASE_URL}/auth-user/register`,
  VERIFY_OTP: `${API_BASE_URL}/auth-user/verify-acc`,
  CITIES: `${API_BASE_URL}/homepage/cities-dropdown`,
  THERAPIST_DROPDOWN: `${API_BASE_URL}/homepage/therapist-dropdown/:cityId`,
  CREATE_RESERVATION: `${API_BASE_URL}/booking/create`,
  GET_TRANSCATION_HISTORY: `${API_BASE_URL}/history/list`,
  GET_TRANSACTION_DETAILS: `${API_BASE_URL}/booking/detail/:code`,
  CANCEL_RESERVATION: `${API_BASE_URL}/booking/cancel/:code`,
  UPLOAD_TRANSFER_PROOF: `${API_BASE_URL}/booking/payment/upload`,
  CREATE_TRANSFER_PAYMENT: `${API_BASE_URL}/booking/:code/payment`,
  GET_CHAT_ROOMS: `${API_BASE_URL}/chat/room`,
};
