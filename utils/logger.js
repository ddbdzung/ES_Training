const fs = require('fs/promises');
const fsSync = require('fs')

exports.createLogFolder = (directory) => {
  if (!fsSync.existsSync(directory)) {
    // Create the directory if it does not exist
    fsSync.mkdirSync(directory, { recursive: true }, (err) => {
      if (err) throw err;
    });
  }
}

exports.logToFile = async (filePath, data) => {
  try {
    await fs.access(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // The file does not exist, so create it
      await fs.writeFile(filePath, data);
      return;
    }
    throw error;
  }

  // The file exists, so overwrite it
  await fs.writeFile(filePath, data);
}
