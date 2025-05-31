import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [columns, setColumns] = useState([
    {
      id: '1',
      title: 'To Do',
      cards: [
        { id: 'card-1', title: 'Design wireframes', description: 'Create initial wireframes for the new feature', assignee: 'Alex Chen', priority: 'high' },
        { id: 'card-2', title: 'Setup development environment', description: 'Configure local development setup', assignee: 'Sarah Kim', priority: 'medium' }
      ]
    },
    {
      id: '2',
      title: 'In Progress',
      cards: [
        { id: 'card-3', title: 'Implement authentication', description: 'Add login and signup functionality', assignee: 'Mike Johnson', priority: 'high' }
      ]
    },
    {
      id: '3',
      title: 'Review',
      cards: [
        { id: 'card-4', title: 'Code review for API endpoints', description: 'Review REST API implementation', assignee: 'Emma Davis', priority: 'medium' }
      ]
    },
    {
      id: '4',
      title: 'Done',
      cards: [
        { id: 'card-5', title: 'Project setup', description: 'Initialize project repository and basic structure', assignee: 'Team Lead', priority: 'low' }
      ]
    }
  ])

  const [draggedCard, setDraggedCard] = useState(null)
  const [draggedOverColumn, setDraggedOverColumn] = useState(null)
  const [showAddCard, setShowAddCard] = useState(null)
  const [newCardTitle, setNewCardTitle] = useState('')
  const [newCardDescription, setNewCardDescription] = useState('')

  const dragCounter = useRef(0)

  const handleDragStart = (e, card, columnId) => {
    setDraggedCard({ card, sourceColumnId: columnId })
    e.dataTransfer.effectAllowed = 'move'
    e.target.classList.add('dragging')
  }

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging')
    setDraggedCard(null)
    setDraggedOverColumn(null)
    dragCounter.current = 0
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e, columnId) => {
    e.preventDefault()
    dragCounter.current++
    setDraggedOverColumn(columnId)
  }

  const handleDragLeave = (e) => {
    dragCounter.current--
    if (dragCounter.current === 0) {
      setDraggedOverColumn(null)
    }
  }

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault()
    dragCounter.current = 0
    setDraggedOverColumn(null)

    if (!draggedCard) return

    const { card, sourceColumnId } = draggedCard

    if (sourceColumnId === targetColumnId) {
      setDraggedCard(null)
      return
    }

    const newColumns = columns.map(column => {
      if (column.id === sourceColumnId) {
        return {
          ...column,
          cards: column.cards.filter(c => c.id !== card.id)
        }
      }
      if (column.id === targetColumnId) {
        return {
          ...column,
          cards: [...column.cards, card]
        }
      }
      return column
    })

    setColumns(newColumns)
    setDraggedCard(null)

    const targetColumn = columns.find(col => col.id === targetColumnId)
    toast.success(`Card moved to ${targetColumn.title}`)
  }

  const addCard = (columnId) => {
    if (!newCardTitle.trim()) return

    const newCard = {
      id: `card-${Date.now()}`,
      title: newCardTitle,
      description: newCardDescription,
      assignee: 'Unassigned',
      priority: 'medium'
    }

    const newColumns = columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          cards: [...column.cards, newCard]
        }
      }
      return column
    })

    setColumns(newColumns)
    setNewCardTitle('')
    setNewCardDescription('')
    setShowAddCard(null)
    toast.success('Card created successfully')
  }

  const deleteCard = (cardId, columnId) => {
    const newColumns = columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          cards: column.cards.filter(card => card.id !== cardId)
        }
      }
      return column
    })

    setColumns(newColumns)
    toast.success('Card deleted')
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-surface-100 text-surface-700 border-surface-200'
    }
  }

  return (
    <div className="w-full">
      {/* Board Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-2">
              Project Alpha Dashboard
            </h1>
            <p className="text-surface-600 text-sm sm:text-base">
              Manage your team's workflow with visual kanban boards
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              {['Alex', 'Sarah', 'Mike', 'Emma'].map((name, index) => (
                <div
                  key={name}
                  className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                  style={{ zIndex: 10 - index }}
                >
                  {name[0]}
                </div>
              ))}
            </div>
            <span className="text-sm text-surface-600 hidden sm:inline">4 members</span>
          </div>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-6">
        <div className="flex space-x-6 min-w-max">
          {columns.map((column, columnIndex) => (
            <motion.div
              key={column.id}
              className={`kanban-column ${
                draggedOverColumn === column.id ? 'drop-zone-active' : ''
              }`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: columnIndex * 0.1 }}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="column-header">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-surface-900">{column.title}</h3>
                  <span className="bg-surface-200 text-surface-700 text-xs px-2 py-1 rounded-full">
                    {column.cards.length}
                  </span>
                </div>
                <button className="text-surface-400 hover:text-surface-600 transition-colors">
                  <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
                </button>
              </div>

              {/* Cards */}
              <div className="space-y-3 mb-4">
                <AnimatePresence>
                  {column.cards.map((card, cardIndex) => (
                    <motion.div
                      key={card.id}
                      className="kanban-card group"
                      draggable
                      onDragStart={(e) => handleDragStart(e, card, column.id)}
                      onDragEnd={handleDragEnd}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: cardIndex * 0.05 }}
                      layout
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-surface-900 text-sm leading-tight flex-1">
                          {card.title}
                        </h4>
                        <button
                          onClick={() => deleteCard(card.id, column.id)}
                          className="opacity-0 group-hover:opacity-100 text-surface-400 hover:text-red-500 transition-all duration-200 ml-2"
                        >
                          <ApperIcon name="X" className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {card.description && (
                        <p className="text-surface-600 text-xs mb-3 line-clamp-2">
                          {card.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(card.priority)}`}>
                          {card.priority}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center text-white text-xs">
                            {card.assignee[0]}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add Card Form */}
              <AnimatePresence>
                {showAddCard === column.id ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white border border-surface-200 rounded-lg p-3 mb-3"
                  >
                    <input
                      type="text"
                      placeholder="Card title..."
                      value={newCardTitle}
                      onChange={(e) => setNewCardTitle(e.target.value)}
                      className="w-full text-sm border-none outline-none mb-2 font-medium"
                      autoFocus
                    />
                    <textarea
                      placeholder="Add description..."
                      value={newCardDescription}
                      onChange={(e) => setNewCardDescription(e.target.value)}
                      className="w-full text-xs border-none outline-none resize-none h-16 text-surface-600"
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => addCard(column.id)}
                        className="bg-primary text-white px-3 py-1.5 rounded-md text-xs hover:bg-primary-dark transition-colors"
                      >
                        Add Card
                      </button>
                      <button
                        onClick={() => {
                          setShowAddCard(null)
                          setNewCardTitle('')
                          setNewCardDescription('')
                        }}
                        className="text-surface-600 px-3 py-1.5 rounded-md text-xs hover:bg-surface-100 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    className="add-card-btn"
                    onClick={() => setShowAddCard(column.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <ApperIcon name="Plus" className="w-4 h-4" />
                      <span className="text-sm">Add a card</span>
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Board Stats */}
      <motion.div 
        className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {columns.map((column, index) => (
          <div key={column.id} className="bg-white rounded-xl p-4 border border-surface-200 shadow-soft">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                index === 0 ? 'bg-red-400' : 
                index === 1 ? 'bg-yellow-400' : 
                index === 2 ? 'bg-blue-400' : 'bg-green-400'
              }`} />
              <div>
                <p className="text-xs text-surface-600">{column.title}</p>
                <p className="text-lg font-bold text-surface-900">{column.cards.length}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default MainFeature