export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gown Rental</h1>
        <div>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}
