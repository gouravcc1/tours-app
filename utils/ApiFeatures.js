class ApiFeatures {
    constructor(query, queryString) {
      
      this.query = query;
      this.queryString = queryString;
    }
    filter() {
      
      const qb = { ...this.queryString };
      const exclude = ["sort", "page", "limit", "fields"];
      exclude.forEach((el) => delete qb[el]);
      let queryst = JSON.stringify(qb);
      queryst = queryst.replace(/\b(gt|lt|gte|lte)\b/g, (m) => "$" + m); // excluding some terms
      
      this.query = this.query.find(JSON.parse(queryst));
      return this;
    }
    sorting() {
      if (this.queryString.sort) {
        const sortby = this.queryString.sort.split(",").join(" ");
        this.query = this.query.sort(sortby);
      } else {
        this.query = this.query.sort("-createdAt");
      }
      return this;
    }
    limilfields() {
      if (this.queryString.fields) {
        const field = this.queryString.fields.split(",").join(" ");
        // console.log(field);
        this.query = this.query.select(field);
      } else {
        this.query = this.query.select("-__v");
      }
      return this;
    }
    pagination() {
      const page  =  this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip  = (page - 1) * limit;
      this.query  = this.query.skip(skip).limit(limit);
      return this;
    }
  }
module.exports= ApiFeatures;  