"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Tạo context cho giỏ hàng
export const CartContext = createContext()

// Hook để sử dụng CartContext
export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [selectedItems, setSelectedItems] = useState({})

  // Tải giỏ hàng từ localStorage khi component được mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCartItems(parsedCart)

        // Mặc định chọn tất cả sản phẩm
        const initialSelected = {}
        parsedCart.forEach((item) => {
          initialSelected[item.id + "-" + item.mauSac] = true
        })
        setSelectedItems(initialSelected)
      } catch (error) {
        console.error("Lỗi khi đọc giỏ hàng từ localStorage:", error)
        setCartItems([])
      }
    }
  }, [])

  // Lưu giỏ hàng vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product, quantity = 1, selectedColor) => {
    setCartItems((prevItems) => {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.mauSac === selectedColor.mau,
      )

      if (existingItemIndex >= 0) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].soLuong += quantity
        return updatedItems
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        const newItem = {
          id: product.id,
          tenSanPham: product.tenSanPham,
          giaTien: product.giaTien,
          giaTienSo: Number.parseInt(product.giaTien.replace(/\D/g, "")),
          hinhAnh: selectedColor.hinhAnh?.[0]?.img || "/placeholder.svg",
          soLuong: quantity,
          mauSac: selectedColor.mau,
        }

        // Cập nhật selectedItems khi thêm sản phẩm mới
        setSelectedItems((prev) => ({
          ...prev,
          [newItem.id + "-" + newItem.mauSac]: true,
        }))

        return [...prevItems, newItem]
      }
    })
  }

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id, mauSac) => {
    setCartItems((prevItems) => prevItems.filter((item) => !(item.id === id && item.mauSac === mauSac)))

    // Xóa khỏi selectedItems
    setSelectedItems((prev) => {
      const newSelected = { ...prev }
      delete newSelected[id + "-" + mauSac]
      return newSelected
    })
  }

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (id, mauSac, quantity) => {
    if (quantity < 1) return

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id && item.mauSac === mauSac ? { ...item, soLuong: quantity } : item)),
    )
  }

  // Chọn/bỏ chọn sản phẩm
  const toggleSelectItem = (id, mauSac, isSelected) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id + "-" + mauSac]: isSelected,
    }))
  }

  // Chọn/bỏ chọn tất cả sản phẩm
  const toggleSelectAll = (isSelected) => {
    const newSelectedItems = {}
    cartItems.forEach((item) => {
      newSelectedItems[item.id + "-" + item.mauSac] = isSelected
    })
    setSelectedItems(newSelectedItems)
  }

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([])
    setSelectedItems({})
  }

  // Tính tổng số sản phẩm trong giỏ hàng
  const cartCount = cartItems.reduce((total, item) => total + item.soLuong, 0)

  // Tính tổng tiền của các sản phẩm đã chọn
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (selectedItems[item.id + "-" + item.mauSac]) {
        return total + item.giaTienSo * item.soLuong
      }
      return total
    }, 0)
  }

  // Kiểm tra xem tất cả sản phẩm có được chọn không
  const isAllSelected = cartItems.length > 0 && cartItems.every((item) => selectedItems[item.id + "-" + item.mauSac])

  // Kiểm tra xem có sản phẩm nào được chọn không
  const hasSelectedItems = Object.values(selectedItems).some((value) => value)

  const value = {
    cartItems,
    cartCount,
    selectedItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleSelectItem,
    toggleSelectAll,
    clearCart,
    calculateTotal,
    isAllSelected,
    hasSelectedItems,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
