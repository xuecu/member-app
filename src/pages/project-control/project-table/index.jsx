import React, { useState, useContext, Fragment, useEffect } from 'react';
import { ProjectControlContext } from '@contexts/project-control.context';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { formatTaiwanTime } from '@utils/day';
import CustomTable from '@components/custom-table';
import TextEllipsis from '@components/text-ellipsis';
import { LightBox } from '@components/light-box';
import EditProject from './edit-project';
import InsertProject from './insert-project';

const ColTitleStyled = styled.span`
	white-space: nowrap;
`;

function ProjectTable() {
	const { tab, fieldMap, table } = useContext(ProjectControlContext);
	const [columns, setColumns] = useState([]);
	const [data, setData] = useState([]);
	const [selectedRow, setSelectedRow] = useState(null); // 儲存點擊的 row
	const [isModalOpen, setIsModalOpen] = useState(false); // 控制 Lightbox 開關
	const [insertProject, setInsertProject] = useState(false); // 控制 Lightbox 開關

	const handleRowClick = (record) => {
		setSelectedRow(record);
		setIsModalOpen(true);
	};
	const handleModalClose = () => {
		setIsModalOpen(false);
		setSelectedRow(null);
	};
	const handleInsertProject = () => {
		setInsertProject(true);
	};
	const handleCloseInsert = () => {
		setInsertProject(false);
	};

	const selectTab = () => {
		const findTargetField = tab.find(({ isOpen }) => isOpen);
		if (findTargetField) {
			const fieldProject = fieldMap[findTargetField.id].content;
			setData(fieldProject);
		}
	};

	const selectColumn = (selectedKeys) => {
		const newColumn = columns.map((col) => ({
			...col,
			hidden: !selectedKeys.includes(col.key),
		}));

		setColumns(newColumn);
	};

	const render = (type) => {
		switch (type) {
			case 'textarea':
				return (text) => (
					<TextEllipsis
						text={text.toString()}
						maxWidth="300px"
					/>
				);
			case 'text':
				return (text) => (
					<TextEllipsis
						text={text.toString()}
						minWidth="50px"
						maxWidth="200px"
					/>
				);
			case 'select':
				return (text) => (
					<TextEllipsis
						text={text.toString()}
						minWidth="50px"
						maxWidth="200px"
					/>
				);
			case 'number':
				return (text) => (
					<TextEllipsis
						text={Number(text)}
						minWidth="30px"
					/>
				);
			case 'check':
				return (val) => {
					const icon = val ? (
						<CheckOutlined style={{ color: '#007bff' }} />
					) : (
						<CloseOutlined style={{ color: '#ff337a' }} />
					);
					const label = val ? '是' : '否'; // or true/false
					return (
						<TextEllipsis
							text={icon}
							title={label}
							minWidth="60px"
						/>
					);
				};
			case 'date':
				return (val) => (
					<TextEllipsis
						text={formatTaiwanTime(val)}
						minWidth="30px"
					/>
				);
			default:
				return undefined;
		}
	};

	const resetColumn = () => {
		const newColumn = table.map(({ key, name, type, align }) => {
			const hiddenList = [
				'created_at',
				'created_by',
				'edited_at',
				'edited_by',
				'key',
				'id',
				'old_id',
			];
			const filterList = ['un_sale', 'pre_sale', 'sale', 'take_cases'];
			const baseConfig = {
				title: <ColTitleStyled>{name}</ColTitleStyled>,
				dataIndex: key,
				key: key,
				hidden: hiddenList.includes(key),
				fixed: ['project_name'].includes(key) && 'left',
				render: render(type),
				align: align,
			};
			if (filterList.includes(key)) {
				return {
					...baseConfig,
					filters: [
						{ text: '是', value: true },
						{ text: '否', value: false },
					],
					onFilter: (value, record) => record[key] === value,
				};
			}
			return baseConfig;
		});
		setColumns(newColumn);
	};

	useEffect(() => {
		resetColumn();
	}, [table]);

	useEffect(() => {
		selectTab();
	}, [tab]);

	return (
		<Fragment>
			<CustomTable
				selectColumn={(key) => selectColumn(key)}
				resetColumn={() => resetColumn()}
				addNew={() => handleInsertProject()}
				dataSource={data}
				columns={columns}
				scroll={{ x: 'max-content', y: 49 * 10 }}
				onRow={(record) => ({
					onClick: () => handleRowClick(record),
				})}
			/>

			{isModalOpen && (
				<LightBox onClose={() => handleModalClose()}>
					<EditProject data={selectedRow} />
				</LightBox>
			)}
			{insertProject && (
				<LightBox onClose={() => handleCloseInsert()}>
					<InsertProject />
				</LightBox>
			)}
		</Fragment>
	);
}

export default ProjectTable;
