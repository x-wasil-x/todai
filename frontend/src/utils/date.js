import dayjs from 'dayjs';

export const createdOnDate = (user) => {
  return dayjs(user?.createdAt).format('MMM DD, YYYY');
};

export const getTimeDifference = (date) => {
  const datePosted = new Date(date);
  const currentTime = new Date();
  const milliseconds = Number(currentTime) - Number(datePosted);
  const seconds = Math.floor(milliseconds / 1000);

  if (seconds > 59) {
    const minutes = Math.floor(seconds / 60);
    if (minutes > 59) {
      const hours = Math.floor(minutes / 60);
      if (hours > 23) {
        const days = Math.floor(hours / 24);
        if (days > 30) {
          const months = Math.floor(days / 30);
          if (months > 11) {
            // const options = {
            //   year: 'numeric',
            //   month: 'short',
            //   day: 'numeric',
            // };
            return datePosted.toLocaleDateString('en-US');
          } else {
            return `${months} month${months === 1 ? '' : 's'} ago`;
          }
        } else {
          return `${days} day${days === 1 ? '' : 's'} ago`;
        }
      } else {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
      }
    } else {
      return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
    }
  } else {
    return `${seconds} sec${seconds === 1 ? '' : 's'} ago`;
  }
};
