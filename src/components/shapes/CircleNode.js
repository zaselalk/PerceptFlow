
import React from 'react';
import { Handle, Position } from 'reactflow';

const CircleNode = ({ data }) => {
  return (
    <div className="react-flow__node-default circle-node">
      <div>{data.label}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CircleNode;
