import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StreamCard } from './components/StreamCard';
import { GRAPHQL_ENDPOINT, CHAIN_ID, STREAM_APP_ID } from './config';
import logo from './assets/logo.jpg';

const queryClient = new QueryClient();

// Mock data for demonstration - backend connection ready
const mockStreams = [
  {
    id: 1,
    sender: 'User:0x00cd823722981ed476b6fe2bfe2333193ed5c341f054b69b121c5a50904619d04e',
    recipient: 'User:0x3678...a0g9',
    ratePerSecond: '278',
    startTime: Date.now() - 600000, // Started 10 minutes ago
    totalWithdrawn: '0',
    status: 'Active'
  },
  {
    id: 2,
    sender: 'User:0xFE75...cy4w',
    recipient: 'User:0x9021...L88f',
    ratePerSecond: '555',
    startTime: Date.now() - 1800000, // Started 30 minutes ago
    totalWithdrawn: '5000',
    status: 'Active'
  }
];

function StreamPayApp() {
  const [recipient, setRecipient] = useState('');
  const [ratePerSecond, setRatePerSecond] = useState('278');
  const [duration, setDuration] = useState('3600');
  const [streams, setStreams] = useState(mockStreams);
  const [showSuccess, setShowSuccess] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'demo'>('checking');
  const [usingRealData, setUsingRealData] = useState(false);

  // CRITICAL: Backend connection check AND fetch real streams
  useEffect(() => {
    const checkBackendAndFetchStreams = async () => {
      try {
        // First check if backend is connected
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `{ chains { default } }`
          })
        });
        const data = await response.json();

        if (data.data?.chains?.default === CHAIN_ID) {
          setBackendStatus('connected');

          // Backend is connected, now try to fetch real streams
          const streamAppEndpoint = `${GRAPHQL_ENDPOINT}/chains/${CHAIN_ID}/applications/${STREAM_APP_ID}`;

          try {
            const streamsResponse = await fetch(streamAppEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: `{
                  allStreams {
                    id
                    sender
                    recipient
                    ratePerSecond
                    startTime
                    totalWithdrawn
                    status
                  }
                }`
              })
            });

            const streamsData = await streamsResponse.json();

            if (streamsData.data?.allStreams && streamsData.data.allStreams.length > 0) {
              // We have real streams! Convert them to our format
              const realStreams = streamsData.data.allStreams.map((s: any) => ({
                id: s.id,
                sender: s.sender,
                recipient: s.recipient,
                ratePerSecond: s.ratePerSecond,
                startTime: new Date(s.startTime / 1000000).getTime(), // Convert from microseconds
                totalWithdrawn: s.totalWithdrawn,
                status: s.status
              }));
              setStreams(realStreams);
              setUsingRealData(true);
            } else {
              // No streams yet, use demo data
              console.log('No streams found on blockchain, using demo data');
              setUsingRealData(false);
            }
          } catch (streamError) {
            console.log('Failed to fetch streams, using demo data:', streamError);
            setUsingRealData(false);
          }
        } else {
          setBackendStatus('demo');
          setUsingRealData(false);
        }
      } catch (error) {
        console.log('Backend check failed, using demo mode:', error);
        setBackendStatus('demo');
        setUsingRealData(false);
      }
    };
    checkBackendAndFetchStreams();
  }, []);

  const handleCreateStream = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipient || !ratePerSecond) {
      alert('Please fill in all required fields');
      return;
    }

    const newStream = {
      id: streams.length + 1,
      sender: 'User:0x06cd823722981ed476b6fe2bfe2333193ed5c341f054b69b121c5a50904619bf (You)',
      recipient: recipient,
      ratePerSecond: ratePerSecond,
      startTime: Date.now(),
      totalWithdrawn: '0',
      status: 'Active'
    };

    setStreams([...streams, newStream]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset form
    setRecipient('');
    setRatePerSecond('278');
    setDuration('3600');
  };

  const handleWithdraw = (streamId: number) => {
    setStreams(streams.map(s =>
      s.id === streamId
        ? { ...s, totalWithdrawn: String(Number(s.totalWithdrawn) + 1000) }
        : s
    ));
    alert(`✅ Withdrawn successfully from Stream #${streamId}!`);
  };

  return (
    <div className="min-h-screen relative">
      {/* Ambient Background Glow */}
      <div className="fixed top-[-200px] left-1/2 transform -translate-x-1/2 w-4/5 h-[400px] bg-gradient-radial from-brand-blue/15 to-transparent opacity-50 pointer-events-none z-0"></div>

      {/* Top Status Bar - CRITICAL: Shows backend connection */}
      <div className="w-full border-b border-white/5 bg-black/20 backdrop-blur-sm py-2">
        <div className="max-w-6xl mx-auto px-4 flex justify-center items-center">
          {backendStatus === 'connected' && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/20">
              <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse"></div>
              <span className="text-[10px] font-medium text-brand-green tracking-wide uppercase">
                Connected to Conway Testnet | Chain: {CHAIN_ID.slice(0, 8)}...
                {!usingRealData && " | Demo Data (No streams on-chain yet)"}
                {usingRealData && " | Live Blockchain Data"}
              </span>
            </div>
          )}
          {backendStatus === 'demo' && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20">
              <div className="w-1.5 h-1.5 bg-brand-purple rounded-full animate-pulse"></div>
              <span className="text-[10px] font-medium text-brand-purple tracking-wide uppercase">
                Demo Mode | Stream App: {STREAM_APP_ID.slice(0, 8)}...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <header className="text-center py-12">
        <div className="flex items-center justify-center gap-3 mb-3">
          {/* Logo Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 blur-xl opacity-30"></div>
            <img
              src={logo}
              alt="StreamPay Logo"
              className="w-12 h-12 rounded-full object-cover relative z-10 border-2 border-orange-500/30"
            />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">StreamPay</h1>
        </div>
        <p className="text-gray-400 text-sm">Get paid by the second, not by the month</p>

        {/* Comparison Block */}
        <div className="flex justify-center items-center gap-4 mt-8 flex-wrap">
          {/* Traditional */}
          <div className="bg-[#1A1A23] px-5 py-2.5 rounded-lg border border-white/5 flex items-center gap-3">
            <div className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Traditional</div>
            <div className="text-sm font-bold text-white">30 days 🗓️</div>
          </div>
          <span className="text-gray-700">→</span>
          {/* Ethereum */}
          <div className="bg-[#1A1A23] px-5 py-2.5 rounded-lg border border-white/5 flex items-center gap-3">
            <div className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Ethereum</div>
            <div className="text-sm font-bold text-white">12+ sec 🐢</div>
          </div>
          <span className="text-gray-700">→</span>
          {/* Linera */}
          <div className="bg-[#1A1A23] px-5 py-2.5 rounded-lg border border-brand-blue/50 shadow-glow-purple flex items-center gap-3 relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-blue/5 group-hover:bg-brand-blue/10 transition-colors"></div>
            <div className="text-[10px] text-brand-blue uppercase font-semibold tracking-wider relative z-10">Linera</div>
            <div className="text-sm font-bold text-brand-green relative z-10">&lt;50ms ⚡</div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-20 space-y-10 relative z-10">

        {/* Create New Stream Form */}
        <section className="bg-bg-card border border-white/[0.08] rounded-xl p-8">
          <h2 className="text-lg font-bold text-white mb-6">Create New Stream</h2>

          {showSuccess && (
            <div className="mb-4 bg-brand-green/10 border border-brand-green/30 rounded-lg p-4 text-center">
              <span className="text-brand-green font-semibold text-sm">✅ Stream created successfully!</span>
            </div>
          )}

          <form onSubmit={handleCreateStream} className="space-y-5">
            {/* Recipient */}
            <div>
              <label className="block text-[12px] text-gray-400 font-medium mb-2">Recipient Address</label>
              <input
                type="text"
                className="w-full bg-bg-main border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
                placeholder="User:0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              />
            </div>

            {/* Rate & Duration Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[12px] text-gray-400 font-medium mb-2">Rate per Second (in atto)</label>
                <input
                  type="number"
                  className="w-full bg-bg-main border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
                  value={ratePerSecond}
                  onChange={(e) => setRatePerSecond(e.target.value)}
                  required
                />
                <p className="text-[10px] text-gray-500 mt-1.5 font-mono">{ratePerSecond} atto/s ≈ ~$21/hour</p>
              </div>
              <div>
                <label className="block text-[12px] text-gray-400 font-medium mb-2">Duration (seconds)</label>
                <input
                  type="number"
                  className="w-full bg-bg-main border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <p className="text-[10px] text-gray-500 mt-1.5">Leave empty for infinite</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-brand-purple text-white font-semibold py-3 text-sm rounded-lg shadow-glow-purple hover:opacity-90 transition-opacity mt-2"
            >
              Create Stream
            </button>
          </form>
        </section>

        {/* Your Streams */}
        <section>
          <h2 className="text-lg font-bold text-white mb-6">Your Streams</h2>

          {streams.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No active streams</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {streams.map((stream) => (
                <StreamCard
                  key={stream.id}
                  stream={stream}
                  onWithdraw={handleWithdraw}
                />
              ))}
            </div>
          )}
        </section>

        {/* Use Cases */}
        <section>
          <h2 className="text-lg font-bold text-white mb-6">Use Cases</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Payroll */}
            <div className="bg-bg-card border border-white/[0.08] rounded-xl p-6 text-center group cursor-pointer hover:transform hover:-translate-y-0.5 hover:border-white/20 transition-all">
              <div className="w-12 h-12 mx-auto bg-[#2A1B18] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-xl">💼</span>
              </div>
              <h3 className="text-sm font-bold text-white">Payroll</h3>
              <p className="text-[10px] text-gray-500 mt-1 leading-tight">Pay employees by the second they work</p>
            </div>

            {/* Subscriptions */}
            <div className="bg-bg-card border border-white/[0.08] rounded-xl p-6 text-center group cursor-pointer hover:transform hover:-translate-y-0.5 hover:border-white/20 transition-all">
              <div className="w-12 h-12 mx-auto bg-[#18232A] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-xl">📺</span>
              </div>
              <h3 className="text-sm font-bold text-white">Subscriptions</h3>
              <p className="text-[10px] text-gray-500 mt-1 leading-tight">Pay per second of service usage</p>
            </div>

            {/* Freelancing */}
            <div className="bg-bg-card border border-white/[0.08] rounded-xl p-6 text-center group cursor-pointer hover:transform hover:-translate-y-0.5 hover:border-white/20 transition-all">
              <div className="w-12 h-12 mx-auto bg-[#2A2518] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-xl">👷</span>
              </div>
              <h3 className="text-sm font-bold text-white">Freelancing</h3>
              <p className="text-[10px] text-gray-500 mt-1 leading-tight">Get paid as you work in real-time</p>
            </div>

            {/* Grants */}
            <div className="bg-bg-card border border-white/[0.08] rounded-xl p-6 text-center group cursor-pointer hover:transform hover:-translate-y-0.5 hover:border-white/20 transition-all">
              <div className="w-12 h-12 mx-auto bg-[#2A1825] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-xl">💝</span>
              </div>
              <h3 className="text-sm font-bold text-white">Grants</h3>
              <p className="text-[10px] text-gray-500 mt-1 leading-tight">Continuous funding distribution</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-500 space-y-2">
        <p>Built with ❤️ on Linera for Wave 3 Buildathon</p>
        <p>
          <strong>Backend Deployed:</strong> Stream App ({STREAM_APP_ID.slice(0, 8)}...) on Conway Testnet
        </p>
        <p className="text-brand-purple font-semibold">⚡ Don't wait. Stream.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StreamPayApp />
    </QueryClientProvider>
  );
}
