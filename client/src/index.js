import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App';
import Firebase, { FirebaseContext } from './components/Firebase';

// Get the root container
const container = document.getElementById('root');
const root = createRoot(container);

// Render the app wrapped with Firebase context
root.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <App />
    </FirebaseContext.Provider>
);