"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Tambahkan package ini untuk mengelola cookies

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Simpan token di cookies dan localStorage
        Cookies.set('token', data.token, { expires: 7 }); // Token disimpan di cookies selama 7 hari
        localStorage.setItem('token', data.token);

        // Redirect ke halaman dashboard setelah login sukses
        router.push('/customers');
      } else {
        setErrorMessage(data.message || 'Failed to login');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
  <form onSubmit={handleLogin} className="w-64 max-w-sm bg-white bg-opacity-80 backdrop-blur-lg p-8 rounded-lg shadow-lg">
    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
      Admin Login
    </h2>
    {errorMessage && (
      <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
        {errorMessage}
      </div>
    )}
    <div className="mb-4">
      <label
        htmlFor="username"
        className="block text-sm font-medium text-gray-700"
      >
        Username
      </label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out transform hover:scale-105"
        required
      />
    </div>
    <div className="mb-6">
      <label
        htmlFor="password"
        className="block text-sm font-medium text-gray-700"
      >
        Password
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-200 ease-in-out transform hover:scale-105"
        required
      />
    </div>
    <button
      type="submit"
      className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
    >
      Login
    </button>
  </form>
</div>

  );
};

export default LoginPage;
