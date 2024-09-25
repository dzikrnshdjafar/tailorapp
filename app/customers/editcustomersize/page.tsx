'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const EditCustomerSizePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [size, setSize] = useState<any>(null);
  const [sizeValue, setSizeValue] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchSize = async () => {
      try {
        const res = await fetch(`/api/customersize/${id}`);
        const data = await res.json();
        setSize(data);
        setSizeValue(data.sizeValue);
      } catch (error) {
        console.error('Error fetching size:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSize();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      const res = await fetch(`/api/customersize/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sizeValue }),
      });

      if (res.ok) {
        router.push('/customers'); // Redirect to the customer list page
      } else {
        console.error('Failed to update size');
      }
    } catch (error) {
      console.error('Error updating size:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!size) {
    return <p>Size not found</p>;
  }

  return (
    <div>
      <h1>Edit Customer Size</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Size Value (cm)</label>
          <input
            type="number"
            value={sizeValue}
            onChange={(e) => setSizeValue(Number(e.target.value))}
            className="border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Size
        </button>
      </form>
    </div>
  );
};

export default EditCustomerSizePage;
