import { gql } from '@apollo/client';

// query member id
export const GET_MEMBER_ID_BY_EMAIL = gql`
	query GET_MEMBER_ID_BY_EMAIL($email: String!) {
		member(where: { email: { _eq: $email } }) {
			id
			name
			email
		}
	}
`;

// query contracts by member id
export const GET_MEMBER_CONTRACTS_BY_MEMBER_ID = gql`
	query GET_MEMBER_CONTRACTS_BY_MEMBER_ID($memberId: String!) {
		member_contract(where: { member_id: { _eq: $memberId } }) {
			id
			started_at
			ended_at
			agreed_at
			agreed_ip
			agreed_options
			revoked_at
			values
			options
			contract {
				id
				name
				__typename
			}
			__typename
		}
	}
`;

// query order_product by order id
export const GET_ORDER_PRODUCT_BY_ORDER_ID = gql`
	query GET_ORDER_PRODUCT_BY_ORDER_ID($orderId: String!) {
		order_product(where: { order_id: { _eq: $orderId } }) {
			id
			product_id
			name
			started_at
			ended_at
		}
	}
`;

// query coin_logs
export const GET_COIN_LOGS_BY_MEMBER_ID = gql`
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
export const GET_COIN_LOG_BY_COIN_LOG_ID = gql`
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
export const GET_MEMBER_ORDER_LOGS_BY_EMAIL = gql`
	query GET_MEMBER_ORDER_LOGS_BY_EMAIL($mail: String!) {
		order_log(where: { member: { email: { _eq: $mail } } }) {
			id
			created_at
			status
			member_id
			is_deleted
			member {
				name
				email
			}
			order_products {
				id
				product_id
				name
				started_at
				ended_at
				delivered_at
			}
		}
	}
`;
export const GET_MEMBER_ORDER_LOGS_BY_MEMBER_ID = gql`
	query GET_MEMBER_ORDER_LOGS_BY_MEMBER_ID($memberId: String!) {
		order_log(where: { member_id: { _eq: $memberId } }) {
			id
			created_at
			status
			member_id
			is_deleted
			member {
				name
				email
			}
			order_products {
				id
				product_id
				name
				started_at
				ended_at
				delivered_at
			}
		}
	}
`;

// query coupon_plan
export const GET_COUPON_PLAN_BY_COUPON_PLAN_ID = gql`
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
export const GET_COUPON_BY_COUPON_PLAN_ID = gql`
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
