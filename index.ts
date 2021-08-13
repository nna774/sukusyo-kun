import type { HttpFunction } from '@google-cloud/functions-framework/build/src/functions';

const main: HttpFunction = (req, res) => {
  res.status(200).send('hello');
}

module.exports = {
 main: main
}
