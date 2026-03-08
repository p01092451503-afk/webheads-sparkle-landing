export const PAYMENT_TYPES = [
  { value: "hosting", label: "호스팅료", color: "bg-blue-100 text-blue-700" },
  { value: "maintenance", label: "유지보수", color: "bg-purple-100 text-purple-700" },
  { value: "sms", label: "SMS충전", color: "bg-teal-100 text-teal-700" },
  { value: "ssl", label: "SSL", color: "bg-cyan-100 text-cyan-700" },
  { value: "commission", label: "영업수수료", color: "bg-amber-100 text-amber-700" },
  { value: "development", label: "개발", color: "bg-orange-100 text-orange-700" },
  { value: "content", label: "콘텐츠", color: "bg-pink-100 text-pink-700" },
  { value: "other", label: "기타", color: "bg-gray-100 text-gray-600" },
] as const;

export type PaymentType = typeof PAYMENT_TYPES[number]["value"];

export function getPaymentTypeLabel(type: string): string {
  return PAYMENT_TYPES.find((t) => t.value === type)?.label || type;
}

export function getPaymentTypeColor(type: string): string {
  return PAYMENT_TYPES.find((t) => t.value === type)?.color || "bg-gray-100 text-gray-600";
}
