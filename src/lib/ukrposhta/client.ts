export const ukrposhtaClient = {
  getRegions: async (...args: any[]) => [],
  getCities: async (...args: any[]) => [],
  getPostOffices: async (...args: any[]) => [],
  calculateDeliveryCost: async (...args: any[]) => ({ deliveryPrice: 100 }),
  createShipment: async (...args: any[]) => ({ trackingNumber: "123" })
};

export type UkrposhtaRegion = any;
export type UkrposhtaCity = any;
export type UkrposhtaPostOffice = any;
