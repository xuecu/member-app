import { Routes, Route, Navigate } from 'react-router-dom';
import DefaultLayout from './pages/default-layout';
import Login from './pages/login';
import ProtectedRoute from './utils/protected-route.utils';
import MemberChange from './pages/member-change/member-change.pages';

function App() {
	return (
		<Routes>
			<Route path="/" element={<DefaultLayout />}>
				<Route index element={ <Navigate to="/login" replace />} />
				<Route path="login" element={<Login />} />

				<Route path="dashboard">
					<Route index element={ <Navigate to="member-change" replace />} />
					<Route
						path="member-change"
						element={<ProtectedRoute children={<MemberChange />} />}
					/>
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
