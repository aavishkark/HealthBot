import React from 'react';
import { Modal, Box, LinearProgress } from '@mui/material';
import {
    Flame,
    Beef,
    Wheat,
    Droplet,
    CheckCircle,
    X,
    Utensils
} from 'lucide-react';
import './NutritionalBreakdownModal.css';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#1a1f29', // fallback
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    outline: 'none',
    width: '90%',
    maxWidth: '480px',
    overflow: 'hidden',
};

const NutritionalBreakdownModal = ({ open, onClose, data, onAdd }) => {
    if (!data) return null;

    const { item, amount, calories, proteins, carbs, fats, fiber, sugar, error } = data;

    const totalMacros = parseFloat(proteins) + parseFloat(carbs) + parseFloat(fats);
    const pPercent = totalMacros ? (parseFloat(proteins) / totalMacros) * 100 : 0;
    const cPercent = totalMacros ? (parseFloat(carbs) / totalMacros) * 100 : 0;
    const fPercent = totalMacros ? (parseFloat(fats) / totalMacros) * 100 : 0;

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="nutrition-modal-title">
            <Box sx={modalStyle} className="human-modal-container">
                {error ? (
                    <div className="human-modal-error">
                        <div className="error-icon-wrapper">
                            <X size={32} />
                        </div>
                        <h3>Couldn't analyze that</h3>
                        <p>{error}</p>
                        <button onClick={onClose} className="btn-modal-action secondary">
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="human-modal-content">
                        <div className="modal-header-visual">
                            <div className="food-icon-hero">
                                <Utensils size={32} />
                            </div>
                            <button onClick={onClose} className="btn-close-icon">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body-content">
                            <div className="food-title-section">
                                <span className="scanned-label">You scanned</span>
                                <h2>{item}</h2>
                                <div className="amount-badge">{amount}g serving</div>
                            </div>

                            <div className="main-stat-card">
                                <div className="cal-ring">
                                    <Flame size={24} className="flame-icon" />
                                </div>
                                <div className="cal-info">
                                    <span className="cal-value">{calories}</span>
                                    <span className="cal-unit">kcal</span>
                                </div>
                            </div>

                            <div className="macros-human-grid">
                                {/* Protein */}
                                <div className="macro-human-card protein">
                                    <div className="macro-header">
                                        <Beef size={18} />
                                        <span>Protein</span>
                                    </div>
                                    <div className="macro-value-row">
                                        <strong>{proteins}g</strong>
                                        <span className="macro-percent">{Math.round(pPercent)}%</span>
                                    </div>
                                    <div className="macro-bar-container">
                                        <div className="macro-bar-fill protein" style={{ width: `${pPercent}%` }}></div>
                                    </div>
                                </div>

                                {/* Carbs */}
                                <div className="macro-human-card carbs">
                                    <div className="macro-header">
                                        <Wheat size={18} />
                                        <span>Carbs</span>
                                    </div>
                                    <div className="macro-value-row">
                                        <strong>{carbs}g</strong>
                                        <span className="macro-percent">{Math.round(cPercent)}%</span>
                                    </div>
                                    <div className="macro-bar-container">
                                        <div className="macro-bar-fill carbs" style={{ width: `${cPercent}%` }}></div>
                                    </div>
                                </div>

                                {/* Fats */}
                                <div className="macro-human-card fats">
                                    <div className="macro-header">
                                        <Droplet size={18} />
                                        <span>Fats</span>
                                    </div>
                                    <div className="macro-value-row">
                                        <strong>{fats}g</strong>
                                        <span className="macro-percent">{Math.round(fPercent)}%</span>
                                    </div>
                                    <div className="macro-bar-container">
                                        <div className="macro-bar-fill fats" style={{ width: `${fPercent}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Micros Row */}
                            <div className="micros-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
                                <div className="macro-human-card fiber" style={{ justifyContent: 'space-between' }}>
                                    <div className="macro-header" style={{ width: 'auto' }}>
                                        <span>Fiber</span>
                                    </div>
                                    <strong style={{ color: '#fff' }}>{fiber || 0}g</strong>
                                </div>
                                <div className="macro-human-card sugar" style={{ justifyContent: 'space-between' }}>
                                    <div className="macro-header" style={{ width: 'auto' }}>
                                        <span>Sugar</span>
                                    </div>
                                    <strong style={{ color: '#fff' }}>{sugar || 0}g</strong>
                                </div>
                            </div>

                            <div className="modal-actions-human">
                                <button onClick={onAdd} className="btn-modal-action primary">
                                    <CheckCircle size={18} />
                                    Add to Daily Log
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Box>
        </Modal>
    );
};

export default NutritionalBreakdownModal;
