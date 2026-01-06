//日時を見やすい形に成形


export const DateTime = (dateString) => {
  if (!dateString) return "日時不明";
  
  // 日付文字列を解析
  const date = new Date(dateString.replace(' ', 'T')); 
  
  // Dateが不正な場合はエラーを返す
  if (isNaN(date.getTime())) {
    return "無効な日時";
  }
  
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const dayOfWeek = weekdays[date.getDay()];

  return `${month}/${day}(${dayOfWeek}) ${hours}:${minutes}`;
};