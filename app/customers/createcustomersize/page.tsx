"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = "force-dynamic";

interface ClothingType {
  id: number;
  name: string;
}

interface SizeAttribute {
  id: number;
  attributeName: string;
  clothingTypeId: number; // Relasi dengan clothingType
}

interface Customer {
  id: number;
  name: string;
}

const AddCustomerSizePage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [clothingTypes, setClothingTypes] = useState<ClothingType[]>([]);
  const [sizeAttributes, setSizeAttributes] = useState<SizeAttribute[]>([]);
  const [filteredSizeAttributes, setFilteredSizeAttributes] = useState<SizeAttribute[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [selectedClothingType, setSelectedClothingType] = useState<number | null>(null);
  const [sizeValues, setSizeValues] = useState<{ [key: number]: string }>({});
  const router = useRouter();

  useEffect(() => {
    // Fetch customers, clothing types, and size attributes
    const fetchData = async () => {
      try {
        const resCustomers = await fetch('/api/customer');
        const customersData = await resCustomers.json();
        setCustomers(customersData);

        const resClothingTypes = await fetch('/api/clothingtype');
        const clothingTypesData = await resClothingTypes.json();
        setClothingTypes(clothingTypesData);

        const resSizeAttributes = await fetch('/api/sizeattribute');
        const sizeAttributesData = await resSizeAttributes.json();
        setSizeAttributes(sizeAttributesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter size attributes based on selected clothing type
  useEffect(() => {
    if (selectedClothingType) {
      const filteredAttributes = sizeAttributes.filter(
        (attr) => attr.clothingTypeId === selectedClothingType
      );
      setFilteredSizeAttributes(filteredAttributes);
    } else {
      setFilteredSizeAttributes([]);
    }
  }, [selectedClothingType, sizeAttributes]);

  const handleSizeValueChange = (attributeId: number, value: string) => {
    setSizeValues((prevValues) => ({
      ...prevValues,
      [attributeId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedCustomer || !selectedClothingType || filteredSizeAttributes.length === 0) {
      alert('Please fill in all fields');
      return;
    }
  
    // Prepare data for all size attributes
    const sizes = filteredSizeAttributes.map((attr) => ({
      sizeAttributeId: attr.id,
      sizeValue: parseFloat(sizeValues[attr.id] || '0'),
    }));
  
    const customerSizeData = {
      customerId: selectedCustomer,
      clothingTypeId: selectedClothingType,
      sizes: sizes, // Sending sizes as an array
    };
  
    try {
      const res = await fetch('/api/customersize/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerSizeData), // Convert the data to JSON format
      });
  
      if (res.ok) {
        router.push('/customers');
      } else {
        console.error('Failed to add customer sizes');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Add Customer Size</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customer">
            Customer
          </label>
          <select
            id="customer"
            value={selectedCustomer ?? ''}
            onChange={(e) => setSelectedCustomer(parseInt(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clothingType">
            Clothing Type
          </label>
          <select
            id="clothingType"
            value={selectedClothingType ?? ''}
            onChange={(e) => setSelectedClothingType(parseInt(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a clothing type</option>
            {clothingTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {filteredSizeAttributes.length > 0 && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Size Attributes</label>
            {filteredSizeAttributes.map((attr) => (
              <div key={attr.id} className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  {attr.attributeName}
                </label>
                <input
                  type="number"
                  value={sizeValues[attr.id] || ''}
                  onChange={(e) => handleSizeValueChange(attr.id, e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder={`Enter value for ${attr.attributeName}`}
                  required
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Sizes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomerSizePage;
