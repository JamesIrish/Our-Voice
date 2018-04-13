export default class Helpers {
  
  static handleError = (error, res) => {
    console.log(error);
    res.status(500).send(error);
  };
  
}
