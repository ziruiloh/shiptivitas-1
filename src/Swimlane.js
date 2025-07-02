import React from 'react';
import Card from './Card';
import './Swimlane.css';

export default class Swimlane extends React.Component {
  // Allow dropping cards into this swimlane
  onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  onDrop = (e) => {
    e.preventDefault();
    // If dropping on the swimlane background, add to end
    this.props.onDrop(this.props.status);
  };

  // For reordering within the swimlane
  onCardDrop = (dropIndex) => {
    const { draggingCard, status, onDrop, onDropReorder } = this.props;
    if (!draggingCard) return;
    if (draggingCard.fromSwimlane === status) {
      onDropReorder(status, dropIndex);
    } else {
      onDrop(status, dropIndex);
    }
  };

  render() {
    const { clients, status, onDragStart, onDragEnd, draggingCard } = this.props;
    return (
      <div className="Swimlane-column">
        <div className="Swimlane-title">{this.props.name}</div>
        <div
          className="Swimlane-dragColumn"
          data-id={status}
          onDragOver={this.onDragOver}
          onDrop={this.onDrop}
        >
          {clients.map((client, idx) => (
            <Card
              key={client.id}
              id={client.id}
              name={client.name}
              description={client.description}
              status={client.status}
              onDragStart={() => onDragStart(client.id, status)}
              onDragEnd={onDragEnd}
              draggable
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={e => { e.preventDefault(); e.stopPropagation(); this.onCardDrop(idx); }}
              isDragging={draggingCard && draggingCard.id === client.id}
            />
          ))}
        </div>
      </div>
    );
  }
}
