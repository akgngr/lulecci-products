"use client"
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/lulecci'); // API rotanızı kontrol edin
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (error) {
        setError(error.message);
        console.error('Fetch Error:', error);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (products.length === 0) {
    return <div>Loading...</div>;
  }
  const regex = /(<([^>]+)>)/gi;
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products?.map((product) => (
          <li key={product.id}>{product.title.replace(regex, " ")} <br />{product.body_html.replace(regex, " ")}</li>
        ))}
      </ul>
    </div>
  );
}