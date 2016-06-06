'use strict';

// Base commands
var UndoCommand = require('substance/ui/UndoCommand');
var RedoCommand = require('substance/ui/RedoCommand');
var SaveCommand = require('substance/ui/SaveCommand');

// Base Tools
var SwitchTextTypeCommand = require('substance/packages/text/SwitchTextTypeCommand');
var SwitchTextTypeTool = require('substance/packages/text/SwitchTextTypeTool');
var UndoTool = require('substance/ui/UndoTool');
var RedoTool = require('substance/ui/RedoTool');
var SaveTool = require('substance/ui/SaveTool');

var JATSImporter = require('./JATSImporter');
var JATSExporter = require('./JATSExporter');

module.exports = {
  name: 'scientist',
  configure: function(config) {

    // Setup base functionality
    config.addCommand(UndoCommand);
    config.addCommand(RedoCommand);
    config.addCommand(SwitchTextTypeCommand);
    config.addCommand(SaveCommand);

    config.addTool(SwitchTextTypeTool);
    config.addTool(UndoTool);
    config.addTool(RedoTool);

    // Activate save tool
    config.addTool(SaveTool);

    // Now import base packages
    config.import(require('../article/ArticlePackage'));
    config.import(require('../body/BodyPackage'));
    config.import(require('../caption/CaptionPackage'));
    // config.import(require('../emphasis/EmphasisPackage'));
    config.import(require('../figure/FigurePackage'));
    config.import(require('../footnote/FootnotePackage'));
    config.import(require('../front/FrontPackage'));
    config.import(require('../graphic/GraphicPackage'));
    config.import(require('../link/LinkPackage'));
    config.import(require('../monospace/MonospacePackage'));
    config.import(require('../paragraph/ParagraphPackage'));
    config.import(require('../reference/ReferencePackage'));
    config.import(require('../section/SectionPackage'));
    config.import(require('../strong/StrongPackage'));
    config.import(require('../subscript/SubscriptPackage'));
    config.import(require('../superscript/SuperscriptPackage'));
    config.import(require('../table/TablePackage'));
    config.import(require('../table-wrap/TableWrapPackage'));
    config.import(require('../unsupported/UnsupportedNodePackage'));

    config.addImporter('jats', JATSImporter);
    config.addExporter('jats', JATSExporter);
  }
};