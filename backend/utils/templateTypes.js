const TemplateType = require('../models/TemplateType');
const { SYSTEM_TEMPLATE_TYPES } = require('../config/storeTemplateTypes');

let bootstrapped = false;

const ensureSystemTemplateTypes = async () => {
    if (bootstrapped) return;
    const operations = SYSTEM_TEMPLATE_TYPES.map((type) => ({
        updateOne: {
            filter: { key: type.key },
            update: { $setOnInsert: type },
            upsert: true
        }
    }));
    if (operations.length > 0) {
        await TemplateType.bulkWrite(operations, { ordered: false });
    }
    bootstrapped = true;
};

module.exports = {
    ensureSystemTemplateTypes
};
