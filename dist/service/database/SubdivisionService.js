"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Subdivision_1 = require("./../../model/Subdivision");
class SubdivisionService {
    constructor() {
    }
    /**
     * Add a subdivision
     */
    async addSubdivision(value) {
        return new Subdivision_1.Subdivision(value).save();
    }
    async findAll() {
        return Subdivision_1.Subdivision.findAll();
    }
    async getByComId(ComId) {
        return Subdivision_1.Subdivision.findOne({ where: { ComId: ComId } });
    }
    async deleteAll() {
        return Subdivision_1.Subdivision.destroy({ where: {} });
    }
}
exports.default = SubdivisionService;
