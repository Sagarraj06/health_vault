import React from 'react';

const GlobalBackground = ({ children }) => {
    return (
        <div className="relative min-h-screen bg-[#0f1014] text-white">
            {/* Decorative Background Elements - Fixed position to stay consistent across scrolls/pages */}
            <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] pointer-events-none z-0" />

            {/* Content Layer - Ensure it sits above background */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default GlobalBackground;
