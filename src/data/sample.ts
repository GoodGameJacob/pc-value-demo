export type Product = {
  productName: string;
  cpu: string;
  gpu: string;
  ramGB: number;
  storageGB: number;
  storageType: 'SSD' | 'HDD' | 'NVMe' | string;
  price: number;
}

export const cpuBench: Record<string, number> = {
  "Intel Core i5-12400F": 18000,
  "Intel Core i7-12700F": 25000,
  "AMD Ryzen 5 5600": 17000,
  "AMD Ryzen 7 5800X": 24000,
};

export const gpuBench: Record<string, number> = {
  "RTX 3060": 12000,
  "RTX 3060 Ti": 14000,
  "RTX 4070": 21000,
  "RX 6700 XT": 19000,
};

export const products: Product[] = [
  {
    productName: "Gaming PC - i5 12400F / RTX 3060 / 16GB / 512GB SSD",
    cpu: "Intel Core i5-12400F",
    gpu: "RTX 3060",
    ramGB: 16,
    storageGB: 512,
    storageType: "SSD",
    price: 899.99
  },
  {
    productName: "Creator Workstation - i7 12700F / RTX 4070 / 32GB / 1TB SSD",
    cpu: "Intel Core i7-12700F",
    gpu: "RTX 4070",
    ramGB: 32,
    storageGB: 1024,
    storageType: "SSD",
    price: 1799.99
  },
  {
    productName: "Budget Build - Ryzen 5 5600 / RX 6700 XT / 16GB / 512GB SSD",
    cpu: "AMD Ryzen 5 5600",
    gpu: "RX 6700 XT",
    ramGB: 16,
    storageGB: 512,
    storageType: "SSD",
    price: 1049.99
  },
  {
    productName: "High-End Rig - Ryzen 7 5800X / RTX 3060 Ti / 32GB / 1TB SSD",
    cpu: "AMD Ryzen 7 5800X",
    gpu: "RTX 3060 Ti",
    ramGB: 32,
    storageGB: 1024,
    storageType: "SSD",
    price: 1399.99
  },
];
