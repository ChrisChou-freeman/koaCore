import URL from 'url';

const request = {
  get url(){
    return this.req.url;
  },

  get path(){
    return new URL(this.req.url).pathname;
  },

  get query() {
    return new URL(this.req.url).query;
  }
}

export default request;
