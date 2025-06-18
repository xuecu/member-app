import { Fragment } from 'react';
import { Table } from 'antd';
import TableControl from './table-control';

function CustomTable({ selectColumn, resetColumn, addNew, ...otherProps }) {
	const { columns } = otherProps;
	return (
		<Fragment>
			<TableControl
				selectColumn={selectColumn}
				resetColumn={resetColumn}
				columns={columns}
				addNew={addNew}
			/>
			<Table {...otherProps} />
		</Fragment>
	);
}

export default CustomTable;
