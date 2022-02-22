exports.handler = async function(event, context) {
  console.log(JSON.stringfy(event, null, 2));
  return {
    statusCode: 200,
    body: 'hi, friend!'
  };
};
