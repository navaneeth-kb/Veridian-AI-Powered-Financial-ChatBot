import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TermsPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsPrivacyModal: React.FC<TermsPrivacyModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Legal Information</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>
        
        <div className="flex border-b border-slate-100 px-4">
          <button 
            className={`py-3 px-4 font-medium text-sm transition-colors border-b-2 cursor-pointer ${activeTab === 'terms' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('terms')}
          >
            Terms of Service
          </button>
          <button 
            className={`py-3 px-4 font-medium text-sm transition-colors border-b-2 cursor-pointer ${activeTab === 'privacy' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy Policy
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 text-slate-600 text-sm leading-relaxed space-y-4">
          {activeTab === 'terms' ? (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">📜 TERMS OF SERVICE</h3>
              <p><strong>Effective Date:</strong> 03-03-2026 <br/>
              <strong>Platform Name:</strong> Veridian – AI-Driven Financial Advisory System</p>
              
              <h4 className="font-semibold text-slate-800">1. Acceptance of Terms</h4>
              <p>By accessing or using Veridian, you agree to be legally bound by these Terms of Service. If you do not agree, you must discontinue use immediately.</p>
              
              <h4 className="font-semibold text-slate-800">2. Nature of the Service</h4>
              <p>Veridian is an AI-powered stock analysis and advisory system that generates probabilistic Buy, Hold, or Sell recommendations using a multi-model ensemble architecture.</p>
              <p>The Platform:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Aggregates technical, fundamental, sentiment, alternative, macroeconomic, and expert signals.</li>
                <li>Produces confidence-weighted recommendations.</li>
                <li>Provides explanatory reports for informational purposes only.</li>
              </ul>
              
              <h4 className="font-semibold text-slate-800">3. No Investment Advice</h4>
              <p>Veridian does not provide financial, investment, tax, or legal advice.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>All outputs are algorithmically generated.</li>
                <li>Recommendations are informational and educational in nature.</li>
                <li>No fiduciary relationship is created.</li>
                <li>Users are solely responsible for their investment decisions.</li>
                <li>Market investments involve risk, including potential loss of principal.</li>
              </ul>
              <p>You agree that:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You will not rely solely on Veridian’s recommendations.</li>
                <li>You will conduct independent due diligence.</li>
                <li>You understand past performance does not guarantee future results.</li>
              </ul>
              
              <h4 className="font-semibold text-slate-800">4. No Brokerage or Trade Execution</h4>
              <p>Veridian:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Does not execute trades.</li>
                <li>Does not hold user funds.</li>
                <li>Is not a registered broker-dealer or investment advisor.</li>
                <li>Does not guarantee performance outcomes.</li>
              </ul>
              
              <h4 className="font-semibold text-slate-800">5. User Responsibilities</h4>
              <p>You agree to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide accurate information.</li>
                <li>Use the platform lawfully.</li>
                <li>Not attempt to reverse engineer models.</li>
                <li>Not misuse, scrape, or exploit system data.</li>
              </ul>
              <p>You are responsible for maintaining confidentiality of your account credentials.</p>
              
              <h4 className="font-semibold text-slate-800">6. AI System Limitations</h4>
              <p>You acknowledge that:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>AI models may produce inaccurate, delayed, or incomplete outputs.</li>
                <li>Financial data sources may contain errors.</li>
                <li>Sentiment or alternative data may include noise or bias.</li>
                <li>Market conditions can change rapidly.</li>
                <li>Veridian makes no warranty regarding prediction accuracy.</li>
              </ul>
              
              <h4 className="font-semibold text-slate-800">7. Third-Party Data Sources</h4>
              <p>The Platform may rely on:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Market data providers</li>
                <li>News APIs</li>
                <li>Social media data</li>
                <li>Analyst consensus sources</li>
                <li>Macroeconomic databases</li>
              </ul>
              <p>Veridian does not guarantee the accuracy or availability of third-party data.</p>
              
              <h4 className="font-semibold text-slate-800">8. Intellectual Property</h4>
              <p>All content including: Algorithms, Model architecture, Reports, Visualizations, Software code are the intellectual property of Veridian unless otherwise stated. Unauthorized reproduction or redistribution is prohibited.</p>
              
              <h4 className="font-semibold text-slate-800">9. Limitation of Liability</h4>
              <p>To the maximum extent permitted by law: Veridian and its creators shall not be liable for Financial losses, Trading losses, Indirect or consequential damages, System downtime, Data inaccuracies, Decisions made based on platform outputs.</p>
              <p>Use of the platform is at your own risk.</p>
              
              <h4 className="font-semibold text-slate-800">10. Indemnification</h4>
              <p>You agree to indemnify and hold harmless Veridian and its developers from any claims, damages, or losses arising from your use of the Platform.</p>
              
              <h4 className="font-semibold text-slate-800">11. Modifications</h4>
              <p>Veridian reserves the right to update these Terms at any time. Continued use constitutes acceptance of revised terms.</p>
              
              <h4 className="font-semibold text-slate-800">12. Governing Law</h4>
              <p>These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of Ernakulam, Kerala.</p>
              
              <h4 className="font-semibold text-slate-800">13. Contact</h4>
              <p>For legal inquiries: <br/> Email: eventiquesnnv@gmail.com <br/> Address: Kakkanad, Rajagiri vally</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">🔐 PRIVACY POLICY</h3>
              <p><strong>Effective Date:</strong> 03-03-2026 <br/>
              <strong>Platform Name:</strong> Veridian – AI-Driven Financial Advisory System</p>
              
              <h4 className="font-semibold text-slate-800">1. Overview</h4>
              <p>This Privacy Policy explains how Veridian collects, uses, processes, and protects user information. We are committed to safeguarding user data and ensuring transparency.</p>
              
              <h4 className="font-semibold text-slate-800">2. Information We Collect</h4>
              <p><strong>A. Information You Provide</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Account registration details (if applicable)</li>
                <li>Email address</li>
                <li>Investment-related queries</li>
                <li>Chat inputs</li>
                <li>User preferences</li>
              </ul>
              
              <p><strong>B. Automatically Collected Data</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Device information</li>
                <li>Usage patterns</li>
                <li>Interaction logs</li>
              </ul>
              
              <p><strong>C. Market & External Data</strong></p>
              <p>We collect publicly available financial data, news content, and macroeconomic indicators for analysis purposes. This does not include personal financial account data unless explicitly provided.</p>
              
              <h4 className="font-semibold text-slate-800">3. How We Use Information</h4>
              <p>We use collected data to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Generate AI-based stock recommendations</li>
                <li>Improve model performance</li>
                <li>Enhance user experience</li>
                <li>Maintain platform security</li>
                <li>Conduct research and analytics</li>
                <li>Prevent fraud or abuse</li>
              </ul>
              
              <h4 className="font-semibold text-slate-800">4. AI Processing</h4>
              <p>User queries may be processed using Machine learning models, NLP systems, Aggregated financial datasets. We do not use your data to make automated decisions affecting legal rights or credit eligibility.</p>
              
              <h4 className="font-semibold text-slate-800">5. Data Storage & Security</h4>
              <p>We implement Encryption protocols, Secure database storage, Access control mechanisms, Regular security audits. However, no system is 100% secure.</p>
              
              <h4 className="font-semibold text-slate-800">6. Data Sharing</h4>
              <p>We do not sell user data. We may share limited data with Cloud hosting providers, Analytics services, Legal authorities (if required by law). All third parties are contractually obligated to protect data.</p>
              
              <h4 className="font-semibold text-slate-800">7. Data Retention</h4>
              <p>User data is retained: For as long as necessary to provide services, For research and system improvement, As required by legal obligations. Users may request deletion where applicable.</p>
              
              <h4 className="font-semibold text-slate-800">8. Cookies & Tracking</h4>
              <p>We may use cookies for: Session management, Performance tracking, Analytics. Users can disable cookies via browser settings.</p>
              
              <h4 className="font-semibold text-slate-800">9. User Rights</h4>
              <p>Depending on jurisdiction, users may have the right to: Access their data, Correct inaccuracies, Request deletion, Withdraw consent, Request data portability. Requests may be submitted via email.</p>
              
              <h4 className="font-semibold text-slate-800">10. Children’s Privacy</h4>
              <p>Veridian is not intended for individuals under 18 years of age. We do not knowingly collect data from minors.</p>
              
              <h4 className="font-semibold text-slate-800">11. Changes to Privacy Policy</h4>
              <p>We may update this policy periodically. Continued use constitutes acceptance of updates.</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Accept & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsPrivacyModal;
