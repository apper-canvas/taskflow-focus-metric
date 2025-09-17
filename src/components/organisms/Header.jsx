import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ taskStats = {}, className = "" }) => {
  const { total = 0, completed = 0, pending = 0 } = taskStats;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-8 shadow-lg ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <ApperIcon name="CheckSquare" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">TaskFlow</h1>
              <p className="text-white/80 text-sm">Stay organized, get things done</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-white/80 text-sm">Total Tasks</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-200">{completed}</div>
            <div className="text-white/80 text-sm">Completed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-200">{pending}</div>
            <div className="text-white/80 text-sm">Pending</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="text-white/80 text-sm">Progress</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/80">Overall Progress</span>
          <span className="text-sm font-medium">{completionRate}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-green-400 to-green-300 h-2 rounded-full"
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;