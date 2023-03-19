/**
 * JsonApiClient
 * @function JsonApiClient
 * @modules []
 * @envs []
 * @param {string} url     // see: https://jsonapi.org
 * @param {object} filters // see: https://jsonapi.org/format/#query-parameters-families
 * @param {array} includes // see: https://jsonapi.org/format/#fetching-includes
 * @return {object} the data
 * @example const data = await JsonApiClient("[host]/jsonapi/node/article", { title: "my title" }, ["field_image"]);
 */
export async function JsonApiClient(url, filters, includes) {

  // create url params from filters object and includes array
  const urlParams = CreateUrlParams(filters, includes);

  // send
  return fetch(`${url}?${urlParams}`)
  .then(res => {
    return res.json();
  })
  .then(res => {
    return InjectRelationships(res)
  });

};


/*
 * Create url params
 */
export function CreateUrlParams(filters, includes) {

  const query = [];

  // create filters query [from string]
  if (typeof filters == 'string') {
    query.push(filters);
  }
  // create filters query [from object]
  else if (filters) {
    const searchParams = [];
    Object.keys(filters || {}).forEach(key => searchParams.push(`filter[${key}]=${filters[key]}`) );
    query.push(searchParams.join('&'));
  }

  
  // create includes query [from string]
  if (typeof includes == 'string') {
    query.push(`include=${includes}`);
  }
  // create includes query [from object]
  else if (includes) {
    query.push(`include=${includes.join(',')}`);
  }

  return query.join('&');
}


/*
 * Inject Relationships
 */
export function InjectRelationships(data) {

  function getRealated(item) {

    const relationships = {};

    Object.keys(item.relationships || {}).map(key => {

      // relationship array
      if (Array.isArray(item.relationships[key].data)) {

        const list = [];

        item.relationships[key].data.forEach(i => {
          // find included item
          const realated = i.id && data.included && data.included.find(include => include.id == i.id);
          if (realated) {
            list.push({ ...realated.attributes, ...getRealated(realated) });
          }
        })

        relationships[key] = list;
      }

      // relationship single
      else {
        const id = item.relationships[key].data?.id;
        // find included item
        const realated = id && data.included && data.included.find(include => include.id == id);
        if (realated) {
          relationships[key] = { ...realated.attributes, ...getRealated(realated) };
        }
      }

    });

    return relationships;
  };

  return data?.data?.map(item => ({ ...item.attributes, ...getRealated(item) }));
}