"""
AI Value Extraction Engine
Extracts core values, patterns, and lessons from memories using NLP
"""

import torch
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    pipeline
)
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Dict, Any


class ValueExtractor:
    """Extract core values from text using fine-tuned BERT"""
    
    def __init__(self):
        self.values_list = [
            "Honesty", "Integrity", "Courage", "Resilience", "Empathy",
            "Kindness", "Patience", "Discipline", "Perseverance", "Gratitude",
            "Humility", "Compassion", "Loyalty", "Respect", "Responsibility",
            "Fairness", "Generosity", "Wisdom", "Creativity", "Curiosity"
        ]
        
        # For demo, we'll use zero-shot classification
        self.classifier = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli"
        )
    
    def extract_values(self, text: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Extract top values from text
        
        Args:
            text: Input text to analyze
            top_k: Number of top values to return
            
        Returns:
            List of dictionaries with value and confidence score
        """
        result = self.classifier(
            text,
            self.values_list,
            multi_label=True
        )
        
        values = []
        for label, score in zip(result['labels'][:top_k], result['scores'][:top_k]):
            if score > 0.3:  # Confidence threshold
                values.append({
                    'value': label,
                    'confidence': float(score)
                })
        
        return values


class EmotionAnalyzer:
    """Analyze emotions in text"""
    
    def __init__(self):
        self.emotion_classifier = pipeline(
            "text-classification",
            model="j-hartmann/emotion-english-distilroberta-base",
            return_all_scores=True
        )
    
    def analyze_emotions(self, text: str) -> List[Dict[str, Any]]:
        """
        Analyze emotions in text
        
        Args:
            text: Input text
            
        Returns:
            List of emotions with scores
        """
        results = self.emotion_classifier(text)[0]
        
        emotions = []
        for result in results:
            if result['score'] > 0.1:
                emotions.append({
                    'emotion': result['label'],
                    'score': float(result['score'])
                })
        
        # Sort by score
        emotions.sort(key=lambda x: x['score'], reverse=True)
        return emotions


class PatternDetector:
    """Detect behavioral patterns and habits"""
    
    def __init__(self):
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
    
    def detect_patterns(self, memories: List[str]) -> Dict[str, Any]:
        """
        Detect patterns across multiple memories
        
        Args:
            memories: List of memory texts
            
        Returns:
            Dictionary with detected patterns
        """
        # Generate embeddings
        embeddings = self.embedder.encode(memories)
        
        # Simple clustering to find similar memories
        from sklearn.cluster import KMeans
        
        n_clusters = min(5, len(memories))
        if len(memories) >= n_clusters:
            kmeans = KMeans(n_clusters=n_clusters, random_state=42)
            clusters = kmeans.fit_predict(embeddings)
            
            patterns = {
                'clusters': clusters.tolist(),
                'n_patterns': n_clusters,
                'pattern_strength': float(kmeans.inertia_)
            }
        else:
            patterns = {
                'clusters': [],
                'n_patterns': 0,
                'pattern_strength': 0.0
            }
        
        return patterns


class LessonGenerator:
    """Generate life lessons from memories"""
    
    def __init__(self):
        self.summarizer = pipeline(
            "summarization",
            model="facebook/bart-large-cnn"
        )
    
    def generate_lesson(self, text: str) -> str:
        """
        Generate a life lesson from memory text
        
        Args:
            text: Memory text
            
        Returns:
            Generated lesson
        """
        # Prepare prompt
        prompt = f"Life lesson from this experience: {text}"
        
        try:
            # Generate summary as lesson
            result = self.summarizer(
                text,
                max_length=50,
                min_length=20,
                do_sample=False
            )
            
            lesson = result[0]['summary_text']
            return lesson
        except Exception as e:
            # Fallback to simple extraction
            sentences = text.split('.')
            if sentences:
                return sentences[0].strip() + '.'
            return "Reflect on this experience for personal growth."


class MemoryAnalysisEngine:
    """Main engine that coordinates all AI analysis"""
    
    def __init__(self):
        self.value_extractor = ValueExtractor()
        self.emotion_analyzer = EmotionAnalyzer()
        self.pattern_detector = PatternDetector()
        self.lesson_generator = LessonGenerator()
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
    
    def analyze_memory(self, text: str) -> Dict[str, Any]:
        """
        Comprehensive analysis of a single memory
        
        Args:
            text: Memory text
            
        Returns:
            Dictionary with all analysis results
        """
        analysis = {
            'values': self.value_extractor.extract_values(text),
            'emotions': self.emotion_analyzer.analyze_emotions(text),
            'lesson': self.lesson_generator.generate_lesson(text),
            'embedding': self.embedder.encode(text).tolist()
        }
        
        return analysis
    
    def analyze_batch(self, memories: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Analyze multiple memories to find patterns
        
        Args:
            memories: List of memory dictionaries with 'text' key
            
        Returns:
            Batch analysis results
        """
        texts = [m['text'] for m in memories]
        
        # Individual analyses
        individual_analyses = [
            self.analyze_memory(text) for text in texts
        ]
        
        # Pattern detection
        patterns = self.pattern_detector.detect_patterns(texts)
        
        # Aggregate values
        all_values = {}
        for analysis in individual_analyses:
            for value_data in analysis['values']:
                value = value_data['value']
                if value in all_values:
                    all_values[value] += 1
                else:
                    all_values[value] = 1
        
        # Sort by frequency
        top_values = sorted(
            all_values.items(),
            key=lambda x: x[1],
            reverse=True
        )[:10]
        
        return {
            'individual_analyses': individual_analyses,
            'patterns': patterns,
            'top_values': [
                {'value': v, 'count': c} for v, c in top_values
            ],
            'total_memories': len(memories)
        }


# Singleton instance
_engine = None

def get_analysis_engine() -> MemoryAnalysisEngine:
    """Get or create the analysis engine singleton"""
    global _engine
    if _engine is None:
        _engine = MemoryAnalysisEngine()
    return _engine
