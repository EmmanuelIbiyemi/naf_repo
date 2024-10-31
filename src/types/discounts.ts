export type Discount = {
  id?: number;
  condition: number;
  gpa: string;
  discount_percentage: string;
  description: string;
};

export type DiscountCreateType = Discount & {};

export type DiscountFormAction = (discount: Discount) => Promise<void>;

export type DiscountResponse = {
  data: Discount[];
};
