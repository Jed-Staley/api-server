'use strict';

class Collection {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async read(id) {
    let options = {};
    if (id) {
      options = { where: { id } };
    }
    return await this.model.findAll(options);
  }

  async update(id, data) {
    const record = await this.model.findOne({ where: { id } });
    if (record) {
      return await record.update(data);
    }
    return null;
  }

  async delete(id) {
    const record = await this.model.findOne({ where: { id } });
    if (record) {
      await record.destroy();
      return record;
    }
    return null;
  }
}

module.exports = Collection;
