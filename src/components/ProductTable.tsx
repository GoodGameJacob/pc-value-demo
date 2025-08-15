import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import type { Product } from '../data/sample';

export type Profile = 'Gaming' | 'Creator' | 'Office';

const PROFILE_WEIGHTS: Record<Profile, { gpu: number; cpu: number; ramBonus: number; ssdBonus: number; }> = {
  Gaming: { gpu: 0.70, cpu: 0.25, ramBonus: 0.03, ssdBonus: 0.02 },
  Creator: { gpu: 0.35, cpu: 0.55, ramBonus: 0.07, ssdBonus: 0.03 },
  Office:  { gpu: 0.05, cpu: 0.80, ramBonus: 0.10, ssdBonus: 0.05 },
};

type ScoredProduct = Product & {
  cpuScore: number;
  gpuScore: number;
  perfScore: number;
  valueScore: number;
};

type TableProps = {
  rows: ScoredProduct[];
  initialSort?: SortingState;
};

export default function ProductTable({ rows, initialSort }: TableProps) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSort ?? [{ id: 'valueScore', desc: true }]);

  const columns = React.useMemo<ColumnDef<ScoredProduct>[]>(() => [
    {
      header: 'Product',
      accessorKey: 'productName',
      cell: info => <span>{info.getValue() as string}</span>,
    },
    { header: 'CPU', accessorKey: 'cpu' },
    { header: 'GPU', accessorKey: 'gpu' },
    { header: 'RAM (GB)', accessorKey: 'ramGB' },
    { header: 'Storage (GB)', accessorKey: 'storageGB' },
    {
      header: 'Price ($)',
      accessorKey: 'price',
      cell: info => (info.getValue<number>()).toFixed(2),
    },
    {
      header: 'CPU Score',
      accessorKey: 'cpuScore',
      cell: info => (info.getValue<number>()).toFixed(2),
    },
    {
      header: 'GPU Score',
      accessorKey: 'gpuScore',
      cell: info => (info.getValue<number>()).toFixed(2),
    },
    {
      header: 'Perf Score',
      accessorKey: 'perfScore',
      cell: info => (info.getValue<number>()).toFixed(2),
    },
    {
      header: 'Value Score',
      accessorKey: 'valueScore',
      cell: info => (info.getValue<number>()).toFixed(2),
    },
  ], []);

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  return (
    <div className="card">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted() as string] ?? null}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function scoreProducts(
  products: Product[],
  cpuBench: Record<string, number>,
  gpuBench: Record<string, number>,
  profile: Profile
) {
  const cpuMax = Math.max(...Object.values(cpuBench));
  const gpuMax = Math.max(...Object.values(gpuBench));
  const w = PROFILE_WEIGHTS[profile];

  function norm(val: number, max: number) {
    return (val / max) * 100;
  }

  return products.map(p => {
    const cpuScore = norm(cpuBench[p.cpu], cpuMax);
    const gpuScore = norm(gpuBench[p.gpu], gpuMax);
    const ramBonus = Math.min(p.ramGB / 32, 1) * 5;
    const ssdBonus = (p.storageType.toLowerCase().includes('ssd') ? 3 : 0);

    const perfScore = (w.gpu * gpuScore) + (w.cpu * cpuScore) + (w.ramBonus * ramBonus) + (w.ssdBonus * ssdBonus);
    const valueScore = (perfScore / p.price) * 100; // scaled for readability

    return {
      ...p,
      cpuScore: +cpuScore.toFixed(2),
      gpuScore: +gpuScore.toFixed(2),
      perfScore: +perfScore.toFixed(2),
      valueScore: +valueScore.toFixed(2),
    };
  });
}
