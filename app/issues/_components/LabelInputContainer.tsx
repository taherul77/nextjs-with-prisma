import React from 'react'

interface LabelInputContainerProps {
  children: React.ReactNode;
  className?: string;
}

const LabelInputContainer: React.FC<LabelInputContainerProps> = ({
    children,
    className,
  }) => {
    return (
      <div className={`flex flex-col space-y-2 w-full ${className}`}>
        {children}
      </div>
    );
  };
export default LabelInputContainer