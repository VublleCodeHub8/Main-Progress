import React from 'react';

function Card({ title, children, className = '' }) {
    return (
        <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
            {title && (
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
}

export default Card;
