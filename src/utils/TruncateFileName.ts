const TruncateFileName = (fileName: string) => {
  if (fileName && fileName.length > 15) {
    return fileName.substring(0, 15) + " " + "...";
  }
  return fileName;
};

export default TruncateFileName;
