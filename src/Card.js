import React from 'react';
import './Card.css';

export default class Card extends React.Component {
  render() {
    let className = ['Card'];
    if (this.props.status === 'backlog') {
      className.push('Card-grey');
    } else if (this.props.status === 'in-progress') {
      className.push('Card-blue');
    } else if (this.props.status === 'complete') {
      className.push('Card-green');
    }
    if (this.props.isDragging) {
      className.push('Card-dragging');
    }
    return (
      <div
        className={className.join(' ')}
        data-id={this.props.id}
        data-status={this.props.status}
        draggable={this.props.draggable}
        onDragStart={e => {
          e.dataTransfer.effectAllowed = 'move';
          this.props.onDragStart && this.props.onDragStart(e);
        }}
        onDragEnd={e => {
          this.props.onDragEnd && this.props.onDragEnd(e);
        }}
        onDragOver={this.props.onDragOver}
        onDrop={this.props.onDrop}
        style={this.props.isDragging ? { opacity: 0.5 } : {}}
      >
        <div className="Card-title">{this.props.name}</div>
      </div>
    );
  }
}