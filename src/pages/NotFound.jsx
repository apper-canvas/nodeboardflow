import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div 
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <ApperIcon name="AlertTriangle" className="w-16 h-16 text-white" />
        </motion.div>
        
        <h1 className="text-6xl font-bold text-surface-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-surface-700 mb-4">
          Board Not Found
        </h2>
        <p className="text-surface-600 mb-8">
          The project board you're looking for seems to have moved to another workspace.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-200"
        >
          <ApperIcon name="Home" className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound