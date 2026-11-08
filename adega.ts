export type CategoryId = 
  | 'todos'
  | 'cervejas'
  | 'whiskies'
  | 'destilados'
  | 'combos'
  | 'gelo_acomp'
  | 'vinhos'
  | 'tabacaria';

export interface Category {
  id: CategoryId;
  name: string;
  badge?: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  price: number;
  originalPrice?: number;
  volume: string; // e.g. "350ml", "600ml", "1L", "Saco 5kg"
  image: string;
  isGelada: boolean;
  isPromo?: boolean;
  isBestSeller?: boolean;
  stockStatus: 'in_stock' | 'out_of_stock' | 'low_stock';
  badge?: string;
}

export interface CartItem {
  id: string; // unique cart entry key
  product: Product;
  quantity: number;
  notes?: string;
  isCustomCombo?: boolean;
  comboTitle?: string;
  comboDetails?: string[];
}

export interface ComboStep {
  title: string;
  subtitle: string;
  category: CategoryId;
}

export interface ComboBuilderSelection {
  bottle?: Product;
  mixer?: Product;
  ice?: Product;
  snack?: Product;
}

export interface DeliveryZone {
  id: string;
  name: string;
  estimatedMinutes: string;
  fee: number;
  minFreeFee: number;
}

export interface OrderDetails {
  customerName: string;
  phone: string;
  neighborhood: string;
  street: string;
  number: string;
  complement?: string;
  paymentMethod: 'pix' | 'cartao_entrega' | 'dinheiro';
  cashChangeFor?: string;
  notes?: string;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  icon: string;
  code: string;
  discountType: 'free_delivery' | 'free_item' | 'discount_fixed';
  value: number;
}

export interface OrderHistoryRecord {
  id: string;
  orderNumber: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  pointsEarned: number;
  status: 'entregue' | 'em_preparo';
  summaryText: string;
}

export interface UserLoyaltyProfile {
  customerName: string;
  phone: string;
  totalPoints: number;
  tierName: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
  orderHistory: OrderHistoryRecord[];
  redeemedRewards: string[]; // array of reward codes
}
