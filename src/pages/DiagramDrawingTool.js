import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, ReactFlowProvider, setNodes, setEdges } from 'reactflow';
import 'reactflow/dist/style.css';

import './DiagramDrawingTool.css';
import RectangleNode from '../components/shapes/RectangleNode';
import CircleNode from '../components/shapes/CircleNode';
import DiamondNode from '../components/shapes/DiamondNode';
import TriangleNode from '../components/shapes/TriangleNode';

const initialNodes = [
  { id: '1', type: 'default', data: { label: 'Start' }, position: { x: 250, y: 5 } },
];

let id = 2;
const getId = () => `${id++}`;

const nodeTypes = {
  rectangle: RectangleNode,
  circle: CircleNode,
  diamond: DiamondNode,
  triangle: TriangleNode,
};

const DiagramDrawingTool = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} shape` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onSave = useCallback(async () => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      try {
        const response = await fetch('http://localhost:5000/api/drawings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(flow),
        });
        if (response.ok) {
          alert('Drawing saved successfully!');
        } else {
          alert('Failed to save drawing.');
        }
      } catch (error) {
        console.error('Error saving drawing:', error);
        alert('Error saving drawing.');
      }
    }
  }, [reactFlowInstance]);

  const onLoad = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/drawings');
      if (response.ok) {
        const drawings = await response.json();
        if (drawings.length > 0) {
          // For simplicity, load the last drawing
          const lastDrawing = drawings[drawings.length - 1];
          setNodes(lastDrawing.nodes || []);
          setEdges(lastDrawing.edges || []);
          alert('Last drawing loaded!');
        } else {
          alert('No drawings found.');
        }
      } else {
        alert('Failed to load drawings.');
      }
    } catch (error) {
      console.error('Error loading drawings:', error);
      alert('Error loading drawings.');
    }
  }, []);

  return (
    <div className="diagram-drawing-tool">
        <div className="sidebar">
            <h3>Shapes</h3>
            <div className="shape-icons">
                <div className="node-item" onDragStart={(event) => onDragStart(event, 'rectangle')} draggable>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                </div>
                <div className="node-item circle" onDragStart={(event) => onDragStart(event, 'circle')} draggable>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
                </div>
                <div className="node-item diamond" onDragStart={(event) => onDragStart(event, 'diamond')} draggable>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 12L12 22L22 12L12 2Z"></path></svg>
                </div>
                <div className="node-item triangle" onDragStart={(event) => onDragStart(event, 'triangle')} draggable>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 22H22L12 2Z"></path></svg>
                </div>
            </div>
            <button onClick={onSave}>Save Drawing</button>
            <button onClick={onLoad}>Load Last Drawing</button>
        </div>
        <div className="canvas-container" ref={reactFlowWrapper}>
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    fitView
                />
            </ReactFlowProvider>
        </div>
    </div>
  );
};

export default DiagramDrawingTool;