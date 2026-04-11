// 📞 联系咨询组件 - 欧美斯现代咨询风格
import React, { useState } from 'react';

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
  loading?: boolean;
}

interface ContactFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    inquiryType: 'product',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inquiryTypes = [
    { value: 'product', label: '产品咨询' },
    { value: 'case', label: '案例咨询' },
    { value: 'solution', label: '解决方案咨询' },
    { value: 'cooperation', label: '合作咨询' },
    { value: 'other', label: '其他咨询' }
  ];

  return (
    <div className="contact-form bg-white rounded-xl shadow-lg p-8">
      {/* 表单头部 - 欧美斯现代设计 */}
      <div className="form-header mb-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">专业咨询</h3>
        <p className="text-gray-600">
          填写以下信息，我们的专业顾问将尽快与您联系
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 - 两列布局 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              姓名 *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              placeholder="请输入您的姓名"
            />
          </div>

          <div className="form-group">
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              公司名称
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              placeholder="请输入公司名称"
            />
          </div>
        </div>

        {/* 联系信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              邮箱 *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              placeholder="请输入邮箱地址"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              电话 *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              placeholder="请输入联系电话"
            />
          </div>
        </div>

        {/* 咨询类型 */}
        <div className="form-group">
          <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
            咨询类型 *
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
          >
            {inquiryTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* 咨询内容 */}
        <div className="form-group">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            咨询内容 *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
            placeholder="请详细描述您的需求，我们将为您提供专业的解决方案"
          />
        </div>

        {/* 提交按钮 */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                提交中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                提交咨询
              </>
            )}
          </button>
        </div>

        {/* 联系信息 */}
        <div className="contact-info pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-600 text-sm">
            或直接联系我们：<span className="font-semibold text-primary">400-123-4567</span>
          </p>
          <p className="text-gray-500 text-xs mt-1">
            工作日 9:00-18:00，我们的专业顾问随时为您服务
          </p>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
