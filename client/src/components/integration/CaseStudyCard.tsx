// 🏢 案例展示组件 - 上海诗敏实际项目风格
import React from 'react';

interface CaseStudyCardProps {
  title: string;
  client: string;
  industry: string;
  location: string;
  imageUrl: string;
  challenge: string;
  solution: string;
  results: string[];
  onViewDetails?: () => void;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  title,
  client,
  industry,
  location,
  imageUrl,
  challenge,
  solution,
  results = [],
  onViewDetails
}) => {
  return (
    <div className="case-study-card bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* 案例头部 - 上海诗敏项目展示风格 */}
      <div className="case-header relative">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-lg font-bold">{title}</h3>
              <p className="text-gray-200 text-sm">{client} • {industry}</p>
            </div>
            <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
              {location}
            </span>
          </div>
        </div>
      </div>

      {/* 案例内容 - 欧林解决方案风格 */}
      <div className="case-content p-6">
        {/* 挑战与解决方案 */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="challenge-section">
              <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                <span className="w-2 h-2 bg-emphasis-red rounded-full mr-2"></span>
                项目挑战
              </h4>
              <p className="text-gray-700 text-sm">{challenge}</p>
            </div>
            
            <div className="solution-section">
              <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                <span className="w-2 h-2 bg-emphasis-green rounded-full mr-2"></span>
                解决方案
              </h4>
              <p className="text-gray-700 text-sm">{solution}</p>
            </div>
          </div>
        </div>

        {/* 项目成果 - 上海诗敏成果展示 */}
        {results.length > 0 && (
          <div className="results-section mb-6">
            <h4 className="text-sm font-semibold text-gray-500 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-emphasis-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              项目成果
            </h4>
            <ul className="space-y-2">
              {results.map((result, index) => (
                <li key={index} className="flex items-start text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-accent-teal rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 查看详情按钮 - 欧美斯现代交互 */}
        <div className="case-actions pt-4 border-t border-gray-100">
          <button 
            onClick={onViewDetails}
            className="w-full bg-gray-50 text-primary py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center group"
          >
            <span>查看完整案例</span>
            <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyCard;
