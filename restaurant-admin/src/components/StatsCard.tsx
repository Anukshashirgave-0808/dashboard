import { ShoppingBag, Clock, CheckCircle } from "lucide-react";

export default function StatsCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon?: string;
}) {
  const getIcon = () => {
    switch (icon) {
      case 'orders':
        return <ShoppingBag className="w-6 h-6 text-white" strokeWidth={1.5} />;
      case 'pending':
        return <Clock className="w-6 h-6 text-white" strokeWidth={1.5} />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-white" strokeWidth={1.5} />;
      default:
        return <ShoppingBag className="w-6 h-6 text-white" strokeWidth={1.5} />;
    }
  };

  const getGradient = () => {
    switch (icon) {
      case 'orders':
        return 'from-blue-600 to-blue-500';
      case 'pending':
        return 'from-yellow-600 to-orange-500';
      case 'delivered':
        return 'from-emerald-600 to-emerald-500';
      default:
        return 'from-cyan-600 to-cyan-500';
    }
  };

  const getBorderColor = () => {
    switch (icon) {
      case 'orders':
        return 'border-blue-500/30';
      case 'pending':
        return 'border-yellow-500/30';
      case 'delivered':
        return 'border-emerald-500/30';
      default:
        return 'border-cyan-500/30';
    }
  };

  return (
    <div className={`relative group overflow-hidden rounded-2xl border ${getBorderColor()}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl"></div>
      <div className="relative p-7 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
          <h2 className="text-4xl font-bold text-white font-mono">{value}</h2>
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${getGradient()} shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
          {getIcon()}
        </div>
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity duration-300"></div>
    </div>
  );
}
