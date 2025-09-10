import React, { useState, useCallback, useEffect } from 'react';
import { findInstructionalContent, generatePersonalizedTips } from '../services/geminiService';
import type { InstructionalContent, GroundingChunk, SwingAnalysis } from '../types';
import { BookOpenIcon, SearchIcon, VideoIcon, DocumentTextIcon, LightBulbIcon } from './icons';

const popularTopics = [
    'Fix Your Slice',
    'Putting Drills',
    'Chipping Basics',
    'Increase Driver Distance',
    'Bunker Shots',
    'Course Management',
];

const ContentCardSkeleton: React.FC = () => (
    <div className="bg-slate-800 p-5 rounded-xl shadow-md border border-slate-700 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-3/4 mb-3"></div>
        <div className="space-y-2 mb-4">
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        </div>
        <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-slate-700 rounded-full"></div>
            <div className="h-4 bg-slate-700 rounded w-1/4"></div>
        </div>
    </div>
);

const ContentCard: React.FC<{ item: InstructionalContent }> = ({ item }) => {
    const Icon = item.type === 'Video' ? VideoIcon : DocumentTextIcon;
    const color = item.type === 'Video' ? 'text-red-400' : 'text-blue-400';

    return (
        <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block bg-slate-900/50 p-5 rounded-xl shadow-md border border-slate-700 hover:bg-slate-800/80 hover:border-green-500/50 transition-all duration-300 group"
        >
            <h4 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">{item.title}</h4>
            <p className="text-sm text-gray-300 mt-1 mb-3">{item.description}</p>
            <div className={`flex items-center gap-2 text-xs font-semibold ${color}`}>
                <Icon className="h-4 w-4" />
                <span>{item.type.toUpperCase()}</span>
            </div>
        </a>
    );
};

interface InstructionalContentProps {
    analysisResult: SwingAnalysis | null;
}

const InstructionalContent: React.FC<InstructionalContentProps> = ({ analysisResult }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<InstructionalContent[]>([]);
    const [sources, setSources] = useState<GroundingChunk[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);
    
    const [tips, setTips] = useState<string[]>([]);
    const [tipsLoading, setTipsLoading] = useState<boolean>(false);
    const [tipsError, setTipsError] = useState<string | null>(null);

    useEffect(() => {
        if (analysisResult && analysisResult.areasForImprovement.length > 0) {
            const fetchTips = async () => {
                setTipsLoading(true);
                setTipsError(null);
                try {
                    const generatedTips = await generatePersonalizedTips(analysisResult.areasForImprovement);
                    setTips(generatedTips);
                } catch (err) {
                    setTipsError("Could not generate personalized tips at this time.");
                    console.error(err);
                } finally {
                    setTipsLoading(false);
                }
            };
            fetchTips();
        }
    }, [analysisResult]);

    const performSearch = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setError("Please enter a topic to search.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setSearched(true);
        setResults([]);
        setSources([]);

        try {
            const { content, sources } = await findInstructionalContent(searchQuery);
            setResults(content);
            setSources(sources);
        } catch (err) {
            setError('An error occurred while finding content. Please try a different topic.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(query);
    };
    
    const handlePopularTopicClick = (topic: string) => {
        setQuery(topic);
        performSearch(topic);
    };

    return (
        <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-700 w-full">
            <div className="text-center mb-6">
                <BookOpenIcon className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="mt-4 text-3xl font-extrabold text-white">Instructional Content Hub</h2>
                <p className="mt-2 text-md text-gray-300">Find top-rated videos and articles from expert coaches to improve your game.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="max-w-lg mx-auto flex gap-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., How to hit a fade"
                    className="flex-grow block w-full px-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    aria-label="Search for instructional content"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <SearchIcon className="h-5 w-5" />
                </button>
            </form>

            <div className="max-w-lg mx-auto text-center mb-8">
                <p className="text-sm text-gray-400 mb-2">Or try a popular topic:</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {popularTopics.map(topic => (
                        <button
                            key={topic}
                            onClick={() => handlePopularTopicClick(topic)}
                            disabled={isLoading}
                            className="px-3 py-1.5 text-xs font-medium rounded-full text-green-300 bg-green-900/50 hover:bg-green-800/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </div>

            {analysisResult && (
                <div className="my-8 p-6 bg-slate-900/50 border border-slate-700 rounded-lg">
                    <div className="flex items-center mb-4">
                        <LightBulbIcon className="h-8 w-8 text-yellow-400 mr-4 flex-shrink-0" />
                        <div>
                            <h3 className="text-2xl font-bold text-white">Personalized AI Tips For You</h3>
                            <p className="text-gray-300">Based on your recent swing analysis.</p>
                        </div>
                    </div>
                    {tipsLoading && (
                        <div className="flex items-center justify-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                            <p className="ml-3 text-gray-300">Generating your tips...</p>
                        </div>
                    )}
                    {tipsError && (
                        <p className="text-red-400 bg-red-900/20 p-3 rounded-md text-center">{tipsError}</p>
                    )}
                    {!tipsLoading && !tipsError && tips.length > 0 && (
                        <ul className="space-y-3 list-disc list-inside text-gray-200">
                            {tips.map((tip, index) => (
                                <li key={index} className="pl-2 leading-relaxed">{tip}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <div>
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(6)].map((_, i) => <ContentCardSkeleton key={i} />)}
                    </div>
                )}
                {error && (
                    <div className="text-center text-red-300 bg-red-900/30 p-4 rounded-lg border border-red-500/50">
                        <p className="font-semibold">Search Failed</p>
                        <p>{error}</p>
                    </div>
                )}
                {!isLoading && !error && searched && results.length === 0 && (
                    <div className="text-center text-gray-400 bg-slate-700/50 p-6 rounded-lg border border-slate-700">
                        <h3 className="font-semibold text-lg text-white">No Content Found</h3>
                        <p>We couldn't find any content for "{query}". Please try a different search term.</p>
                    </div>
                )}
                {results.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {results.map((item, index) => (
                            <ContentCard key={index} item={item} />
                        ))}
                    </div>
                )}
                {!isLoading && sources.length > 0 && (
                     <div className="mt-8 pt-6 border-t border-slate-700">
                        <h4 className="text-sm font-semibold text-gray-300">Sources from Google Search:</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            {sources.map((source, index) => (
                                <li key={index} className="text-xs text-gray-400">
                                    <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                        {source.web.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructionalContent;