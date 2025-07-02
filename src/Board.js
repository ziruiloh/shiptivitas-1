import React from 'react';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients,
        inProgress: [],
        complete: [],
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
    this.drake = null;
  }

  getClients() {
    // All clients start in backlog
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix'],
      ['6','Boehm and Sons','Automated Systematic Paradigm'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude'],
      ['10','Romaguera Inc','Managed Foreground Toolset'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: 'backlog', // Force all to backlog status
    }));
  }

  onDragStart = (cardId, fromSwimlane) => {
    this.setState({ draggingCard: { id: cardId, fromSwimlane } });
  };

  onDragEnd = () => {
    this.setState({ draggingCard: null });
  };

  onDrop = (toSwimlane, dropIndex = null) => {
    const { draggingCard, clients } = this.state;
    if (!draggingCard) return;
    const { id: cardId, fromSwimlane } = draggingCard;
    if (fromSwimlane === toSwimlane) return;

    // Find and remove the card from its old swimlane
    let cardToMove = null;
    const newClients = { ...clients };
    newClients[fromSwimlane] = newClients[fromSwimlane].filter(card => {
      if (card.id === cardId) {
        cardToMove = { ...card, status: toSwimlane === 'inProgress' ? 'in-progress' : toSwimlane };
        return false;
      }
      return true;
    });
    if (!cardToMove) return;

    // Insert into new swimlane at the right position
    let updatedTarget = [...newClients[toSwimlane]];
    if (dropIndex !== null && dropIndex >= 0 && dropIndex <= updatedTarget.length) {
      updatedTarget.splice(dropIndex, 0, cardToMove);
    } else {
      updatedTarget.push(cardToMove);
    }
    newClients[toSwimlane] = updatedTarget;

    this.setState({
      clients: newClients,
      draggingCard: null,
    });
  };

  // For reordering within the same swimlane
  onDropReorder = (toSwimlane, dropIndex) => {
    const { draggingCard, clients } = this.state;
    if (!draggingCard) return;
    const { id: cardId, fromSwimlane } = draggingCard;
    if (fromSwimlane !== toSwimlane) return;

    // Remove card from current position
    let cardToMove = null;
    let updated = clients[toSwimlane].filter((card) => {
      if (card.id === cardId) {
        cardToMove = card;
        return false;
      }
      return true;
    });
    if (!cardToMove) return;
    // Insert at new position
    updated.splice(dropIndex, 0, cardToMove);
    this.setState({
      clients: {
        ...clients,
        [toSwimlane]: updated,
      },
      draggingCard: null,
    });
  };

  renderSwimlane(name, clients, statusKey) {
    return (
      <Swimlane
        name={name}
        clients={clients}
        status={statusKey}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDrop={this.onDrop}
        onDropReorder={this.onDropReorder}
        draggingCard={this.state.draggingCard}
      />
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, 'backlog')}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, 'inProgress')}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, 'complete')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
