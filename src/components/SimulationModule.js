
import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import Afterimages from './simulations/Afterimages';

import MotionBlur from './simulations/MotionBlur';

const SimulationModule = ({ id, name, isActive }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '10px',
    margin: '0 0 10px 0',
    backgroundColor: '#eee',
    border: '1px solid #ddd',
    cursor: 'grab',
  };

  const renderContent = () => {
    if (!isActive) {
      return name;
    }

    switch (name) {
      case 'Afterimages':
        return <Afterimages />;
      case 'Motion Blur':
        return <MotionBlur />;
      default:
        return <p>This simulation is not yet implemented.</p>;
    }
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {renderContent()}
    </div>
  );
};

export default SimulationModule;
