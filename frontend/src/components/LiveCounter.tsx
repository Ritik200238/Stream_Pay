import { useEffect, useState } from 'react';

import { Zap, TrendingUp } from 'lucide-react';

interface LiveCounterProps {
  streamId?: number;
  ratePerSecond: string | number;
  startTime: number;
  totalWithdrawn: string | number;
  status: string;
}

export function LiveCounter({
  streamId = 0,
  ratePerSecond,
  startTime,
  totalWithdrawn,
  status,
}: LiveCounterProps) {
  const rate = typeof ratePerSecond === 'string' ? parseFloat(ratePerSecond) : ratePerSecond;
  const withdrawn = typeof totalWithdrawn === 'string' ? parseFloat(totalWithdrawn) : totalWithdrawn;

  const [displayAmount, setDisplayAmount] = useState('0.000000');

  useEffect(() => {
    if (status !== 'Active') return;

    const interval = setInterval(() => {
      const now = Date.now() / 1000;
      const elapsed = now - (startTime / 1000);

      if (elapsed < 0) {

        return;
      }

      const totalEarned = elapsed * rate;
      const available = Math.max(0, totalEarned - withdrawn);

      setDisplayAmount(available.toFixed(6));
    }, 100); // 100ms updates - DO NOT CHANGE

    return () => clearInterval(interval);
  }, [rate, startTime, withdrawn, status]);

  const [whole, decimal] = displayAmount.split('.');

  return (
    <div className="relative group">
      {/* Electric Border Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green to-holo-purple opacity-30 group-hover:opacity-100 transition duration-1000 blur rounded-2xl animate-pulse-glow"></div>

      <div className="relative bg-deep-void/90 backdrop-blur-xl border border-glass-border rounded-2xl p-8 overflow-hidden">
        {/* Background Grid/Graph Effect */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#39ff14_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-neon-green/10 text-neon-green text-xs font-bold tracking-widest uppercase border border-neon-green/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
              Stream #{streamId} Active
            </span>
          </div>

          <div className="flex items-baseline gap-1 font-mono tracking-tighter text-white mb-2">
            <span className="text-4xl text-gray-400">$</span>
            <span className="text-7xl font-black tracking-tight">{whole}</span>
            <span className="text-4xl text-neon-green">.{decimal}</span>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-neon-green" />
              <span>Rate: <span className="text-white font-mono">${rate.toFixed(6)}/s</span></span>
            </div>
            <div className="w-px h-4 bg-gray-700"></div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-holo-purple" />
              <span>Hourly: <span className="text-white font-mono">${(rate * 3600).toFixed(2)}</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
