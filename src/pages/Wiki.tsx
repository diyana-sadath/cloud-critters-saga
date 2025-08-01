import { useEffect, useState } from 'react';

interface Cloudimal {
  id: number;
  image_url: string;
  name: string;
  story: string;
  silly_score: number;
  votes: number;
}

export default function Wiki() {
  const [cloudimals, setCloudimals] = useState<Cloudimal[]>([]);

  // Fetch all critters on mount
  useEffect(() => {
    fetchCloudimals();
  }, []);

  const fetchCloudimals = async () => {
    const res = await fetch('http://localhost:4000/cloudwiki');
    const data = await res.json();
    setCloudimals(data);
  };

  // Upvote logic
  const upvote = async (id: number, currentVotes: number) => {
    await fetch(`http://localhost:4000/cloudwiki/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ votes: currentVotes + 1 }),
    });

    // Refresh updated data
    fetchCloudimals();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center magic-gradient">🌥 Cloud Critter Wiki</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cloudimals.map((cloud) => (
          <div key={cloud.id} className="bg-white shadow-xl rounded-xl p-4 border border-gray-100">
            <img
              src={cloud.image_url}
              alt={cloud.name}
              className="rounded-lg h-48 w-full object-cover object-center mb-4 bg-gray-200"
            />

            <h2 className="text-xl font-bold text-blue-800">{cloud.name}</h2>
            <p className="text-sm text-gray-700 mb-2">{cloud.story.slice(0, 100)}...</p>
            <div className="text-xs text-gray-500 mb-2">
              🪄 Silly Score: {cloud.silly_score}
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => upvote(cloud.id, cloud.votes)}
                className="text-sm text-blue-500 hover:underline"
              >
                👍 {cloud.votes} upvotes
              </button>
              <span className="text-[11px] text-gray-400 italic">#id {cloud.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
