import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const ProgressRing = ({
    progress = 0,
    size = 120,
    strokeWidth = 8,
    label = '',
    color = 'var(--color-primary)',
    bgColor = 'var(--color-border)',
    showPercentage = true,
    animated = true,
}) => {
    const [displayProgress, setDisplayProgress] = useState(0);

    useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => {
                setDisplayProgress(progress);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setDisplayProgress(progress);
        }
    }, [progress, animated]);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (displayProgress / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    className="transform -rotate-90"
                    width={size}
                    height={size}
                >
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={bgColor}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={animated ? 'transition-all duration-1000 ease-out' : ''}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        {showPercentage && (
                            <div
                                className="font-bold font-mono"
                                style={{ fontSize: size * 0.18 }}
                            >
                                {Math.round(displayProgress)}%
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {label && (
                <div className="mt-2 text-sm text-[var(--color-text-secondary)] font-medium">
                    {label}
                </div>
            )}
        </div>
    );
};

ProgressRing.propTypes = {
    progress: PropTypes.number,
    size: PropTypes.number,
    strokeWidth: PropTypes.number,
    label: PropTypes.string,
    color: PropTypes.string,
    bgColor: PropTypes.string,
    showPercentage: PropTypes.bool,
    animated: PropTypes.bool,
};

export default ProgressRing;
