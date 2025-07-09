
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import SimulationModule from './components/SimulationModule';
import { Droppable } from './components/Droppable';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DiagramDrawingTool from './pages/DiagramDrawingTool';

function Home() {
  const [simulations, setSimulations] = useState([
    { id: '1', name: 'Afterimages' },
    { id: '2', name: 'Motion Blur' },
  ]);
  const [activeSimulations, setActiveSimulations] = useState([]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const overId = over.id;
    const activeId = active.id;

    const isActiveASimulation = simulations.some(sim => sim.id === activeId);
    const isOverASimulation = simulations.some(sim => sim.id === overId);
    const isActiveAnActiveSimulation = activeSimulations.some(sim => sim.id === activeId);
    const isOverAnActiveSimulation = activeSimulations.some(sim => sim.id === overId);

    if (over.id === 'sidebar' || isOverASimulation) {
      // moving to sidebar
      if (isActiveAnActiveSimulation) {
        const itemToMove = activeSimulations.find(item => item.id === activeId);
        setActiveSimulations(activeSimulations.filter(item => item.id !== activeId));
        setSimulations([...simulations, itemToMove]);
      }
    } else if (over.id === 'content' || isOverAnActiveSimulation) {
      // moving to content
      if (isActiveASimulation) {
        const itemToMove = simulations.find(item => item.id === activeId);
        setSimulations(simulations.filter(item => item.id !== activeId));
        setActiveSimulations([...activeSimulations, itemToMove]);
      }
    }

    if (isOverASimulation && isActiveASimulation) {
      // reordering in sidebar
      const oldIndex = simulations.findIndex(item => item.id === activeId);
      const newIndex = simulations.findIndex(item => item.id === overId);
      setSimulations(arrayMove(simulations, oldIndex, newIndex));
    } else if (isOverAnActiveSimulation && isActiveAnActiveSimulation) {
      // reordering in content
      const oldIndex = activeSimulations.findIndex(item => item.id === activeId);
      const newIndex = activeSimulations.findIndex(item => item.id === overId);
      setActiveSimulations(arrayMove(activeSimulations, oldIndex, newIndex));
    }

  };
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="main-container">
        <aside className="sidebar">
          <h2>Visual Simulations</h2>
          <Droppable id="sidebar">
            <SortableContext items={simulations.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {simulations.map(simulation => <SimulationModule key={simulation.id} id={simulation.id} name={simulation.name} isActive={false} />)}
            </SortableContext>
          </Droppable>
        </aside>
        <main className="content">
          <h2>Active Simulations</h2>
          <Droppable id="content">
            <SortableContext items={activeSimulations.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {activeSimulations.map(simulation => <SimulationModule key={simulation.id} id={simulation.id} name={simulation.name} isActive={true} />)}
              {activeSimulations.length === 0 && <div className="placeholder">Drag simulations here</div>}
            </SortableContext>
          </Droppable>
        </main>
      </div>
    </DndContext>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>PerceptFlow</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/diagram-drawing-tool">Diagram Drawing Tool</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diagram-drawing-tool" element={<DiagramDrawingTool />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
