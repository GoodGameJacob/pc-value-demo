import React from 'react';
import ProductTable, { scoreProducts, Profile } from './components/ProductTable';
import { products as sampleProducts, cpuBench, gpuBench } from './data/sample';

export default function App() {
  const [profile, setProfile] = React.useState<Profile>('Gaming');
  const [search, setSearch] = React.useState('');
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');

  const scored = React.useMemo(() => {
    return scoreProducts(sampleProducts, cpuBench, gpuBench, profile);
  }, [profile]);

  const filtered = scored.filter(row => {
    const hay = (row.productName + ' ' + row.cpu + ' ' + row.gpu).toLowerCase();
    const okSearch = !search || hay.includes(search.toLowerCase());
    const price = row.price;
    const okMin = !minPrice || price >= parseFloat(minPrice);
    const okMax = !maxPrice || price <= parseFloat(maxPrice);
    return okSearch && okMin && okMax;
  });

  const avgPerf = (filtered.reduce((a, b) => a + b.perfScore, 0) / Math.max(filtered.length, 1)).toFixed(1);
  const avgPrice = (filtered.reduce((a, b) => a + b.price, 0) / Math.max(filtered.length, 1)).toFixed(2);
  const bestValue = filtered.slice().sort((a,b) => b.valueScore - a.valueScore)[0];

  return (
    <div className="container">
      <h1>PC Price-to-Performance</h1>
      <div className="subtle">Demo • React + Vite + TypeScript + TanStack Table</div>

      <div className="kpi">
        <div className="item">
          <div className="label">Items</div>
          <div className="value">{filtered.length}</div>
        </div>
        <div className="item">
          <div className="label">Avg Perf Score</div>
          <div className="value">{avgPerf}</div>
        </div>
        <div className="item">
          <div className="label">Avg Price</div>
          <div className="value">${avgPrice}</div>
        </div>
      </div>

      <div className="controls">
        <div>
          <label>Profile</label>
          <select value={profile} onChange={e => setProfile(e.target.value as Profile)}>
            <option>Gaming</option>
            <option>Creator</option>
            <option>Office</option>
          </select>
        </div>
        <div>
          <label>Search (Product/CPU/GPU)</label>
          <input placeholder="e.g., 4070 or i7-12700F" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div>
          <label>Min Price</label>
          <input placeholder="e.g., 800" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
        </div>
        <div>
          <label>Max Price</label>
          <input placeholder="e.g., 1500" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
        </div>
      </div>

      {bestValue && (
        <div style={{ marginBottom: 12 }}>
          <span className="pill">
            <span>🔥 Best Value:</span>
            <strong>{bestValue.productName}</strong>
            <span className="badge">Value {bestValue.valueScore.toFixed(2)}</span>
          </span>
        </div>
      )}

      <ProductTable rows={filtered} />
    </div>
  );
}
