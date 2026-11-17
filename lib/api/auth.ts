import { API_BASE, axiosInstance } from "@/lib/axios"
import { pickAccessToken, setAccessToken } from "@/lib/auth-token"
import type {
  AuthUser,
  LoginFormValues,
  OtpRequestResponse,
} from "@/lib/types/auth"
import axios from "axios"

/*
 * Unauthenticated calls (login, password reset) go through bare `axios` so the
 * bearer-injection / refresh-and-retry interceptors never apply to them.
 * `withCredentials` is still needed so the backend can set the refresh cookie.
 */

export async function login(values: LoginFormValues) {
  const response = await axios.post(`${API_BASE}/auth/login`, values, {
    withCredentials: true,
  })
  const token = pickAccessToken(response.data)
  setAccessToken(token)
  return token
}

/** Emails (and WhatsApps) a 6-digit login code. The reply is the same whether or not the account exists. */
export async function requestLoginOtp(identifier: string) {
  const response = await axios.post<OtpRequestResponse>(
    `${API_BASE}/auth/otp/request`,
    { identifier },
    { withCredentials: true }
  )
  return response.data
}

/** Trades a login code for an access token, like a password login. */
export async function verifyLoginOtp(identifier: string, code: string) {
  const response = await axios.post(
    `${API_BASE}/auth/otp/verify`,
    { identifier, code },
    { withCredentials: true }
  )
  const token = pickAccessToken(response.data)
  setAccessToken(token)
  return token
}

export async function fetchMe() {
  const response = await axiosInstance.get<AuthUser>("/auth/me")
  return response.data
}

export async function logout() {
  await axiosInstance.post("/auth/logout")
}

export async function requestPasswordReset(email: string) {
  await axios.post(
    `${API_BASE}/auth/password-reset`,
    { email },
    { withCredentials: true }
  )
}

export async function confirmPasswordReset(token: string, newPassword: string) {
  await axios.post(
    `${API_BASE}/auth/password-reset/confirm`,
    { token, new_password: newPassword },
    { withCredentials: true }
  )
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  await axiosInstance.patch("/auth/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
  })
}
