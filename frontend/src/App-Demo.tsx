import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LiveCounter } from './components/LiveCounter';
import './App.css';

const queryClient = new QueryClient();

// Mock stream data for demo
const mockStreams = [
  {
    id: 1,
    sender: 'User:0x1234...abcd',
    recipient: 'User:0x5678...efgh',
    ratePerSecond: '278',  // ~$1/hour
    startTime: Date.now() - 600000, // Started 10 minutes ago
    totalWithdrawn: '0',
    status: 'Active'
  },
  {
    id: 2,
    sender: 'User:0x9876...zyxw',
    recipient: 'User:0x5432...dcba',
    ratePerSecond: '555',  // ~$2/hour
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

  const handleCreateStream = (e: React.FormEvent) => {
    e.preventDefault();
    const newStream = {
      id: streams.length + 1,
      sender: 'User:0x1234...abcd (You)',
      recipient: recipient || 'User:0xdemo...addr',
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
    <div className="app">
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1 className="title">
            ⚡ StreamPay
            <span className="subtitle">Get Paid by the Second</span>
          </h1>
          <p className="tagline">
            Real-time payment streaming on Linera microchains
          </p>
        </div>
      </header>

      {/* Comparison Banner */}
      <div className="comparison-banner">
        <div className="comparison-item">
          <span className="comparison-label">Traditional</span>
          <span className="comparison-value">30 days 📅</span>
        </div>
        <div className="comparison-arrow">→</div>
        <div className="comparison-item">
          <span className="comparison-label">Ethereum</span>
          <span className="comparison-value">12+ seconds 🐢</span>
        </div>
        <div className="comparison-arrow">→</div>
        <div className="comparison-item highlight">
          <span className="comparison-label">Linera</span>
          <span className="comparison-value">&lt;50ms ⚡</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {/* Create Stream Form */}
        <section className="card">
          <h2>Create Payment Stream</h2>
          {showSuccess && (
            <div className="success-message">
              ✅ Stream created successfully!
            </div>
          )}
          <form onSubmit={handleCreateStream} className="create-form">
            <div className="form-group">
              <label>Recipient Address</label>
              <input
                type="text"
                placeholder="User:0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Rate per Second (SPT)</label>
              <input
                type="number"
                placeholder="278"
                value={ratePerSecond}
                onChange={(e) => setRatePerSecond(e.target.value)}
                className="form-input"
              />
              <small className="form-hint">
                ~{Math.round(Number(ratePerSecond) * 3600)} SPT/hour
                (~${(Number(ratePerSecond) * 3600 / 1000).toFixed(2)}/hour)
              </small>
            </div>

            <div className="form-group">
              <label>Duration (seconds)</label>
              <input
                type="number"
                placeholder="3600"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="form-input"
              />
              <small className="form-hint">
                {Number(duration) / 3600} hour(s)
              </small>
            </div>

            <button type="submit" className="btn-primary">
              Create Stream
            </button>
          </form>
        </section>

        {/* Active Streams */}
        <section className="card">
          <h2>Your Streams</h2>
          {streams.length === 0 ? (
            <p className="empty-state">No active streams</p>
          ) : (
            <div className="streams-list">
              {streams.map((stream) => (
                <div key={stream.id} className="stream-card">
                  <div className="stream-header">
                    <span className="stream-id">Stream #{stream.id}</span>
                    <span className={`stream-status ${stream.status.toLowerCase()}`}>
                      {stream.status}
                    </span>
                  </div>

                  {/* THE KILLER FEATURE: Live Counter */}
                  <LiveCounter
                    ratePerSecond={stream.ratePerSecond}
                    startTime={stream.startTime}
                    totalWithdrawn={stream.totalWithdrawn}
                    status={stream.status}
                  />

                  <div className="stream-details">
                    <div className="detail-row">
                      <span className="detail-label">From:</span>
                      <span className="detail-value">{stream.sender}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">To:</span>
                      <span className="detail-value">{stream.recipient}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Rate:</span>
                      <span className="detail-value">
                        {stream.ratePerSecond} SPT/sec
                        <small> (~{Math.round(Number(stream.ratePerSecond) * 3600)} SPT/hour)</small>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleWithdraw(stream.id)}
                    className="btn-primary"
                  >
                    Withdraw Available
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Use Cases */}
        <section className="card use-cases">
          <h2>Use Cases</h2>
          <div className="use-cases-grid">
            <div className="use-case">
              <div className="use-case-icon">💼</div>
              <h3>Payroll</h3>
              <p>Pay employees by the second they work</p>
            </div>
            <div className="use-case">
              <div className="use-case-icon">📺</div>
              <h3>Subscriptions</h3>
              <p>Pay per second of service usage</p>
            </div>
            <div className="use-case">
              <div className="use-case-icon">👷</div>
              <h3>Freelancing</h3>
              <p>Get paid as you work in real-time</p>
            </div>
            <div className="use-case">
              <div className="use-case-icon">💝</div>
              <h3>Grants</h3>
              <p>Continuous funding distribution</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Built with ❤️ on Linera for Wave 3 Buildathon</p>
        <p className="footer-tagline">⚡ Don't wait. Stream.</p>
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
