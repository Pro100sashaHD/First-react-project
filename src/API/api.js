export const fetchTopics = async () => {
  const response = await fetch('/data/topics.json');
  return response.json();
};