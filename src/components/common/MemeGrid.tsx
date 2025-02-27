import React from 'react';
import { Meme } from '../../store/slices/memesSlice';
import MemeCard from './MemeCard';

interface MemeGridProps {
  memes: Meme[];
  columns?: number;
}

const MemeGrid: React.FC<MemeGridProps> = ({ memes, columns = 3 }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-6`}>
      {memes.map((meme, index) => (
        <MemeCard key={meme.id} meme={meme} index={index} />
      ))}
    </div>
  );
};

export default MemeGrid;