"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdMapper = void 0;
class IdMapper {
    constructor() {
        this.mapping = {};
    }
    getMapping(slug, fileId) {
        var _a;
        return (_a = this.mapping[slug]) === null || _a === void 0 ? void 0 : _a.get(`${fileId}`);
    }
    setMapping(slug, fileId, dbId) {
        if (!this.mapping[slug]) {
            this.mapping[slug] = new Map();
        }
        this.mapping[slug].set(`${fileId}`, dbId);
    }
}
exports.IdMapper = IdMapper;
