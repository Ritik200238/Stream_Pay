import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LiveCounter } from './components/LiveCounter';
import { StreamCard } from './components/StreamCard';
import { GRAPHQL_ENDPOINT, CHAIN_ID, STREAM_APP_ID } from './config';
import {
  LayoutDashboard,
  Waves,
  Wallet,
  Settings,
  Plus,
  Activity,
  Copy,
  CheckCircle2
} from 'lucide-react';

const queryClient = new QueryClient();

// Mock data for demonstration
const mockStreams = [
  {
    id: 1,
    sender: 'User:0x06cd823722981ed476b6fe2bfe2333193ed5c341f054b69b121c5a50904619bf',
    recipient: 'User:0x5678...efgh',
    ratePerSecond: '278',  // ~$1/hour
    startTime: Date.now() - 600000,
    totalWithdrawn: '0',
    status: 'Active'
  },
  {
    id: 2,
    sender: 'User:0x9876...zyxw',
    recipient: 'User:0x06cd823722981ed476b6fe2bfe2333193ed5c341f054b69b121c5a50904619bf',
    ratePerSecond: '555',  // ~$2/hour
    startTime: Date.now() - 1800000,
    totalWithdrawn: '5000',
    status: 'Active'
  }
];

function StreamPayApp() {
  const [recipient, setRecipient] = useState('');
  const [ratePerSecond, setRatePerSecond] = useState('278');

  const [streams, setStreams] = useState(mockStreams);
  const [showSuccess, setShowSuccess] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'demo'>('checking');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `{ chains { default } }` })
        });
        const data = await response.json();
        if (data.data?.chains?.default === CHAIN_ID) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('demo');
        }
      } catch (error) {
        console.log('Backend check failed, using demo mode:', error);
        setBackendStatus('demo');
      }
    };
    checkBackend();
  }, []);

  const handleCreateStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !ratePerSecond) return;

    const newStream = {
      id: streams.length + 1,
      sender: 'User:0x06cd...19bf (You)',
      recipient: recipient,
      ratePerSecond: ratePerSecond,
      startTime: Date.now(),
      totalWithdrawn: '0',
      status: 'Active'
    };

    setStreams([...streams, newStream]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setRecipient('');
    setRatePerSecond('278');
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
    <div className="flex min-h-screen bg-deep-void text-white font-sans selection:bg-neon-green/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-deep-void/50 backdrop-blur-xl fixed h-full z-50 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-neon-green to-holo-purple flex items-center justify-center font-black text-deep-void">
              ⚡
            </div>
            <span className="font-bold text-xl tracking-tight">StreamPay</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'streams', icon: Waves, label: 'Active Streams' },
            { id: 'wallet', icon: Wallet, label: 'Wallet' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === item.id
                ? 'bg-neon-green/10 text-neon-green border border-neon-green/20'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <div className={`w-2 h-2 rounded-full ${backendStatus === 'connected' ? 'bg-neon-green animate-pulse' : 'bg-purple-500'}`} />
              {backendStatus === 'connected' ? 'Conway Testnet' : 'Demo Mode'}
            </div>
            <div className="font-mono text-xs text-gray-500 truncate" title={CHAIN_ID}>
              Chain: {CHAIN_ID.slice(0, 8)}...
            </div>
            <div className="font-mono text-xs text-gray-500 truncate mt-1" title={STREAM_APP_ID}>
              App: {STREAM_APP_ID.slice(0, 8)}...
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back, Trader.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition text-sm font-mono text-gray-300">
            <span className="w-2 h-2 rounded-full bg-neon-green"></span>
            0x06cd...19bf
            <Copy className="w-4 h-4 ml-2 text-gray-500" />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* The Money Reactor */}
          <div className="lg:col-span-2">
            <LiveCounter
              streamId={1}
              ratePerSecond={278}
              startTime={Date.now() - 600000}
              totalWithdrawn={0}
              status="Active"
            />
          </div>

          {/* Quick Actions / Stats */}
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4 text-gray-400">
                <Activity className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Net Flow</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">+$24.50<span className="text-lg text-gray-500">/hr</span></div>
              <div className="text-sm text-neon-green">+12% vs last month</div>
            </div>

            <div className="bg-gradient-to-br from-holo-purple/20 to-deep-void border border-holo-purple/30 rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:border-holo-purple/50 transition">
              <div className="absolute inset-0 bg-holo-purple/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <h3 className="text-lg font-bold mb-2 relative z-10">New Stream</h3>
              <p className="text-sm text-gray-400 mb-4 relative z-10">Start a continuous payment flow.</p>
              <div className="w-10 h-10 rounded-full bg-holo-purple flex items-center justify-center relative z-10">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Create Stream Section */}
        <section className="mb-12">
          <div className="bg-deep-void/50 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-neon-green" />
              Initiate Stream
            </h2>

            {showSuccess && (
              <div className="mb-6 p-4 bg-neon-green/10 border border-neon-green/20 rounded-xl flex items-center gap-3 text-neon-green">
                <CheckCircle2 className="w-5 h-5" />
                Stream created successfully!
              </div>
            )}

            <form onSubmit={handleCreateStream} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Recipient</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="User:0x..."
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 outline-none transition font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Rate (atto/s)</label>
                <input
                  type="number"
                  value={ratePerSecond}
                  onChange={(e) => setRatePerSecond(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 outline-none transition font-mono text-sm"
                />
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full bg-neon-green hover:bg-neon-green/90 text-deep-void font-bold py-3 px-6 rounded-xl transition transform hover:scale-[1.02] active:scale-[0.98]">
                  Start Stream
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Active Streams */}
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Waves className="w-5 h-5 text-holo-purple" />
            Active Streams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {streams.map(stream => (
              <StreamCard
                key={stream.id}
                stream={stream}
                onWithdraw={handleWithdraw}
              />
            ))}
          </div>
        </section>
      </main>
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
