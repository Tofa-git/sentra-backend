module.exports = {
  paginattionGenerator(req, query) {
    query.limit = req.query.limit ? +req.query.limit : 10
    query.page = req.query.page ? +req.query.page : 1
    query.totalPage = Math.ceil(query.count / (req.query.limit ? +req.query.limit : 10))
    query.hasNext = query.totalPage === 0 ? false : query.page === query.totalPage ? false : true
    query.hasPreviouse = query.page === 1 ? false : true

    return query;
  },
}