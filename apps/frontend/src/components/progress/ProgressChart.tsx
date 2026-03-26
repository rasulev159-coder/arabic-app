import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { useProgressChart } from '../../hooks/useProgress';
import { Spinner }          from '../../lib/utils';

export function ProgressChart({ days = 30 }: { days?: number }) {
  const { data, isLoading } = useProgressChart(days);

  if (isLoading) return <div className="flex justify-center py-10"><Spinner /></div>;
  if (!data?.length) return (
    <p className="text-center text-[#9a8a6a] font-cinzel text-xs tracking-widest py-10">
      Нет данных
    </p>
  );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradCorrect" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#c9a84c" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#c9a84c" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.08)" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#9a8a6a', fontFamily: 'Cinzel' }}
          tickFormatter={(v) => v.slice(5)}
          stroke="rgba(201,168,76,0.15)"
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#9a8a6a', fontFamily: 'Cinzel' }}
          stroke="rgba(201,168,76,0.15)"
        />
        <Tooltip
          contentStyle={{
            background: '#1c160e', border: '1px solid #3a2d10',
            borderRadius: 12, fontFamily: 'Cinzel', fontSize: 11,
          }}
          labelStyle={{ color: '#9a8a6a' }}
          itemStyle={{ color: '#e8c96d' }}
        />
        <Area
          type="monotone" dataKey="correct"
          stroke="#c9a84c" strokeWidth={2}
          fill="url(#gradCorrect)"
          name="Верно"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
