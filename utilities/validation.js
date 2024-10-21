const validateInput = (schema, dataSource = 'body') => (req, res, next) => {
  let data = req[dataSource];

  // Switch case to determine which part of the request to validate
  switch (dataSource) {
    case 'body':
      data = req.body;
      break;
    case 'params':
      data = req.params;
      break;
    case 'query':
      data = req.query;
      break;
    case '{ id: req.params.id, ...req.query }':
      data = { id: req.params.id, ...req.query };
      break;
    case '{ id: req.params.id, ...req.body}':
      data = { id: req.params.id, ...req.body};
      break;
    default:
      return res.status(400).json({ error: 'Invalid data source for validation' });
  }

  const { error } = schema.validate(data);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

module.exports = {
  validateInput,
}