import React from 'react';
import { Topic } from '../types';
import { Calculator, Circle, BarChart3, PieChart, Box, ArrowRight } from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  onClick: (topic: Topic) => void;
}

const IconMap: Record<string, React.FC<any>> = {
  'Calculator': Calculator,
  'Circle': Circle,
  'BarChart3': BarChart3,
  'PieChart': PieChart,
  'Box': Box
};

const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  const Icon = IconMap[topic.icon] || Calculator;

  return (
    <button
      onClick={() => onClick(topic)}
      className={`relative overflow-hidden w-full text-left p-6 rounded-3xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 ${topic.bgColor} ${topic.borderColor} group`}
    >
      <div className="flex items-start justify-between z-10 relative">
        <div className={`p-3 rounded-2xl bg-white/60 backdrop-blur-sm ${topic.color} shadow-sm`}>
          <Icon size={32} strokeWidth={2.5} />
        </div>
        <div className={`p-2 rounded-full bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity ${topic.color}`}>
           <ArrowRight size={20} />
        </div>
      </div>
      
      <div className="mt-6 relative z-10">
        <h3 className={`text-xl font-bold mb-1 ${topic.color.replace('text-', 'text-slate-800 ')}`}>
          {topic.title}
        </h3>
        <p className="text-slate-600 text-sm font-medium">
          {topic.description}
        </p>
      </div>

      {/* Decorative Blob */}
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/30 blur-xl group-hover:bg-white/40 transition-colors`} />
    </button>
  );
};

export default TopicCard;