import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Clock,
    Flame,
    Beef,
    Cookie,
    Droplet,
    RefreshCw,
    Eye,
    Scale
} from 'lucide-react';
import { useAuth } from './authContext';
import API from './api';
import Card from './ui/Card';
import './meal-recommendations.css';
import riceBowlGif from '../assets/ricebowl.gif';

export const MealRecommendations = () => {
    const { email } = useAuth();
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const handleViewDetails = (meal, index) => {
        navigate(`/meal/${index}`, { state: { meal } });
    };

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

    if (loading && recommendations.length === 0) {
        return (
            <Card variant="glass" className="meal-recommendations-card">
                <div className="meal-rec-header">
                    <Sparkles className="header-icon" />
                    <h3>AI Meal Suggestions</h3>
                </div>
                <div className="loading-container">
                    <img src={riceBowlGif} alt="Cooking up recommendations..." className="loading-gif" />
                    <p>Cooking up personalized meal suggestions...</p>
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
        <div className="glass-content-wrapper">
            <Card variant="glass" className="meal-recommendations-card">
                <div className="meal-rec-header">
                    <div className="meal-recommendations-heading">
                        <h2>Personalized Meal Suggestions</h2>
                        <p>Based on your log history</p>
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
                                        <span className="nutrition-unit">protein</span>
                                    </div>
                                    <div className="nutrition-item">
                                        <Cookie size={16} className="nutrition-icon" />
                                        <span className="nutrition-value">{meal.carbs}</span>
                                        <span className="nutrition-unit">carbs</span>
                                    </div>
                                    <div className="nutrition-item">
                                        <Droplet size={16} className="nutrition-icon" />
                                        <span className="nutrition-value">{meal.fats}</span>
                                        <span className="nutrition-unit">fat</span>
                                    </div>
                                </div>

                                <div className="meal-meta-row">
                                    <div className="meta-item">
                                        <Clock size={14} />
                                        <span>{meal.prepTime}</span>
                                    </div>
                                    {meal.totalWeight && (
                                        <>
                                            <div className="meta-divider">•</div>
                                            <div className="meta-item">
                                                <Scale size={14} />
                                                <span>{meal.totalWeight}</span>
                                            </div>
                                        </>
                                    )}
                                </div>



                                <div className="meal-card-actions">
                                    <button
                                        onClick={() => handleViewDetails(meal, index)}
                                        className="btn-view-details"
                                    >
                                        <Eye size={16} />
                                        View Details
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </Card>


        </div>
    );
};

export default MealRecommendations;
