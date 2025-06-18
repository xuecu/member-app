import { CustomScroll } from '@components/custom-scroll';
import * as Styled from './styled';

export const LightBox = ({ children, ...otherProps }) => {
	const { onClose } = otherProps;
	return (
		<Styled.OverlayStyled onClick={onClose}>
			<Styled.LightBoxStyled
				onClick={(e) => e.stopPropagation()}
				{...otherProps}
			>
				<CustomScroll>
					<Styled.ContentStyled>{children}</Styled.ContentStyled>
				</CustomScroll>
				<Styled.ClosedStyled onClick={onClose} />
			</Styled.LightBoxStyled>
		</Styled.OverlayStyled>
	);
};
