export enum OrderStatus {
  PENDING = 'PENDING', // vừa đặt hàng, chờ admin xác nhận
  CONFIRMED = 'CONFIRMED', // admin đã xác nhận đơn
  PROCESSING = 'PROCESSING', // shop đang đóng gói/xử lý
  SHIPPING = 'SHIPPING', // đang giao cho shipper
  COMPLETED = 'COMPLETED', // giao thành công, COD đã thu tiền
  CANCELLED = 'CANCELLED', // user/admin huỷ
  REFUNDED = 'REFUNDED', // hoàn tiền (nếu đã thu rồi mới huỷ)
}

export enum PaymentMethod {
  COD = 'COD',
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum ShippingConfig {
  DEFAULT_FEE = 30000,
  FREE_SHIPPING_THRESHOLD = 500000,
  // EXPRESS_SURCHARGE: 20000,
}
