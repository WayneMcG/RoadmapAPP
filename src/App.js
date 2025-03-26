// App.js
import React, { useState, useRef, useEffect } from 'react';
import './styles.css';

function App() {
  // Sample initial items
  const [items, setItems] = useState([
    { id: 1, title: 'Research', status: 'Q2: 2025', description: 'Research market and competition', dueDate: '2025-04-01', linkedItems: [] },
    { id: 2, title: 'Design', status: 'Q3: 2025', description: 'Create UI/UX designs', dueDate: '2025-04-15', linkedItems: [] },
    { id: 3, title: 'Development', status: 'Q4:2025', description: 'Implement core features', dueDate: '2025-05-10', linkedItems: [] },
    { id: 4, title: 'Testing', status: 'Q1:2026', description: 'QA and bug fixes', dueDate: '2025-05-25', linkedItems: [] },
    { id: 5, title: 'Launch', status: 'New', description: 'Release product to market', dueDate: '2025-06-01', linkedItems: [] },
  ]);
  
  // New item form state
  const [formVisible, setFormVisible] = useState(false);
  const [formError, setFormError] = useState('');
  const [formItem, setFormItem] = useState({
    id: null,
    title: '',
    description: '',
    dueDate: '',
    status: 'Q2:2025'
  });
  
  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState(null);
  const draggedItemRef = useRef(null);
  const [draggingOver, setDraggingOver] = useState(null);
  
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedLinkedItems, setSelectedLinkedItems] = useState([]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormItem({ ...formItem, [name]: value });
  };

  const saveItem = (e) => {
    e.preventDefault();
    // Add or update item
    if (!formItem.title) {
      console.log("Missing title, form not submitted");
      setFormError('Title is required. Please provide a title.');
      return;
    if (formItem.id) {
      // Update existing item
      console.log("Updating item with ID:", formItem.id);
      setItems(prevItems => 
        prevItems.map(item => item.id === formItem.id ? {...formItem} : item)
      );
    } else {
      // Add new item
      const newId = Math.max(0, ...items.map(item => item.id)) + 1;
      console.log("Adding new item with ID:", newId);
      const newItem = {
        ...formItem,
        id: newId
      };
      setItems(prevItems => [...prevItems, newItem]);
    }
    // Reset form
    setFormItem({
      id: null,
      title: '',
      description: '',
      dueDate: '',
      status: 'Q2:2025'
    });
    setFormVisible(false);
    setFormVisible(false);
    setFormError(''); // Clear error on successful submission

  // Debug effect
  useEffect(() => {
    console.log("Current items:", items);
  }, [items]);

  // Start editing an item
  const editItem = (item, e) => {
    e.stopPropagation(); // Prevent drag start
    setFormItem({ ...item });
    setFormVisible(true);
  };

  // Delete an item
  const deleteItem = (id, e) => {
    e.stopPropagation(); // Prevent drag start
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Cancel form
  const cancelForm = () => {
    setFormItem({
      id: null,
      title: '',
      description: '',
      dueDate: '',
      status: 'Q2:2025'
    });
    setFormVisible(false);
  };

  // Get items by status
  const getItemsByStatus = (status) => {
    return items.filter(item => item.status === status);
  };

  // Drag and drop handlers
  const handleDragStart = (item, e) => {
    setDraggedItem(item);
    draggedItemRef.current = item;
    // Required for Firefox
    e.dataTransfer.setData('application/json', JSON.stringify({ id: item.id }));
    // Add dragging class after a short delay to allow the transform to happen
    setTimeout(() => {
      e.target.classList.add('dragging');
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedItem(null);
    draggedItemRef.current = null;
    setDraggingOver(null);
  };

  const handleDragOver = (status, e) => {
    e.preventDefault();
    if (draggedItemRef.current && draggedItemRef.current.status !== status) {
      setDraggingOver(status);
    }
  };

  const handleDragLeave = () => {
    setDraggingOver(null);
  };
  
  const handleDrop = (status, e) => {
    e.preventDefault();
    
    if (draggedItemRef.current && draggedItemRef.current.status !== status) {
      setItems(items.map(item => 
        item.id === draggedItemRef.current.id
          ? { ...item, status }
          : item
      ));
    }
    setDraggingOver(null);
  };

  const saveLinks = () => {
      if (!currentItem) {
        console.error("No current item selected for linking.");
        return;
      }
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === currentItem.id
            ? { ...item, linkedItems: selectedLinkedItems }
            : item
        )
      );
      closeLinkModal();
    };
  
  const handleLinkChange = (id) => {
    setSelectedLinkedItems((prev) =>
      prev.includes(id)
        ? prev.filter((linkedId) => linkedId !== id)
        : [...prev, id]
    );
  };

  const openLinkModal = (item) => {
    setCurrentItem(item);
    setSelectedLinkedItems(item.linkedItems);
    setLinkModalVisible(true);
  };

  const closeLinkModal = () => {
    setLinkModalVisible(false);
  };

  // Column definitions
  const columns = [
    { id: 'Q2:2025', title: 'Q2:2025' },
    { id: 'Q3:2025', title: 'Q3:2025' },
    { id: 'Q4:2025', title: 'Q4:2025' },
    { id: 'Q1:2026', title: 'Q1:2026' },
    { id: 'done', title: 'Done' },
  ];
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Project Roadmap</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setFormVisible(true)}
        >
          + Add Item
        </button>
      </header>
      
      {formVisible && (
        <div className="form-container">
          <h2 className="form-title">
            {formItem.id ? 'Edit Item' : 'Add New Item'}
          </h2>
          <form onSubmit={saveItem}>
          {formError && <p className="form-error">{formError}</p>}
          <form onSubmit={saveItem}>
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formItem.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-input form-textarea"
                value={formItem.description}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                name="dueDate"
                className="form-input"
                value={formItem.dueDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-input"
                value={formItem.status}
                onChange={handleChange}
              >
                {columns.map(column => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                {formItem.id ? 'Save Changes' : 'Add Item'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="roadmap-grid">
        {columns.map(column => {
          const columnItems = getItemsByStatus(column.id);
          
          return (
            <div key={column.id} className="roadmap-column">
              <div className="column-header">
                <h3 className="column-title">{column.title}</h3>
                <span className="column-count">{columnItems.length}</span>
              </div>
              <div 
                className={`item-list drop-zone ${draggingOver === column.id ? 'drag-over' : ''}`}
                onDragOver={(e) => handleDragOver(column.id, e)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(column.id, e)}
              >
                {columnItems.map(item => (
                  <div 
                    key={item.id} 
                    className="item-card"
                    draggable="true"
                    onDragStart={(e) => handleDragStart(item, e)}
                    onDragEnd={handleDragEnd}
                  >
                    <h4 className="item-title">{item.title}</h4>
                    {item.description && (
                      <p className="item-description">{item.description}</p>
                    )}
                    {item.dueDate && (
                      <p className="item-due-date">
                        <strong>Due:</strong> {item.dueDate}
                      </p>
                    )}
                    {item.linkedItems.length > 0 && (
                      <div className="linked-items">
                        <strong>Linked Items:</strong>
                        <ul>
                          {item.linkedItems.map((linkedId) => {
                            const linkedItem = items.find((i) => i.id === linkedId);
                            return <li key={linkedId}>{linkedItem?.title}</li>;
                          })}
                        </ul>
                      </div>
                    )}
                    <div className="item-actions">
                      <button
                        className="action-btn"
                        onClick={(e) => editItem(item, e)}
                        title="Edit this item"
                        aria-label="Edit this item"
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn"
                        onClick={(e) => deleteItem(item.id, e)}
                      >
                        Delete
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => openLinkModal(item)}
                      >
                        Link
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {linkModalVisible && (
        <div className="modal">
          <h2>Link Items</h2>
          <ul>
            {items
              .filter((item) => item.id !== currentItem.id)
              .map((item) => (
                <li key={item.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedLinkedItems.includes(item.id)}
                      onChange={() => handleLinkChange(item.id)}
                    />
                    {item.title}
                  </label>
                </li>
              ))}
          </ul>
          <button onClick={saveLinks}>Save</button>
          <button onClick={closeLinkModal}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default App;