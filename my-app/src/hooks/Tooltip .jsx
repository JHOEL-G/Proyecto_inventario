import { useState } from 'react';

const Tooltip = ({ children, content, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="cursor-help"
            >
                {children}
            </div>
            {isVisible && (
                <div className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap
                    ${position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' : ''}
                    ${position === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-2' : ''}
                    ${position === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-2' : ''}
                    ${position === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-2' : ''}
                    animate-fade-in`}>
                    {content}
                    <div className={`absolute w-2 h-2 bg-gray-900 rotate-45
                        ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' : ''}
                        ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1' : ''}
                        ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' : ''}
                        ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' : ''}`} />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
