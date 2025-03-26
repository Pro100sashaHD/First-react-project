export const fetchTopics = async () => {
  const response = await fetch(process.env.PUBLIC_URL + '/data/topics.json');
  return response.json();
};