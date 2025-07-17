import React, { useState, useEffect, useContext, Fragment } from 'react';
import { InvitGuideContext } from '@/contexts/invit-guide.context';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { LightBox } from '@/components/light-box';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';
import styled, { css } from 'styled-components';
import { Button } from 'antd';

import BookingModal from './booking-modal';

dayjs.extend(isoWeek);
dayjs.extend(isBetween);

const containerStyles = css`
	display: flex;
	justify-content: center;
	width: 100%;
`;
const ContainerStyled = styled.div`
	${containerStyles}
	flex-direction: ${({ $row }) => ($row ? 'row' : 'column')};
	justify-content: ${({ $justifyContent }) => $justifyContent || 'start'};
	align-items: ${({ $alignItems }) => $alignItems || 'start'};
	gap: 10px;
	padding: 0;
`;
const GuideButtonWrapper = styled.div`
	position: relative;
	display: inline-block;

	&:hover .tooltip {
		display: block;
	}
`;
const Tooltip = styled.div`
	display: none;
	position: absolute;
	bottom: 110%;
	left: 50%;
	transform: translateX(-50%);
	white-space: pre-wrap;
	background-color: #333;
	color: #fff;
	padding: 6px 10px;
	border-radius: 4px;
	font-size: 12px;
	z-index: 10;
	max-width: 200px;
	text-align: left;
`;

const GuideButton = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 100px;
	${({ $bd }) => $bd && `border: 1px solid #dedede;`}
	width: 100px;
	height: 30px;
`;

function getMonday(dateStr) {
	const date = dayjs(dateStr);
	const monday = date.startOf('isoWeek');
	return monday;
}
function convertAvailability(rawData, startDateStr) {
	const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
	// 取得以 startDate 為當週的週一
	const baseDate = dayjs(startDateStr);
	const monday = baseDate.subtract(baseDate.day() === 0 ? 6 : baseDate.day() - 1, 'day'); // 週一為第一天

	const result = [];

	for (let i = 0; i < 7; i++) {
		const currentDate = monday.add(i, 'day');
		const dateStr = currentDate.format('YYYY-MM-DD');
		const week = weekDays[i];

		const timeMap = {
			13: [],
			14: [],
			15: [],
			16: [],
			17: [],
			18: [],
			19: [],
			20: [],
		};

		rawData.forEach((person) => {
			const email = person.mail;
			const brands = person.brands || []; // ⬅️ 請確認你資料中是否有 brands 欄位

			const hasOverride = person.other && person.other[dateStr];
			const timeSlots = hasOverride ? person.other[dateStr] : person.available?.[week] || [];

			timeSlots.forEach((slot) => {
				if (slot.isValid && timeMap[slot.time]) {
					timeMap[slot.time].push({
						mail: email,
						brands, // ✅ 將品牌一起塞進來
					});
				}
			});
		});

		const available = Object.entries(timeMap).map(([time, list]) => ({
			time,
			mail: list,
		}));

		result.push({
			dateTime: dateStr,
			week,
			available,
		});
	}

	return result;
}
function clearAvailability(raw, bookings) {
	const cleaned = JSON.parse(JSON.stringify(raw));

	// 預先整理 booking 資料成 map，key 為 date
	const bookingMap = {};
	bookings.forEach((b) => {
		if (b.status !== 'confirmed') return;
		const bDate = b.date.replace(/\//g, '-');
		if (!bookingMap[bDate]) bookingMap[bDate] = [];
		bookingMap[bDate].push(b);
	});

	cleaned.forEach((day) => {
		const date = day.dateTime;
		const todayBookings = bookingMap[date] || []; // ✅ 只抓當天的 booking

		day.available.forEach((slot) => {
			const slotHour = parseInt(slot.time);
			const slotStart = dayjs(`${date} ${String(slotHour).padStart(2, '0')}:00`);
			const slotEnd = slotStart.add(1, 'hour');

			let updatedMail = [...slot.mail];

			todayBookings.forEach((b) => {
				const bStart = dayjs(`${b.date} ${b.start_at}`);
				const bEnd = dayjs(`${b.date} ${b.end_at}`);

				const overlap = bStart.isBefore(slotEnd) && bEnd.isAfter(slotStart);
				if (overlap) {
					const invitedEmails = b.inviter.split(',').map((e) => e.trim());
					updatedMail = updatedMail.filter((m) => !invitedEmails.includes(m.mail));
				}
			});

			slot.mail = updatedMail;
		});
	});

	return cleaned;
}
const weekCodeMap = ['日', '一', '二', '三', '四', '五', '六'];

const BrandCopyButton = ({ brandName, data, monday, sunday }) => {
	const handleCopy = async () => {
		const filtered = data
			.filter(({ dateTime }) => dayjs(dateTime).isBetween(monday, sunday, 'day', '[]'))
			.map(({ dateTime, available }) => {
				const timeSlots = available
					.filter(({ mail }) =>
						mail.some((m) => m.brands && m.brands.includes(brandName))
					)
					.map(({ time, mail }) => {
						const hasSomeone = mail.some((m) => m.brands.includes(brandName));
						return hasSomeone ? `${time}:00` : null;
					})
					.filter(Boolean);

				if (timeSlots.length === 0) return null;
				return `${dateTime}(${weekCodeMap[dayjs(dateTime).day()]}) ${timeSlots.join('、')}`;
			})
			.filter(Boolean)
			.join('\n');

		const content = `📘 ${brandName}可預約時段：\n${filtered}`;

		try {
			await navigator.clipboard.writeText(content.trim());
			alert(`已複製 ${brandName} 可預約時段 ✅`);
		} catch (err) {
			alert('複製失敗 ❌');
		}
	};

	return <Button onClick={handleCopy}>{brandName}</Button>;
};

const defaultModalData = {
	date: '',
	start: '',
	mail: '',
	member: '',
	end: '',
};

function Booking() {
	const { startTime, memberData, booking } = useContext(InvitGuideContext);
	const [filterData, setFilterData] = useState([]);
	const [monday, setMonday] = useState(getMonday(startTime));
	const [sunday, setSunday] = useState(monday.add(6, 'd'));
	const [isModalOpen, setIsModalOpen] = useState(false); // 控制 Lightbox 開關
	const [modalData, setModalData] = useState(defaultModalData);

	const handleModalClose = () => {
		setIsModalOpen(false);
		setModalData(defaultModalData);
	};
	const handleSetModal = ({ date, start, end, mail }) => {
		setModalData((prev) => {
			return { ...prev, date, start, end, mail };
		});
		setIsModalOpen(true);
	};
	console.log(filterData);

	useEffect(() => {
		const availabilityData = convertAvailability(memberData, monday);

		const bookingData = booking.filter((item) => {
			const itemDay = dayjs(item.date);
			return itemDay.isBetween(monday, sunday, 'day', '[]') && item.status !== 'cancelled';
		});
		const clearData = clearAvailability(availabilityData, bookingData);
		setFilterData(clearData);
	}, [booking, monday]);

	const mondayHandler = (e) => {
		setMonday(monday.add(e, 'd'));
		setSunday(sunday.add(e, 'd'));
		console.log('sunday', sunday);
	};

	return (
		<ContainerStyled>
			{isModalOpen && (
				<LightBox onClose={() => handleModalClose()}>
					<BookingModal data={modalData} />
				</LightBox>
			)}
			<ContainerStyled
				$row
				$justifyContent="space-around"
			>
				{startTime.isAfter(monday) ? (
					<CaretLeftOutlined />
				) : (
					<CaretLeftOutlined onClick={() => mondayHandler(-7)} />
				)}

				<div>
					{monday.format('MM/DD')} - {sunday.format('MM/DD')}
				</div>
				<CaretRightOutlined onClick={() => mondayHandler(7)} />
			</ContainerStyled>
			<ContainerStyled
				$row
				$justifyContent="space-around"
			>
				{filterData &&
					filterData.length > 0 &&
					filterData.map(({ dateTime, week, available }) => {
						return (
							<ContainerStyled
								$alignItems="center"
								key={dateTime}
							>
								<span></span>
								<span>{dateTime}</span>
								<span>{week.toUpperCase()}</span>
								<span></span>
								{dayjs(dateTime).isBetween(dayjs(startTime), sunday, 'day', [])
									? available.map(({ time, mail }) => {
											if (mail.length > 0)
												return (
													<GuideButtonWrapper key={time}>
														<GuideButton
															$bd
															onClick={() =>
																handleSetModal({
																	date: dateTime,
																	start: Number(time),
																	end: Number(time) + 1,
																	mail: mail,
																})
															}
														>
															{time}:00
														</GuideButton>
														<Tooltip className="tooltip">
															{mail
																.map(
																	({ mail, brands }) =>
																		`${mail}\n${brands}`
																)
																.join('\n')}
														</Tooltip>
													</GuideButtonWrapper>
												);
											return <GuideButton key={time}>-</GuideButton>;
									  })
									: available.map(({ time, mail }) => {
											return <GuideButton key={time}>-</GuideButton>;
									  })}
							</ContainerStyled>
						);
					})}
			</ContainerStyled>
			<ContainerStyled
				$row
				$justifyContent="center"
				$alignItems="center"
				style={{ gap: '10px', marginTop: '20px' }}
			>
				<span>點擊複製各品牌預約時間：</span>
				<BrandCopyButton
					brandName="學米"
					data={filterData}
					monday={monday}
					sunday={sunday}
				/>
				<BrandCopyButton
					brandName="職能"
					data={filterData}
					monday={monday}
					sunday={sunday}
				/>
				<BrandCopyButton
					brandName="無限"
					data={filterData}
					monday={monday}
					sunday={sunday}
				/>
				<BrandCopyButton
					brandName="財經"
					data={filterData}
					monday={monday}
					sunday={sunday}
				/>
			</ContainerStyled>
		</ContainerStyled>
	);
}

export default Booking;
