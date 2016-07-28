'use strict';

module.exports = function(processor) {
    // This will allow to use this <!-- build:phType[:target] <value> --> syntax
    processor.registerBlockType('phType', function(content, block, blockLine, blockContent) {
        var asset = block.asset || '', title = '', result = '', timestamp = new Date().getTime().toString(16);
        if (asset.indexOf('.js') !== -1) {
            title = '<script src="' + asset + '?_' + timestamp +  '"></script>';
        } else if (asset.indexOf('.css') !== -1) {
            title = '<link rel="stylesheet" href="' + asset + '?_' + timestamp +  '"/>';
        }
        result = content.replace(blockLine, title);
        return result;
    });
};
