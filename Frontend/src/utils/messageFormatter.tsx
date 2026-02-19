/**
 * Message Formatter Utility
 * 
 * Formats AI responses with markdown-like syntax and keyword highlighting
 */

import React from 'react';

// Financial keywords to highlight with specific colors
const KEYWORDS = {
  risk: ['risk', 'warning', 'caution', 'danger', 'volatile', 'volatility', 'loss'],
  positive: ['return', 'returns', 'profit', 'gain', 'growth', 'dividend', 'appreciation'],
  cost: ['tax', 'fee', 'cost', 'expense', 'charge'],
  metrics: ['cagr', 'roi', 'apr', 'apy', 'p/e', 'eps', 'nav'],
} as const;

/**
 * Format a message with markdown-like syntax and keyword highlighting
 */
export const formatMessage = (content: string): React.ReactNode => {
  const lines = content.split('\n');

  return lines.map((line, lineIdx) => {
    // Handle bullet points
    if (line.trim().match(/^[•\-\*]\s/)) {
      return (
        <div key={lineIdx} className="message-bullet">
          {formatLine(line.replace(/^[•\-\*]\s/, ''))}
        </div>
      );
    }

    // Handle numbered lists
    if (line.trim().match(/^\d+\.\s/)) {
      return (
        <div key={lineIdx} className="message-numbered">
          {formatLine(line)}
        </div>
      );
    }

    // Handle bold text (**text**)
    if (line.includes('**')) {
      return (
        <div key={lineIdx} className="message-line">
          {formatBoldText(line)}
        </div>
      );
    }

    // Regular line
    return (
      <div key={lineIdx} className="message-line">
        {formatLine(line)}
      </div>
    );
  });
};

/**
 * Format a line with keyword highlighting
 */
const formatLine = (text: string): React.ReactNode => {
  if (!text.trim()) return <br />;

  // Split text into words while preserving spaces and punctuation
  const words = text.split(/(\s+|[,.:;!?()])/);

  return words.map((word, idx) => {
    const lowerWord = word.toLowerCase();

    // Check if word matches any keyword category
    if (KEYWORDS.risk.some(keyword => lowerWord.includes(keyword))) {
      return <span key={idx} className="keyword-risk">{word}</span>;
    }

    if (KEYWORDS.positive.some(keyword => lowerWord.includes(keyword))) {
      return <span key={idx} className="keyword-positive">{word}</span>;
    }

    if (KEYWORDS.cost.some(keyword => lowerWord.includes(keyword))) {
      return <span key={idx} className="keyword-cost">{word}</span>;
    }

    if (KEYWORDS.metrics.some(keyword => lowerWord.includes(keyword))) {
      return <span key={idx} className="keyword-metric">{word}</span>;
    }

    // Highlight percentages
    if (word.match(/[+-]?\d+\.?\d*%/)) {
      const isPositive = word.startsWith('+') || (!word.startsWith('-') && parseFloat(word) > 0);
      return (
        <span key={idx} className={isPositive ? 'positive' : 'negative'}>
          {word}
        </span>
      );
    }

    return <span key={idx}>{word}</span>;
  });
};

/**
 * Format text with bold markers (**text**)
 */
const formatBoldText = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*.*?\*\*)/);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={idx}>{formatLine(boldText)}</strong>;
    }
    return <span key={idx}>{formatLine(part)}</span>;
  });
};

/**
 * Simple text formatter for percentage highlighting (legacy)
 */
export const formatPercentages = (content: string): React.ReactNode => {
  return content.split('\n').map((line, idx) => {
    if (line.includes('%')) {
      const parts = line.split(/([+-]?\d+\.?\d+%)/);
      return (
        <span key={idx}>
          {parts.map((part, i) => {
            if (part.match(/\+\d+\.?\d+%/)) {
              return <span key={i} className="positive">{part}</span>;
            } else if (part.match(/-\d+\.?\d+%/)) {
              return <span key={i} className="negative">{part}</span>;
            }
            return <span key={i}>{part}</span>;
          })}
          {idx < content.split('\n').length - 1 && <br />}
        </span>
      );
    }
    return (
      <React.Fragment key={idx}>
        {line}
        {idx < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    );
  });
};
