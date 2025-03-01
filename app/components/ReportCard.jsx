"use client";
import React from "react";
import { Award, CheckCircle, AlertTriangle, BookOpen, Info } from "lucide-react";

export function ReportCard({ categories = [], messageCount = 0, messages = [] }) {
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
    
    displayCategories.forEach(category => {
      const categoryInfo = coveredCategories[category];
      
      if (!categoryInfo || !categoryInfo.covered) {
        // Category not covered - no score
        scores[category] = null;
        return;
      }
      
      // Base score calculation
      // 5 points for coverage + up to 15 points for depth
      const baseScore = 5 + Math.floor((categoryInfo.depth / 10) * 15);
      
      // Add small random variation
      const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      scores[category] = Math.max(5, Math.min(20, baseScore + variation));
    });
    
    return scores;
  };

  const scores = generateScores();
  
  // Calculate average only from categories that were covered
  const validScores = Object.values(scores).filter(score => score !== null);
  const totalScore = validScores.reduce((sum, score) => sum + score, 0);
  const averageScore = validScores.length > 0 ? Math.round(totalScore / validScores.length) : 0;
  
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