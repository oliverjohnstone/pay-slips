const flattenTable = json => {
    return json.reduce((acc, row) => {
        Object.values(row).forEach(el => {
            Object.values(el).forEach(i => {
                acc = acc.concat(i.split('\n'));
            });
        });
        return acc;
    }, []).map(i => i.replace(/\t/g, '').trim()).filter(Boolean);
};

module.exports = {
    flattenTable
};