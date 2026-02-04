export enum OrderStatus {
  PENDING = 'PENDING', // vừa tạo, chưa thanh toán
  PAID = 'PAID', // đã thanh toán
  PROCESSING = 'PROCESSING', // shop đang xử lý
  SHIPPING = 'SHIPPING', // đang giao
  COMPLETED = 'COMPLETED', // giao thành công
  CANCELLED = 'CANCELLED', // user/admin huỷ
  REFUNDED = 'REFUNDED', // hoàn tiền
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
