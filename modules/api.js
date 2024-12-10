// Submiting data on a local server, using async/await
// 1. Install json-server: npm i -g json-server
// 2. Start the server: json-server --watch db.json --static ./ --port 3000

const sendCardData = async function (cardData) {
  try {
    const response = await fetch("http://localhost:3000/cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardData),
    });

    if (!response.ok) {
      throw new Error("Failed to submit form!");
    }

    return await response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export { sendCardData };
