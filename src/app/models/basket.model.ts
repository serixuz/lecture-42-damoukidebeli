export interface BasketPost {
  quantity: number;
  price: number;
  productId: number;
}

export interface BasketItem {
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    price: number;
    nuts: boolean;
    image: string;
    vegeterian: boolean;
    spiciness: number;
    categoryId: number;
  };
}
