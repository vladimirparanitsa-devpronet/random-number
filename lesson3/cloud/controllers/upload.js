var multer  = require('multer');
var fs = require('fs');
var config = require('config');
var log = require('../log');

var uploadMiddleware = multer({
  dest: config.uploadDestination,
  fileFilter: fileFilter
});

var FILES_LIST_PATH = config.filesListPath;
var FILERECORDSPLITTER = config.filesRecordSplitter;
var filesList = [];

try {
  filesList = JSON.parse(fs.readFileSync(FILES_LIST_PATH, 'utf8') );
  log.info('FileList loaded at start');
} catch (err) {
  log.info('No fileList found at start');
}

function fileFilter(req, file, cb) {
  let syncedFileData = findExistingFile(req.query);
  if (syncedFileData) {
    isFileChanged(syncedFileData, req.query, function(err) {
      cb(err, true);
    });
  } else {
    saveToFileList(req.query, function(err) {
      cb(err, true);
    });
  }

  return cb(null, false);
}

function validateRequest() {
  return function(req, res, next) {
    var filePath = req.query.filePath;
    if (!filePath) {
      var err = new Error('Validation error: filePath parameter is missing');
      err.code = 400;
      return next(err);
    }
    next();
  }
}

function saveToFileList(requestData, cb) {
  let filePath = requestData.filePath;
  try {
    filesList.push({
      filePath,
      modifyDate: requestData.modifyDate,
    });

    fs.writeFileSync(FILES_LIST_PATH, JSON.stringify(filesList));
  } catch (err) {
    return cb(err);
  }
  log.debug('File saved to list', filePath);
  return cb();
}

function isFileChanged(syncedFile, fileToSync, cb) {
  
  if (fileToSync.modifyDate > syncedFile.modifyDate) {
    try {
      filesList[filesList.indexOf(syncedFile)] = {
        filePath: fileToSync.filePath,
        modifyDate: fileToSync.modifyDate
      };

      fs.writeFileSync(FILES_LIST_PATH, JSON.stringify(filesList));

      return cb(null, true);
    } catch (error) {
      cb(error);
    }
  }

  return false;
}

function findExistingFile (requestData) {
  if (filesList.length > 0) {
    return filesList.find((fileRow) => {
      return fileRow.filePath === requestData.filePath;
    });
  }

  return false;
}

module.exports = {
  parse: uploadMiddleware,
  validate: validateRequest
};
