import React from 'react';
import { X } from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpSupportModal: React.FC<HelpSupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Help & Support</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 text-slate-600 text-sm leading-relaxed space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900"> HELP & SUPPORT</h3>
            <p><strong>Welcome to Veridian Support Center</strong></p>
            <p>Veridian is an AI-driven financial advisory system that provides confidence-weighted Buy, Hold, and Sell recommendations using multi-model analysis.</p>
            <p>If you need assistance, this page will guide you through how the system works, how to interpret recommendations, and how to resolve common issues.</p>
            
            <h4 className="font-semibold text-slate-800 text-base mt-6"> 1. How Veridian Works</h4>
            <p>Veridian uses an advanced ensemble AI architecture to analyze a stock from multiple perspectives:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Technical indicators</li>
              <li>Company fundamentals</li>
              <li>News & social sentiment</li>
              <li>Alternative web data</li>
              <li>Macroeconomic conditions</li>
              <li>Expert analyst consensus</li>
            </ul>
            <p>Each analysis module generates its own probability-based recommendation. These are combined using a reliability-weighted aggregation system to produce a final decision.</p>
            <p>The result includes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Buy / Hold / Sell recommendation</li>
              <li>Confidence score</li>
              <li>Structured explanation</li>
            </ul>
            
            <h4 className="font-semibold text-slate-800 text-base mt-6"> 2. Understanding Recommendations</h4>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-slate-700">🔹 Buy</span>
                <p>The system detects favorable multi-factor alignment and positive structural indicators.</p>
              </div>
              <div>
                <span className="font-semibold text-slate-700">🔹 Hold</span>
                <p>Signals are mixed, neutral, or uncertain. Risk/reward balance does not justify strong directional bias.</p>
              </div>
              <div>
                <span className="font-semibold text-slate-700">🔹 Sell</span>
                <p>Structural weakness, elevated risk, or consistent negative signals detected.</p>
              </div>
            </div>

            <h4 className="font-semibold text-slate-800 text-base mt-6"> 3. What Does the Confidence Score Mean?</h4>
            <p>The confidence score reflects:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Agreement across analytical models</li>
              <li>Strength of dominant signals</li>
              <li>Stability of underlying indicators</li>
            </ul>
            <p>It does not guarantee profit or performance. Higher confidence means stronger internal model agreement — not certainty.</p>

            <h4 className="font-semibold text-slate-800 text-base mt-6"> 4. Important Risk Notice</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Veridian provides informational insights only.</li>
              <li>Market investments carry risk.</li>
              <li>AI predictions can be incorrect.</li>
              <li>Financial markets are volatile.</li>
              <li>Past data does not guarantee future outcomes.</li>
            </ul>
            <p className="font-medium text-slate-700 mt-2">Always conduct independent research before making investment decisions.</p>

            <h4 className="font-semibold text-slate-800 text-base mt-6"> 5. Frequently Asked Questions (FAQ)</h4>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-slate-700">Q1: Is Veridian a registered investment advisor?</p>
                <p>No. Veridian is an AI-powered analytical tool and does not provide regulated financial advice.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Q2: Does Veridian execute trades?</p>
                <p>No. The platform does not connect to brokerage accounts or execute transactions.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Q3: Why did the recommendation change?</p>
                <p>Recommendations may change due to:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>New financial data</li>
                  <li>Breaking news</li>
                  <li>Market volatility</li>
                  <li>Changes in macroeconomic indicators</li>
                  <li>Shifts in sentiment or analyst consensus</li>
                </ul>
                <p className="mt-1">The system updates dynamically based on incoming data.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Q4: Why does the system recommend “Hold” frequently?</p>
                <p>“Hold” indicates uncertainty or balanced risk. The system prioritizes stability and avoids reacting to short-term price fluctuations.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Q5: Why does the model not follow sudden price spikes?</p>
                <p>Veridian is designed to filter short-term volatility and avoid overreacting to temporary price distortions.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Q6: Can I rely solely on Veridian’s output?</p>
                <p>No. Veridian should be used as a decision-support tool, not as the sole basis for investment decisions.</p>
              </div>
            </div>

            <h4 className="font-semibold text-slate-800 text-base mt-6"> 6. Troubleshooting</h4>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-slate-700">🔹 Stock Not Recognized</span>
                <ul className="list-disc pl-5 mt-1">
                  <li>Ensure ticker symbol is correct.</li>
                  <li>Try using full company name.</li>
                  <li>Verify exchange listing.</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-700">🔹 Slow Response</span>
                <ul className="list-disc pl-5 mt-1">
                  <li>Check internet connection.</li>
                  <li>Try refreshing the page.</li>
                  <li>Market data providers may occasionally experience delays.</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-700">🔹 Recommendation Not Loading</span>
                <ul className="list-disc pl-5 mt-1">
                  <li>Clear browser cache.</li>
                  <li>Disable conflicting browser extensions.</li>
                  <li>Ensure cookies are enabled.</li>
                </ul>
              </div>
              <div>
                <span className="font-semibold text-slate-700">🔹 Inaccurate Data Display</span>
                <ul className="list-disc pl-5 mt-1">
                  <li>Financial data depends on third-party sources.</li>
                  <li>Refresh page to retrieve latest updates.</li>
                </ul>
              </div>
            </div>

            <h4 className="font-semibold text-slate-800 text-base mt-6"> 7. Data & Privacy Concerns</h4>
            <p>If you have concerns about:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Data usage</li>
              <li>Account security</li>
              <li>Information deletion requests</li>
            </ul>
            <p>Please refer to our Privacy Policy or contact support.</p>

            <h4 className="font-semibold text-slate-800 text-base mt-6"> 8. Contact Support</h4>
            <p>If you need assistance, contact us at:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li> <strong>Email:</strong> eventiquesnnv@gmail.com</li>
              <li> <strong>Support Hours:</strong> 9 AM - 6 PM IST</li>
            </ul>
            <p className="mt-2">When contacting support, please include:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Your registered email (if applicable)</li>
              <li>Stock queried</li>
              <li>Date and time of issue</li>
              <li>Screenshot (if possible)</li>
            </ul>

            <h4 className="font-semibold text-slate-800 text-base mt-6"> 9. Feature Requests & Feedback</h4>
            <p>We continuously improve Veridian’s AI system. If you have suggestions or feature requests, please email us with the subject line:</p>
            <p className="italic bg-slate-50 p-2 rounded">“Feature Request – Veridian”</p>

            <h4 className="font-semibold text-slate-800 text-base mt-6"> 10. System Updates</h4>
            <p>Veridian is modular and continuously evolving. Model weights, analytical methods, and data sources may be refined to improve stability and performance.</p>
            <p>Updates will be reflected automatically in recommendations.</p>

            <h4 className="font-semibold text-slate-800 text-base mt-6"> 11. Legal Reminder</h4>
            <p>Veridian is an AI-driven analytical platform for informational purposes only. It is not a brokerage service, portfolio manager, or registered investment advisor.</p>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportModal;
