export interface AdminDashboardSummary {
  ticketsSold: number;
  ticketRevenue: number;
  productsSold: number;
  storeRevenue: number;
  productCost: number;
  netProfit: number;
}

export interface TicketSales {
  movieId: number;
  movieName: string;
  ticketsSold: number;
  revenue: number;
}

export interface ProductSales {
  productId: number;
  productName: string;
  quantitySold: number;
  revenue: number;
  cost: number;
  profit: number;
}

export interface AdminDashboard {
  from: string;
  to: string;
  summary: AdminDashboardSummary;
  ticketSales: TicketSales[];
  productSales: ProductSales[];
}
