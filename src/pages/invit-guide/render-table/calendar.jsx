import React, { useState, useEffect, useContext, Fragment } from 'react';
import { InvitGuideContext } from '@/contexts/invit-guide.context';
import dayjs from 'dayjs';
import styled, { css } from 'styled-components';

import { Tab } from '@/components/tab';
import SendRequest from '@utils/auth-service.utils';
import { Loading, LoadingOverlay, LoadingMessage, useMessage } from '@components/loading';
import Booking from './booking';

function Calendar() {
	return <div>Calendar</div>;
}

export default Calendar;
