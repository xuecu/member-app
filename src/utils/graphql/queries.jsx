// query member id
export const GET_MEMBER_ID_BY_EMAIL = `
	query GET_MEMBER_ID_BY_EMAIL($email: String!) {
		member(where: { email: { _eq: $email } }) {
			id
			name
			email
		}
	}
`;

// query contracts
export const GET_MEMBER_CONTRACTS_BY_MEMBER_ID = `
	query GET_MEMBER_CONTRACTS_BY_MEMBER_ID($memberId: String!) {
		member_contract(where: { member_id: { _eq: $memberId } }) {
			id
			contract_id
			created_at
			started_at
			ended_at
			agreed_at
			agreed_ip
			agreed_options
			revocation_values
			revoked_at
			member {
				id
				email
				name
			}
			member_id
			values
			options
			contract {
				id
				name
				__typename
			}
			author {
				id
				email
				name
				__typename
			}
			author_id
			dealer
			__typename
		}
	}
`;
export const GET_MEMBER_CONTRACTS_BY_ID = `
	query GET_MEMBER_CONTRACTS_BY_ID($id: uuid!) {
		member_contract(where: { id: { _eq: $id } }) {
			id
			contract_id
			created_at
			started_at
			ended_at
			agreed_at
			agreed_ip
			agreed_options
			revocation_values
			revoked_at
			member {
				id
				email
				name
			}
			member_id
			values
			options
			contract {
				id
				name
				__typename
			}
			author {
				id
				email
				name
				__typename
			}
			author_id
			dealer
			__typename
		}
	}
`;

// query order_product by order id
export const GET_ORDER_PRODUCT_BY_ORDER_ID = `
	query GET_ORDER_PRODUCT_BY_ORDER_ID($orderId: String!) {
		order_product(where: { order_id: { _eq: $orderId } }) {
			id
			name
			price
			created_at
			started_at
			ended_at
			updated_at
			order_id
			order_log {
				app_id
				id
				is_deleted
				member_id
				status
				updated_at
			}
			product_id
			product {
				id
				type
			}
			deliverables
			delivered_at
			options
		}
	}
`;

// query coin_logs
export const GET_COIN_LOGS_BY_MEMBER_ID = `
	query GET_COIN_LOGS_BY_MEMBER_ID($memberId: String!) {
		coin_log(where: { member_id: { _eq: $memberId } }) {
			id
			member_id
			title
			started_at
			ended_at
			amount
			description
		}
	}
`;
export const GET_COIN_LOG_BY_COIN_LOG_ID = `
	query getCoinLog($id: uuid!) {
		coin_log(where: { id: { _eq: $id } }) {
			id
			title
			member_id
			started_at
			ended_at
			amount
			description
		}
	}
`;

// query order_logs
export const GET_MEMBER_ORDER_LOGS_BY_EMAIL = `
	query GET_MEMBER_ORDER_LOGS_BY_EMAIL($mail: String!) {
		order_log(where: { member: { email: { _eq: $mail } } }) {
			id
			created_at
			updated_at
			status
			member_id
			is_deleted
			member {
				name
				email
			}
			order_products {
				id
				price
				product_id
				name
				created_at
				started_at
				ended_at
				updated_at
				delivered_at
			}
		}
	}
`;
export const GET_MEMBER_ORDER_LOGS_BY_MEMBER_ID = `
	query GET_MEMBER_ORDER_LOGS_BY_MEMBER_ID($memberId: String!) {
		order_log(where: { member_id: { _eq: $memberId } }) {
			id
			created_at
			updated_at
			status
			member_id
			is_deleted
			member {
				name
				email
			}
			order_products {
				id
				price
				product_id
				name
				created_at
				started_at
				ended_at
				updated_at
				delivered_at
			}
		}
	}
`;
export const GET_MEMBER_ORDER_LOG_BY_ORDER_ID = `
	query GET_MEMBER_ORDER_LOG_BY_ORDER_ID($orderId: String!) {
		order_log(where: { id: { _eq: $orderId } }) {
			id
			created_at
			updated_at
			status
			member_id
			is_deleted
			member {
				name
				email
			}
			order_products {
				id
				price
				product_id
				name
				created_at
				started_at
				ended_at
				updated_at
				delivered_at
			}
		}
	}
`;

// query coupon_plan
export const GET_COUPON_PLAN_BY_COUPON_PLAN_ID = `
	query GET_COUPON_PLAN_BY_COUPON_PLAN_ID($id: uuid!) {
		coupon_plan(where: { id: { _eq: $id } }) {
			id
			title
			started_at
			ended_at
		}
	}
`;

// query coupon
export const GET_COUPON_BY_COUPON_PLAN_ID = `
	query GET_COUPON_CODE_BY_COUPON_PLAN_ID($id: uuid!) {
		coupon_code(where: { coupon_plan_id: { _eq: $id } }) {
			id
			coupon_plan_id
			code
			created_at
			deleted_at
			remaining
			updated_at
		}
	}
`;
