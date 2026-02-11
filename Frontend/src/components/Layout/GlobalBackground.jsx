import React from 'react';

const GlobalBackground = ({ children }) => {
    return (
        <div className="relative min-h-screen bg-dark text-white">
            {/* Subtle decorative gradient orbs */}
            <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-primary/[0.07] rounded-full blur-[150px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-accent/[0.05] rounded-full blur-[150px] pointer-events-none translate-x-1/4 translate-y-1/4" />

            {/* Subtle grid pattern */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default GlobalBackground;
