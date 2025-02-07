import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { MemberChangeMenuProvider } from './contexts/member-change-menu.contexts';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<MemberChangeMenuProvider>
				<App />
			</MemberChangeMenuProvider>
		</BrowserRouter>
	</React.StrictMode>
);
