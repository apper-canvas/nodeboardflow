import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
const [columns, setColumns] = useState([
    {
      id: '1',
      title: 'To Do',
      cards: [
        { id: 'card-1', title: 'Design wireframes', description: 'Create initial wireframes for the new feature', assignee: 'Alex Chen', priority: 'high', dueDate: '2024-02-15' },
        { id: 'card-2', title: 'Setup development environment', description: 'Configure local development setup', assignee: 'Sarah Kim', priority: 'medium' }
      ]
    },
    {
      id: '2',
title: 'In Progress',
      cards: [
        { id: 'card-3', title: 'Implement authentication', description: 'Add login and signup functionality', assignee: 'Mike Johnson', priority: 'high', dueDate: '2024-02-20' }
      ]
    },
    {
      id: '3',
title: 'Review',
      cards: [
        { id: 'card-4', title: 'Code review for API endpoints', description: 'Review REST API implementation', assignee: 'Emma Davis', priority: 'medium', dueDate: '2024-02-18' }
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
  const [selectedCard, setSelectedCard] = useState(null)
  const [showCardDetail, setShowCardDetail] = useState(false)
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const [boards, setBoards] = useState([
    {
      id: 'board-1',
      name: 'Project Alpha',
      description: 'Main project dashboard',
      columns: [
        {
          id: '1',
title: 'To Do',
          cards: [
            { id: 'card-1', title: 'Design wireframes', description: 'Create initial wireframes for the new feature', assignee: 'Alex Chen', priority: 'high', dueDate: '2024-02-15' },
            { id: 'card-2', title: 'Setup development environment', description: 'Configure local development setup', assignee: 'Sarah Kim', priority: 'medium' }
          ]
        },
        {
          id: '2',
title: 'In Progress',
          cards: [
            { id: 'card-3', title: 'Implement authentication', description: 'Add login and signup functionality', assignee: 'Mike Johnson', priority: 'high', dueDate: '2024-02-20' }
          ]
        },
        {
          id: '3',
title: 'Review',
          cards: [
            { id: 'card-4', title: 'Code review for API endpoints', description: 'Review REST API implementation', assignee: 'Emma Davis', priority: 'medium', dueDate: '2024-02-18' }
          ]
        },
        {
          id: '4',
          title: 'Done',
          cards: [
            { id: 'card-5', title: 'Project setup', description: 'Initialize project repository and basic structure', assignee: 'Team Lead', priority: 'low' }
          ]
        }
      ]
    }
  ])
  const [currentBoardId, setCurrentBoardId] = useState('board-1')
  const dragCounter = useRef(0)
// Get current board data
  const currentBoard = boards.find(board => board.id === currentBoardId)
  const currentColumns = currentBoard ? currentBoard.columns : []

  // Update board columns
  const updateBoardColumns = (newColumns) => {
    setBoards(boards.map(board => 
      board.id === currentBoardId 
        ? { ...board, columns: newColumns }
        : board
    ))
  }
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

    const newColumns = currentColumns.map(column => {
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

    updateBoardColumns(newColumns)
setDraggedCard(null)

    const targetColumn = currentColumns.find(col => col.id === targetColumnId)
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

    const newColumns = currentColumns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          cards: [...column.cards, newCard]
        }
      }
      return column
    })

    updateBoardColumns(newColumns)
    setNewCardTitle('')
    setNewCardDescription('')
    setShowAddCard(null)
    toast.success('Card created successfully')
  }
const updateCard = (cardId, updatedCard) => {
    const newColumns = currentColumns.map(column => ({
      ...column,
      cards: column.cards.map(card =>
        card.id === cardId ? { ...card, ...updatedCard } : card
      )
    }))
    
    updateBoardColumns(newColumns)
    setSelectedCard({ ...selectedCard, ...updatedCard })
    toast.success('Card updated successfully')
}

  const deleteCard = (cardId, columnId) => {
    const newColumns = currentColumns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          cards: column.cards.filter(card => card.id !== cardId)
        }
      }
      return column
    })

    updateBoardColumns(newColumns)
    toast.success('Card deleted')
  }

  // Board management functions
  const createBoard = (boardData) => {
    // Check for duplicate names
    const existingBoard = boards.find(board => 
      board.name.toLowerCase() === boardData.name.toLowerCase()
    )
    
    if (existingBoard) {
      toast.error('A board with this name already exists')
      return false
    }

    const newBoard = {
      id: `board-${Date.now()}`,
      name: boardData.name,
      description: boardData.description,
      columns: [
        { id: '1', title: 'To Do', cards: [] },
        { id: '2', title: 'In Progress', cards: [] },
        { id: '3', title: 'Review', cards: [] },
        { id: '4', title: 'Done', cards: [] }
      ]
    }

    setBoards([...boards, newBoard])
    setCurrentBoardId(newBoard.id)
    setShowCreateBoard(false)
    toast.success(`Board "${boardData.name}" created successfully`)
    return true
  }

  const switchBoard = (boardId) => {
    setCurrentBoardId(boardId)
    const board = boards.find(b => b.id === boardId)
    toast.success(`Switched to "${board.name}"`)
  }

  const deleteBoard = (boardId) => {
    if (boards.length <= 1) {
      toast.error('Cannot delete the last board')
      return
    }

    if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      const boardToDelete = boards.find(b => b.id === boardId)
      setBoards(boards.filter(board => board.id !== boardId))
      
      if (currentBoardId === boardId) {
        const remainingBoard = boards.find(board => board.id !== boardId)
        setCurrentBoardId(remainingBoard.id)
      }
      
      toast.success(`Board "${boardToDelete.name}" deleted`)
    }
  }

  // Listen for board creation events from Home component
  React.useEffect(() => {
    const handleCreateBoard = () => {
      setShowCreateBoard(true)
    }

    document.addEventListener('createNewBoard', handleCreateBoard)
    return () => {
      document.removeEventListener('createNewBoard', handleCreateBoard)
    }
  }, [])

  // Create Board Modal Component
  const CreateBoardModal = () => {
    const [boardName, setBoardName] = useState('')
    const [boardDescription, setBoardDescription] = useState('')
    const [isCreating, setIsCreating] = useState(false)

    const handleSubmit = async (e) => {
      e.preventDefault()
      if (!boardName.trim()) {
        toast.error('Board name is required')
        return
      }

      setIsCreating(true)
      const success = createBoard({
        name: boardName.trim(),
        description: boardDescription.trim()
      })
      
      if (success) {
        setBoardName('')
        setBoardDescription('')
      }
      setIsCreating(false)
    }

    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowCreateBoard(false)}
        />
        
        <motion.div
          className="relative bg-white rounded-xl shadow-float p-6 w-full max-w-md mx-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-surface-900">Create New Board</h2>
            <button
              onClick={() => setShowCreateBoard(false)}
              className="p-1 hover:bg-surface-100 rounded-md transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5 text-surface-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Board Name *
              </label>
              <input
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                className="w-full p-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Enter board name..."
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Description
              </label>
              <textarea
                value={boardDescription}
                onChange={(e) => setBoardDescription(e.target.value)}
                className="w-full p-3 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none h-20 resize-none"
                placeholder="Enter board description..."
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={isCreating || !boardName.trim()}
                className="flex-1 bg-primary text-white py-2.5 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isCreating ? 'Creating...' : 'Create Board'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateBoard(false)}
                className="px-4 py-2.5 text-surface-600 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )
  }

  const openCardDetail = (card) => {
    const cardWithComments = {
      ...card,
      comments: card.comments || []
    }
    setSelectedCard(cardWithComments)
    setShowCardDetail(true)
  }

  const closeCardDetail = () => {
    setShowCardDetail(false)
    setSelectedCard(null)
  }

  const CardDetailPanel = () => {
    const [editingTitle, setEditingTitle] = useState(false)
    const [editingDescription, setEditingDescription] = useState(false)
    const [tempTitle, setTempTitle] = useState(selectedCard?.title || '')
    const [tempDescription, setTempDescription] = useState(selectedCard?.description || '')
    const [tempAssignee, setTempAssignee] = useState(selectedCard?.assignee || '')
    const [tempPriority, setTempPriority] = useState(selectedCard?.priority || 'medium')
    const [newComment, setNewComment] = useState('')

    const saveTitle = () => {
      if (tempTitle.trim()) {
        updateCard(selectedCard.id, { title: tempTitle.trim() })
        setEditingTitle(false)
      }
    }

    const saveDescription = () => {
      updateCard(selectedCard.id, { description: tempDescription.trim() })
      setEditingDescription(false)
    }

    const saveAssignee = () => {
      updateCard(selectedCard.id, { assignee: tempAssignee.trim() || 'Unassigned' })
    }

    const savePriority = () => {
      updateCard(selectedCard.id, { priority: tempPriority })
    }

    const addComment = () => {
      if (!newComment.trim()) return

      const comment = {
        id: `comment-${Date.now()}`,
        text: newComment.trim(),
        author: 'Current User',
        timestamp: new Date()
      }

      const updatedComments = [...(selectedCard.comments || []), comment]
      updateCard(selectedCard.id, { comments: updatedComments })
      setNewComment('')
      toast.success('Comment added')
    }

    const deleteComment = (commentId) => {
      const updatedComments = selectedCard.comments.filter(c => c.id !== commentId)
      updateCard(selectedCard.id, { comments: updatedComments })
      toast.success('Comment deleted')
    }

    if (!selectedCard) return null

    return (
      <motion.div
        className="fixed inset-0 z-50 flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div 
          className="flex-1 bg-black/50 backdrop-blur-sm"
          onClick={closeCardDetail}
        />
        
        {/* Panel */}
        <motion.div
          className="w-full max-w-md bg-white shadow-float overflow-y-auto"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <ApperIcon name="FileText" className="w-5 h-5 text-surface-600" />
                <span className="text-sm text-surface-600">Card Details</span>
              </div>
              <button
                onClick={closeCardDetail}
                className="p-1 hover:bg-surface-100 rounded-md transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-surface-600" />
              </button>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label className="text-sm font-medium text-surface-700 mb-2 block">Title</label>
              {editingTitle ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="w-full p-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={saveTitle}
                      className="px-3 py-1.5 bg-primary text-white rounded-md text-sm hover:bg-primary-dark transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingTitle(false)
                        setTempTitle(selectedCard.title)
                      }}
                      className="px-3 py-1.5 text-surface-600 border border-surface-300 rounded-md text-sm hover:bg-surface-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="p-2 rounded-lg hover:bg-surface-50 cursor-pointer transition-colors"
                  onClick={() => setEditingTitle(true)}
                >
                  <h2 className="text-lg font-semibold text-surface-900">
                    {selectedCard.title}
                  </h2>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="text-sm font-medium text-surface-700 mb-2 block">Description</label>
              {editingDescription ? (
                <div className="space-y-2">
                  <textarea
                    value={tempDescription}
                    onChange={(e) => setTempDescription(e.target.value)}
                    className="w-full p-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none h-24 resize-none"
                    placeholder="Add a description..."
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={saveDescription}
                      className="px-3 py-1.5 bg-primary text-white rounded-md text-sm hover:bg-primary-dark transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingDescription(false)
                        setTempDescription(selectedCard.description || '')
                      }}
                      className="px-3 py-1.5 text-surface-600 border border-surface-300 rounded-md text-sm hover:bg-surface-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="p-2 rounded-lg hover:bg-surface-50 cursor-pointer transition-colors min-h-[60px]"
                  onClick={() => setEditingDescription(true)}
                >
                  <p className="text-surface-600 text-sm">
                    {selectedCard.description || 'Click to add a description...'}
                  </p>
                </div>
              )}
            </div>

            {/* Assignee */}
            <div className="mb-6">
              <label className="text-sm font-medium text-surface-700 mb-2 block">Assignee</label>
              <input
                type="text"
                value={tempAssignee}
                onChange={(e) => setTempAssignee(e.target.value)}
                onBlur={saveAssignee}
                className="w-full p-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Enter assignee name..."
              />
            </div>

            {/* Priority */}
            <div className="mb-6">
              <label className="text-sm font-medium text-surface-700 mb-2 block">Priority</label>
              <select
                value={tempPriority}
                onChange={(e) => {
                  setTempPriority(e.target.value)
                  savePriority()
                }}
                className="w-full p-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
</select>
            </div>

            {/* Due Date */}
            <div className="mb-6">
              <label className="text-sm font-medium text-surface-700 mb-2 block">Due Date</label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={selectedCard.dueDate || ''}
                    onChange={(e) => {
                      const newDate = e.target.value
                      updateCard(selectedCard.id, { dueDate: newDate })
                      toast.success('Due date updated')
                    }}
                    className="flex-1 p-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                  {selectedCard.dueDate && (
                    <button
                      onClick={() => {
                        updateCard(selectedCard.id, { dueDate: null })
                        toast.success('Due date cleared')
                      }}
                      className="px-3 py-2 text-surface-600 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
                      title="Clear due date"
                    >
                      <ApperIcon name="X" className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {/* Calendar View Toggle */}
                <div className="border-t border-surface-200 pt-3">
                  <CalendarView 
                    selectedDate={selectedCard.dueDate} 
                    onDateSelect={(date) => {
                      updateCard(selectedCard.id, { dueDate: date })
                      toast.success('Due date updated')
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Comments */}
            <div className="mb-6">
              <label className="text-sm font-medium text-surface-700 mb-2 block">Comments</label>
              
              {/* Add Comment */}
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addComment()}
                    className="flex-1 p-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="Add a comment..."
                  />
                  <button
                    onClick={addComment}
                    className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <ApperIcon name="Send" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedCard.comments?.map((comment) => (
                  <div key={comment.id} className="bg-surface-50 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-surface-900">
                            {comment.author}
                          </span>
                          <span className="text-xs text-surface-500">
                            {format(new Date(comment.timestamp), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-surface-700">{comment.text}</p>
                      </div>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="text-surface-400 hover:text-red-500 transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {(!selectedCard.comments || selectedCard.comments.length === 0) && (
                  <p className="text-surface-500 text-sm text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
</div>
        </motion.div>
      </motion.div>
    )
  }
  // Calendar Component
  const CalendarView = ({ selectedDate, onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState(() => {
      if (selectedDate) {
        return new Date(selectedDate)
      }
      return new Date()
    })

    const today = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    // Get first day of month and number of days
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    const firstDayWeekday = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()

    // Generate calendar days
    const calendarDays = []
    
    // Previous month's trailing days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate()
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      calendarDays.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth - 1, prevMonthLastDay - i)
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({
        day,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, day)
      })
    }

    // Next month's leading days
    const remainingDays = 42 - calendarDays.length // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      calendarDays.push({
        day,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth + 1, day)
      })
    }

    const formatDateForComparison = (date) => {
      return format(date, 'yyyy-MM-dd')
    }

    const isToday = (date) => {
      return formatDateForComparison(date) === formatDateForComparison(today)
    }

    const isSelected = (date) => {
      return selectedDate && formatDateForComparison(date) === selectedDate
    }

    const isPastDate = (date) => {
      return date < today && !isToday(date)
    }

    const navigateMonth = (direction) => {
      setCurrentDate(new Date(currentYear, currentMonth + direction, 1))
    }

    return (
      <div className="bg-surface-50 rounded-lg p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 hover:bg-surface-200 rounded-md transition-colors"
          >
            <ApperIcon name="ChevronLeft" className="w-4 h-4 text-surface-600" />
          </button>
          
          <div className="text-sm font-medium text-surface-900">
            {format(currentDate, 'MMMM yyyy')}
          </div>
          
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-surface-200 rounded-md transition-colors"
          >
            <ApperIcon name="ChevronRight" className="w-4 h-4 text-surface-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday Headers */}
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-xs text-surface-500 text-center py-2 font-medium">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {calendarDays.map((dayObj, index) => {
            const dateStr = formatDateForComparison(dayObj.date)
            
            return (
              <button
                key={index}
                onClick={() => {
                  if (dayObj.isCurrentMonth && !isPastDate(dayObj.date)) {
                    onDateSelect(dateStr)
                  }
                }}
                disabled={!dayObj.isCurrentMonth || isPastDate(dayObj.date)}
                className={`
                  w-8 h-8 text-xs rounded-md transition-colors
                  ${dayObj.isCurrentMonth 
                    ? 'text-surface-900' 
                    : 'text-surface-400'
                  }
                  ${isToday(dayObj.date) 
                    ? 'bg-primary text-white font-medium' 
                    : ''
                  }
                  ${isSelected(dayObj.date) && !isToday(dayObj.date)
                    ? 'bg-primary-100 text-primary-700 font-medium ring-2 ring-primary-300' 
                    : ''
                  }
                  ${isPastDate(dayObj.date)
                    ? 'opacity-40 cursor-not-allowed'
                    : dayObj.isCurrentMonth 
                      ? 'hover:bg-surface-200 cursor-pointer' 
                      : ''
                  }
                `}
              >
                {dayObj.day}
              </button>
            )
          })}
        </div>

        {selectedDate && (
          <div className="mt-3 pt-3 border-t border-surface-200">
            <div className="text-xs text-surface-600 text-center">
              Selected: {format(new Date(selectedDate), 'MMM d, yyyy')}
            </div>
          </div>
        )}
      </div>
)
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
          <div className="flex items-center space-x-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">
                  {currentBoard?.name || 'BoardFlow'}
                </h1>
                
                {/* Board Selector */}
                <div className="relative">
                  <select
                    value={currentBoardId}
                    onChange={(e) => switchBoard(e.target.value)}
                    className="text-sm bg-surface-100 border border-surface-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none cursor-pointer"
                  >
                    {boards.map(board => (
                      <option key={board.id} value={board.id}>
                        {board.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delete Board Button */}
                {boards.length > 1 && (
                  <button
                    onClick={() => deleteBoard(currentBoardId)}
                    className="p-1.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete Board"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-surface-600 text-sm sm:text-base">
                {currentBoard?.description || 'Manage your team\'s workflow with visual kanban boards'}
              </p>
            </div>
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
          {currentColumns.map((column, columnIndex) => (
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
                      onClick={() => openCardDetail(card)}
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
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(card.priority)}`}>
                            {card.priority}
                          </span>
                          {card.dueDate && (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center space-x-1">
                              <ApperIcon name="Calendar" className="w-3 h-3" />
                              <span>{format(new Date(card.dueDate), 'MMM d')}</span>
                            </span>
                          )}
                        </div>
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
        {currentColumns.map((column, index) => (
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
{/* Card Detail Panel */}
      <AnimatePresence>
        {showCardDetail && <CardDetailPanel />}
      </AnimatePresence>

      {/* Create Board Modal */}
      <AnimatePresence>
        {showCreateBoard && <CreateBoardModal />}
      </AnimatePresence>
    </div>
  )
}
export default MainFeature