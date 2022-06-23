module.exports = class BaseServer {
  static instance = null;
  static getInstance(){
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }
}