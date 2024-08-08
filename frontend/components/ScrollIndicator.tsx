import React from 'react';

const ScrollIndicator: React.FC = () => {
  return (
    <div className="scroll-indicator absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <span className="block w-2 h-2 mb-1 rounded-full bg-white animate-bounce"></span>
      <span className="block w-2 h-2 mb-1 rounded-full bg-white animate-bounce delay-150"></span>
      <span className="block w-2 h-2 rounded-full bg-white animate-bounce delay-300"></span>
    </div>
  );
};

export default ScrollIndicator;
