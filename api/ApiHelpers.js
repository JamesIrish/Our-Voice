export default class ApiHelpers {
  
  static handleError = (error, res) => {
    console.log(error);
    res.status(500).send(error);
  };
  
}
