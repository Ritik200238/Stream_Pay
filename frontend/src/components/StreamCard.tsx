import { useState, useEffect } from 'react';

interface Stream {
  id: number;
  sender: string;
  recipient: string;
  ratePerSecond: string;
  startTime: number;
  totalWithdrawn: string;
  status: string;
}

interface StreamCardProps {
  stream: Stream;
  onWithdraw: (streamId: number) => void;
}

export function StreamCard({ stream, onWithdraw }: StreamCardProps) {
  const [balance, setBalance] = useState(0);
  const [displayInteger, setDisplayInteger] = useState('0');
  const [displayDecimal, setDisplayDecimal] = useState('.000000');

  // CRITICAL: Live counter logic - DO NOT MODIFY
  useEffect(() => {
    // Handle both "Active" and "ACTIVE" status
    if (stream.status !== 'Active' && stream.status !== 'ACTIVE') return;

    // Handle both formats: "278" (atto) and "0.000000000000000278" (full units from blockchain)
    let rate = Number(stream.ratePerSecond);

    // If rate is very small (< 0.001), it's in full units from blockchain, convert to atto
    if (rate < 0.001 && rate > 0) {
      rate = rate * 1e18; // Convert from full units to atto
    }

    const withdrawn = Number(stream.totalWithdrawn);
    const startTime = stream.startTime / 1000; // Convert to seconds

    const interval = setInterval(() => {
      const now = Date.now() / 1000;
      const elapsed = now - startTime;

      if (elapsed < 0) {
        setBalance(0);
        setDisplayInteger('0');
        setDisplayDecimal('.000000');
        return;
      }

      const totalEarned = elapsed * rate;
      const available = Math.max(0, totalEarned - withdrawn);

      setBalance(available);

      // Split into integer and decimal parts for display
      const integerPart = Math.floor(available);
      const decimalPart = available - integerPart;

      setDisplayInteger(integerPart.toString());
      setDisplayDecimal('.' + decimalPart.toFixed(6).split('.')[1]);
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [stream.ratePerSecond, stream.startTime, stream.totalWithdrawn, stream.status]);

  // Calculate per hour and per month for display
  // Handle both atto and full unit formats
  let displayRate = Number(stream.ratePerSecond);
  if (displayRate < 0.001 && displayRate > 0) {
    displayRate = displayRate * 1e18; // Convert from full units to atto
  }

  const ratePerHour = (displayRate * 3600).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const ratePerMonth = (displayRate * 3600 * 24 * 30).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className="bg-bg-card border border-white/[0.08] rounded-xl shadow-glow-purple hover:border-brand-purple/30 transition-colors">
      {/* Header Gradient Area */}
      <div className="bg-gradient-to-b from-brand-blue/10 to-transparent border-b border-white/5 p-6 text-center relative">
        {/* Status Badge */}
        <div className="absolute top-4 right-4 bg-brand-green/20 text-brand-green text-[10px] font-bold px-2 py-0.5 rounded border border-brand-green/30">
          {stream.status.toUpperCase()}
        </div>
        <div className="absolute top-4 left-4 text-[10px] font-bold text-gray-500">
          Stream #{stream.id}
        </div>

        {/* Balance - THE KILLER FEATURE */}
        <div className="mt-4 mb-1">
          <span className="text-gray-400 text-2xl align-top">$</span>
          <span className="text-4xl font-bold text-white font-mono tracking-tight">
            {displayInteger}
          </span>
          <span className="text-2xl font-bold text-gray-500 font-mono">
            {displayDecimal}
          </span>
        </div>
        <div className="text-xs font-mono text-brand-green font-bold mb-6">
          +{displayRate.toFixed(6)}/s
        </div>

        {/* Stats Row */}
        <div className="bg-black/20 rounded-lg p-3 grid grid-cols-2 divide-x divide-white/10">
          <div>
            <div className="text-[9px] text-gray-500 uppercase font-bold mb-1">PER HOUR</div>
            <div className="text-sm font-bold text-white font-mono">${ratePerHour}</div>
          </div>
          <div>
            <div className="text-[9px] text-gray-500 uppercase font-bold mb-1">PER MONTH</div>
            <div className="text-sm font-bold text-white font-mono">${ratePerMonth}</div>
          </div>
        </div>

        {/* Live Visualizer */}
        <div className="mt-6 flex items-center justify-center gap-2 opacity-80">
          <div className="flex items-end gap-0.5 h-3">
            <div className="w-0.5 bg-brand-purple h-2 animate-pulse" style={{ animationDuration: '0.5s' }}></div>
            <div className="w-0.5 bg-brand-purple h-3 animate-pulse" style={{ animationDuration: '0.7s' }}></div>
            <div className="w-0.5 bg-brand-purple h-1 animate-pulse" style={{ animationDuration: '0.4s' }}></div>
          </div>
          <span className="text-[9px] font-bold text-white tracking-widest uppercase">STREAMING LIVE</span>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 pt-4">
        <div className="space-y-2 text-[10px] font-mono text-gray-500">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span>From:</span>
            <span className="text-white truncate ml-2" title={stream.sender}>
              {stream.sender.length > 20 ? `${stream.sender.slice(0, 10)}...${stream.sender.slice(-6)}` : stream.sender}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span>To:</span>
            <span className="text-white truncate ml-2" title={stream.recipient}>
              {stream.recipient.length > 20 ? `${stream.recipient.slice(0, 10)}...${stream.recipient.slice(-6)}` : stream.recipient}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span>Rate:</span>
            <span className="text-white">{displayRate} aCC/s</span>
          </div>
        </div>

        {/* Withdraw Button */}
        <button
          onClick={() => {
            alert('💡 Withdraw functionality requires wallet integration.\n\n✅ GraphQL mutation ready\n🔜 Coming in Wave 4!\n\nFor now, this demonstrates the real-time streaming capability of StreamPay on Linera.');
          }}
          className="w-full bg-brand-green hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider py-3 mt-5 rounded-md shadow-glow-green transition-all"
        >
          Withdraw Available
        </button>
      </div>
    </div>
  );
}
