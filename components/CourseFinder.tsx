import React, { useState } from 'react';
import { findCourses } from '../services/geminiService';
import type { Course, GroundingChunk } from '../types';
import { MapPinIcon, SearchIcon, LinkIcon, StarIcon, PhoneIcon, MapIcon, XIcon } from './icons';

const CourseCardSkeleton: React.FC = () => (
    <div className="bg-slate-800 p-5 rounded-xl shadow-md border border-slate-700 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-3/4 mb-3"></div>
        <div className="flex justify-between items-center mb-4">
            <div className="h-5 bg-slate-700 rounded w-1/4"></div>
            <div className="h-5 bg-slate-700 rounded w-1/4"></div>
        </div>
        <div className="space-y-2 mb-4">
            <div className="h-4 bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        </div>
        <div className="h-4 bg-slate-700 rounded w-1/2 mb-5"></div>
        <div className="flex flex-wrap gap-2 border-t border-slate-700 pt-4">
            <div className="h-8 bg-slate-700 rounded w-24"></div>
            <div className="h-8 bg-slate-700 rounded w-20"></div>
            <div className="h-8 bg-slate-700 rounded w-28"></div>
        </div>
    </div>
);

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
    const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(course.address)}`;

    const getTypeColor = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'public': return 'bg-green-900/50 text-green-300';
            case 'private': return 'bg-blue-900/50 text-blue-300';
            case 'semi-private': return 'bg-yellow-900/50 text-yellow-300';
            default: return 'bg-slate-700 text-slate-300';
        }
    };
    
    return (
        <div className="bg-slate-900/50 p-5 rounded-xl shadow-md border border-slate-700 flex flex-col hover:bg-slate-800/80 transition-colors duration-300">
            <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-white">{course.name}</h4>
                    {course.type && <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(course.type)}`}>{course.type}</span>}
                </div>

                {course.rating && (
                    <div className="flex items-center gap-1 text-yellow-500 mb-3">
                        {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-5 w-5 ${i < course.rating! ? 'text-yellow-400' : 'text-gray-500'}`} />)}
                        <span className="text-sm text-gray-300 font-medium ml-1">{course.rating.toFixed(1)}</span>
                    </div>
                )}
                
                <p className="text-sm text-gray-300 mb-3">{course.summary}</p>
                <p className="text-sm text-gray-200 font-medium">{course.address}</p>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-slate-700 mt-4 pt-4">
                {course.website && (
                    <a href={course.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-300 bg-green-900/50 hover:bg-green-800/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <LinkIcon className="h-4 w-4 mr-1.5" /> Website
                    </a>
                )}
                {course.phone && (
                     <a href={`tel:${course.phone}`} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-300 bg-indigo-900/50 hover:bg-indigo-800/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <PhoneIcon className="h-4 w-4 mr-1.5" /> Call
                    </a>
                )}
                <a href={gmapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-gray-200 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                   <MapIcon className="h-4 w-4 mr-1.5" /> View on Map
                </a>
            </div>
        </div>
    );
};

const CourseFinder: React.FC = () => {
    const [location, setLocation] = useState<string>('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [sources, setSources] = useState<GroundingChunk[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState<boolean>(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location.trim()) {
            setError("Please enter a location to search.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setSearched(true);
        try {
            const { courses: foundCourses, sources: foundSources } = await findCourses(location);
            setCourses(foundCourses);
            setSources(foundSources);
        } catch (err) {
            setError('An error occurred while finding courses. Please try a different location or check your connection.');
            console.error(err);
            setCourses([]);
            setSources([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearSearch = () => {
        setLocation('');
        setCourses([]);
        setSources([]);
        setError(null);
        setSearched(false);
    };

    return (
        <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-700 w-full">
            <div className="text-center mb-6">
                <MapPinIcon className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="mt-4 text-3xl font-extrabold text-white">Find Your Next Round</h2>
                <p className="mt-2 text-md text-gray-300">Enter a city, state, or zip code to discover courses near you.</p>
            </div>

            <form onSubmit={handleSearch} className="max-w-lg mx-auto flex gap-2 mb-8">
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Pebble Beach, CA"
                    className="flex-grow block w-full px-4 py-3 bg-slate-700 text-white border border-slate-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    aria-label="Location for course search"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <SearchIcon className="h-5 w-5" />
                </button>
                {searched && !isLoading && (
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className="inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-base font-medium rounded-lg shadow-sm text-gray-200 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                        aria-label="Clear search"
                        title="Clear search"
                    >
                        <XIcon className="h-5 w-5" />
                    </button>
                )}
            </form>

            <div>
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => <CourseCardSkeleton key={i} />)}
                    </div>
                )}
                {error && (
                    <div className="text-center text-red-300 bg-red-900/30 p-4 rounded-lg border border-red-500/50">
                        <p className="font-semibold">Search Failed</p>
                        <p>{error}</p>
                    </div>
                )}
                {!isLoading && !error && searched && courses.length === 0 && (
                    <div className="text-center text-gray-400 bg-slate-700/50 p-6 rounded-lg border border-slate-700">
                        <h3 className="font-semibold text-lg text-white">No Courses Found</h3>
                        <p>We couldn't find any courses for "{location}". Please try a different or more general location.</p>
                    </div>
                )}
                {courses.length > 0 && (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-white text-center">Courses near "{location}"</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {courses.map((course, index) => (
                                <CourseCard key={index} course={course} />
                            ))}
                        </div>
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

export default CourseFinder;