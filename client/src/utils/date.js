import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.locale('fr');

export const formatDateFR = (dateStr) =>
  dateStr ? dayjs(dateStr).format('DD/MM/YYYY') : '-';
