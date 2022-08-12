const urlGet = (query) => `https://api.mercadolibre.com/items/${query}`;

const fetchItem = async (query) => {
  try {
    const url = urlGet(query);
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
