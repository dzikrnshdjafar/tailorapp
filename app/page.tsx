import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col justify-center text-center items-center text-white">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg p-10 sm:p-10 lg:p-12 rounded-lg shadow-lg w-64 max-w-md sm:max-w-lg">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-10 tracking-wide">
          OPIXXX TAILOR WEB ✂️
        </h1>
        
        <Link href="/login">
          <span className="bg-white text-blue-500 text-lg sm:text-xl lg:text-2xl px-6 py-3 rounded-lg shadow-md hover:bg-blue-500 hover:text-white hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
            Login
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
