// src/lib/stores.js
import { writable } from 'svelte/store';

// Store for user authentication status
export const isAuthenticated = writable(false);

// Store for posts
export const posts = writable([]);