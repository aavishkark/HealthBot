import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Clock,
    Flame,
    Beef,
    Cookie,
    Droplet,
    RefreshCw,
    Plus,
    ChevronDown,
    ChevronUp,
    Sunrise,
    Sun,
    Moon
} from 'lucide-react';
import { Alert, Snackbar } from '@mui/material';
import { useAuth } from './authContext';
import API from './api';
import Card from './ui/Card';
import LoadingSpinner from './ui/LoadingSpinner';
import './meal-recommendations.css';

const getMealTypeIcon = (mealType) => {
    const icons = {
        breakfast: <Sunrise size={20} />,
        lunch: <Sun size={20} />,
        dinner: <Moon size={20} />,
        snack: <Cookie size={20} />
    };
    return icons[mealType] || <Sparkles size={20} />;
};

export const MealRecommendations = () => {
    const { email } = useAuth();
    const [recommendations, setRecommendations] = useState([]);
    const [mealType, setMealType] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const fetchRecommendations = useCallback(async (count = 3, specificMealType = null) => {
        if (!email) {
            setError('User not authenticated');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await API.post('/meal-recommendations', {
                email: email,
                count,
                mealType: specificMealType
            });

            if (response.data.success) {
                setRecommendations(response.data.recommendations);
                setMealType(response.data.mealType);
            } else {
                setError('Failed to fetch recommendations');
            }
        } catch (err) {
            console.error('Error fetching recommendations:', err);
            setError(err.response?.data?.message || 'Unable to load meal recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [email]);

    useEffect(() => {
        if (email) {
            fetchRecommendations();
        }
    }, [email, fetchRecommendations]);

    if (!email) {
        return null;
    }

    const handleQuickLog = async (meal) => {
        try {
            await API.post('/addcalories', {
                calories: meal.calories,
                proteins: meal.proteins,
                carbs: meal.carbs,
                fats: meal.fats,
                foodAmount: meal.servingSize,
                foodItem: meal.name
            });

            setAlertMessage(`✨ ${meal.name} added to your log!`);
            setShowAlert(true);

            setTimeout(() => fetchRecommendations(), 1000);
        } catch (err) {
            console.error('Error logging meal:', err);
            setAlertMessage('Failed to log meal. Please try again.');
            setShowAlert(true);
        }
    };

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    if (loading && recommendations.length === 0) {
        return (
            <Card variant="glass" className="meal-recommendations-card">
                <div className="meal-rec-header">
                    <Sparkles className="header-icon" />
                    <h3>AI Meal Suggestions</h3>
                </div>
                <div className="loading-container">
                    <LoadingSpinner size="large" />
                    <p>Generating personalized meal suggestions...</p>
                </div>
            </Card>
        );
    }

    if (error && recommendations.length === 0) {
        return (
            <Card variant="glass" className="meal-recommendations-card">
                <div className="meal-rec-header">
                    <Sparkles className="header-icon" />
                    <h3>AI Meal Suggestions</h3>
                </div>
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button onClick={() => fetchRecommendations()} className="btn-retry">
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            </Card>
        );
    }

    return (
        <>
            <Card variant="glass" className="meal-recommendations-card">
                <div className="meal-rec-header">
                    <div className="meal-recommendations-heading">
                        <h2>Personalized Meal Suggestions</h2>
                        <p>AI-powered recommendations based on your nutrition goals</p>
                    </div>
                    <button
                        onClick={() => fetchRecommendations()}
                        className="btn-refresh"
                        disabled={loading}
                    >
                        <RefreshCw size={18} className={loading ? 'spinning' : ''} />
                    </button>
                </div>

                <div className="recommendations-list">
                    <AnimatePresence mode="popLayout">
                        {recommendations.map((meal, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="meal-card"
                            >
                                <div className="meal-card-header">
                                    <h4 className="meal-name">{meal.name}</h4>
                                </div>

                                <p className="meal-description">{meal.description}</p>

                                <div className="meal-nutrition">
                                    <div className="nutrition-item">
                                        <Flame size={16} className="nutrition-icon" />
                                        <span className="nutrition-value">{meal.calories}</span>
                                        <span className="nutrition-unit">cal</span>
                                    </div>
                                    <div className="nutrition-item">
                                        <Beef size={16} className="nutrition-icon" />
                                        <span className="nutrition-value">{meal.proteins}</span>
                                        <span className="nutrition-unit">g protein</span>
                                    </div>
                                    <div className="nutrition-item">
                                        <Cookie size={16} className="nutrition-icon" />
                                        <span className="nutrition-value">{meal.carbs}</span>
                                        <span className="nutrition-unit">g carbs</span>
                                    </div>
                                    <div className="nutrition-item">
                                        <Droplet size={16} className="nutrition-icon" />
                                        <span className="nutrition-value">{meal.fats}</span>
                                        <span className="nutrition-unit">g fat</span>
                                    </div>
                                </div>

                                <div className="meal-meta">
                                    <div className="meta-item">
                                        <Clock size={14} />
                                        <span>{meal.prepTime}</span>
                                    </div>
                                    <div className="meal-tags">
                                        {meal.tags?.slice(0, 2).map((tag, idx) => (
                                            <span key={idx} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleExpand(index)}
                                    className="btn-expand"
                                >
                                    <span>Ingredients</span>
                                    {expandedIndex === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>

                                <AnimatePresence>
                                    {expandedIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="ingredients-container"
                                        >
                                            <ul className="ingredients-list">
                                                {meal.ingredients?.map((ingredient, idx) => (
                                                    <li key={idx}>{ingredient}</li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    onClick={() => handleQuickLog(meal)}
                                    className="btn-quick-log"
                                >
                                    <Plus size={16} />
                                    Add to Log
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </Card>

            <Snackbar
                open={showAlert}
                autoHideDuration={3000}
                onClose={() => setShowAlert(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setShowAlert(false)}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default MealRecommendations;
