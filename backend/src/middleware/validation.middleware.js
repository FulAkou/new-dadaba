export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!result.success) {
        return res.status(400).json({
          error: 'Erreur de validation',
          details: result.error.errors,
        });
      }

      // Replace req with validated data
      if (result.data.body) req.body = result.data.body;
      if (result.data.query) req.query = result.data.query;
      if (result.data.params) req.params = result.data.params;

      next();
    } catch (error) {
      next(error);
    }
  };
};

