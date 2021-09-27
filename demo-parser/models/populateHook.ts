export function autoPopulateAllFields(schema) {
  var paths = '';
  schema.eachPath(function process(pathname, schemaType) {
    if (pathname == '_id') return;
    if (schemaType.options.type[0] && schemaType.options.type[0].ref)
      paths += ' ' + pathname;

    if (schemaType.options.ref)
      paths += ' ' + pathname;      
  });

  schema.pre('find', handler);
  schema.pre('findOne', handler);

  function handler(next) {
    // @ts-expect-error 
    this.populate(paths.trim());
    next();
  }
};
