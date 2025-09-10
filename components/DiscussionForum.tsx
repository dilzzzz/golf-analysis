
import React, { useState, useEffect } from 'react';
import type { Post, Reply } from '../types';
import { UserGroupIcon, SearchIcon, FlagIcon, ThumbsUpIcon, ThumbsDownIcon } from './icons';

const STORAGE_KEY = 'golfAiDiscussionPosts';
const INTERACTIONS_STORAGE_KEY = 'golfAiDiscussionInteractions';
const USER_NAME_STORAGE_KEY = 'golfAiUserName';
const LINK_REGEX = /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-?=%.]+/;

const timeAgo = (timestamp: number): string => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);
    if (seconds < 5) return "Just now";
    
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    return `${Math.floor(seconds)} seconds ago`;
};

const DiscussionForum: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [name, setName] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [interactions, setInteractions] = useState<{ likedPosts: string[], unlikedPosts: string[] }>({ likedPosts: [], unlikedPosts: [] });
    
    // State for handling replies
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyName, setReplyName] = useState<string>('');
    const [replyMessage, setReplyMessage] = useState<string>('');
    const [replyError, setReplyError] = useState<string | null>(null);
    
    // State for editing
    const [userName, setUserName] = useState<string>('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState<string>('');

    useEffect(() => {
        // Load Posts
        try {
            const savedPosts = localStorage.getItem(STORAGE_KEY);
            if (savedPosts) {
                const parsedPosts: Post[] = JSON.parse(savedPosts);
                const postsWithDefaults = parsedPosts.map(p => ({
                    ...p,
                    replies: p.replies || [],
                    likes: p.likes || 0,
                    unlikes: p.unlikes || 0,
                }));
                setPosts(postsWithDefaults);
            }
        } catch (err) {
            console.error("Failed to load posts from localStorage", err);
        }

        // Load Interactions
        try {
            const savedInteractions = localStorage.getItem(INTERACTIONS_STORAGE_KEY);
            if (savedInteractions) {
                setInteractions(JSON.parse(savedInteractions));
            }
        } catch (err) {
            console.error("Failed to load interactions from localStorage", err);
        }
        
        // Load User Name for edit checks
        try {
            const savedUserName = localStorage.getItem(USER_NAME_STORAGE_KEY);
            if (savedUserName) {
                setUserName(savedUserName);
            }
        } catch (err) {
            console.error("Failed to load user name from localStorage", err);
        }
    }, []);
    
    const persistPosts = (updatedPosts: Post[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
        } catch (err) {
            console.error("Failed to save posts to localStorage", err);
            setError("Could not save your post. Please try again.");
            // Revert state if saving fails
            setPosts(posts);
        }
    }

    const persistInteractions = (updatedInteractions: { likedPosts: string[], unlikedPosts: string[] }) => {
        try {
            localStorage.setItem(INTERACTIONS_STORAGE_KEY, JSON.stringify(updatedInteractions));
        } catch (err) {
            console.error("Failed to save interactions to localStorage", err);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        const trimmedName = name.trim();
        const trimmedMessage = message.trim();
        
        if (!trimmedName || !trimmedMessage) {
            setError("Name and message cannot be empty.");
            return;
        }
        
        if (LINK_REGEX.test(trimmedMessage)) {
            setError("Posting links or URLs is not allowed.");
            return;
        }

        const newPost: Post = {
            id: crypto.randomUUID(),
            name: trimmedName,
            message: trimmedMessage,
            timestamp: Date.now(),
            replies: [],
            likes: 0,
            unlikes: 0,
        };

        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        setMessage('');
        persistPosts(updatedPosts);
        
        // Save user name for edit checks
        setUserName(trimmedName);
        localStorage.setItem(USER_NAME_STORAGE_KEY, trimmedName);
    };
    
    const handleReplySubmit = (e: React.FormEvent, postId: string) => {
        e.preventDefault();
        setReplyError(null);

        const trimmedReplyName = replyName.trim();
        const trimmedReplyMessage = replyMessage.trim();

        if (!trimmedReplyName || !trimmedReplyMessage) {
            setReplyError("Name and message cannot be empty.");
            return;
        }

        if (LINK_REGEX.test(trimmedReplyMessage)) {
            setReplyError("Posting links or URLs is not allowed.");
            return;
        }

        const newReply: Reply = {
            id: crypto.randomUUID(),
            name: trimmedReplyName,
            message: trimmedReplyMessage,
            timestamp: Date.now(),
        };

        const updatedPosts = posts.map(post => {
            if (post.id === postId) {
                // Add new reply to the start of the array to show newest first
                return { ...post, replies: [newReply, ...(post.replies || [])] };
            }
            return post;
        });

        setPosts(updatedPosts);
        setReplyMessage('');
        setReplyName('');
        setReplyingTo(null);
        persistPosts(updatedPosts);
        
        // Save user name for edit checks
        setUserName(trimmedReplyName);
        localStorage.setItem(USER_NAME_STORAGE_KEY, trimmedReplyName);
    };

    const handleReportPost = (postId: string) => {
        if (!window.confirm("Are you sure you want to report this post? This action will flag it for moderator review.")) {
            return;
        }

        const updatedPosts = posts.map(post => {
            if (post.id === postId) {
                return { ...post, reported: true };
            }
            return post;
        });

        setPosts(updatedPosts);
        persistPosts(updatedPosts);
    };
    
    const handleReportReply = (postId: string, replyId: string) => {
        if (!window.confirm("Are you sure you want to report this reply? This action will flag it for moderator review.")) {
            return;
        }

        const updatedPosts = posts.map(post => {
            if (post.id === postId) {
                const updatedReplies = (post.replies || []).map(reply => {
                    if (reply.id === replyId) {
                        return { ...reply, reported: true };
                    }
                    return reply;
                });
                return { ...post, replies: updatedReplies };
            }
            return post;
        });

        setPosts(updatedPosts);
        persistPosts(updatedPosts);
    };
    
    const handleLike = (postId: string) => {
        let updatedInteractions = { ...interactions };
        const updatedPosts = posts.map(post => {
            if (post.id === postId) {
                const updatedPost = { ...post };
                const wasLiked = updatedInteractions.likedPosts.includes(postId);
                const wasUnliked = updatedInteractions.unlikedPosts.includes(postId);

                if (wasLiked) {
                    updatedPost.likes -= 1;
                    updatedInteractions.likedPosts = updatedInteractions.likedPosts.filter(id => id !== postId);
                } else {
                    if (wasUnliked) {
                        updatedPost.unlikes -= 1;
                        updatedInteractions.unlikedPosts = updatedInteractions.unlikedPosts.filter(id => id !== postId);
                    }
                    updatedPost.likes += 1;
                    updatedInteractions.likedPosts.push(postId);
                }
                return updatedPost;
            }
            return post;
        });

        setPosts(updatedPosts);
        setInteractions(updatedInteractions);
        persistPosts(updatedPosts);
        persistInteractions(updatedInteractions);
    };

    const handleUnlike = (postId: string) => {
        let updatedInteractions = { ...interactions };
        const updatedPosts = posts.map(post => {
            if (post.id === postId) {
                const updatedPost = { ...post };
                const wasLiked = updatedInteractions.likedPosts.includes(postId);
                const wasUnliked = updatedInteractions.unlikedPosts.includes(postId);

                if (wasUnliked) {
                    updatedPost.unlikes -= 1;
                    updatedInteractions.unlikedPosts = updatedInteractions.unlikedPosts.filter(id => id !== postId);
                } else {
                    if (wasLiked) {
                        updatedPost.likes -= 1;
                        updatedInteractions.likedPosts = updatedInteractions.likedPosts.filter(id => id !== postId);
                    }
                    updatedPost.unlikes += 1;
                    updatedInteractions.unlikedPosts.push(postId);
                }
                return updatedPost;
            }
            return post;
        });

        setPosts(updatedPosts);
        setInteractions(updatedInteractions);
        persistPosts(updatedPosts);
        persistInteractions(updatedInteractions);
    };
    
    const handleStartEdit = (id: string, currentText: string) => {
        setEditingId(id);
        setEditText(currentText);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const handleSaveEdit = (idToSave: string) => {
        const trimmedEditText = editText.trim();
        if (!trimmedEditText || LINK_REGEX.test(trimmedEditText)) {
            // Can show a more specific error, but for now just cancel.
            handleCancelEdit();
            return;
        }

        const updatedPosts = posts.map(post => {
            // Check if it's the post being edited
            if (post.id === idToSave) {
                return { ...post, message: trimmedEditText };
            }
            // Check if it's a reply within this post being edited
            if (post.replies?.some(reply => reply.id === idToSave)) {
                return {
                    ...post,
                    replies: post.replies.map(reply => 
                        reply.id === idToSave ? { ...reply, message: trimmedEditText } : reply
                    ),
                };
            }
            return post;
        });

        setPosts(updatedPosts);
        persistPosts(updatedPosts);
        handleCancelEdit();
    };

    const filteredPosts = posts.filter(post => {
        if (!searchTerm.trim()) {
            return true; // Show all posts if search is empty
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        // Check post name and message
        if (post.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            post.message.toLowerCase().includes(lowerCaseSearchTerm)) {
            return true;
        }

        // Check replies name and message
        return post.replies?.some(reply => 
            reply.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            reply.message.toLowerCase().includes(lowerCaseSearchTerm)
        );
    });

    return (
        <div className="bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-700 w-full">
            <div className="text-center mb-8">
                <UserGroupIcon className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="mt-4 text-3xl font-extrabold text-white">Community Discussion</h2>
                <p className="mt-2 text-md text-gray-300">Share your thoughts, ask questions, and connect with other golfers.</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
                 <div className="mb-8">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search posts by keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full bg-slate-700 border border-slate-600 rounded-md py-2 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                            aria-label="Search posts"
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 bg-slate-900/50 border border-slate-700 rounded-lg space-y-4 mb-8">
                    <h3 className="text-lg font-semibold text-white">Post a New Message</h3>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Your Name</label>
                        <input
                            type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={30}
                            placeholder="e.g., John D."
                            className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
                        <textarea
                            id="message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500}
                            placeholder="Share your latest golf tip..."
                            className="mt-1 block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                         <p className="mt-1 text-xs text-gray-500">{500 - message.length} characters remaining</p>
                    </div>
                    {error && (<div className="text-sm text-red-400 bg-red-900/30 p-3 rounded-md border border-red-500/50">{error}</div>)}
                    <div className="text-right">
                        <button type="submit" className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Post Message</button>
                    </div>
                </form>

                <div className="space-y-4">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                           <div key={post.id} className={`bg-slate-900/30 p-5 rounded-lg border transition-opacity ${post.reported ? 'opacity-60 border-yellow-500/30' : 'border-slate-700'}`}>
                               <div className="flex justify-between items-start mb-2">
                                   <p className="font-bold text-green-400">{post.name}</p>
                                   <div className="flex items-center gap-2 text-right">
                                        {post.reported && (
                                            <span className="flex items-center gap-1 text-xs text-yellow-400 font-semibold">
                                                <FlagIcon className="h-4 w-4" />
                                                Reported
                                            </span>
                                        )}
                                       <p className="text-xs text-gray-400">{timeAgo(post.timestamp)}</p>
                                   </div>
                               </div>
                               {editingId === post.id ? (
                                    <div className="mt-2">
                                        <textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            rows={4} maxLength={500}
                                            className="block w-full px-3 py-2 bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        />
                                        <div className="flex items-center gap-2 mt-2">
                                            <button onClick={() => handleSaveEdit(post.id)} className="text-sm font-medium text-green-400 hover:text-green-300">Save</button>
                                            <button onClick={handleCancelEdit} className="text-sm font-medium text-gray-400 hover:text-white">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-200 whitespace-pre-wrap">{post.message}</p>
                                )}
                               
                               <div className="mt-4 flex items-center gap-4">
                                  <button onClick={() => { setReplyingTo(replyingTo === post.id ? null : post.id); setReplyError(null); setReplyName(''); setReplyMessage('');}}
                                          className="text-sm font-medium text-gray-300 hover:text-white"
                                  >
                                      {replyingTo === post.id ? 'Cancel' : 'Reply'}
                                  </button>
                                  {userName && post.name === userName && !post.reported && !editingId && (
                                     <button onClick={() => handleStartEdit(post.id, post.message)} className="text-sm font-medium text-gray-300 hover:text-white">
                                        Edit
                                    </button>
                                  )}
                                  <button
                                      onClick={() => handleReportPost(post.id)}
                                      disabled={post.reported}
                                      className="text-sm font-medium text-yellow-500 hover:text-yellow-400 disabled:text-gray-500 disabled:cursor-not-allowed"
                                  >
                                      {post.reported ? 'Reported' : 'Report Post'}
                                  </button>
                                  <div className="flex items-center gap-4 border-l border-slate-600 pl-4">
                                    <button
                                        onClick={() => handleLike(post.id)}
                                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                                            interactions.likedPosts.includes(post.id)
                                                ? 'text-green-400'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                        aria-pressed={interactions.likedPosts.includes(post.id)}
                                    >
                                        <ThumbsUpIcon className="h-5 w-5" />
                                        <span>{post.likes}</span>
                                    </button>
                                    <button
                                        onClick={() => handleUnlike(post.id)}
                                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                                            interactions.unlikedPosts.includes(post.id)
                                                ? 'text-red-400'
                                                : 'text-gray-400 hover:text-white'
                                        }`}
                                        aria-pressed={interactions.unlikedPosts.includes(post.id)}
                                    >
                                        <ThumbsDownIcon className="h-5 w-5" />
                                        <span>{post.unlikes}</span>
                                    </button>
                                  </div>
                               </div>

                               {replyingTo === post.id && (
                                   <form onSubmit={(e) => handleReplySubmit(e, post.id)} className="mt-4 pl-6 border-l-2 border-slate-700">
                                       <div className="p-4 bg-slate-800/50 rounded-lg space-y-3">
                                           <h4 className="text-sm font-semibold text-white">Replying to {post.name}</h4>
                                           <div>
                                               <label htmlFor={`reply-name-${post.id}`} className="sr-only">Your Name</label>
                                               <input type="text" id={`reply-name-${post.id}`} value={replyName} onChange={(e) => setReplyName(e.target.value)} maxLength={30} placeholder="Your Name"
                                                      className="block w-full px-3 py-2 text-sm bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                                           </div>
                                           <div>
                                               <label htmlFor={`reply-message-${post.id}`} className="sr-only">Your Reply</label>
                                               <textarea id={`reply-message-${post.id}`} rows={3} value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} maxLength={500} placeholder="Write your reply..."
                                                         className="block w-full px-3 py-2 text-sm bg-slate-700 text-white border border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                                           </div>
                                           {replyError && <div className="text-xs text-red-400">{replyError}</div>}
                                           <div className="text-right">
                                               <button type="submit" className="inline-flex items-center px-4 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Post Reply</button>
                                           </div>
                                       </div>
                                   </form>
                               )}
                               
                               {post.replies && post.replies.length > 0 && (
                                   <div className="mt-4 pt-4 border-t border-slate-700/50 pl-6 border-l-2 border-slate-700/50 space-y-4">
                                       {post.replies.map(reply => (
                                           <div key={reply.id} className={`bg-slate-800/50 p-4 rounded-lg transition-opacity ${reply.reported ? 'opacity-60 border border-yellow-500/30' : ''}`}>
                                               <div className="flex justify-between items-start mb-1">
                                                   <p className="font-bold text-blue-400 text-sm">{reply.name}</p>
                                                   <div className="flex items-center gap-2 text-right">
                                                        {reply.reported && (
                                                            <span className="flex items-center gap-1 text-xs text-yellow-400 font-semibold">
                                                                <FlagIcon className="h-4 w-4" />
                                                                Reported
                                                            </span>
                                                        )}
                                                        <p className="text-xs text-gray-500">{timeAgo(reply.timestamp)}</p>
                                                   </div>
                                               </div>
                                                {editingId === reply.id ? (
                                                    <div className="mt-1">
                                                        <textarea
                                                            value={editText}
                                                            onChange={(e) => setEditText(e.target.value)}
                                                            rows={3} maxLength={500}
                                                            className="block w-full text-sm px-3 py-2 bg-slate-600 text-white border border-slate-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                        />
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <button onClick={() => handleSaveEdit(reply.id)} className="text-xs font-medium text-green-400 hover:text-green-300">Save</button>
                                                            <button onClick={handleCancelEdit} className="text-xs font-medium text-gray-400 hover:text-white">Cancel</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{reply.message}</p>
                                                )}
                                                <div className="mt-2 flex items-center gap-4">
                                                    {userName && reply.name === userName && !reply.reported && !editingId && (
                                                        <button
                                                            onClick={() => handleStartEdit(reply.id, reply.message)}
                                                            className="text-xs font-medium text-gray-400 hover:text-white"
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                    <button
                                                      onClick={() => handleReportReply(post.id, reply.id)}
                                                      disabled={reply.reported}
                                                      className="text-xs font-medium text-yellow-500 hover:text-yellow-400 disabled:text-gray-500 disabled:cursor-not-allowed"
                                                    >
                                                      {reply.reported ? 'Reported' : 'Report Reply'}
                                                    </button>
                                                </div>
                                           </div>
                                       ))}
                                   </div>
                               )}
                           </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-400 bg-slate-700/50 p-8 rounded-lg border border-slate-700">
                            {searchTerm ? (
                                <>
                                    <h3 className="font-semibold text-lg text-white">No Results Found</h3>
                                    <p>We couldn't find any posts matching "{searchTerm}".</p>
                                </>
                            ) : (
                                <>
                                    <h3 className="font-semibold text-lg text-white">The course is quiet...</h3>
                                    <p>Be the first to start a conversation!</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiscussionForum;
