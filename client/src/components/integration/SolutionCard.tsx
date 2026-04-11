// 🏗️ 解决方案卡片 - 欧林专业解决方案风格
import React from 'react';

interface SolutionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  applications: string[];
  onExplore?: () => void;
}

const SolutionCard: React.FC<SolutionCardProps> = ({
  title,
  description,
  icon,
  features = [],
  applications = [],
  onExplore
}) => {
  return (
    <div className="solution-card bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 p-6">
      {/* 解决方案头部 - 欧林专业标识 */}
      <div className="solution-header flex items-start mb-6">
        <div className="solution-icon mr-4 p-3 bg-primary bg-opacity-10 rounded-lg">
          <div className="text-primary">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="solution-title text-lg font-bold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="solution-description text-gray-600 text-sm">
            {description}
          </p>
        </div>
      </div>

      {/* 核心特点 - 欧林专业展示 */}
      <div className="solution-features mb-6">
        <h4 className="features-title text-sm font-semibold text-gray-500 mb-3">核心特点</h4>
        <ul className="features-list space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-700">
              <svg className="w-4 h-4 text-emphasis-green mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* 应用场景 - 欧林专业领域 */}
      <div className="solution-applications mb-6">
        <h4 className="applications-title text-sm font-semibold text-gray-500 mb-3">适用场景</h4>
        <div className="applications-tags flex flex-wrap gap-2">
          {applications.map((application, index) => (
            <span 
              key={index}
              className="application-tag bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
            >
              {application}
            </span>
          ))}
        </div>
      </div>

      {/* 探索按钮 - 欧美斯现代交互 */}
      <div className="solution-actions">
        <button 
          onClick={onExplore}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          探索解决方案
        </button>
      </div>
    </div>
  );
};

export default SolutionCard;
