import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';

import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export default function TimeDisplay({ createdAt }) {
  return <p>{dayjs(createdAt).fromNow()}</p>;
}
