"use client";
import React from "react";
import { Award, CheckCircle, AlertTriangle, BookOpen, Info, Eye } from "lucide-react";

export function ReportCard({ categories = [], messageCount = 0, messages = [], proctoringWarnings = 0 }) {
  // Use MERN stack categories if none provided
  const mernCategories = ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB"];
  const displayCategories = categories.length > 0 ? categories : mernCategories;
  
  // Analyze which categories were actually covered in the conversation
  const analyzeCoveredCategories = () => {
    // If no messages, return empty object
    if (!messages.length) return {};
    
    // Simple keyword matching to determine which categories were covered
    const categoryKeywords = {
      'HTML': ['html', 'tag', 'element', 'semantic', 'structure', 'document'],
      'CSS': ['css', 'style', 'flexbox', 'grid', 'responsive', 'layout', 'selector'],
      'JavaScript': ['javascript', 'js', 'function', 'variable', 'array', 'object', 'promise', 'async'],
      'React': ['react', 'component', 'hook', 'state', 'props', 'jsx', 'useeffect', 'usestate'],
      'Node.js': ['node', 'server', 'backend', 'npm', 'package', 'module', 'require'],
      'Express': ['express', 'route', 'middleware', 'api', 'endpoint', 'server'],
      'MongoDB': ['mongo', 'database', 'collection', 'document', 'schema', 'model', 'nosql']
    };
    
    const coveredCategories = {};
    
    // Initialize all categories as not covered
    displayCategories.forEach(category => {
      coveredCategories[category] = {
        covered: false,
        messageCount: 0,
        depth: 0 // 0-10 scale for depth of discussion
      };
    });
    
    // Analyze user messages to determine coverage
    const userMessages = messages.filter(m => m.sender === 'user');
    
    userMessages.forEach(message => {
      const text = message.text.toLowerCase();
      
      // Check each category for keyword matches
      Object.entries(categoryKeywords).forEach(([category, keywords]) => {
        if (!coveredCategories[category]) return;
        
        // Count keyword matches
        const matches = keywords.filter(keyword => text.includes(keyword)).length;
        
        if (matches > 0) {
          coveredCategories[category].covered = true;
          coveredCategories[category].messageCount++;
          coveredCategories[category].depth += Math.min(matches, 3); // Cap depth increase per message
        }
      });
    });
    
    // Normalize depth scores to 0-10 scale
    Object.keys(coveredCategories).forEach(category => {
      if (coveredCategories[category].covered) {
        // Calculate depth based on message count and keyword matches
        const rawDepth = coveredCategories[category].depth;
        coveredCategories[category].depth = Math.min(10, Math.ceil(rawDepth / 2));
      }
    });
    
    return coveredCategories;
  };
  
  const coveredCategories = analyzeCoveredCategories();
  
  // Generate scores based on conversation coverage and length
  const generateScores = () => {
    const scores = {};
    
    // Calculate base score multiplier based on total message count
    // This ensures scores scale with conversation length
    let baseMultiplier = 0.5; // Default low multiplier
    
    if (messageCount >= 8) {
      baseMultiplier = 0.8; // Higher multiplier for more responses (8-10)
    } else if (messageCount >= 3) {
      baseMultiplier = 0.65; // Medium multiplier for moderate responses (3-7)
    }
    
    displayCategories.forEach(category => {
      const categoryInfo = coveredCategories[category];
      
      if (!categoryInfo || !categoryInfo.covered) {
        // Category not covered - no score
        scores[category] = null;
        return;
      }
      
      // Base score calculation (max 20)
      // 5 points for coverage + up to 15 points for depth
      const rawScore = 5 + Math.floor((categoryInfo.depth / 10) * 15);
      
      // Apply the multiplier based on message count
      const adjustedScore = Math.floor(rawScore * baseMultiplier);
      
      // Add small random variation
      const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      
      // Ensure score is between 5-16 (25-80%)
      scores[category] = Math.max(5, Math.min(16, adjustedScore + variation));
    });
    
    return scores;
  };

  const scores = generateScores();
  
  // Calculate average only from categories that were covered
  const validScores = Object.values(scores).filter(score => score !== null);
  const totalScore = validScores.reduce((sum, score) => sum + score, 0);

  // Calculate average score with a minimum value based on message count
  let averageScore = 0;
  if (validScores.length > 0) {
    // Base average calculation
    const rawAverage = Math.round(totalScore / validScores.length);
    
    // Apply a bonus based on message count
    let messageBonus = 0;
    if (messageCount >= 8) {
      messageBonus = 4; // Significant bonus for 8+ messages
    } else if (messageCount >= 5) {
      messageBonus = 3; // Medium bonus for 5-7 messages
    } else if (messageCount >= 3) {
      messageBonus = 2; // Small bonus for 3-4 messages
    }
    
    // Apply a bonus based on topics covered
    const topicCoverageRatio = validScores.length / displayCategories.length;
    const topicBonus = Math.round(topicCoverageRatio * 3); // Up to 3 points for topic coverage
    
    // Final score with bonuses
    averageScore = Math.min(16, rawAverage + messageBonus + topicBonus);
  }
  
  // Feedback based on score
  const getFeedback = (score) => {
    if (score < 8) return "Needs significant improvement";
    if (score < 12) return "Shows basic understanding";
    if (score < 16) return "Good knowledge with some gaps";
    return "Strong understanding of concepts";
  };

  // Areas to improve - only from categories that were covered
  const areasToImprove = Object.entries(scores)
    .filter(([_, score]) => score !== null)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 2)
    .map(([category]) => category);

  // Get proctoring score based on warnings
  const getProctoringScore = () => {
    if (proctoringWarnings === 0) return 20;
    if (proctoringWarnings <= 2) return 18;
    if (proctoringWarnings <= 5) return 15;
    if (proctoringWarnings <= 10) return 10;
    return 5;
  };

  const proctoringScore = getProctoringScore();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Interview Complete</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for completing your MERN stack interview!
        </p>
        <div className="flex justify-center items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900">
              <span className="text-4xl font-bold text-blue-600 dark:text-blue-300">
                {validScores.length > 0 ? averageScore : "-"}
              </span>
            </div>
            <Award className="absolute -top-2 -right-2 text-yellow-500" size={28} />
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Overall Score</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Based on {messageCount} responses
        </p>
      </div>

      {/* Technical Skills Section */}
      <h3 className="font-bold text-gray-800 dark:text-white mb-4">Technical Skills</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {Object.entries(scores).map(([category, score]) => (
          <div key={category} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{category}</h3>
            {score !== null ? (
              <>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full" 
                      style={{ width: `${score * 5}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{score}/20</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{getFeedback(score)}</p>
              </>
            ) : (
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Info size={16} className="mr-2" />
                <span>Not covered in interview</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Proctoring Results Section */}
      <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <Eye size={20} className="mr-2 text-blue-500" />
        Proctoring Results
      </h3>
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-200">Face Detection Warnings:</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{proctoringWarnings}</span>
        </div>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mr-2">
            <div 
              className={`h-2.5 rounded-full ${
                proctoringScore > 15 ? 'bg-green-500' : 
                proctoringScore > 10 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${proctoringScore * 5}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{proctoringScore}/20</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {proctoringWarnings === 0 
            ? "Excellent focus throughout the interview" 
            : proctoringWarnings <= 2 
              ? "Good focus with minimal distractions" 
              : proctoringWarnings <= 5 
                ? "Occasional loss of focus detected" 
                : "Significant focus issues detected"}
        </p>
      </div>

      {/* Interview Statistics */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-8">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Interview Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Responses</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{messageCount}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Topics Covered</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {Object.values(scores).filter(score => score !== null).length}/{displayCategories.length}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <CheckCircle size={20} className="mr-2 text-green-500" />
          Strengths
        </h3>
        {validScores.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6">
            <li>Good communication skills</li>
            <li>Logical approach to problem-solving</li>
            <li>Basic understanding of core concepts</li>
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Not enough data to determine strengths. The interview was too short.
          </p>
        )}

        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <AlertTriangle size={20} className="mr-2 text-yellow-500" />
          Areas to Improve
        </h3>
        {areasToImprove.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6">
            {areasToImprove.map(area => (
              <li key={area}>Deeper knowledge of {area} concepts</li>
            ))}
            <li>Practical implementation experience</li>
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Not enough data to determine areas for improvement.
          </p>
        )}

        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <BookOpen size={20} className="mr-2 text-blue-500" />
          Recommended Resources
        </h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          <li>MDN Web Docs for web development fundamentals</li>
          <li>freeCodeCamp for practical exercises</li>
          <li>YouTube tutorials for visual learning</li>
        </ul>
      </div>
    </div>
  );
} 