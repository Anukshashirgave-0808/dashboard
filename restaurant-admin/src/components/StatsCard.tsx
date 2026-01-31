"use client";

export default function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon?: string;
}) {
  // Function to choose the correct icon
  const getIcon = () => {
    switch (icon) {
      case 'orders':
        return (
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        );
      case 'pending':
        return (
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'delivered':
        return (
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        );
    }
  };

  // Function to choose gradient background for icon box
  const getGradient = () => {
    switch (icon) {
      case 'orders':
        return 'bg-gradient-to-br from-cyan-500 to-indigo-600';
      case 'pending':
        return 'bg-gradient-to-br from-orange-500 to-orange-600';
      case 'delivered':
        return 'bg-gradient-to-br from-emerald-500 to-emerald-600';
      default:
        return 'bg-gradient-to-br from-indigo-500 to-cyan-600';
    }
  };

  return (
    <div
      className="min-w-[250px] flex-shrink-0 p-6 rounded-3xl shadow-2xl border border-cyan-500/20
      bg-[#1a2847]/40 hover:bg-[#1f2a4a]/50 transition-all duration-500 relative overflow-hidden
      group hover:scale-105 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up"
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0
      group-hover:opacity-70 rounded-3xl transition-opacity duration-500"></div>

      <div className="flex items-center justify-between relative z-10 gap-4">
        {/* Title & Value */}
        <div className="flex-1">
          <p className="text-cyan-300/70 text-lg font-bold uppercase tracking-wider mb-2">{title}</p>
          <h2 className="text-4xl font-black text-cyan-100 group-hover:text-cyan-50 transition-colors duration-300 leading-none">{value}</h2>
        </div>

        {/* Icon Box */}
        <div className={`p-4 rounded-3xl ${getGradient()} shadow-2xl relative`}>
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-3xl ${getGradient()} blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
          <div className="relative z-10">{getIcon()}</div>
        </div>
      </div>
    </div>
  );
}
