import { useContext, Fragment } from 'react';
import { ProjectControlContext } from '@contexts/project-control.context';
import { AuthContext } from '@contexts/auth.context';
import { LoadingPage } from '@components/loading';

import TabControl from './tab-control';
import ProjectTable from './project-table';

import styled from 'styled-components';

export const ContainerStyled = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 20px;
`;

const RenderPage = () => {
	return (
		<div>
			<TabControl />
			<ProjectTable />
		</div>
	);
};

function ProjectControl() {
	const { project } = useContext(ProjectControlContext);
	const { auth } = useContext(AuthContext);
	if (auth.hasOwnProperty('router'))
		if (!auth.router.includes('project-control')) return <div>無權限</div>;
	const LoadingCheck = () => {
		return <Fragment>{project.length > 0 ? <RenderPage /> : <LoadingPage />}</Fragment>;
	};
	return (
		<ContainerStyled>
			<h2>專案管理</h2>
			<LoadingCheck />
		</ContainerStyled>
	);
}

export default ProjectControl;
