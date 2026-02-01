import axiosClient from '../../api/axiosClient'
import type { Product } from './types'

export const getProducts = () =>
  axiosClient.get<{ results: Product[] }>('products/products/')

export const createProduct = (data: Partial<Product>) =>
  axiosClient.post('products/products/', data)

export const updateProduct = (id: string, data: Partial<Product>) =>
  axiosClient.put(`products/products/${id}/`, data)

export const deleteProduct = (id: string) =>
  axiosClient.delete(`products/products/${id}/`)
