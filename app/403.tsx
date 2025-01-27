import Link from "next/link";

export default function Custom403() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-red-500">403 - Forbidden</h1>
        <p className="mt-2 text-lg text-gray-700">You do not have access to this page.</p>
        <Link
          href="/"
          className="mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Go to Home
        </Link>
      </div>
    );
  }
  