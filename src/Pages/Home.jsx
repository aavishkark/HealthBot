import { useState } from 'react';
export const Home = () => {
    const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('https://healthbotbackend.onrender.com/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();
      setResponse(data.reply || 'No response.');
      console.log(data.reply);
    } catch (err) {
      console.error(err);
      setResponse('Error fetching data.');
    } finally {
      setLoading(false);
    }
  }
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-6">🍎 Calorie Bot</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
        <input
          className="border rounded p-2 w-full"
          type="text"
          value={input}
          placeholder="e.g., How many calories in a banana?"
          onChange={(e) => setInput(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      <div className="mt-6 w-full max-w-md">
        {response && (
          <div className="border rounded p-4">
            <strong>Bot:</strong> {response}
          </div>
        )}
      </div>
    </div>
    )
}