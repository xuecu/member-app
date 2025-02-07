import { gql } from '@apollo/client';

export const UPDATE_ORDER_PRODUCT = gql`
	mutation UpdateOrderProduct($id: uuid!, $endedAt: timestamptz!) {
		update_order_product(where: { id: { _eq: $id } }, _set: { ended_at: $endedAt }) {
			returning {
				id
				ended_at
			}
		}
	}
`;

export const UPDATE_COIN_LOG = gql`
	mutation UpdateCoinLog($id: uuid!, $endedAt: timestamptz!) {
		update_coin_log(where: { id: { _eq: $id } }, _set: { ended_at: $endedAt }) {
			returning {
				id
				ended_at
			}
		}
	}
`;

export const UPDATE_COUPON_PLAN = gql`
	mutation UpdateCouponPlan($id: uuid!, $endedAt: timestamptz!) {
		update_coupon_plan(where: { id: { _eq: $id } }, _set: { ended_at: $endedAt }) {
			returning {
				id
				ended_at
			}
		}
	}
`;

export const SUPER_NOTE = gql`
	mutation SuperNote(
		$createdAt: timestamptz
		$description: String
		$memberId: String
		$authorId: String
	) {
		insert_member_note(
			objects: {
				created_at: $createdAt
				description: $description
				member_id: $memberId
				author_id: $authorId
				status: ""
			}
		) {
			returning {
				id
			}
		}
	}
`;
