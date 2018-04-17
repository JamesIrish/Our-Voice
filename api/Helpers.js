
export default class Helpers {
  
  static handleError = (error, req, res) => {
    if (req.log)
      req.log.error(error);
    res.status(500).send(error);
  };
  
}
