'use server'

import { tokenInterceptor } from "@/services/auth/api.service"
import axios from "axios"
import { cookies } from "next/headers"
import { env } from "./env.config"

// ✅ bikin instance axios
export const satellite = axios.create({
  baseURL: env.APP.API_URL, // pastikan ini TIDAK kosong
  headers: {
    APIKey: env.APP.API_KEY,
  },
})

// ✅ request interceptor
satellite.interceptors.request.use(
  async function (request) {
    try {
      const cookieStore = await cookies()
      const token = cookieStore.get("token")?.value

      if (token) {
        request.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error("Request interceptor error:", error)
      return Promise.reject(error)
    }

    return request
  },
  function (error) {
    return Promise.reject(error)
  }
)

// ✅ response interceptor
satellite.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    // 🔒 jangan langsung akses error.response.data
    if (error.response) {
      console.error("error in main:", error.response.data)
    } else {
      console.error("error in main (no response):", error.message)
    }

    return tokenInterceptor(error)
  }
)
