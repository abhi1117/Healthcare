"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold mb-4">Google Fit API Integration</h1>
      <div className="space-y-4">
        <Link href="/api/auth">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Authorize
          </button>
        </Link>
        <Link href="/api/fetch-heart-rate">
          <button className="px-4 py-2 bg-green-500 text-white rounded">
            Fetch Heart Rate
          </button>
        </Link>
        <Link href="/api/list-datasources">
          <button className="px-4 py-2 bg-purple-500 text-white rounded">
            List Data Sources
          </button>
        </Link>
      </div>
    </div>
  );
}
